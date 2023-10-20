import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    axios.post('http://localhost:3000/register', { username, password })
      .then(response => {
        console.log(response)
        window.alert("Usuario registrado con éxito ")
        window.location = '/login'
      })
      .catch(error => {
        window.alert('Error al registrarse ', error)
      })
  }

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Correo electrónico: </label>
          <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} autoComplete='username' /> <br /> <br />
        </div>
        <div>
          <label>Contraseña: </label>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} autoComplete='current-password' /> <br /> <br />
        </div>
        <div>
          <button type='submit'>Registrarse</button> <br /> <br />
        </div>
      </form>
      <div>
        <Link to="/login">Iniciar Sesión</Link>
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

export default Register