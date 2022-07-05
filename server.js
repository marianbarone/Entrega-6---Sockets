import express from 'express'
const app = express()
const port = 8080
import path from 'path'
import { fileURLToPath } from 'url';
import { Server } from "socket.io";

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

//Arrays donde voy a guardar las movies y messages
const movies = [];
const messages = [];
console.log(movies)

io.on('connection', socket => {
    console.log(`Un usuario se ha conectado: ${socket.id}`);
    //muestra a cada cliente que se conecte los productos y mensajes guardados
    socket.emit("server:movie", movies);
    socket.emit("server:message", messages);

    socket.on("client:movie", (movie) => {
        movies.push(movie);
        console.log('movies', movies)
        console.log('movie', movie)
        io.emit("server:movie", movies);
    });

    //Aca estaba el error con la conexion de los mensajes
    //Estaba mal configurado
    socket.on('client:message', messageInfo => {
        messages.push(messageInfo);
        console.log('soy messages',messages)
        io.emit('server:message', messages);
    });
});

