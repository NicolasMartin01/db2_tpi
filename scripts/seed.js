// Inserta datos de prueba: 10 socios, 6 clases y 25 reservas.
// Uso: npm run seed            (aborta si ya hay datos)
//      npm run seed -- --reset (vacía las 3 colecciones antes de insertar)
import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { Socio } from '../src/models/socio.model.js';
import { Clase } from '../src/models/clase.model.js';
import { Reserva } from '../src/models/reserva.model.js';

const dias = (n, hora = 18) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    d.setHours(hora, 0, 0, 0);
    return d;
};

const socios = [
    ['30111222', 'Ana', 'Pérez', 'Mensual', 25000],
    ['31222333', 'Luis', 'Gómez', 'Anual', 240000],
    ['32333444', 'María', 'López', 'Mensual', 25000],
    ['33444555', 'Juan', 'Martínez', 'Trimestral', 65000],
    ['34555666', 'Sofía', 'Rodríguez', 'Mensual', 25000],
    ['35666777', 'Diego', 'Fernández', 'Anual', 240000],
    ['36777888', 'Lucía', 'García', 'Trimestral', 65000],
    ['37888999', 'Martín', 'Sánchez', 'Mensual', 25000],
    ['38999000', 'Valentina', 'Romero', 'Anual', 240000],
    ['39000111', 'Pablo', 'Díaz', 'Mensual', 25000]
].map(([dni, nombre, apellido, plan, precio], i) => ({
    dni, nombre, apellido,
    email: `${nombre}.${apellido}@mail.com`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''),
    telefono: `11555${String(1000 + i)}`,
    membresia: { plan, precio, fechaVencimiento: dias(30 + i * 10) },
    // el último socio está dado de baja
    ...(i === 9 && { activo: false, deletedAt: new Date() })
}));

const clases = [
    ['Spinning', 'Carlos', 'Gómez', 'Sala 1', 20, 1, 8],
    ['Yoga', 'Laura', 'Ibarra', 'Sala 2', 15, 2, 10],
    ['Funcional', 'Marcos', 'Torres', 'Sala 3', 12, 3, 19],
    ['Pilates', 'Elena', 'Vega', 'Sala 2', 10, 4, 9],
    ['Crossfit', 'Nicolás', 'Ruiz', 'Box', 8, 5, 20],
    ['Zumba', 'Camila', 'Paz', 'Sala 1', 25, -3, 18] // dada de baja
].map(([nombre, inom, iape, sala, cupoMaximo, dia, hora], i) => ({
    nombre,
    instructor: { nombre: inom, apellido: iape, email: `${inom}.${iape}@gimnasio.com`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') },
    fechaInicio: dias(dia, hora),
    cupoMaximo,
    sala,
    ...(i === 5 && { activo: false, deletedAt: new Date() })
}));

await mongoose.connect(env.mongoUri, { dbName: env.dbName });

try {
    const reset = process.argv.includes('--reset');
    if (reset) {
        await Promise.all([Reserva.deleteMany({}), Clase.deleteMany({}), Socio.deleteMany({})]);
    } else if ((await Socio.countDocuments()) + (await Clase.countDocuments()) + (await Reserva.countDocuments()) > 0) {
        throw new Error('Las colecciones ya tienen datos. Usá "npm run seed -- --reset" para reemplazarlos.');
    }

    const sociosDB = await Socio.insertMany(socios);
    const clasesDB = await Clase.insertMany(clases);
    const sociosActivos = sociosDB.filter((s) => s.activo);
    const clasesActivas = clasesDB.filter((c) => c.activo);

    // 25 pares socio-clase distintos, tomados con paso uniforme de las 9 x 5 = 45 combinaciones
    const pares = sociosActivos.flatMap((socio) => clasesActivas.map((clase) => [socio, clase]));
    const reservas = Array.from({ length: 25 }, (_, i) => {
        const [socio, clase] = pares[Math.floor((i * pares.length) / 25)];
        return {
            socioId: socio._id,
            claseId: clase._id,
            estado: i % 5 === 4 ? 'CANCELADA' : 'CONFIRMADA' // 5 canceladas
        };
    });
    await Reserva.insertMany(reservas);

    console.log(`Insertados: ${sociosDB.length} socios, ${clasesDB.length} clases, ${reservas.length} reservas`);
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
} finally {
    await mongoose.connection.close();
}
