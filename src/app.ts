import express from 'express'

const app = express()

app.use((request, response, next) => {
  response.status(200).json({
    message: 'It works!'
  })
})
