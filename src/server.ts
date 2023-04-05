import express from 'express'
import dotenv from 'dotenv'
import http from 'http'

dotenv.config()
const app = express()

const server = http.createServer()

const serverPort = process.env.PORT ?? 3333

app.get('/', (request, response) => response.json({ message: 'Hello World!' }))

server.listen(serverPort, () => {
  console.log('Server started on port 3333!!')
})
