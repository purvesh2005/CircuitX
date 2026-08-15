import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import '../styles/profile.css'

function ProfilePage() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ total_listings: 0, total_views: 0 })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile')
      setUser(res.data.user)
      setStats(res.data.stats)
      setFormData({
        name: res.data.user.name,
        email: res.data.user.email,
        phone: res.data.user.phone || '',
        college: res.data.user.college || ''
      })
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
      }
      console.log('Error fetching profile:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put('/users/profile', formData)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile')
    }
  }

  if (!user) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            <img src={user.profile_image} alt="" />
          </div>
          <h1>{user.name}</h1>
          <p className="profile-email">{user.email}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total_listings || 0}</div>
            <div className="stat-label">Total Listings</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">{stats.total_views || 0}</div>
            <div className="stat-label">Total Views</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">₹</div>
            <div className="stat-label">Total Earnings</div>
          </div>
        </div>

        <div className="profile-form-section">
          <h2>Edit Profile</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
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
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  minLength="10"
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="college">College Name</label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="user_id">User ID</label>
                <input
                  type="text"
                  id="user_id"
                  value={user.user_id}
                  readOnly
                />
              </div>
            </div>

            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        </div>
      </div>

      {error && (
        <div className="error-popup">
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="success-popup">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}
    </div>
  )
}

export default ProfilePage