import { useState } from 'react'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Accounts from './pages/Accounts'
import Categories from './pages/Categories'
import Stats from './pages/Stats'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

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

  if (!token) return <Auth onAuth={handleAuth} />

  return (
    <Router>
      <nav style={{ display: 'flex', gap: 16, padding: 16 }}>
        <Link to="/">記帳本</Link>
        <Link to="/accounts">資產管理</Link>
        <Link to="/categories">分類管理</Link>
        <Link to="/stats">圖表統計</Link>
        <button onClick={handleLogout}>登出</button>
      </nav>
      <Routes>
        <Route path="/" element={<Home onLogout={handleLogout} />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  )
}

export default App
