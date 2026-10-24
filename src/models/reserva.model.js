import mongoose from 'mongoose';

export const ESTADOS_RESERVA = ['CONFIRMADA', 'CANCELADA'];

const reservaSchema = new mongoose.Schema({
    socioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Socio', required: true },
    claseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clase', required: true },
    estado: { type: String, required: true, enum: ESTADOS_RESERVA, default: 'CONFIRMADA' },
    activo: { type: Boolean, required: true, default: true },
    deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

// Un socio no puede tener dos reservas vigentes en la misma clase.
reservaSchema.index(
    { socioId: 1, claseId: 1 },
    { unique: true, partialFilterExpression: { estado: 'CONFIRMADA', activo: true } }
);

export const Reserva = mongoose.model('Reserva', reservaSchema, 'reservas');
