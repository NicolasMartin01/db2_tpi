import { HttpError } from './httpError.js';

// Campos que el cliente no puede escribir directamente.
const PROTEGIDOS = ['_id', 'createdAt', 'updatedAt', 'deletedAt', 'activo'];

export function sanitize(data = {}) {
    const limpio = { ...data };
    PROTEGIDOS.forEach((campo) => delete limpio[campo]);
    return limpio;
}

// hooks.beforeSave(data, existente): existente es el documento actual (undefined al crear).
export function createService(repository, nombre, hooks = {}) {
    const getOr404 = async (id) => {
        const doc = await repository.findById(id);
        if (!doc) throw new HttpError(404, `${nombre} no encontrado`);
        return doc;
    };

    return {
        getOr404,

        async create(data) {
            const limpio = sanitize(data);
            await hooks.beforeSave?.(limpio);
            return repository.create(limpio);
        },

        // activo: 'true' (default) | 'false' | 'all'
        list({ activo = 'true' } = {}) {
            const filter = activo === 'all' ? {} : { activo: activo !== 'false' };
            return repository.findAll(filter);
        },

        get: getOr404,

        async replace(id, data) {
            const limpio = sanitize(data);
            await hooks.beforeSave?.(limpio, await getOr404(id));
            const doc = await repository.replace(id, limpio);
            if (!doc) throw new HttpError(404, `${nombre} no encontrado`);
            return doc;
        },

        async patch(id, data) {
            const limpio = sanitize(data);
            await hooks.beforeSave?.(limpio, await getOr404(id));
            const doc = await repository.update(id, limpio);
            if (!doc) throw new HttpError(404, `${nombre} no encontrado`);
            return doc;
        },

        async remove(id) {
            const doc = await getOr404(id);
            if (!doc.activo) throw new HttpError(409, `${nombre} ya está dado de baja`);
            return repository.softDelete(id);
        }
    };
}
