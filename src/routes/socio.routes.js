import { Router } from 'express';
import { socioController as c } from '../controllers/socio.controller.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = Router();

/**
 * @openapi
 * /api/socios:
 *   get:
 *     tags: [socios]
 *     summary: Listar socios
 *     parameters:
 *       - $ref: '#/components/parameters/Activo'
 *     responses:
 *       200:
 *         description: Lista de socios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Socio' }
 *   post:
 *     tags: [socios]
 *     summary: Crear
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SocioInput' }
 *     responses:
 *       201:
 *         description: Creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Socio' }
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 * /api/socios/{id}:
 *   get:
 *     tags: [socios]
 *     summary: Obtener por id
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Socio' }
 *       404:
 *         description: No encontrado
 *   put:
 *     tags: [socios]
 *     summary: Reemplazo completo
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SocioInput' }
 *     responses:
 *       200:
 *         description: Actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Socio' }
 *       400:
 *         description: Error de validación
 *       404:
 *         description: No encontrado
 *   patch:
 *     tags: [socios]
 *     summary: Actualización parcial
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Cualquier subconjunto de campos de SocioInput
 *     responses:
 *       200:
 *         description: Actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Socio' }
 *       400:
 *         description: Error de validación
 *       404:
 *         description: No encontrado
 *   delete:
 *     tags: [socios]
 *     summary: Baja lógica (activo=false, deletedAt=now)
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Dado de baja
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Socio' }
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

export default router;
