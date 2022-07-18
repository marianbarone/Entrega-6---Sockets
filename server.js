import express from 'express'
const app = express()
const port = 8080
import path from 'path'
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import moviesController from "./controllers/movies-controller.js";
import messagesController from "./controllers/messages-controller.js";
// import { createChatTable, createMoviesTable } from './controllers/tables-controller.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serverExpress = app.listen(port, (err) => {
    if (err) {
        console.log(`Se produjo un error al iniciar el servidor ${err}`)
    } else {
        console.log(`El servidor esta escuchando el puerto ${port}`)
    }
})

app.use(express.static(path.join(__dirname, "./public")));

//Sockets

// const io = new Server(serverExpress);

// const movies = await moviesController.getAll();

// const messages = await messagesController.getAll();
// console.log(movies)

// io.on('connection', socket => {
//     console.log(`Un usuario se ha conectado: ${socket.id}`);


//     socket.emit("server:products", movies);
//     socket.emit("server:message", messages);

//     socket.on("client:movie", (movie) => {
//         movies.push(movie);
//         console.log(movies)
//         io.emit("server:movie", movies);
//     });

//     socket.on('client:message', async (messageInfo) => {
//         await messagesController.addMessage(messageInfo);
//         const messagesLog = await messagesController.getAll();
//         io.emit("server:messages", { messagesLog });
//     });
// });

const io = new Server(serverExpress);

io.on('connection', async socket => {
    console.log(`Un usuario se ha conectado: ${socket.id}`);

    await createChatTable(messagesController, 'chat');            // CREA LA TABLA DE CHATS SI ESTA NO EXISTIA
    let chat = await messagesController.getAll();                 // SE TRAEN TODOS LOS CHATS DE LA TABLA

    io.emit('server:messages', chat);                             // AL ESTABLECERSE LA CONEXION SE LE ENVIAN AL CLIENTE LOS PRODUCTOS QUE HAYA EN LA BBDD
    socket.on('client:message', async messageInfo => {
        await messagesController.addMessage(messageInfo);         // CUANDO EL CLIENTE LE ENVIA AL SERVIDOR UN NUEVO PRODUCTO DESDE EL SERVIDOR SE LO GUARDA EN LA BBDD
        chat = await messagesController.getAll();                   // SE ESPERA A QUE SE TRAIGAN TODOS LOS PRODUCTOS DE LA BBDD Y SE LOS ALMACENA EN UNA VARIABLE  
        io.emit('server:messages', chat);                        // SE ENVIA AL CLIENTE LA VARIABLE CONTENEDORA DE TODOS LOS PRODUCTOS PARA QUE SE RENDERICEN
    })

    await createMoviesTable(moviesController, 'movies');            // CREA LA TABLA DE CHATS SI ESTA NO EXISTIA
    let movies = await moviesController.getAll();                 // SE TRAEN TODOS LOS CHATS DE LA TABLA

    io.emit('server:movies', movies);                             // AL ESTABLECERSE LA CONEXION SE LE ENVIAN AL CLIENTE LOS PRODUCTOS QUE HAYA EN LA BBDD
    socket.on('client:movie', async movies => {
        await moviesController.addMovie(movies);         // CUANDO EL CLIENTE LE ENVIA AL SERVIDOR UN NUEVO PRODUCTO DESDE EL SERVIDOR SE LO GUARDA EN LA BBDD
        movies = await moviesController.getAll();                   // SE ESPERA A QUE SE TRAIGAN TODOS LOS PRODUCTOS DE LA BBDD Y SE LOS ALMACENA EN UNA VARIABLE  
        io.emit('server:movies', movies);                        // SE ENVIA AL CLIENTE LA VARIABLE CONTENEDORA DE TODOS LOS PRODUCTOS PARA QUE SE RENDERICEN
    })
});

