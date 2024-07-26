import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000
const DATA_PATH = path.join(__dirname, '../../data/tc.json')

app.get('/', (req, res) => {
  res.send('El servidor está funcionando correctamente.')
})

app.get('/tipo-cambio', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8')
    const exchangeRate = JSON.parse(data)
    const today = new Date().getDate()

    const todayExchangeRate = exchangeRate.find(tc => tc.date == today)

    if (todayExchangeRate) {
      res.json(todayExchangeRate)
    } else {
      res
        .status(404)
        .json({ message: 'No hay tipo de cambio para el día de hoy' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al leer los datos', error })
  }
})

app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`)
})