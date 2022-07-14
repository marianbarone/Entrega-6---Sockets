const socket = io();

//AddMovieForm
const moviesForm = document.getElementById('moviesForm')
const titleInput = document.getElementById("moviesForm").title
const priceInput = document.getElementById("moviesForm").price
const thumbnailInput = document.getElementById("moviesForm").thumbnail

//Chat
const chatForm = document.getElementById('chatForm')
const usernameInput = document.getElementById("chatForm").username
const messageInput = document.getElementById("chatForm").message
const messagesPool = document.getElementById('messagesPool')

//Agregar nueva pelicula
function addMovie() {
    try {
        const title = titleInput.value;
        const price = Number(priceInput.value);
        const thumbnail = thumbnailInput.value;
        socket.emit("client:movie", { title, price, thumbnail });
    } catch (err) {
        console.log(`Hubo un error ${err}`);
    }
}

//Renderiza las peliculas
async function renderMovies(movies) {
    const response = await fetch('/movies.hbs')
    const moviesTable = await response.text()
    console.log('movies', moviesTable)
    document.getElementById("movies").innerHTML = "";
    movies.forEach((movie) => {
        const template = Handlebars.compile(moviesTable);
        const html = template(movie);
        document.getElementById("movies").innerHTML += html;
    });
}

function sendMessage() {
    try {
        const user = usernameInput.value;
        const message = messageInput.value;
        const date = new Date().toLocaleString("es-AR")
        socket.emit("client:message", { user, message, date });
    } catch (error) {
        console.log(`Hubo un error ${error}`);
    }
}

const renderMessages = (messages) => {
    try {
        const html = messages
            .map((messageInfo) => {
                return (`
                <div class="col-8">
                    <p><span class="userEmail text-primary font-weight-bold">${messageInfo.user} :</span>
                        <span class="userMessage font-italic text-success">${messageInfo.message}</span>
                    </p>
                </div>
                <div class="col-4">
                    <p>${messageInfo.date}</p>
                </div>`)
            })
            .join(" ");

        messagesPool.innerHTML = html;
    } catch (error) {
        console.log(`Hubo un error ${error}`);
    }
};

moviesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addMovie();
    titleInput.value = "";
    priceInput.value = "";
    thumbnailInput.value = "";
});

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage();
    messageInput.value = "";
});

//Pone socket a escuchar
socket.on('server:movie', movie => {
    renderMovies(movie)
})

socket.on('server:message', renderMessages);
