import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>CircuitX</h2>
          <p>Reuse. Save. Build.</p>
          <p>Buy & sell used electronic components with your college community.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/home">Home</Link>
          <Link to="/browse">Browse</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/sell">Sell Component</Link>
        </div>

        <div className="footer-section">
          <h3>Account</h3>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@circuitx.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Pune, Maharashtra</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 CircuitX. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer