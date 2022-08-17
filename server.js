import express from 'express'
const app = express()
const port = 8080
import path from 'path'
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import moviesController from "./controllers/movies-controller.js";
import messagesController from "./controllers/messages-controller.js";
<<<<<<< HEAD
import { faker } from '@faker-js/faker';
import { normalize, schema } from "normalizr";

faker.locale = "es";

//Middleware del post
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
=======

//Middleware del post
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serverExpress = app.listen(port, (err) => {
    if (err) {
        console.log(`Se produjo un error al iniciar el servidor ${err}`)
    } else {
        console.log(`El servidor esta escuchando el puerto ${port}`)
    }
})

app.use(express.static(path.join(__dirname, "./public")));

<<<<<<< HEAD
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
=======
const mensajes = []
const movies = []
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16

//Socket
const io = new Server(serverExpress);

<<<<<<< HEAD
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
=======
io.on('connection', async socket => {
    console.log(`Un usuario se ha conectado: ${socket.id}`);

    try {
        mensajes = await messagesController.getAll()
        socket.emit('server:mensajes', mensajes )
    } catch (error) {
       console.log('Error al adquirir los productos', error) 
    }

    try {
        movies = await moviesController.getAll()
        socket.emit('server:movies', movies )
    } catch (error) {
       console.log('Error al adquirir los mensajes', error) 
    }
                        
    socket.on('client:mensajes', async messageInfo => {
        await messagesController.addMessage(messageInfo);         // CUANDO EL CLIENTE LE ENVIA AL SERVIDOR UN NUEVO PRODUCTO DESDE EL SERVIDOR SE LO GUARDA EN LA BBDD
        mensajes = await messagesController.getAll();                   // SE ESPERA A QUE SE TRAIGAN TODOS LOS PRODUCTOS DE LA BBDD Y SE LOS ALMACENA EN UNA VARIABLE  
        io.emit('server:mensajes', mensajes);                        // SE ENVIA AL CLIENTE LA VARIABLE CONTENEDORA DE TODOS LOS PRODUCTOS PARA QUE SE RENDERICEN
    })

   
    socket.on('client:movie', async movies => {
        await moviesController.addMovie(movies);         // CUANDO EL CLIENTE LE ENVIA AL SERVIDOR UN NUEVO PRODUCTO DESDE EL SERVIDOR SE LO GUARDA EN LA BBDD
        movies = await moviesController.getAll();                   // SE ESPERA A QUE SE TRAIGAN TODOS LOS PRODUCTOS DE LA BBDD Y SE LOS ALMACENA EN UNA VARIABLE  
        io.emit('server:movies', movies);                        // SE ENVIA AL CLIENTE LA VARIABLE CONTENEDORA DE TODOS LOS PRODUCTOS PARA QUE SE RENDERICEN
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16
    })
})

