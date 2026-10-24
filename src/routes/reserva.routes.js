import { Router } from 'express';
import { reservaController as c } from '../controllers/reserva.controller.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = Router();

/**
 * @openapi
 * /api/reservas:
 *   get:
 *     tags: [reservas]
 *     summary: Listar reservas
 *     parameters:
 *       - $ref: '#/components/parameters/Activo'
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Reserva' }
 *   post:
 *     tags: [reservas]
 *     summary: Crear
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReservaInput' }
 *     responses:
 *       201:
 *         description: Creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reserva' }
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 * /api/reservas/{id}:
 *   get:
 *     tags: [reservas]
 *     summary: Obtener por id
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reserva' }
 *       404:
 *         description: No encontrado
 *   put:
 *     tags: [reservas]
 *     summary: Reemplazo completo
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReservaInput' }
 *     responses:
 *       200:
 *         description: Actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reserva' }
 *       400:
 *         description: Error de validación
 *       404:
 *         description: No encontrado
 *   patch:
 *     tags: [reservas]
 *     summary: Actualización parcial
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Cualquier subconjunto de campos de ReservaInput
 *     responses:
 *       200:
 *         description: Actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reserva' }
 *       400:
 *         description: Error de validación
 *       404:
 *         description: No encontrado
 *   delete:
 *     tags: [reservas]
 *     summary: Baja lógica (activo=false, deletedAt=now)
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Dado de baja
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reserva' }
 *       404:
 *         description: No encontrado
 *       409:
 *         description: Ya dado de baja
 */
router.get('/', c.list);
router.post('/', c.create);
router.get('/:id', validateObjectId, c.get);
router.put('/:id', validateObjectId, c.replace);
router.patch('/:id', validateObjectId, c.patch);
router.delete('/:id', validateObjectId, c.remove);

/**
 * @openapi
 * /api/reservas/{id}/cancelar:
 *   patch:
 *     tags: [reservas]
 *     summary: Cancelar reserva (estado=CANCELADA)
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Reserva cancelada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reserva' }
 *       404:
 *         description: No encontrada
 *       409:
 *         description: Ya cancelada o dada de baja
 */
router.patch('/:id/cancelar', validateObjectId, c.cancelar);

export default router;
