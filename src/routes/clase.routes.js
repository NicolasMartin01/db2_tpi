import { Router } from 'express';
import { claseController as c } from '../controllers/clase.controller.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = Router();

/**
 * @openapi
 * /api/clases:
 *   get:
 *     tags: [clases]
 *     summary: Listar clases
 *     parameters:
 *       - $ref: '#/components/parameters/Activo'
 *     responses:
 *       200:
 *         description: Lista de clases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Clase' }
 *   post:
 *     tags: [clases]
 *     summary: Crear
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClaseInput' }
 *     responses:
 *       201:
 *         description: Creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Clase' }
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 * /api/clases/{id}:
 *   get:
 *     tags: [clases]
 *     summary: Obtener por id
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Clase' }
 *       404:
 *         description: No encontrado
 *   put:
 *     tags: [clases]
 *     summary: Reemplazo completo
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClaseInput' }
 *     responses:
 *       200:
 *         description: Actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Clase' }
 *       400:
 *         description: Error de validación
 *       404:
 *         description: No encontrado
 *   patch:
 *     tags: [clases]
 *     summary: Actualización parcial
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Cualquier subconjunto de campos de ClaseInput
 *     responses:
 *       200:
 *         description: Actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Clase' }
 *       400:
 *         description: Error de validación
 *       404:
 *         description: No encontrado
 *   delete:
 *     tags: [clases]
 *     summary: Baja lógica (activo=false, deletedAt=now)
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Dado de baja
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Clase' }
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
