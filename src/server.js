import express from "express";
import { Server as IOServer } from "socket.io";
import __dirname from "./utils.js";
import productsController from "./controllers/products-controller.js";
import messagesController from "./controllers/messages-controller.js";
import { faker } from '@faker-js/faker';
import { normalize, schema } from "normalizr";
import session from "express-session";
import passport from "passport";
import dotenv from 'dotenv';
dotenv.config()
import os from "os";
import cluster from "cluster"

//Routes

import loginRouter from './routes/loginRouter.js'
import logoutRouter from './routes/logoutRouter.js'
import rootRouter from './routes/rootRouter.js'
import signupRouter from './routes/signupRouter.js'
import infoRouter from './routes/infoRouter.js'
import randomsRouter from './routes/randomsRouter.js'
import compression from 'compression'
import logger from "./middlewares/logs.js";

faker.locale = "es";

const modo = parseInt(process.argv[3]) || 'FORK'
const port = Number(process.argv[2]) || 8080


const app = express();

app.use(compression())


const numCpus = os.cpus();

if (modo == "CLUSTER" && cluster.isPrimary) {
    cpus.map(() => {
        cluster.fork();
    });

    cluster.on("exit", (worker) => {
        logger.info(`worker ${worker.process.pid} died :(`);
        cluster.fork();
    })
} else {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const PORT = process.env.PORT || 8080;
    const serverExpress = app.listen(PORT, (err) => err ? logger.error(`Error en el server: ${err}`) : logger.info(`Server listening on PORT: ${PORT}`));

    const io = new IOServer(serverExpress);

    app.use(express.static(__dirname + "/public"));

    app.set("views", __dirname + "/public/views");
    app.set("view engine", ".ejs");


    app.use(session({
        secret: 'keyboard cat',
        cookie: {
            httpOnly: false,
            secure: false,
            // maxAge: config.TIEMPO_EXPIRACION
        },
        rolling: true,
        resave: true,
        saveUninitialized: false
    }));

    //Passport

    app.use(passport.initialize());
    app.use(passport.session());

    //INDEX
    app.use('/', rootRouter);
    //LOGIN
    app.use('/login', loginRouter);
    //SIGNUP
    app.use('/signup', signupRouter);
    //LOGOUT
    app.use('/logout', logoutRouter);
    //INFO
    app.use("/information", infoRouter);
    //RANDOMS
    app.use("/api/randoms", randomsRouter);

    // Ruta de testeo con Faker.js
    app.use("/api/productos-test", (req, res) => {
        const products = [];
        for (let index = 0; index < 5; index++) {
            const obj = {};
            obj.id = products[products.length - 1]?.id + 1 || 1;
            obj.title = faker.commerce.productName();
            obj.price = faker.commerce.price(100);
            obj.thumbnail = faker.image.fashion(400, 400, true);
            products.push(obj);
        }
        res.status(404).render("productsTemplate.ejs", { products });
    })

    app.use((req, res, next) => {
        logger.info(`Ruta: ${req.url} | Método: ${req.method}`);
        next();
    });    

    //Schemas de Normalize
    const authorSchema = new schema.Entity("authorEntity", {}, { idAttribute: "email" });
    const messageSchema = new schema.Entity("messageEntity", { author: authorSchema }, { idAttribute: "_id" });
    const messageArraySchema = new schema.Entity("messageArrayEntity", { messages: [messageSchema] });

    const getNormalizedMessages = async () => {
        //Obtengo array de mensajes de mongo db.
        const messages = await messagesController.getMessages();
        //Hago una copia del array para eliminar metodos del objeto que me largo mongoose y asi poder trabajarlo con normalizr sin errores.
        const messages2 = JSON.parse(JSON.stringify(messages));

        const normalizedData = normalize({ id: "messagesArrayId", messages: messages2 }, messageArraySchema);
        return normalizedData;
    }

    //Conexion websockets
    io.on("connection", async (socket) => {
        logger.info(`Socket ID: ${socket.id} connected`);

        const products = await productsController.getAll();
        socket.emit("server:products", products);
        socket.on("client:newProduct", async (data) => {
            data.price = Number(data.price);
            await productsController.add(data);
            const products = await productsController.getAll();
            io.emit("server:products", products);
        })

        const messagesLog = await getNormalizedMessages();
        socket.emit("server:messages", messagesLog);
        socket.on("client:newMessage", async (data) => {
            await messagesController.addMessage(data);
            const messagesLog = await getNormalizedMessages();
            io.emit("server:messages", messagesLog);
        })
    })
}