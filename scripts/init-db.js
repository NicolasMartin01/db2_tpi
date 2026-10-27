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

try {
    await mongoose.connect(env.mongoUri, { dbName: env.dbName });
    const db = mongoose.connection.db;
    const existentes = (await db.listCollections().toArray()).map((c) => c.name);

    for (const [nombre, schema] of Object.entries(schemas)) {
        const validator = { $jsonSchema: { bsonType: 'object', ...schema } };
        if (existentes.includes(nombre)) {
            await db.command({ collMod: nombre, validator });
            console.log(`Validador actualizado (collMod): ${nombre}`);
        } else {
            await db.createCollection(nombre, { validator });
            console.log(`Colección creada con validador: ${nombre}`);
        }
    }

    await db.collection('socios').createIndex({ dni: 1 }, { unique: true });
    await db.collection('reservas').createIndex(
        { socioId: 1, claseId: 1 },
        { unique: true, partialFilterExpression: { activo: true } }
    );
    console.log('Índices aplicados: socios.dni (único), reservas.socioId+claseId (único parcial)');
} catch (error) {
    if (error.codeName === 'Unauthorized') {
        console.error('ERROR: el usuario no tiene permisos suficientes. Ejecutar con un usuario con rol dbAdmin.');
    } else {
        console.error('ERROR al aplicar los validadores:', error.message);
    }
    process.exitCode = 1;
} finally {
    await mongoose.connection.close();
}