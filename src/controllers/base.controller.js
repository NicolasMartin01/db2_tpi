const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);

export function createController(service) {
    return {
        create: wrap(async (req, res) => res.status(201).json(await service.create(req.body))),
        list: wrap(async (req, res) => res.json(await service.list(req.query))),
        get: wrap(async (req, res) => res.json(await service.get(req.params.id))),
        replace: wrap(async (req, res) => res.json(await service.replace(req.params.id, req.body))),
        patch: wrap(async (req, res) => res.json(await service.patch(req.params.id, req.body))),
        remove: wrap(async (req, res) => res.json(await service.remove(req.params.id))),
        wrap
    };
}
