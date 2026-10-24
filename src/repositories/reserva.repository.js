import { Reserva } from '../models/reserva.model.js';
import { createRepository } from './base.repository.js';

export const reservaRepository = createRepository(Reserva);
