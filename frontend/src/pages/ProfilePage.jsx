import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

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

  if (!user) return <div className="text-center py-[100px]">Loading...</div>

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f7f9f8] px-4 pt-[30px] pb-10">
      <div className="max-w-[900px] min-h-[600px] mx-auto bg-white border border-[#eeeeee] rounded-xl overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
        <div className="bg-gradient-to-br from-[#08a568] to-[#06b87a] px-[30px] pt-10 pb-[30px] text-center text-white relative max-[650px]:px-5 max-[650px]:pt-[30px] max-[650px]:pb-[25px]">
          <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-[3px] border-white/60 mx-auto mb-[15px] flex items-center justify-center">
            <img src={user.profile_image} alt="" className="w-full h-full object-cover object-center block" />
          </div>
          <h1 className="text-[22px] font-bold mb-[5px]">{user.name}</h1>
          <p className="text-[13px] opacity-90">{user.email}</p>
        </div>

        <div className="grid grid-cols-3 gap-[15px] px-[30px] py-5 bg-[#fafafa] border-b border-[#eeeeee] max-[650px]:grid-cols-1">
          <div className="text-center px-2.5 py-[15px] bg-white border border-[#eeeeee] rounded-lg">
            <div className="text-2xl font-bold text-[#08a568] mb-1">{stats.total_listings || 0}</div>
            <div className="text-[11px] text-[#666] font-medium">Total Listings</div>
          </div>

          <div className="text-center px-2.5 py-[15px] bg-white border border-[#eeeeee] rounded-lg">
            <div className="text-2xl font-bold text-[#08a568] mb-1">{stats.total_views || 0}</div>
            <div className="text-[11px] text-[#666] font-medium">Total Views</div>
          </div>

          <div className="text-center px-2.5 py-[15px] bg-white border border-[#eeeeee] rounded-lg">
            <div className="text-2xl font-bold text-[#08a568] mb-1">₹</div>
            <div className="text-[11px] text-[#666] font-medium">Total Earnings</div>
          </div>
        </div>

        <div className="p-[30px] max-[650px]:p-5">
          <h2 className="text-base font-bold mb-5 text-[#222]">Edit Profile</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-[18px] max-[650px]:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-[#333]">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-10 px-3 border border-[#ddd] rounded-md text-[13px] text-[#333] outline-none transition duration-200 focus:border-[#08a568] focus:shadow-[0_0_0_3px_rgba(8,165,104,0.1)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-[#333]">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-10 px-3 border border-[#ddd] rounded-md text-[13px] text-[#333] outline-none transition duration-200 focus:border-[#08a568] focus:shadow-[0_0_0_3px_rgba(8,165,104,0.1)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-[#333]">Phone Number</label>
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
                  className="h-10 px-3 border border-[#ddd] rounded-md text-[13px] text-[#333] outline-none transition duration-200 focus:border-[#08a568] focus:shadow-[0_0_0_3px_rgba(8,165,104,0.1)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="college" className="text-xs font-semibold text-[#333]">College Name</label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                  className="h-10 px-3 border border-[#ddd] rounded-md text-[13px] text-[#333] outline-none transition duration-200 focus:border-[#08a568] focus:shadow-[0_0_0_3px_rgba(8,165,104,0.1)]"
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-full">
                <label htmlFor="user_id" className="text-xs font-semibold text-[#333]">User ID</label>
                <input
                  type="text"
                  id="user_id"
                  value={user.user_id}
                  readOnly
                  className="h-10 px-3 border border-[#ddd] rounded-md text-[13px] bg-[#f5f5f5] text-[#888] cursor-not-allowed"
                />
              </div>
            </div>

            <button type="submit" className="h-10 px-[30px] bg-[#08a568] text-white border-none rounded-md text-[13px] font-semibold cursor-pointer transition duration-200 mt-5 hover:bg-[#078b58]">Save Changes</button>
          </form>
        </div>
      </div>

      {error && (
        <div className="fixed top-5 right-5 bg-[#e55b5b] text-white py-3.5 px-5 rounded-lg text-[13px] font-medium flex items-center gap-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.15)] z-[1000]">
          <span>{error}</span>
          <button onClick={() => setError('')} className="bg-none border-none text-white text-lg cursor-pointer leading-none">×</button>
        </div>
      )}

      {success && (
        <div className="fixed top-5 right-5 bg-[#08a568] text-white py-3.5 px-5 rounded-lg text-[13px] font-medium flex items-center gap-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.15)] z-[1000]">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="bg-none border-none text-white text-lg cursor-pointer leading-none">×</button>
        </div>
      )}
    </div>
  )
}

export default ProfilePage