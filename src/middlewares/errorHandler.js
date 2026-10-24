import mongoose from 'mongoose';

export function errorHandler(err, req, res, next) {
    if (err instanceof mongoose.Error.ValidationError) {
        const detalles = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: 'Error de validación', detalles });
    }
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({ error: `Valor inválido para ${err.path}` });
    }
    if (err.code === 11000) {
        return res.status(409).json({ error: 'Valor duplicado', campos: err.keyValue });
    }
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'JSON inválido' });
    }
    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
}
