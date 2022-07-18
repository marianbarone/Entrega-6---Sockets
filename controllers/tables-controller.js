import knex from "knex";
import configSqlite from '../db/sqlite.js'
import configMariaDb from "../db/mariaDB.js";

export function createChatTable() {

    try {

        const sqliteClient = knex(configSqlite)

        sqliteClient.schema.dropTableIfExists('messages')

        sqliteClient.schema.createTable('messages', table => {
            table.increments('id').primary()
            table.string('user')
            table.string('message')
            table.timestamp('date')
        })

        sqliteClient.destroy()

        console.log('tabla mensajes en sqlite3 creada con éxito')
    } catch (error) {
        console.log('error al crear tabla mensajes en sqlite3')
    }
}

export function createMoviesTable() {


    try {

        const MariaDB = knex(configMariaDb)

        MariaDB.schema.dropTableIfExists('movies')

        MariaDB.schema.createTable('movies', table => {
            table.increments('id').primary()
            table.string('title')
            table.string('price')
            table.string('thumbnail')
        })

        MariaDB.destroy()

        console.log('tabla movies en MariaDB creada con éxito')
    } catch (error) {
        console.log('error al crear tabla mensajes en MariaDB')
    }

}


