import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            trim: true 
        },
        type: {
            type: String,
            required: true,
            enum: [
                'transferencia', 
                'webpay', 
                'mercadopago', 
                'flow'
            ],
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        provider: {
            type: String,
            required: true,
            trim: true
        },
        logo_url: {
            type: String,
            trim: true,
            default: ""
        },
        requires_additional_data: {
            type: Boolean,
            default: false
        },
        additional_fields: [{
            name: {
                type: String,
                trim: true
            },
            type: {
                type: String,
                enum: ['text', 'number', 'email', 'date'],
                default: 'text'
            },
            required: {
                type: Boolean,
                default: false
            }
        }],
        commission_percentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        api_keys: {
            public_key: {
                type: String,
                trim: true,
                default: ""
            },
            private_key: {
                type: String,
                trim: true,
                default: ""
            },
            commerce_code: {
                type: String,
                trim: true,
                default: ""
            }
        },
        is_sandbox: {
            type: Boolean,
            default: true
        },
        active: { 
            type: Boolean, 
            default: true 
        }
    },
    { 
        timestamps: true 
    }
);

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);

export { PaymentMethod }; 