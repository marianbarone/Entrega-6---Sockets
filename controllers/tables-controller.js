import knex from "knex";
import configSqlite from '../db/sqlite.js'
import configMariaDb from "../db/mariaDB.js";

export async function createChatTable() {

    try {

        const sqliteClient = knex(configSqlite)

        await sqliteClient.schema.dropTableIfExists('messages')

        await sqliteClient.schema.createTable('messages', table => {
            table.increments('id').primary()
            table.string('user')
            table.string('message')
            table.timestamp('date')
        })

        await sqliteClient.destroy()

        console.log('tabla mensajes en sqlite3 creada con éxito')
    } catch (error) {
        console.log('error al crear tabla mensajes en sqlite3')
    }
}

export async  function createMoviesTable() {


    try {

        const MariaDB = knex(configMariaDb)

      await  MariaDB.schema.dropTableIfExists('movies')

       await  MariaDB.schema.createTable('movies', table => {
            table.increments('id').primary()
            table.string('title')
            table.string('price')
            table.string('thumbnail')
        })

      await  MariaDB.destroy()

        console.log('tabla movies en MariaDB creada con éxito')
    } catch (error) {
        console.log('error al crear tabla mensajes en MariaDB')
    }

}


