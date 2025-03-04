import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        orderDate: { type: Date, default: Date.now },
        status: { type: String, required: true, enum: ["pending", "completed", "canceled"] },
        total: { type: Number, required: true },
        shippingAddress: {
            street: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            state: { type: String, required: true, trim: true },
            country: { type: String, required: true, trim: true },
            zipCode: { type: String, required: true, trim: true },
            reference: { type: String, trim: true }, // Campo de referencia para ayudar al repartidor
            phoneContact: { type: String, trim: true }, // Teléfono de contacto para la entrega
            recipientName: { type: String, required: true, trim: true }, // Nombre de quien recibe
            additionalInstructions: { type: String, trim: true } // Instrucciones adicionales para la entrega
        },
        paymentMethod: { 
            type: String, 
            enum: ['credit_card', 'debit_card', 'paypal'],
            required: false
        },
        shippingMethod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShippingMethod',
            required: true
        },
        shippingCost: {
            type: Number,
            required: true
        },
        estimatedDeliveryDate: {
            type: Date,
            required: true
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export { Order };
