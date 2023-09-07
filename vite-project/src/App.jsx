import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import axios from 'axios'
import PropTypes from 'prop-types'

import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import Admin from './components/Admin'

function App() {
  const [user, setUser] = useState()
  const [appLoaded, setAppLoaded] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get('http://localhost:3000/check-auth', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data)
        })
        .catch((error) => {
          // console.error('Error al verificar la autenticación:', error)
          // localStorage.removeItem('token')
          // setUser(null)
          error
        })
    }
    setTimeout(() => {
      setAppLoaded(true)
    }, 300)
  }, [])

  const ProtectedRoute = ({ user, children }) => {
    if (!user) {
      return <Navigate to='/login' replace />
    }
    return children
  }

  ProtectedRoute.propTypes = {
    user: PropTypes.any,
    children: PropTypes.any,
  }

  if (!appLoaded) {
    return <div>Cargando...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path='/register' element={user ? <Navigate to='/profile' replace /> : <Register />} />
        <Route path='/login' element={user ? <Navigate to='/profile' replace /> : <Login setUser={setUser} />} />
        <Route
          path='/profile'
          element={
            user && user.role === 0 ? (
              <Profile />
            ) : user && user.role === 1 ? (
              <Navigate to='/admin' replace />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route path='/admin' element={user && user.role === 1 ? <Admin /> : <Navigate to='/login' replace />} />
        <Route path='/*' element={<Navigate to='/login' replace />} />
      </Routes>
    </Router>
  )
}

export default App
