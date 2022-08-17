import mongoose from "mongoose";

const URLMongo = "mongodb://127.0.0.1:27017/ecommerce";

mongoose.connect(URLMongo, (err, res) => {
    if (err) throw err;
    return console.log("Base de datos MONGO conectada.");
})
