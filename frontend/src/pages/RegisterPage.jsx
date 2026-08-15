import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/auth.css'

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    college: ''
  })
  const [profileImage, setProfileImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append('username', formData.username)
      data.append('email', formData.email)
      data.append('phone', formData.phone)
      data.append('password', formData.password)
      data.append('college', formData.college)
      data.append('profile_image', profileImage)

      await register(data)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="logo-section">
          <div className="logo-circle"></div>
          <img src="/images/circuitx-logo.png" alt="CircuitX Logo" className="circuitx-logo" />
          <h2>CircuitX</h2>
          <p>Connect. Learn. Build.</p>
        </div>

        <div className="form-section">
          <h1>Create Account</h1>
          <p className="subtitle">Join CircuitX today!</p>

          <form onSubmit={handleSubmit}>
            <div className="profile-photo-section">
              <label htmlFor="profile_image" className="profile-upload-btn">
                <div className="profile-preview">
                  <img
                    id="profilePreview"
                    src={preview || 'https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg'}
                    alt="Profile"
                  />
                </div>
                Add Profile Photo
              </label>
              <input
                type="file"
                id="profile_image"
                name="profile_image"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              <small>JPG, PNG or WEBP • Max 5MB</small>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="username"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your 10-digit phone number"
                pattern="[0-9]{10}"
                maxLength="10"
                minLength="10"
                inputMode="numeric"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="college">College Name</label>
              <input
                type="text"
                id="college"
                name="college"
                placeholder="Enter your college name"
                value={formData.college}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-btn-submit">Register</button>
          </form>

          <p className="auth-switch-text">
            Already have an account? <Link to="/login">Login</Link>
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

export default RegisterPage