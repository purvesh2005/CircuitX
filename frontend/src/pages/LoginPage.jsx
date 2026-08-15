import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/auth.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="logo-section">
          <div className="logo-circle"></div>
          <img src="/images/circuitx-logo.png" alt="CircuitX Logo" className="circuitx-logo" />
          <h2>CircuitX</h2>
          <p>Connect. Learn. Build.</p>
        </div>

        <div className="form-section">
          <h1>Welcome Back!</h1>
          <p className="subtitle">Login to your CircuitX account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="auth-btn-submit">Login</button>
          </form>

          <p className="auth-switch-text">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

      {error && (
        <div className="error-popup">
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
    </div>
  )
}

export default LoginPage