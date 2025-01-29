import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        price: { type: Number, required: true },
        images: [{ type: String, trim: true }], // Arreglo de URLs de imágenes
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        stock: { type: Number, default: 0 },
        brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
        modelId: { type: mongoose.Schema.Types.ObjectId, ref: "Model" },
    },
    { timestamps: true } // Agrega automáticamente createdAt y updatedAt
);

const Product = mongoose.model("Product", productSchema);

export { Product };
