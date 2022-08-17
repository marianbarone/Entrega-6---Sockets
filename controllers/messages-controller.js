<<<<<<< HEAD
import mongoose from "mongoose";

export class messagesController {
    constructor(collectionName) {
        const MessageSchema = mongoose.Schema({
            author: {
                email: { type: String, require: true },
                nombre: { type: String, default: null },
                apellido: { type: String, default: null },
                edad: { type: Number, default: null },
                alias: { type: String, default: null },
                avatar: { type: String, default: "https://cdn3.iconfinder.com/data/icons/avatars-set1/32/ava32px040-256.png" }
            },
            text: { type: String, require: true },
            date: { type: Date, default: Date.now }
        })
        this.model = mongoose.model(collectionName, MessageSchema);
    }

    async addMessage(data) {
        try {
            await this.model.create(data);
            console.log('Mensaje insertado')
=======
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
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16
        } catch (error) {
          console.log("error al crear tabla messages en SQLite", error);
        }
<<<<<<< HEAD
    }

    async getAll() {
        try {
            const messages = await this.model.find();
            // console.log('mensajes controller', messages)
            return messages;
        } catch (error) {
            console.log("Error al obtener mensajes", error);
        }
=======
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
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16
    }
  }
}

<<<<<<< HEAD
export default new messagesController("message");
=======
export default new messagesController(configSqlite, "messages");
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16
