import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { validateEnv } from './config/env.validation.js';
import { errorHandler } from './middleware/error.middleware.js';
import { limiter } from './middleware/rateLimit.middleware.js';
import { AppError } from './types/appError.js';

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
