import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Navbar Component
 * Sticky navigation bar displayed at the top of the app.
 *
 * Shows:
 * - Logo (CircuitX) with a tagline
 * - Navigation links (Home, Browse, Categories, Dashboard, Wishlist)
 * - Cart & notification quick-access buttons
 * - Profile section with user avatar if logged in
 * - Login/Register buttons if the user is NOT logged in
 *
 * Styling is done entirely with Tailwind CSS utility classes.
 */
function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Log the user out and redirect them to the login page
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    /* Main navbar container - sticky at top with white background */
    <nav className="w-full h-[72px] min-h-[72px] flex-shrink-0 flex items-center px-[60px] bg-white border-b border-[#eeeeee] gap-10 sticky top-0 z-[1000] max-[900px]:px-5 max-[900px]:gap-5 max-[700px]:h-auto max-[700px]:min-h-[65px] max-[700px]:flex-wrap max-[700px]:py-3 max-[700px]:px-5">
      {/* Logo - links to the home page */}
      <Link to="/home" className="flex items-center gap-[9px] no-underline min-w-[150px] max-[900px]:min-w-auto">
        {/* Logo icon circle with sparkle */}
        <div className="w-10 h-10 border-2 border-[#159b69] rounded-full flex items-center justify-center text-[#159b69] text-[17px] relative">
          <span>✦</span>
        </div>
        {/* Logo text: CircuitX with tagline */}
        <div>
          <h2 className="text-[28px] leading-[18px] text-[#202828] font-bold">Circuit<span className="text-[#159b69]">X</span></h2>
          <p className="mt-1.5 ml-1 text-[10px] font-semibold text-[#159b69] tracking-[0.2px]">Reuse. Save. Build.</p>
        </div>
      </Link>

      {/* Navigation links - center of the navbar */}
      <div className="flex items-center justify-evenly px-[150px] flex-1 max-[900px]:gap-[15px] max-[700px]:order-3 max-[700px]:w-full max-[700px]:justify-center max-[700px]:py-2.5 max-[700px]:overflow-x-auto">
        <NavLink to="/home" className={({ isActive }) => `no-underline text-[15px] font-medium text-[#303737] transition duration-200 hover:text-[#159b69] max-[900px]:text-[11px] ${isActive ? 'text-[#159b69] font-semibold' : ''}`}>Home</NavLink>
        <NavLink to="/browse" className={({ isActive }) => `no-underline text-[15px] font-medium text-[#303737] transition duration-200 hover:text-[#159b69] max-[900px]:text-[11px] ${isActive ? 'text-[#159b69] font-semibold' : ''}`}>Browse</NavLink>
        <NavLink to="/categories" className={({ isActive }) => `no-underline text-[15px] font-medium text-[#303737] transition duration-200 hover:text-[#159b69] max-[900px]:text-[11px] ${isActive ? 'text-[#159b69] font-semibold' : ''}`}>Categories</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => `no-underline text-[15px] font-medium text-[#303737] transition duration-200 hover:text-[#159b69] max-[900px]:text-[11px] ${isActive ? 'text-[#159b69] font-semibold' : ''}`}>Dashboard</NavLink>
        <NavLink to="/wishlist" className={({ isActive }) => `no-underline text-[15px] font-medium text-[#303737] transition duration-200 hover:text-[#159b69] max-[900px]:text-[11px] ${isActive ? 'text-[#159b69] font-semibold' : ''}`}>Wishlist</NavLink>
      </div>

      {/* Right side - cart, notifications, profile OR login/register */}
      <div className="flex items-center gap-[17px] max-[700px]:ml-auto">
        {user ? (
          <>
            {/* Cart & notification icon buttons (hidden on small screens) */}
            <button className="border-none bg-transparent cursor-pointer text-[22px] text-[#222] flex items-center justify-center hover:text-[#159b69] max-[700px]:hidden" aria-label="Cart">🛒</button>
            <button className="border-none bg-transparent cursor-pointer text-[22px] text-[#222] flex items-center justify-center hover:text-[#159b69] max-[700px]:hidden" aria-label="Notifications">♡</button>

            {/* Profile section - avatar + username linking to profile page */}
            <Link to="/profile" className="flex items-center gap-[9px] py-1 px-2 no-underline rounded-lg transition duration-200 hover:bg-[#f0f8f5] max-[700px]:p-0">
              <div className="w-[38px] h-[38px] rounded-full overflow-hidden bg-[#dff5ec] flex items-center justify-center flex-shrink-0 max-[700px]:w-[34px] max-[700px]:h-[34px]">
                <img src={user.profile_image} alt="" className="w-full h-full object-cover object-center block" />
              </div>
              <div className="flex flex-col justify-center gap-0.5 max-[700px]:hidden">
                <span className="text-xs font-semibold text-[#1f2937] whitespace-nowrap">{user.name}</span>
                <span className="text-[9px] text-[#6b7280]">My Profile</span>
              </div>
            </Link>

            {/* Logout button with arrow icon */}
            <button onClick={handleLogout} className="w-[34px] h-[34px] flex items-center justify-center rounded-md text-[#6b7280] text-sm no-underline transition duration-200 hover:bg-[#fff1f1] hover:text-[#e55b5b] border-none bg-transparent cursor-pointer">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </>
        ) : (
          <>
            {/* Login / Register buttons shown when user is NOT logged in */}
            <Link to="/login" className="py-[9px] px-4 rounded-md no-underline text-[13px] font-semibold transition duration-200 border border-[#159b69] text-[#159b69] bg-white hover:bg-[#f0f8f5]">Login</Link>
            <Link to="/register" className="py-[9px] px-4 rounded-md no-underline text-[13px] font-semibold transition duration-200 bg-[#159b69] text-white border border-[#159b69] hover:bg-[#078b58]">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar