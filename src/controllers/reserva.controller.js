import { reservaService } from '../services/reserva.service.js';
import { createController } from './base.controller.js';

const base = createController(reservaService);

export const reservaController = {
    ...base,
    cancelar: base.wrap(async (req, res) => res.json(await reservaService.cancelar(req.params.id)))
};
