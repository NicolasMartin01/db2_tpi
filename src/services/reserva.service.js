import { reservaRepository } from '../repositories/reserva.repository.js';
import { socioRepository } from '../repositories/socio.repository.js';
import { claseRepository } from '../repositories/clase.repository.js';
import { createService } from './base.service.js';
import { HttpError } from './httpError.js';

async function exigirActivo(repository, id, nombre) {
    const doc = await repository.findById(id);
    if (!doc || !doc.activo) throw new HttpError(400, `${nombre} inexistente o dado de baja`);
    return doc;
}

// Una reserva ocupa lugar solo si está CONFIRMADA y no fue dada de baja.
const vigente = { estado: 'CONFIRMADA', activo: true };

async function validarReserva(data, existente) {
    if (data.socioId) await exigirActivo(socioRepository, data.socioId, 'Socio');
    if (data.claseId) await exigirActivo(claseRepository, data.claseId, 'Clase');

    // Estado resultante tras aplicar el cambio (PATCH parcial: se completa con lo guardado).
    const socioId = data.socioId ?? existente?.socioId;
    const claseId = data.claseId ?? existente?.claseId;
    const estado = data.estado ?? existente?.estado ?? 'CONFIRMADA';
    if (estado !== 'CONFIRMADA' || existente?.activo === false) return;
    if (!socioId || !claseId) return; // faltan requeridos: lo informa la validación del modelo

    const otras = { claseId, ...vigente, ...(existente && { _id: { $ne: existente._id } }) };

    if (await reservaRepository.count({ ...otras, socioId }) > 0) {
        throw new HttpError(409, 'El socio ya tiene una reserva confirmada en esta clase');
    }

    const clase = await exigirActivo(claseRepository, claseId, 'Clase');
    if (await reservaRepository.count(otras) >= clase.cupoMaximo) {
        throw new HttpError(409, `La clase alcanzó el cupo máximo (${clase.cupoMaximo})`);
    }
}

const base = createService(reservaRepository, 'Reserva', { beforeSave: validarReserva });

export const reservaService = {
    ...base,

    async cancelar(id) {
        const reserva = await base.getOr404(id);
        if (!reserva.activo) throw new HttpError(409, 'La reserva está dada de baja');
        if (reserva.estado === 'CANCELADA') throw new HttpError(409, 'La reserva ya está cancelada');
        return reservaRepository.update(id, { estado: 'CANCELADA' });
    }
};
