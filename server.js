import express from 'express'
const app = express()
const port = 8080
import path from 'path'
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import moviesController from "./controllers/productsManager.js";
import messagesController from "./controllers/messagesManager.js";

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

const io = new Server(serverExpress);

const movies = await moviesController.getAll();

const messages = await messagesController.getAll();
console.log(movies)

io.on('connection', socket => {
    console.log(`Un usuario se ha conectado: ${socket.id}`);


    socket.emit("server:products", movies);
    socket.emit("server:message", messages);

    socket.on("client:movie", (movie) => {
        movies.push(movie);
        console.log(movies)
        io.emit("server:movie", movies);
    });

    socket.on('client:message', async (messageInfo) => {
        await messagesController.addMessage(messageInfo);
        const messagesLog = await messagesController.getAll();
        io.emit("server:messages", { messagesLog });
    });
});

