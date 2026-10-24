import mongoose from 'mongoose';

const { Schema } = mongoose;

const claseSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    instructor: {
        type: new mongoose.Schema({
            nombre: { type: String, required: true },
            apellido: { type: String },
            email: { type: String }
        }, { _id: false }),
        required: true
    },
    fechaInicio: { type: Date, required: true },
    cupoMaximo: {
        type: Schema.Types.Int32, // se guarda como BSON int, como exige el validador
        required: true,
        min: 1
    },
    sala: { type: String, trim: true },
    activo: { type: Boolean, required: true, default: true },
    deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

export const Clase = mongoose.model('Clase', claseSchema, 'clases');
