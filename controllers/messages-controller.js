import knex from "knex";
import configSqlite from "../db/sqlite.js";

export class messagesController {
  constructor(config, table) {
    this.table = table;
    this.config = knex(config);

    const crearTabla = async () => {
      const exist = await this.config.schema.hasTable(table);
      if (!exist) {
        try {
          await this.config.schema.createTable(this.table, (table) => {
            table.increments("id").primary();
            table.string("user");
            table.string("message");
            table.timestamp("date").defaultTo(knex.fn.now());
          });
          console.log("Tabla messages en SQLite creada con éxito");
        } catch (error) {
          console.log("error al crear tabla messages en SQLite", error);
        }
      }
    };
    crearTabla();
  }

  async addMessage(mensaje) {
    try {
      await this.config(this.table).insert(mensaje);
      console.log('Mensaje insertado')
    } catch (error) {
      console.log(`Hubo un error ${error}`);
    }
  }

  async getAll() {
    try {
      const messageInfo = await this.config.from(this.table).select("*");
      return messageInfo;
    } catch (error) {
      console.log("error al obtener mensajes", error);
    }
  }
}

export default new messagesController(configSqlite, "messages");
