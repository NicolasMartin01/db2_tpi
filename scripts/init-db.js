// Aplica los validadores $jsonSchema del TPI sobre las colecciones (idempotente).
import mongoose from 'mongoose';
import { env } from '../src/config/env.js';

const fecha = { bsonType: 'date' };
const fechaONull = { bsonType: ['date', 'null'] };
const base = { activo: { bsonType: 'bool' }, deletedAt: fechaONull, createdAt: fecha, updatedAt: fecha };

const schemas = {
    socios: {
        required: ['dni', 'nombre', 'apellido', 'email', 'membresia', 'activo'],
        properties: {
            dni: { bsonType: 'string' }, nombre: { bsonType: 'string' }, apellido: { bsonType: 'string' },
            email: { bsonType: 'string' }, telefono: { bsonType: 'string' }, membresia: { bsonType: 'object' }, ...base
        }
    },
    clases: {
        required: ['nombre', 'instructor', 'fechaInicio', 'cupoMaximo', 'activo'],
        properties: {
            nombre: { bsonType: 'string' }, instructor: { bsonType: 'object' }, fechaInicio: fecha,
            cupoMaximo: { bsonType: 'int' }, sala: { bsonType: 'string' }, ...base
        }
    },
    reservas: {
        required: ['socioId', 'claseId', 'estado', 'activo'],
        properties: {
            socioId: { bsonType: 'objectId' }, claseId: { bsonType: 'objectId' },
            estado: { enum: ['CONFIRMADA', 'CANCELADA'] }, ...base
        }
    }
};

await mongoose.connect(env.mongoUri, { dbName: env.dbName });
const db = mongoose.connection.db;
const existentes = (await db.listCollections().toArray()).map((c) => c.name);

for (const [nombre, schema] of Object.entries(schemas)) {
    const validator = { $jsonSchema: { bsonType: 'object', ...schema } };
    if (existentes.includes(nombre)) await db.command({ collMod: nombre, validator });
    else await db.createCollection(nombre, { validator });
    console.log(`Validador aplicado: ${nombre}`);
}
await mongoose.connection.close();
