import mongoose from "mongoose";

<<<<<<< HEAD
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
=======
class moviesController {
  constructor(config, table) {
    this.table = table;
    this.config = knex(config);

    const crearTabla = async () => {
      const exist = await this.config.schema.hasTable(table);
      if (!exist) {
        try {
          await this.config.schema.createTable(this.table, (table) => {
            table.increments("id").primary();
            table.string("title");
            table.number("price");
            table.string("thumbnail");
          });
          console.log("Tabla movies en MariaDB creada con éxito");
        } catch (error) {
          console.log("error al crear tabla movies en MariaDB", error);
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16
        }
      }
    };
    crearTabla();
  }

  async getAll() {
    try {
      const movies = await this.config.from(this.table).select("*");
      return movies;
    } catch (error) {
      console.log("Error al obtener peliculas", error);
    }
<<<<<<< HEAD

    async addMovie(movie) {
        try {
            await this.model.create(movie);
            console.log("Pelicula insertada");
        } catch (error) {
            console.log("error al agregar pelicula", error);
        }
=======
  }

  async addMovie(movie) {
    try {
      await this.config(this.table).insert(movie);
      console.log("Pelicula insertada");
    } catch (error) {
      console.log("error al agregar pelicula", error);
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16
    }
  }
}

<<<<<<< HEAD
export default new moviesController("movies");
=======
export default new moviesController(configMariaDb, "movies");
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16
