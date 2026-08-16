import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

/**
 * CategoriesPage Component
 * Displays all product categories with item counts.
 *
 * Each category card shows:
 * - An icon representing the category
 * - Category name
 * - Number of items available in that category
 * - "View All" button that links to the browse page with a category filter
 *
 * Uses Tailwind CSS for all styling.
 */
function CategoriesPage() {
  // State for category item counts fetched from the API
  const [counts, setCounts] = useState({})

  // Fetch category counts when the component mounts
  useEffect(() => {
    fetchCategories()
  }, [])

  /**
   * Fetches the number of products in each category from the backend.
   * GET /api/products/categories/list returns a counts object.
   */
  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories/list')
      setCounts(res.data.counts)
    } catch (err) {
      console.log('Error fetching categories:', err)
    }
  }

  // List of all categories with their FontAwesome icons and browse page links
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
    <div className="min-h-[calc(100vh-72px)] bg-[#f7f9f8] px-4 pt-[30px] pb-10">
      <div className="max-w-[1100px] mx-auto bg-white border border-[#eeeeee] rounded-xl px-8 pt-[30px] pb-10 shadow-[0_2px_15px_rgba(0,0,0,0.04)] max-[650px]:px-[18px] max-[650px]:pt-[22px] max-[650px]:pb-[30px]">
        {/* Page heading */}
        <div className="mb-[27px]">
          <h1 className="text-[22px] mb-1.5 font-bold">Categories</h1>
          <p className="text-xs text-[#555]">Explore components by category</p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-4 gap-[15px] max-[850px]:grid-cols-3 max-[650px]:grid-cols-2 max-[420px]:grid-cols-1">
          {categories.map(cat => (
            <div className="min-h-[205px] border border-[#e8e8e8] rounded-[10px] flex flex-col items-center text-center px-3 pt-[18px] pb-[15px] bg-white transition duration-200 shadow-[0_1px_5px_rgba(0,0,0,0.02)] hover:-translate-y-[2px] hover:border-[#bfe7d7] hover:shadow-[0_5px_15px_rgba(0,0,0,0.06)]" key={cat.name}>
              {/* Category icon */}
              <div className="w-[66px] h-[66px] rounded-xl bg-[#eef8f4] flex items-center justify-center mb-[13px]">
                <i className={`fa-solid ${cat.icon} text-[27px] text-[#087d53]`}></i>
              </div>
              {/* Category name */}
              <h3 className="text-[11px] font-bold mb-2 min-h-[14px]">{cat.name}</h3>
              {/* Item count from API */}
              <p className="text-[9px] text-[#777] mb-[17px]">{counts[cat.name] || 0} Items</p>
              {/* Link to browse page filtered by this category */}
              <Link to={`/browse?category=${cat.link}`} className="w-[90px] h-[31px] border border-[#a9dbc8] rounded flex items-center justify-center gap-[9px] no-underline text-[#087d53] text-[9px] font-semibold mt-auto transition duration-200 hover:bg-[#eaf8f3] hover:border-[#08a568]">
                View All
                <i className="fa-solid fa-chevron-right text-[8px]"></i>
              </Link>
            </div>
          ))}
        </div>

        {/* Sell banner - prompts users to sell their components */}
        <div className="mt-[25px] min-h-[75px] rounded-[10px] bg-[#eef9f4] flex items-center px-[22px] py-3 gap-[15px] max-[650px]:flex-wrap max-[420px]:items-start">
          <div className="w-[44px] h-[44px] flex-shrink-0 rounded-full bg-[#dff4eb] flex items-center justify-center">
            <i className="fa-solid fa-recycle text-[#078b58] text-xl"></i>
          </div>
          <div className="flex-1 max-[650px]:min-w-[calc(100%-65px)]">
            <h3 className="text-[11px] mb-[5px] font-bold">Can't find what you need?</h3>
            <p className="text-[9px] text-[#555]">Sell your component to help others and earn!</p>
          </div>
          <Link to="/sell" className="h-[34px] px-[18px] flex items-center justify-center bg-[#078b58] text-white rounded font-semibold text-[9px] no-underline whitespace-nowrap transition duration-200 hover:bg-[#056f46] max-[650px]:ml-[59px] max-[420px]:ml-0">Sell Your Component</Link>
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage