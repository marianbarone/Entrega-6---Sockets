import knex from "knex";
import configMariaDb from "../db/mariaDB.js";

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
  }

  async addMovie(movie) {
    try {
      await this.config(this.table).insert(movie);
      console.log("Pelicula insertada");
    } catch (error) {
      console.log("error al agregar pelicula", error);
    }
  }
}

export default new moviesController(configMariaDb, "movies");
