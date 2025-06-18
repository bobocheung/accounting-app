import { useState } from 'react'
import Auth from './pages/Auth'
import Home from './pages/Home'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  const handleAuth = (t: string) => {
    setToken(t)
    localStorage.setItem('token', t)
  }
  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('token')
  }

  return token ? <Home onLogout={handleLogout} /> : <Auth onAuth={handleAuth} />
}

export default App
