import { socioRepository } from '../repositories/socio.repository.js';
import { createService } from './base.service.js';

export const socioService = createService(socioRepository, 'Socio');
