import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        orderDate: { type: Date, default: Date.now },
        status: { type: String, required: true, enum: ["pending", "completed", "canceled"] },
        total: { type: Number, required: true },
        shippingAddress: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            zipCode: { type: String, trim: true },
            country: { type: String, trim: true },
        },
        paymentMethod: { type: String, required: true, enum: ['credit_card', 'debit_card', 'paypal']},
    },
    { timestamps: true } // Agrega automáticamente createdAt y updatedAt
);

const Order = mongoose.model("Order", orderSchema);

export { Order };
