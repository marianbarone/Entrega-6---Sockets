import knex from "knex";
import configMariaDb from "../db/mariaDB";

class productsController {
    constructor(config, table) {
        this.table = table;
        this.config = config;

        const MariaDB = knex(configMariaDb)

        MariaDB.schema.dropTableIfExists(this.table)

        MariaDB.schema.createTable(this.table, table => {
            table.increments('id').primary()
            table.string('user', 30)
            table.string('message', 128)
            table.timestamp('date').defaultTo(knex.fn.now())
        })

        MariaDB.destroy()

        console.log('tabla mensajes en MariaDB creada con éxito')
        } catch(error) {
        console.log('error al crear tabla mensajes en MariaDB')
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

    async addMovie(product) {
        try {
            await knex(this.config)(this.table).insert(product);
        } catch (error) {
            console.log("error al agregar pelicula", error);
        } finally {
            knex(this.config).destroy();
        }
    }
}

export default new productsController(configMariaDb, 'product');