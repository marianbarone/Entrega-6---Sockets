import mongoose from "mongoose";

class userModel {
    constructor(collectionName) {
        const userSchema = mongoose.Schema({
            username: { type: String, require: true, unique: true },
            email: { type: String, require: true, unique: true },
            password: { type: String, require: true }
        });
        this.model = mongoose.model(collectionName, userSchema);
    }

    async createUser(data) {
        try {
            const user = await this.model.create(data);
            return user;
        } catch (error) {
            console.log("error al crear usuario: ", error);
        }
    }

    async getById(id) {
        try {
            const data = await this.model.findOne({ _id: id });
            return data;
        } catch (error) {
            console.log("error al obtener user por ID", error);
        }
    }

    async getByUsername(username) {
        try {
            const data = await this.model.findOne({ username });
            return data;
        } catch (error) {
            console.log("error al obtener user por USERNAME", error);
        }
    }
}

export default new userModel('user');