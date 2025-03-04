import mongoose from "mongoose";

const shippingMethodSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            trim: true 
        },
        company: { 
            type: String, 
            required: true, 
            trim: true 
        },
        description: { 
            type: String, 
            trim: true 
        },
        cost: { 
            type: Number, 
            required: true, 
            min: 0 
        },
        estimatedDeliveryDays: { 
            type: Number, 
            required: true, 
            min: 1 
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

const ShippingMethod = mongoose.model("ShippingMethod", shippingMethodSchema);

export { ShippingMethod };