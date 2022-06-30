import express from 'express'
const app = express()
const port = 8080
import routes from './api/movies.js'
import path from 'path'
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars'
import { Server } from "socket.io";
const movies = []
const messages = []


const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Configuracion req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', routes)
app.use('/index.html', express.static(path.join(__dirname, 'public')));

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: path.join(__dirname, './views/layouts/main.hbs'),
    layoutsDir: path.join(__dirname, './views/layouts'),
    partialsDir: path.join(__dirname, './views/partials')
}))

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "hbs");


const serverExpress = app.listen(port, (err) => {
    if (err) {
        console.log(`Se produjo un error al iniciar el servidor ${err}`)
    } else {
        console.log(`El servidor esta escuchando el puerto ${port}`)
    }
})

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

    socket.on('new-message', data => {
        messages.push(data);
        io.sockets.emit('messages', messages);
    });
});

