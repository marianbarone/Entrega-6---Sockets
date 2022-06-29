import express from 'express'
const app = express()
const port = 8080
import routes from './api/movies.js'
import path from 'path'
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars'

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


app.listen(port, (err) => {
    if (err) {
        console.log(`Se produjo un error al iniciar el servidor ${err}`)
    } else {
        console.log(`El servidor esta escuchando el puerto ${port}`)
    }
})

//Sockets

httpServer.listen(8080, function () {
    console.log('Servidor corriendo en http://localhost:8080');
})


const messages = [
    { author: "Juan", text: "¡Hola! ¿Que tal?" },
    { author: "Pedro", text: "¡Muy bien! ¿Y vos?" },
    { author: "Ana", text: "¡Genial!" }
];

io.on('connection', function (socket) {
    console.log('Un cliente se ha conectado');
    socket.emit('messages', messages);
});
