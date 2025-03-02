import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['credit_card', 'debit_card', 'paypal'],
    },
    // Para tarjetas
    cardNumber: {
        type: String,
        select: false // No se incluye por defecto en las consultas
    },
    last4Digits: {
        type: String
    },
    cardType: {
        type: String,
        enum: ['visa', 'mastercard', 'american_express', null]
    },
    expiryMonth: {
        type: String,
        select: false
    },
    expiryYear: {
        type: String,
        select: false
    },
    cardholderName: {
        type: String
    },
    // Para PayPal
    paypalEmail: {
        type: String,
        select: false
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Middleware para encriptar información sensible antes de guardar
paymentMethodSchema.pre('save', async function(next) {
    if (this.isModified('cardNumber')) {
        // Solo guardamos los últimos 4 dígitos de la tarjeta
        this.last4Digits = this.cardNumber.slice(-4);
        // Aquí deberías implementar la encriptación del número completo de la tarjeta
        // usando una biblioteca de cifrado como crypto-js
    }
    next();
});

// Método para ocultar información sensible
paymentMethodSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.cardNumber;
    delete obj.expiryMonth;
    delete obj.expiryYear;
    delete obj.paypalEmail;
    return obj;
};

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

export { PaymentMethod };