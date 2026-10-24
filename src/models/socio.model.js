import mongoose from 'mongoose';

const socioSchema = new mongoose.Schema({
    dni: { type: String, required: true, unique: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    telefono: { type: String, trim: true },
    membresia: {
        type: new mongoose.Schema({
            plan: { type: String, required: true },
            precio: { type: Number, min: 0 },
            fechaVencimiento: { type: Date }
        }, { _id: false }),
        required: true
    },
    activo: { type: Boolean, required: true, default: true },
    deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

export const Socio = mongoose.model('Socio', socioSchema, 'socios');
