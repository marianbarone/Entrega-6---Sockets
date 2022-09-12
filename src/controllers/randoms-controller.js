import __dirname from "../utils.js";
import { fork } from "child_process";

const randomsController = (req, res) => {
    const cant = Number(req.query.cant) || 100000000;
    const forked = fork(__dirname + "/middlewares/randoms-generator.js");
    forked.on("message", (msg) => {
        if (msg == "listo") {
            forked.send(cant);
        } else {
            console.log("Numero random generado...");
            res.json(msg);
        }
    });
}

export default randomsController;