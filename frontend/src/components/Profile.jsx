import { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Profile = () => {
  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location = '/login'
  }

  const [user, setUser] = useState({})
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.get('http://localhost:3000/check-auth', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          setUser(response.data)
        })
        .catch(error => {
          // console.error('Error al verificar la autenticación:', error)
          // localStorage.removeItem('token')
          // setUser(null)
          error
        })
    }
  }, [user])

  return (
    <div>
      <h2>Panel de Usuario</h2>
      <p>Nombre de usuario: {user.username}</p>
      <p>Rol: {user.role === 0 ? 'Usuario' : user.role === 1 ? 'Admin' : 'Cargando...'}</p>
      <button onClick={handleLogout}>Cerrar Sesión</button> <br /> <br />
      <div>
        <Link to="/Register">Registrarse</Link>
      </div>
      <div>
        <Link to="/Login">Iniciar Sesión</Link>
      </div>
      <div>
        <Link to="/Admin">Panel de Admin</Link>
      </div>
    </div>
  )
}

Profile.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
}

export default Profile