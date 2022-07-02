const socket = io();

//AddMovieForm
const moviesForm = document.getElementById('moviesForm')
const titleInput = document.getElementById("moviesForm").elements["title"]
const priceInput = document.getElementById("moviesForm").elements["price"]
const thumbnailInput = document.getElementById("moviesForm").elements["thumbnail"]

//Chat
const chatForm = document.getElementById('chatForm')
const usernameInput = document.getElementById("chatForm").elements["username"]
const messageInput = document.getElementById("chatForm").elements["message"]
const messagesPool = document.getElementById('messagesPool')

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

async function renderMovies(movies) {
    const response = await fetch('/movies.hbs')
    const moviesTable = await response.text()
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
                return `
                <div class="col-8">
                    <p><span class="userEmail fw-bold">${messageInfo.userEmail} :</span>
                        <span class="userMessage text-primary">${messageInfo.message}</span>
                    </p>
                </div>
                <div class="col-4">
                    <p>${messageInfo.date}</p>
                </div>`;
            })
            .join(" ");

        messagesPool.innerHTML = html;
    } catch (error) {
        console.log(`Hubo un error ${error}`);
    }
};

moviesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendProduct();
    titleInput.value = "";
    priceInput.value = "";
    thumbnailInput.value = "";
});

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage();
    messageInput.value = "";
});

socket.on("server:movie", renderMovies);
socket.on("server:message", renderMessages);
