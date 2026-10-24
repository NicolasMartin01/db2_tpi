import { Router } from 'express';
import socioRoutes from './socio.routes.js';
import claseRoutes from './clase.routes.js';
import reservaRoutes from './reserva.routes.js';

const router = Router();

router.use('/socios', socioRoutes);
router.use('/clases', claseRoutes);
router.use('/reservas', reservaRoutes);

export default router;
