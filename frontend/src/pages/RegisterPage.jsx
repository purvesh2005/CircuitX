import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * RegisterPage Component
 * Allows new users to create a CircuitX account.
 * Includes profile photo upload, personal details, and college info.
 * After successful registration, redirects to the login page.
 *
 * Uses Tailwind CSS for all styling.
 */
function RegisterPage() {
  // Form state for all user registration fields
  const [formData, setFormData] = useState({
    username: '',   // Full name
    email: '',      // Email address
    phone: '',      // 10-digit phone number
    password: '',   // Account password
    college: ''     // College/university name
  })

  // Profile photo upload state
  const [profileImage, setProfileImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

  // Update formData when any input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle profile image selection and generate a preview
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      // Use FileReader to create a preview URL for the selected image
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  /**
   * Handles the registration form submission.
   * Sends form data (including profile image) to the backend via FormData.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Build multipart form data for the registration API call
      const data = new FormData()
      data.append('username', formData.username)
      data.append('email', formData.email)
      data.append('phone', formData.phone)
      data.append('password', formData.password)
      data.append('college', formData.college)
      data.append('profile_image', profileImage)

      await register(data)
      navigate('/login')  // Redirect to login after successful registration
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex justify-center items-center p-[30px] bg-[#f8faf9] max-[700px]:p-[15px]">
      <div className="w-[900px] max-w-full min-h-[560px] bg-white rounded-xl overflow-hidden grid grid-cols-[42%_58%] shadow-[0_5px_25px_rgba(0,0,0,0.06)] max-[700px]:grid-cols-1 max-[700px]:w-[450px]">
        {/* Left panel - logo/brand section with decorative circle */}
        <div className="relative bg-[#eef8f3] flex flex-col justify-center items-center text-center overflow-hidden max-[700px]:h-[220px] max-[450px]:h-[180px]">
          {/* Decorative background circle */}
          <div className="absolute w-[350px] h-[350px] bg-[#dff2e9] rounded-full top-[-130px] left-[-130px] opacity-70"></div>

          {/* CircuitX logo and branding */}
          <img src="/images/circuitx-logo.png" alt="CircuitX Logo" className="w-[150px] h-[150px] object-contain relative z-[2] mb-[15px]" />
          <h2 className="relative z-[2] text-[#078b51] text-[28px] font-bold mb-1.5">CircuitX</h2>
          <p className="relative z-[2] text-[#6b7280] text-[13px]">Connect. Learn. Build.</p>
        </div>

        {/* Right panel - registration form section */}
        <div className="py-[45px] px-[55px] flex flex-col justify-center max-[700px]:py-[35px] max-[700px]:px-[30px] max-[450px]:py-[30px] max-[450px]:px-[22px]">
          <h1 className="text-[26px] text-[#111827] mb-[7px] max-[450px]:text-[23px]">Create Account</h1>
          <p className="text-sm text-[#6b7280] mb-7">Join CircuitX today!</p>

          <form onSubmit={handleSubmit}>
            {/* Profile photo upload section with live preview */}
            <div className="flex flex-col items-center mb-[25px]">
              <label htmlFor="profile_image" className="cursor-pointer flex flex-col items-center text-xs text-[#008f55] font-semibold">
                <div className="w-[110px] h-[110px] rounded-full overflow-hidden border-[3px] border-[#ddd] mb-3">
                  <img
                    id="profilePreview"
                    src={preview || 'https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                Add Profile Photo
              </label>
              {/* Hidden file input triggered by the label above */}
              <input
                type="file"
                id="profile_image"
                name="profile_image"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="hidden"
              />
              <small className="text-xs text-[#6b7280]">JPG, PNG or WEBP • Max 5MB</small>
            </div>

            {/* Full name field */}
            <div className="mb-[18px]">
              <label htmlFor="name" className="block text-xs font-semibold text-[#374151] mb-1.5">Full Name</label>
              <input
                type="text"
                id="name"
                name="username"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full h-[42px] border border-[#d9dedb] rounded px-3 text-xs outline-none transition duration-200 placeholder:text-[#9ca3af] focus:border-[#0aa564] focus:shadow-[0_0_0_2px_rgba(10,165,100,0.1)]"
              />
            </div>

            {/* Email field */}
            <div className="mb-[18px]">
              <label htmlFor="email" className="block text-xs font-semibold text-[#374151] mb-1.5">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-[42px] border border-[#d9dedb] rounded px-3 text-sm outline-none transition duration-200 placeholder:text-[#9ca3af] focus:border-[#0aa564] focus:shadow-[0_0_0_2px_rgba(10,165,100,0.1)]"
              />
            </div>

            {/* Phone number field - validates 10 digits */}
            <div className="mb-[18px]">
              <label htmlFor="phone" className="block text-xs font-semibold text-[#374151] mb-1.5">Phone Number</label>
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
                className="w-full h-[42px] border border-[#d9dedb] rounded px-3 text-sm outline-none placeholder:text-[#9ca3af] focus:border-[#0aa564] focus:shadow-[0_0_0_2px_rgba(10,165,100,0.1)]"
              />
            </div>

            {/* Password field */}
            <div className="mb-[18px]">
              <label htmlFor="password" className="block text-xs font-semibold text-[#374151] mb-1.5">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full h-[42px] border border-[#d9dedb] rounded px-3 text-sm outline-none placeholder:text-[#9ca3af] focus:border-[#0aa564] focus:shadow-[0_0_0_2px_rgba(10,165,100,0.1)]"
              />
            </div>

            {/* College name field */}
            <div className="mb-[18px]">
              <label htmlFor="college" className="block text-xs font-semibold text-[#374151] mb-1.5">College Name</label>
              <input
                type="text"
                id="college"
                name="college"
                placeholder="Enter your college name"
                value={formData.college}
                onChange={handleChange}
                required
                className="w-full h-[42px] border border-[#d9dedb] rounded px-3 text-sm outline-none placeholder:text-[#9ca3af] focus:border-[#0aa564] focus:shadow-[0_0_0_2px_rgba(10,165,100,0.1)]"
              />
            </div>

            {/* Submit button */}
            <button type="submit" className="w-full h-[42px] border-none rounded bg-[#08a35f] text-white text-xs font-semibold cursor-pointer transition duration-200 hover:bg-[#078b51] active:scale-[0.99]">Register</button>
          </form>

          {/* Link to login for existing users */}
          <p className="text-center mt-5 text-xs text-[#6b7280]">
            Already have an account? <Link to="/login" className="text-[#008f55] no-underline font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>

      {/* Error popup - shown when registration fails */}
      {error && (
        <div className="fixed top-5 right-5 bg-[#ef4444] text-white py-[15px] px-5 rounded-lg flex items-center gap-[15px] shadow-[0_5px_15px_rgba(0,0,0,0.2)] z-[9999]">
          <span>{error}</span>
          <button onClick={() => setError('')} className="bg-transparent border-none text-white text-[22px] cursor-pointer">×</button>
        </div>
      )}
    </div>
  )
}

export default RegisterPage