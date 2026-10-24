import mongoose from 'mongoose';

const url = 'mongodb+srv://nemartinr_db_user:3060@bdii-utn-cluster.zrjbxq5.mongodb.net/';
const dbName = 'laboratorio';

const sensorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    stock: {
        type: Number
    }
}, {
    timestamps: true
});

const Sensor = mongoose.model('Sensor', sensorSchema, 'sensores');

async function main() {
    await mongoose.connect(`${url}${dbName}`);
    console.log('Conexión exitosa a MongoDB con Mongoose');

    const insertResult = await Sensor.insertMany([
        { nombre: 'Sensor de Humedad', stock: 15 },
        { nombre: 'Servo Motor', stock: 8 },
        { nombre: 'LED RGB', stock: 40 }
    ]);
    console.log('Documentos insertados =>', insertResult);
    return 'Completado.';
}

try {
    const result = await main();
    console.log(result);
} catch (error) {
    console.error('Error en la conexión o ejecución:', error);
} finally {
    await mongoose.connection.close();
}
