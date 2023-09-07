import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import isEmail from 'validator/lib/isEmail.js'

const app = express()
const port = process.env.PORT || 3000
const secretKey = 'superSecretKey'

mongoose.connect('mongodb://127.0.0.1:27017/node-authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(cors())

app.use(bodyParser.json())

const User = mongoose.model('User', {
  username: {
    type: String,
    unique: true,
    validate: {
      validator: isEmail,
      message: 'Correo electrónico no válido',
    },
  },
  password: String,
  role: {
    type: Number,
    default: 0,
  },
})

app.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: 'Correo electrónico ya registrado' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, password: hashedPassword, role })
    await user.save()
    res.status(201).json({ message: 'Usuario registrado con éxito' })
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' })
  }
})

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, secretKey, { expiresIn: '1h' })
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
})

app.get('/check-auth', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  try {
    const decoded = jwt.verify(token, secretKey)
    res.status(200).json({ user: decoded.userId, username: decoded.username, role: decoded.role })
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' })
  }
})

app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`)
})

// Agregar mensajes de error en nodemon en consola
// Verificar comportamientos si el token ha sido eliminado o modificado
// https://github.com/JCamiloMedinaN/login