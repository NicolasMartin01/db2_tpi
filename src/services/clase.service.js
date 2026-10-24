import { claseRepository } from '../repositories/clase.repository.js';
import { createService } from './base.service.js';

export const claseService = createService(claseRepository, 'Clase');
