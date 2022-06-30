const socket = io.connect();

//AddMovieForm
const moviesForm = document.getElementById('moviesForm')
const title = document.getElementById("moviesForm").elements["title"]
const price = document.getElementById("moviesForm").elements["price"]
const thumbnail = document.getElementById("moviesForm").elements["thumbnail"]

//Chat
const chatForm = document.getElementById('moviesForm')
const username = document.getElementById("moviesForm").elements["username"]
const message = document.getElementById("moviesForm").elements["message"]

function addMovie() {
    try {
        let title = title.value;
        let price = Number(price.value);
        let thumbnail = thumbnail.value;
        socket.emit("client:movie", { title, price, thumbnail });
    } catch (err) {
        console.log(`Hubo un error ${err}`);
    }
}

async function renderMovies(movies) {
    let response = await fetch('./movies.hbs')
    let moviesTable = await response.text()
    document.getElementById("movies").innerHTML = "";
    movies.forEach((movie) => {
        const template = Handlebars.compile(moviesTable);
        const html = template(movie);
        document.getElementById("movies").innerHTML += html;
    });
}

socket.on('messages', function (data) { render(data); });

function sendMessage() {
    try {
        let user = username.value;
        let message = message.value;
        let date = new Date().toLocaleString("es-AR")
        socket.emit("client:message", { user, message, date });
    } catch (error) {
        console.log(`Han error has ocurred; ${error}`);
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
    title.value = "";
    price.value = "";
    thumbnail.value = "";
});

formMessage.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage();
    message.value = "";
});

socket.on("server:movie", renderMovies);
socket.on("server:message", renderMessages);
