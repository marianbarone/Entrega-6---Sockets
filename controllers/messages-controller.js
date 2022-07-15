import knex from 'knex'
import configSqlite from '../db/sqlite.js'

export class messagesController {
    constructor(config, table) {
        this.table = table;
        this.config = config;

        try {

            knex(this.config).schema.hasTable(this.table).then(exists => {
                if (!exists) {
                    return knex(this.config).schema.createTable(this.config, table => {
                        table.increments('id')
                        table.string('user')
                        table.string('message')
                        table.timestamp('date').defaultTo(knex.fn.now())
                    })
                }
            })

        } catch (err) {
            console.log(`Hubo un error ${err}`);
        }
    }

    async addMessage() {
        try {
            const user = usernameInput.value;
            const message = messageInput.value;
            const date = new Date().toLocaleString("es-AR")
            await knex(this.config)(this.table).insert(user, message, date);
        } catch (error) {
            console.log(`Hubo un error ${error}`);
        } finally {
            knex(this.config).destroy();

        }
    }

    async getAll() {
        try {
            const messageInfo = await knex(this.config).from(this.table).select('*');
            return messageInfo;
        } catch (error) {
            console.log("error al obtener mensajes", error);
        } finally {
            knex(this.config).destroy();
        }
    }
}

export default new messagesController(configSqlite, 'messages');


