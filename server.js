import express from 'express'
const app = express()
const port = 8080
import path from 'path'
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import moviesController from "./controllers/movies-controller.js";
import messagesController from "./controllers/messages-controller.js";

//Middleware del post
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serverExpress = app.listen(port, (err) => {
    if (err) {
        console.log(`Se produjo un error al iniciar el servidor ${err}`)
    } else {
        console.log(`El servidor esta escuchando el puerto ${port}`)
    }
})

app.use(express.static(path.join(__dirname, "./public")));

const mensajes = []
const movies = []

//Socket
const io = new Server(serverExpress);

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
    })
});

