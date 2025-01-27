import mongoose from "mongoose";

// Esquema para la dirección
const addressSchema = new mongoose.Schema({
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true },
});

// Esquema para el usuario
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please fill a valid email address']
    },
    password: { type: String, required: true, trim: true },
    address: { type: addressSchema, default: {} }, // Ahora no es requerido
    phone: { type: String, trim: true },
    roles: { type: [String], default: ['customer'] },
    registrationDate: { type: Date, default: Date.now },
    token: { type: String, default: null },  // Campo para el token de verificación
    confirmado: { type: Boolean, default: false },  // Campo para saber si el usuario ha confirmado su cuenta
});

// Crear el modelo con el esquema
const User = mongoose.model('User', userSchema);

export { User };
