import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/home" className="logo">
        <div className="logo-icon">
          <span>✦</span>
        </div>
        <div className="logo-text">
          <h2>Circuit<span>X</span></h2>
          <p>Reuse. Save. Build.</p>
        </div>
      </Link>

      <div className="nav-links">
        <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/browse" className={({ isActive }) => isActive ? 'active' : ''}>Browse</NavLink>
        <NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>Categories</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/wishlist" className={({ isActive }) => isActive ? 'active' : ''}>Wishlist</NavLink>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <button className="icon-btn" aria-label="Cart">🛒</button>
            <button className="icon-btn" aria-label="Notifications">♡</button>

            <Link to="/profile" className="profile-section">
              <div className="profile-avatar">
                <img src={user.profile_image} alt="" />
              </div>
              <div className="profile-info">
                <span className="profile-name">{user.name}</span>
                <span className="profile-label">My Profile</span>
              </div>
            </Link>

            <button onClick={handleLogout} className="logout-link" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-btn login-btn-nav">Login</Link>
            <Link to="/register" className="auth-btn register-btn-nav">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar