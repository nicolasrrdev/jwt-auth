import { useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    axios.post('http://localhost:3000/login', { username, password })
      .then(response => {
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)
        window.location = '/profile'
      })
      .catch(error => {
        window.alert('Error al iniciar sesión ', error)
      })
  }

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de usuario:</label>
          <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <button type='submit'>Iniciar Sesión</button>
        </div>
      </form>
      <div>
        <Link to="/register">Registrarse</Link>
      </div>
      <div>
        <Link to="/Profile">Perfil</Link>
      </div>
      <div>
        <Link to="/Admin">Admin</Link>
      </div>
    </div>
  )
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
}

export default Login