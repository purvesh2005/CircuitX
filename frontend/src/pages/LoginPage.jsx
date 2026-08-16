import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * LoginPage Component
 * Allows users to sign in with their email and password.
 * On successful login, the user is redirected to the home page.
 * Displays an error popup if login fails.
 *
 * Uses Tailwind CSS for all styling.
 */
function LoginPage() {
  // Local state for the email and password inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Get the login function from our AuthContext
  const { login } = useAuth()
  const navigate = useNavigate()

  /**
   * Handles the login form submission.
   * Calls the login function from AuthContext and navigates to /home on success.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Attempt login - AuthContext handles storing the session
      await login(email, password)
      navigate('/home')
    } catch (err) {
      // Show the error message returned by the backend
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex justify-center items-center p-[30px] bg-[#f8faf9] max-[700px]:p-[15px]">
      <div className="w-[900px] max-w-full min-h-[500px] bg-white rounded-xl overflow-hidden grid grid-cols-[42%_58%] shadow-[0_5px_25px_rgba(0,0,0,0.06)] max-[700px]:grid-cols-1 max-[700px]:w-[450px]">
        {/* Left panel - logo/brand section with decorative circle */}
        <div className="relative bg-[#eef8f3] flex flex-col justify-center items-center text-center overflow-hidden max-[700px]:h-[220px] max-[450px]:h-[180px]">
          {/* Decorative background circle */}
          <div className="absolute w-[350px] h-[350px] bg-[#dff2e9] rounded-full top-[-130px] left-[-130px] opacity-70"></div>

          {/* CircuitX logo and branding */}
          <img src="/images/circuitx-logo.png" alt="CircuitX Logo" className="w-[150px] h-[150px] object-contain relative z-[2] mb-[15px]" />
          <h2 className="relative z-[2] text-[#078b51] text-[28px] font-bold mb-1.5">CircuitX</h2>
          <p className="relative z-[2] text-[#6b7280] text-[13px]">Connect. Learn. Build.</p>
        </div>

        {/* Right panel - login form section */}
        <div className="py-[45px] px-[55px] flex flex-col justify-center max-[700px]:py-[35px] max-[700px]:px-[30px] max-[450px]:py-[30px] max-[450px]:px-[22px]">
          <h1 className="text-[26px] text-[#111827] mb-[7px] max-[450px]:text-[23px]">Welcome Back!</h1>
          <p className="text-sm text-[#6b7280] mb-7">Login to your CircuitX account</p>

          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="mb-[18px]">
              <label htmlFor="email" className="block text-xs font-semibold text-[#374151] mb-1.5">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[42px] border border-[#d9dedb] rounded px-3 text-xs outline-none transition duration-200 placeholder:text-[#9ca3af] focus:border-[#0aa564] focus:shadow-[0_0_0_2px_rgba(10,165,100,0.1)]"
              />
            </div>

            {/* Password field */}
            <div className="mb-[18px]">
              <label htmlFor="password" className="block text-xs font-semibold text-[#374151] mb-1.5">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-[42px] border border-[#d9dedb] rounded px-3 text-sm outline-none placeholder:text-[#9ca3af] focus:border-[#0aa564] focus:shadow-[0_0_0_2px_rgba(10,165,100,0.1)]"
              />
            </div>

            {/* Forgot password link */}
            <div className="text-right -mt-[5px] mb-[18px]">
              <a href="/forgot-password" className="text-xs text-[#008f55] no-underline font-semibold hover:underline">Forgot Password?</a>
            </div>

            {/* Submit button */}
            <button type="submit" className="w-full h-[42px] border-none rounded bg-[#08a35f] text-white text-xs font-semibold cursor-pointer transition duration-200 hover:bg-[#078b51] active:scale-[0.99]">Login</button>
          </form>

          {/* Link to the register page for new users */}
          <p className="text-center mt-5 text-xs text-[#6b7280]">
            Don't have an account? <Link to="/register" className="text-[#008f55] no-underline font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>

      {/* Error popup - shown at the top-right corner when login fails */}
      {error && (
        <div className="fixed top-5 right-5 bg-[#ef4444] text-white py-[15px] px-5 rounded-lg flex items-center gap-[15px] shadow-[0_5px_15px_rgba(0,0,0,0.2)] z-[9999]">
          <span>{error}</span>
          <button onClick={() => setError('')} className="bg-transparent border-none text-white text-[22px] cursor-pointer">×</button>
        </div>
      )}
    </div>
  )
}

export default LoginPage