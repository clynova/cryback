import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { validateEnv } from './config/env.validation.js';
import { errorHandler } from './middleware/error.middleware.js';
import { limiter } from './middleware/rateLimit.middleware.js';
import { AppError } from './types/appError.js';
import { getApiDocs } from './utils/apiDocs.js';

// Validar variables de entorno
validateEnv();

const app = express();

// Configuración de confianza para proxy
app.set('trust proxy', 1);

// Rate limiting - Aplicar solo a rutas /api
app.use('/api', limiter);

// Seguridad
app.use(helmet());

// Logging
app.use(morgan('combined'));

// Compresión
app.use(compression());

// Configuración de CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-frontend-domain.com']
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Sanitización de datos
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Ruta principal
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API CryBack - Documentación</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; max-width: 1200px; margin: 0 auto; }
                h1 { color: #2c3e50; border-bottom: 2px solid #eee; }
                h2 { color: #34495e; margin-top: 30px; }
                .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
                .method { font-weight: bold; }
                .get { color: #2ecc71; }
                .post { color: #3498db; }
                .put { color: #f1c40f; }
                .delete { color: #e74c3c; }
                .description { margin: 10px 0; }
            </style>
        </head>
        <body>
            <h1>🚀 API CryBack</h1>
            <p>Sistema de gestión de comercio electrónico RESTful API</p>
            
            ${getApiDocs()}
            
            <footer style="margin-top: 50px; text-align: center; color: #7f8c8d;">
                <p>Versión 1.0.0 | Desarrollado con ❤️</p>
            </footer>
        </body>
        </html>
    `);
});

app.get('/test-ip', (req, res) => {
    res.json({
        ip: req.ip,
        'x-forwarded-for': req.headers['x-forwarded-for'],
        remoteAddress: req.socket.remoteAddress
    });
});

app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

export default app;
