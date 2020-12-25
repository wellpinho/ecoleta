import express from 'express'
import cors from 'cors'
import path from 'path'

import Items from './routes/ItemRoutes'
import Points from './routes/CollectPointRoutes'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  return res.json({
    message: 'Hello World!'
  })
})

app.use(Items)
app.use(Points)

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(4000, () => {
  console.log('Running on port 4000')
})