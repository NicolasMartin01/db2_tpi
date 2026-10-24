import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
    if (!env.mongoUri) {
        throw new Error('Falta MONGODB_URI en el archivo .env');
    }
    await mongoose.connect(env.mongoUri, { dbName: env.dbName });
    console.log(`Conexión exitosa a MongoDB (${env.dbName})`);
}
