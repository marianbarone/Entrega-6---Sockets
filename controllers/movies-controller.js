import knex from "knex";
import configMariaDb from "../db/mariaDB.js";

class moviesController {
    constructor(config, table) {
        this.table = table;
        this.config = config;

        const MariaDB = knex(configMariaDb)

        MariaDB.schema.dropTableIfExists(this.table)

        MariaDB.schema.createTable(this.table, table => {
            table.increments('id').primary()
            table.string('title',)
            table.number('price',)
            table.string('thumbnail')
        })

        MariaDB.destroy()

        console.log('tabla movies en MariaDB creada con éxito')
    } catch(error) {
        console.log('error al crear tabla movies en MariaDB')
    }

    async getAll() {
        try {
            const movies = await knex(this.config).from(this.table).select('*');
            return { movies };
        } catch (error) {
            console.log("error al obtener peliculas", error);
        } finally {
            knex(this.config).destroy();
        }
    }

    async addMovie(movie) {
        try {
            await knex(this.config)(this.table).insert(movie);
        } catch (error) {
            console.log("error al agregar pelicula", error);
        } finally {
            knex(this.config).destroy();
        }
    }
}

export default new moviesController(configMariaDb, 'movies');