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
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import { userRoutes } from '../routes/userRoutes.js';
import { cartRoutes } from '../routes/cartRoutes.js';
import { categoryRoutes } from '../routes/categoryRoutes.js';
import { productRoutes } from '../routes/productRoutes.js';
import { reviewRoutes } from '../routes/reviewRoutes.js';
import { wishlistRoutes } from '../routes/wishlistRoutes.js';
import { orderRoutes } from '../routes/orderRoutes.js';
import { paymentMethodRoutes } from '../routes/paymentMethodRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Sanitización de datos
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Ruta principal
app.get('/', async (req, res) => {
  try {
    const template = await fs.readFile(
      path.join(__dirname, 'views', 'home.html'),
      'utf8'
    );
    const html = template.replace('{{API_DOCS}}', getApiDocs());
    res.send(html);
  } catch (error) {
    console.error('Error al cargar la página:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);

app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

export default app;
