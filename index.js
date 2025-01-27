import dotenv from 'dotenv';
import express from "express"
import { conectarDB } from './config/db.js'

dotenv.config()
const { PORT } = process.env;

const app = express()

conectarDB()

app.use('/', (req, res) => {
    res.send('hey bro')
})

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`)
})