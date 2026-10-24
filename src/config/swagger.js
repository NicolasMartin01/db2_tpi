import swaggerJsdoc from 'swagger-jsdoc';

const idParam = {
    name: 'id', in: 'path', required: true,
    schema: { type: 'string', example: '665f1c2e8a1b2c3d4e5f6a7b' }
};

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.3',
        info: { title: 'API Gimnasio TPI', version: '1.0.0', description: 'CRUD de socios, clases y reservas (MongoDB + Mongoose)' },
        servers: [{ url: '/' }],
        components: {
            parameters: {
                Id: idParam,
                Activo: {
                    name: 'activo', in: 'query',
                    schema: { type: 'string', enum: ['true', 'false', 'all'], default: 'true' },
                    description: 'Filtra por baja lógica'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: { error: { type: 'string' }, detalles: { type: 'array', items: { type: 'string' } } }
                },
                Membresia: {
                    type: 'object', required: ['plan'],
                    properties: {
                        plan: { type: 'string', example: 'Mensual' },
                        precio: { type: 'number', example: 25000 },
                        fechaVencimiento: { type: 'string', format: 'date-time' }
                    }
                },
                SocioInput: {
                    type: 'object', required: ['dni', 'nombre', 'apellido', 'email', 'membresia'],
                    properties: {
                        dni: { type: 'string', example: '30123456' },
                        nombre: { type: 'string', example: 'Ana' },
                        apellido: { type: 'string', example: 'Pérez' },
                        email: { type: 'string', example: 'ana@mail.com' },
                        telefono: { type: 'string', example: '1155550000' },
                        membresia: { $ref: '#/components/schemas/Membresia' }
                    }
                },
                Instructor: {
                    type: 'object', required: ['nombre'],
                    properties: {
                        nombre: { type: 'string', example: 'Carlos' },
                        apellido: { type: 'string', example: 'Gómez' },
                        email: { type: 'string', example: 'carlos@mail.com' }
                    }
                },
                ClaseInput: {
                    type: 'object', required: ['nombre', 'instructor', 'fechaInicio', 'cupoMaximo'],
                    properties: {
                        nombre: { type: 'string', example: 'Spinning' },
                        instructor: { $ref: '#/components/schemas/Instructor' },
                        fechaInicio: { type: 'string', format: 'date-time', example: '2026-11-01T18:00:00Z' },
                        cupoMaximo: { type: 'integer', example: 20 },
                        sala: { type: 'string', example: 'Sala 1' }
                    }
                },
                ReservaInput: {
                    type: 'object', required: ['socioId', 'claseId'],
                    properties: {
                        socioId: { type: 'string', example: '665f1c2e8a1b2c3d4e5f6a7b' },
                        claseId: { type: 'string', example: '665f1c2e8a1b2c3d4e5f6a7c' },
                        estado: { type: 'string', enum: ['CONFIRMADA', 'CANCELADA'], default: 'CONFIRMADA' }
                    }
                },
                Socio: {
                    allOf: [{ $ref: '#/components/schemas/SocioInput' }, { $ref: '#/components/schemas/Metadata' }]
                },
                Clase: {
                    allOf: [{ $ref: '#/components/schemas/ClaseInput' }, { $ref: '#/components/schemas/Metadata' }]
                },
                Reserva: {
                    allOf: [{ $ref: '#/components/schemas/ReservaInput' }, { $ref: '#/components/schemas/Metadata' }]
                },
                Metadata: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        activo: { type: 'boolean' },
                        deletedAt: { type: 'string', format: 'date-time', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
});
