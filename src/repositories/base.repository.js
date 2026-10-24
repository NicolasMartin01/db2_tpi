// Único punto de acceso a Mongoose: el resto de las capas no conoce los modelos.
export function createRepository(Model) {
    return {
        create: (data) => Model.create(data),

        findAll: (filter = {}) => Model.find(filter).sort({ createdAt: -1 }),

        findById: (id) => Model.findById(id),

        count: (filter = {}) => Model.countDocuments(filter),

        update: (id, data) =>
            Model.findByIdAndUpdate(id, { $set: data }, { returnDocument: 'after', runValidators: true }),

        async replace(id, data) {
            const doc = await Model.findById(id);
            if (!doc) return null;
            doc.overwrite({
                ...data,
                activo: doc.activo,
                deletedAt: doc.deletedAt,
                createdAt: doc.createdAt
            });
            return doc.save();
        },

        softDelete: (id) =>
            Model.findByIdAndUpdate(id, { $set: { activo: false, deletedAt: new Date() } }, { returnDocument: 'after' })
    };
}
