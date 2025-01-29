import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true } // Agrega automáticamente createdAt y updatedAt
);

const Category = mongoose.model("Category", categorySchema);

export { Category };
