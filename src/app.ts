/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/authRoutes'
import cors from 'cors'

dotenv.config()

const app = express()
const serverPort = process.env.PORT ?? 3333

app.use(express.json())

app.use(cors())

app.listen(serverPort)

app.use('/users', userRouter)

export default app
