import express from 'express'
const app = express()
const port = 8080
import path from 'path'
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import moviesController from "./controllers/movies-controller.js";
import messagesController from "./controllers/messages-controller.js";
import { faker } from '@faker-js/faker';
import { normalize, schema } from "normalizr";

faker.locale = "es";

//Middleware del post
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serverExpress = app.listen(port, (err) => {
    if (err) {
        console.log(`Se produjo un error al iniciar el servidor ${err}`)
    } else {
        console.log(`El servidor esta escuchando el puerto ${port}`)
    }
})

app.use(express.static(path.join(__dirname, "./public")));

app.set("views", __dirname + "/public/views");
app.set("view engine", ".ejs");

app.use("/api/movies-test", (req, res) => {
    const movies = [];
    for (let index = 0; index < 5; index++) {
        const obj = {};
        obj.id = movies[movies.length - 1]?.id + 1 || 1;
        obj.title = faker.commerce.title();
        obj.price = faker.commerce.price(100);
        obj.thumbnail = faker.image.fashion(400, 400, true);
        movies.push(obj);
    }
    res.status(404).render("movies.hbs", { movies });
})

//Normalize 
const authorSchema = new schema.Entity("authorEntity", {}, { idAttribute: "email" });
const messageSchema = new schema.Entity("messageEntity", { author: authorSchema }, { idAttribute: "_id" });
const messageArraySchema = new schema.Entity("messageArrayEntity", { messages: [messageSchema] });

const getNormalizedMessages = async () => {
    //Obtengo array de mensajes de mongo db.
    const messages = await messagesController.getAll();
    //Hago una copia del array para eliminar metodos del objeto que me largo mongoose y asi poder trabajarlo con normalizr sin errores.
    const messages2 = JSON.parse(JSON.stringify(messages));

    const normalizedData = normalize({ id: "messagesArrayId", messages: messages2 }, messageArraySchema);
    return normalizedData;
}

//Socket
const io = new Server(serverExpress);

//Conexion websockets
io.on("connection", async (socket) => {
    console.log(`Socket ID: ${socket.id} connected`);

    const products = await moviesController.getAll();
    socket.emit("server:products", products);
    socket.on("client:newProduct", async (movie) => {
        movie.price = Number(movie.price);
        await moviesController.addMovie(movie);
        console.log('data', movie)
        const products = await moviesController.getAll();
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

