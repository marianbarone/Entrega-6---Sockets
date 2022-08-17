import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce", (err, res) => {
    if (err) throw err;
    return console.log("Base de datos MONGO conectada.");
})

class moviesController {
    constructor(collectionName) {

        const moviesSchema = mongoose.Schema({
            movies: {
                id: { type: String, require: true },
                title: { type: String, default: null },
                price: { type: Number, default: null },
                thumbnail: { type: String, default: null },
            },

        })
        this.model = mongoose.model(collectionName, moviesSchema);
    }

    async getAll() {
        try {
            const movies = await this.model.find();
            return movies;
        } catch (error) {
            console.log("Error al obtener peliculas", error);
        }
    }

    async addMovie(movie) {
        try {
            await this.model.create(movie);
            console.log("Pelicula insertada");
        } catch (error) {
            console.log("error al agregar pelicula", error);
        }
    }
}

export default new moviesController("movies");
