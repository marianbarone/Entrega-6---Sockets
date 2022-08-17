// import knex from "knex";
// import configMariaDb from "../db/configDB.js";

<<<<<<< HEAD
// export async function createChatTable() {
=======
export async function createChatTable() {
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16

//     try {

//         const sqliteClient = knex(configSqlite)

<<<<<<< HEAD
//         await sqliteClient.schema.dropTableIfExists('messages')

//         await sqliteClient.schema.createTable('messages', table => {
//             table.increments('id').primary()
//             table.string('user')
//             table.string('message')
//             table.timestamp('date')
//         })

//         await sqliteClient.destroy()
=======
        await sqliteClient.schema.dropTableIfExists('messages')

        await sqliteClient.schema.createTable('messages', table => {
            table.increments('id').primary()
            table.string('user')
            table.string('message')
            table.timestamp('date')
        })

        await sqliteClient.destroy()
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16

//         console.log('tabla mensajes en sqlite3 creada con éxito')
//     } catch (error) {
//         console.log('error al crear tabla mensajes en sqlite3')
//     }
// }

<<<<<<< HEAD
// export async function createMoviesTable() {
=======
export async  function createMoviesTable() {
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16


//     try {

//         const MariaDB = knex(configMariaDb)

<<<<<<< HEAD
//         await MariaDB.schema.dropTableIfExists('movies')

//         await MariaDB.schema.createTable('movies', table => {
//             table.increments('id').primary()
//             table.string('title')
//             table.string('price')
//             table.string('thumbnail')
//         })

//         await MariaDB.destroy()
=======
      await  MariaDB.schema.dropTableIfExists('movies')

       await  MariaDB.schema.createTable('movies', table => {
            table.increments('id').primary()
            table.string('title')
            table.string('price')
            table.string('thumbnail')
        })

      await  MariaDB.destroy()
>>>>>>> 47398b81f25fea9570219fb765137dbb707c7d16

//         console.log('tabla movies en MariaDB creada con éxito')
//     } catch (error) {
//         console.log('error al crear tabla mensajes en MariaDB')
//     }

// }



