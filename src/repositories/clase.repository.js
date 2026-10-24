import { Clase } from '../models/clase.model.js';
import { createRepository } from './base.repository.js';

export const claseRepository = createRepository(Clase);
