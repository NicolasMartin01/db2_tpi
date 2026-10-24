import { claseService } from '../services/clase.service.js';
import { createController } from './base.controller.js';

export const claseController = createController(claseService);
