const socket = io();

const renderProducts = async (products) => {
    const res = await fetch("./views/productsTemplate.ejs");
    const template = await res.text();
    const html = ejs.render(template, { products });
    document.getElementById("products").innerHTML = html;
}

const renderMessages = async (messages, compression) => {
    const res = await fetch("./views/chatTemplate.ejs");
    const template = await res.text();
    const html = ejs.render(template, { messages, compression });
    document.getElementById("chatLog").innerHTML = html;
}

document.getElementById("productsForm")
    .addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        let obj = {};
        data.forEach((value, key) => obj[key] = value);
        socket.emit("client:newProduct", obj);
        e.target.reset();
    })

document.getElementById("messageCenter")
    .addEventListener("submit", (e) => {
        e.preventDefault();
        const chatBox = e.target.querySelector("[name='message']");
        const emailInput = e.target.querySelector("[name='email']");
        if (chatBox.value.trim()) {
            const message = chatBox.value;
            const email = emailInput.value;
            const obj = {
                author: {
                    email: email
                },
                text: message
            }
            socket.emit("client:newMessage", obj);
            chatBox.value = "";
            chatBox.focus();
            emailInput.disabled = true;
        }
    })

//Evento websocket para render de productos.
socket.on("server:products", (data) => {
    renderProducts(data.products);
})


//Schemas de Normalize
const authorSchema = new normalizr.schema.Entity("authorEntity", {}, { idAttribute: "email" });
const messageSchema = new normalizr.schema.Entity("messageEntity", { author: authorSchema }, { idAttribute: "_id" });
const messageArraySchema = new normalizr.schema.Entity("messageArrayEntity", { messages: [messageSchema] });

//Evento websocket del chat (render de cada mensaje nuevo).
socket.on("server:messages", (noromalizedData) => {
    //Denormalizamos el objeto normalizado que recibimos.
    const denormalizedData = normalizr.denormalize(noromalizedData.result, messageArraySchema, noromalizedData.entities);

    //Calculo % de compresion:
    const compression = Math.round(JSON.stringify(noromalizedData).length / JSON.stringify(denormalizedData).length * 100 - 100);

    //Rendereamos el array denormalizado y el % de compresion
    renderMessages(denormalizedData.messages, compression);
})