const random = (cant) => {
    let obj = {};
    for (let i = 0; i < cant; i++) {
        const number = Math.round((Math.random() * (1000 - 1)) + 1);
        obj[number] ? obj[number] = obj[number] + 1 : obj[number] = 1;
    }
    return obj;
}

process.on("message", (msg) => {
    if (typeof msg == "number") process.send(random(msg));
})

process.send("listo");