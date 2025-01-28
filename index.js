import dotenv from 'dotenv';
import express from "express"
import { conectarDB } from './config/db.js'
import { userRoutes } from './routes/userRoutes.js';

dotenv.config()
const { PORT } = process.env;

const app = express()
app.use(express.json())

conectarDB()

app.use('/api/user', userRoutes)

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`)
})