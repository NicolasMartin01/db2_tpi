import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

try {
    await connectDB();
    app.listen(env.port, () => {
        console.log(`Servidor en http://localhost:${env.port}  |  Swagger: http://localhost:${env.port}/api-docs`);
    });
} catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
}
