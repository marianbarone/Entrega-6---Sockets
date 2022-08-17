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
        } catch (error) {
            console.log(`Hubo un error ${error}`);
        }
    }

    async getAll() {
        try {
            const messages = await this.model.find();
            // console.log('mensajes controller', messages)
            return messages;
        } catch (error) {
            console.log("Error al obtener mensajes", error);
        }
    }
}

export default new messagesController("message");
