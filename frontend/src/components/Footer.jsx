import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Footer Component
 * Site-wide footer displayed at the bottom of every page.
 *
 * Contains four sections:
 * - Brand info (logo, tagline, description)
 * - Quick links (Home, Browse, Categories, Sell)
 * - Account links (Dashboard, Wishlist, Login, Register)
 * - Contact information (email, phone, location)
 *
 * Styling is done entirely with Tailwind CSS utility classes.
 */
function Footer() {
  return (
    <footer className="bg-[#111827] text-white pt-[50px] mt-auto">
      <div className="max-w-[1200px] mx-auto px-[30px] pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand section - name, tagline, and description */}
        <div>
          <h2 className="text-xl font-bold mb-2">CircuitX</h2>
          <p className="text-[#9ca3af] text-sm mb-1">Reuse. Save. Build.</p>
          <p className="text-[#9ca3af] text-sm">Buy & sell used electronic components with your college community.</p>
        </div>

        {/* Quick Links section */}
        <div>
          <h3 className="text-base font-semibold mb-3">Quick Links</h3>
          <div className="flex flex-col gap-2">
            <Link to="/home" className="text-[#9ca3af] text-sm hover:text-white transition">Home</Link>
            <Link to="/browse" className="text-[#9ca3af] text-sm hover:text-white transition">Browse</Link>
            <Link to="/categories" className="text-[#9ca3af] text-sm hover:text-white transition">Categories</Link>
            <Link to="/sell" className="text-[#9ca3af] text-sm hover:text-white transition">Sell Component</Link>
          </div>
        </div>

        {/* Account section */}
        <div>
          <h3 className="text-base font-semibold mb-3">Account</h3>
          <div className="flex flex-col gap-2">
            <Link to="/dashboard" className="text-[#9ca3af] text-sm hover:text-white transition">Dashboard</Link>
            <Link to="/wishlist" className="text-[#9ca3af] text-sm hover:text-white transition">Wishlist</Link>
            <Link to="/login" className="text-[#9ca3af] text-sm hover:text-white transition">Login</Link>
            <Link to="/register" className="text-[#9ca3af] text-sm hover:text-white transition">Register</Link>
          </div>
        </div>

        {/* Contact section */}
        <div>
          <h3 className="text-base font-semibold mb-3">Contact</h3>
          <p className="text-[#9ca3af] text-sm mb-1">Email: support@circuitx.com</p>
          <p className="text-[#9ca3af] text-sm mb-1">Phone: +91 98765 43210</p>
          <p className="text-[#9ca3af] text-sm">Pune, Maharashtra</p>
        </div>
      </div>

      {/* Copyright bar at the very bottom */}
      <div className="border-t border-[#374151] py-4 text-center">
        <p className="text-[#9ca3af] text-sm">© 2026 CircuitX. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer