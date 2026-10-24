import { socioService } from '../services/socio.service.js';
import { createController } from './base.controller.js';

export const socioController = createController(socioService);
