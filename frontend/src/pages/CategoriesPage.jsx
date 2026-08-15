import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import '../styles/categories.css'

function CategoriesPage() {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories/list')
      setCounts(res.data.counts)
    } catch (err) {
      console.log('Error fetching categories:', err)
    }
  }

  const categories = [
    { name: 'Microcontrollers', icon: 'fa-microchip', link: 'Microcontrollers' },
    { name: 'Resistors & Capacitors', icon: 'fa-resistor', link: 'Resistors' },
    { name: 'ICs', icon: 'fa-plug', link: 'ICs' },
    { name: 'Capacitors', icon: 'fa-ethernet', link: 'Capacitors' },
    { name: 'Sensors', icon: 'fa-tower-broadcast', link: 'Sensors' },
    { name: 'Development Boards', icon: 'fa-memory', link: 'Development%20Boards' },
    { name: 'Power Supply', icon: 'fa-bolt', link: 'Power%20Supply' },
    { name: 'Tools & Others', icon: 'fa-tv', link: 'Tools%20%26%20Others' },
    { name: 'Resistors', icon: 'fa-toggle-on', link: 'Resistors' },
    { name: 'Motors', icon: 'fa-gears', link: 'Motors' }
  ]

  return (
    <div className="categories-page">
      <div className="categories-container">
        <div className="categories-heading">
          <h1>Categories</h1>
          <p>Explore components by category</p>
        </div>

        <div className="categories-grid">
          {categories.map(cat => (
            <div className="category-card" key={cat.name}>
              <div className="category-icon">
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <h3>{cat.name}</h3>
              <p>{counts[cat.name] || 0} Items</p>
              <Link to={`/browse?category=${cat.link}`} className="category-btn">
                View All
                <i className="fa-solid fa-chevron-right"></i>
              </Link>
            </div>
          ))}
        </div>

        <div className="sell-banner">
          <div className="sell-icon">
            <i className="fa-solid fa-recycle"></i>
          </div>
          <div className="sell-text">
            <h3>Can't find what you need?</h3>
            <p>Sell your component to help others and earn!</p>
          </div>
          <Link to="/sell" className="sell-btn">Sell Your Component</Link>
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage