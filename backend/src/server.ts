import express from 'express'

const app = express()

app.get('/users', (req, res) => {
  return res.json([
    'Wellington',
    'Mary',
    'Raica',
    'Wendell'
  ])
})

app.listen(3333, () => {
  console.log('Running on port 3333')
})