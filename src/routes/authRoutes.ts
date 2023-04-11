/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextFunction, type RequestHandler, type Request, type Response, Router } from 'express'
import bcrypt from 'bcrypt'
import User, { type IUserProfile } from '../models/User'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import express from 'express'

dotenv.config()

const userRouter = Router()

const app = express()

app.use(express.json())

mongoose.connect(process.env.MONGO_DB_USER_DB ?? '').then(() => {
  console.log('Connected to db')
}).catch((err) => {
  console.log('Error connecting to database', err)
})

mongoose.connection.useDb('users')

const verifyToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado!' })
  }

  try {
    const secret = process.env.SECRET ?? ''
    jwt.verify(token, secret)
    // req.user = decoded
    next()
  } catch (error) {
    res.status(400).json({ msg: 'Token inválido' })
  }
}

// Rota pública

userRouter.get('/:id', verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id
  const user = await User.findById(id, '-password')

  if (user == null) {
    return res.status(404).json({ msg: 'Usuário não encontrado' })
  }

  return res.status(200).json(user)
})

userRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email) {
    return res.status(422).json({ message: 'O email é obrigatório' })
  }

  if (!password) {
    return res.status(422).json({ message: 'A senha é obrigatória' })
  }

  const user = await User.findOne({ email })

  if (user === null) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  const passwordMatched = await bcrypt.compare(password, user.password)

  if (!passwordMatched) {
    return res.status(422).json({ message: 'Senha incorreta' })
  }

  try {
    const secret = process.env.SECRET ?? ''
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1d' })
    return res.status(200).json({ message: 'Usuário logado com sucesso', token, user })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

userRouter.post('/register', async (req: Request<IUserProfile>, res: Response) => {
  const { name, email, password, profilePhoto, createdAt, address }: IUserProfile = req.body

  //   if (!name || !email || !password) {
  //     return res.status(422).send('Please enter all fields')
  //   }

  if (!name) {
    return res.status(422).json({ error: 'O nome é obrigatório' })
  }

  if (!email) {
    return res.status(422).json({ error: 'O email é obrigatório' })
  }

  if (!password) {
    return res.status(422).json({ error: 'A senha é obrigatória' })
  }

  const userExists = await User.findOne({ email })

  if (userExists !== null) {
    return res.status(422).json({ error: 'User already exists' })
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = new User({ name, email, password: hash, profilePhoto, createdAt, address })

  user.save()
    .then(() => {
      res.status(201).json({ message: 'User registered successfully' })
    })
    .catch((err) => {
      console.log('🚀 ~ file: app.ts:43 ~ app.post ~ err', err)
      res.status(500).json({ error: 'Server error' })
    })
})

export default userRouter
