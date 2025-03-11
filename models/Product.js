import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        price: { type: Number, required: true },
        images: [{ type: String, trim: true }],
        stock: { type: Number, default: 0 }
    },
    { timestamps: true } // Agrega automáticamente createdAt y updatedAt
);

const Product = mongoose.model("Product", productSchema);

export { Product };
