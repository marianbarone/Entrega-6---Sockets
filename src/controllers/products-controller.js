import mongoose from "mongoose";

class productsController {
    constructor(collectionName) {
        const moviesSchema = mongoose.Schema({

            id: { type: String, require: true },
            title: { type: String, default: null },
            price: { type: Number },
            thumbnail: { type: String },
        })
        this.model = mongoose.model(collectionName, moviesSchema);
    }


    async getAll() {
        try {
            const products = await await this.model.find();
            return { products };
        } catch (error) {
            console.log("error al obtener productos", error);
        }
    }

    async add(product) {
        try {
            await this.model.insertMany(product);
        } catch (error) {
            console.log("error al crear producto", error);
        }
    }
}

export default new productsController('product');