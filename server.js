import express from 'express'
const app = express()
const port = 8080
import path from 'path'
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars'
import { Server } from "socket.io";
const movies = [];
const messages = [];


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

io.on('connection', socket => {
    console.log(`Un usuario se ha conectado: ${socket.id}`);
    io.emit("server:movie", movies);
    io.emit("server:message", messages);

    socket.on("client:movie", (movie) => {
        movies.push(movie);
        io.emit("server:movie", movies);
    });

    socket.on('new-message', messageInfo => {
        messages.push(messageInfo);
        io.sockets.emit('messages', messages);
    });
});

