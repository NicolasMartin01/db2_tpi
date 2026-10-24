import { Socio } from '../models/socio.model.js';
import { createRepository } from './base.repository.js';

export const socioRepository = createRepository(Socio);
