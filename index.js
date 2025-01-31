import dotenv from 'dotenv';
import express from "express"
import { conectarDB } from './config/db.js'
import { userRoutes } from './routes/userRoutes.js';
import { categoryRoutes } from './routes/categoryRoutes.js';
import { productRoutes } from './routes/productRoutes.js';
import { cartRoutes } from './routes/cartRoutes.js';
import { orderRoutes } from './routes/orderRoutes.js';
import { reviewRoutes } from './routes/reviewRoutes.js';


dotenv.config()
const { PORT } = process.env;

const app = express()
app.use(express.json())

conectarDB()

app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/review', reviewRoutes)

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`)
})