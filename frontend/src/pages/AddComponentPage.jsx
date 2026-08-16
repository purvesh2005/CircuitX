import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

/**
 * AddComponentPage Component
 * Form page that allows sellers to list a new electronic component.
 *
 * Form fields:
 * - Basic Information: Title, Category, Condition, Price, Original Price, Quantity, Description
 * - Images: Upload image file for the product
 * - Other Details: City, State, Date Purchased
 *
 * On successful submission, redirects to the dashboard.
 * Uses Tailwind CSS for all styling.
 */
function AddComponentPage() {
  // Form state for all product fields
  const [formData, setFormData] = useState({
    title: '',          // Product name/title
    category: '',       // Category (e.g., Microcontrollers, Sensors)
    condition: '',      // Condition (New, Like New, Good, Used)
    price: '',          // Selling price in rupees
    originalPrice: '',  // Original price before discount (optional)
    quantity: '',       // Quantity available
    description: '',    // Product description
    city: '',           // Seller's city
    state: '',          // Seller's state
    date: ''            // Date the product was originally purchased
  })

  // Image upload state
  const [image, setImage] = useState(null)
  const [fileName, setFileName] = useState('')  // Display name of the uploaded file
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Update formData when any input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle image file selection and store the filename for display
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setFileName(file.name)
    }
  }

  /**
   * Handles the form submission.
   * Sends product data + image to the backend as multipart form data.
   * On success, navigates to the dashboard to see the new listing.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Build FormData with all product fields and the uploaded image
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key])
      })
      data.append('image', image)

      await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add component')
    }
  }

  // Shared Tailwind classes for input fields
  const inputClass = "w-full h-9 border border-[#dedede] rounded bg-white font-inherit text-[10px] text-[#333] outline-none transition duration-200 px-2.5 placeholder:text-[#999] focus:border-[#08a568] focus:shadow-[0_0_0_2px_rgba(8,165,104,0.08)]"

  return (
    <div className="w-full px-4 pt-[30px] pb-10 bg-[#f7f9f8] min-h-[calc(100vh-72px)] max-[700px]:px-3 max-[700px]:pt-5 max-[700px]:pb-5">
      <form onSubmit={handleSubmit} className="max-w-[1100px] mx-auto bg-white rounded-xl px-8 pt-7 pb-[34px] border border-[#eeeeee] shadow-[0_2px_15px_rgba(0,0,0,0.04)] max-[700px]:px-[18px] max-[700px]:pt-[22px]">
        <h1 className="text-[22px] mb-[25px] font-bold max-[480px]:text-base">Add New Component</h1>

        {/* Two-column form layout: left = basic info, right = image + other details */}
        <div className="grid grid-cols-[1.25fr_0.85fr] gap-[55px] max-[700px]:grid-cols-1 max-[700px]:gap-5">
          {/* LEFT COLUMN - Basic Information */}
          <div className="min-w-0">
            <h3 className="text-sm mb-3 font-bold">Basic Information</h3>

            {/* Title input */}
            <div className="mb-3.5">
              <label className="block text-xs font-semibold mb-1.5 text-[#333]">Title <span className="text-[#e53935]">*</span></label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Arduino UNO R3"
                value={formData.title}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Category and Condition dropdowns (side by side) */}
            <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
              <div className="mb-3.5">
                <label className="block text-xs font-semibold mb-1.5 text-[#333]">Category <span className="text-[#e53935]">*</span></label>
                <select name="category" value={formData.category} onChange={handleChange} required className={inputClass}>
                  <option value="">Select Category</option>
                  <option value="Microcontrollers">Microcontrollers</option>
                  <option value="Sensors">Sensors</option>
                  <option value="Development Boards">Development Boards</option>
                  <option value="Resistors">Resistors</option>
                  <option value="Capacitors">Capacitors</option>
                  <option value="Motors">Motors</option>
                  <option value="Power Supply">Power Supply</option>
                  <option value="ICs">ICs</option>
                  <option value="Tools & Others">Tools & Others</option>
                </select>
              </div>

              <div className="mb-3.5">
                <label className="block text-xs font-semibold mb-1.5 text-[#333]">Condition <span className="text-[#e53935]">*</span></label>
                <select name="condition" value={formData.condition} onChange={handleChange} required className={inputClass}>
                  <option value="">Select Condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Used">Used</option>
                </select>
              </div>
            </div>

            {/* Price and Original Price inputs (side by side) */}
            <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
              <div className="mb-3.5">
                <label className="block text-xs font-semibold mb-1.5 text-[#333]">Price (₹) <span className="text-[#e53935]">*</span></label>
                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 450"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="mb-3.5">
                <label className="block text-xs font-semibold mb-1.5 text-[#333]">Original Price (₹)</label>
                <input
                  type="number"
                  name="originalPrice"
                  placeholder="e.g. 900"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Quantity input */}
            <div className="mb-3.5 max-w-[48%] max-[700px]:max-w-full">
              <label className="block text-xs font-semibold mb-1.5 text-[#333]">Quantity <span className="text-[#e53935]">*</span></label>
              <input
                type="number"
                name="quantity"
                placeholder="e.g. 1"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Description textarea */}
            <div className="mb-3.5">
              <label className="block text-xs font-semibold mb-1.5 text-[#333]">Description <span className="text-[#e53935]">*</span></label>
              <textarea
                name="description"
                placeholder="Describe your component..."
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full h-[86px] border border-[#dedede] rounded bg-white font-inherit text-[10px] text-[#333] outline-none transition duration-200 p-2.5 resize-y placeholder:text-[#999] focus:border-[#08a568] focus:shadow-[0_0_0_2px_rgba(8,165,104,0.08)]"
              ></textarea>
            </div>
          </div>

          {/* RIGHT COLUMN - Image upload + Other Details */}
          <div className="min-w-0">
            {/* Upload box with a hidden file input */}
            <div className="h-[150px] border border-dashed border-[#cfcfcf] rounded-[7px] flex flex-col items-center justify-center text-center relative cursor-pointer transition duration-200 mb-6 hover:border-[#08a568] hover:bg-[#fbfffd]">
              <i className="fa-solid fa-cloud-arrow-up text-2xl mb-2.5 text-[#333]"></i>
              <h4 className="text-[10px] mb-1.5">{fileName || 'Upload Images'}</h4>
              <p className="text-[8px] text-[#777] mb-1">{fileName ? '' : 'Drag & drop or click to browse'}</p>
              <small className="text-[7px] text-[#999]">{fileName ? '' : 'Up to 5mb image file'}</small>
              <input
                type="file"
                name="image"
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleImageChange}
                required
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {/* Other details section */}
            <h3 className="text-sm mb-3 font-bold">Other Details</h3>

            {/* City input */}
            <div className="mb-3.5">
              <label className="block text-xs font-semibold mb-1.5 text-[#333]">City <span className="text-[#e53935]">*</span></label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Pune"
                value={formData.city}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* State input */}
            <div className="mb-3.5">
              <label className="block text-xs font-semibold mb-1.5 text-[#333]">State <span className="text-[#e53935]">*</span></label>
              <input
                type="text"
                name="state"
                placeholder="e.g. Maharashtra"
                value={formData.state}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Date purchased input */}
            <div className="mb-3.5">
              <label className="block text-xs font-semibold mb-1.5 text-[#333]">Date Purchased</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Submit button */}
            <button type="submit" className="w-full h-[38px] border-none rounded-md bg-[#08a568] text-white text-[11px] font-semibold cursor-pointer mt-[7px] transition duration-200 hover:bg-[#078b58]">List Component</button>
          </div>
        </div>
      </form>

      {/* Error popup - shown when the API call fails */}
      {error && (
        <div className="fixed top-5 right-5 bg-[#ef4444] text-white py-[15px] px-5 rounded-lg flex items-center gap-[15px] shadow-[0_5px_15px_rgba(0,0,0,0.2)] z-[9999]">
          <span>{error}</span>
          <button onClick={() => setError('')} className="bg-transparent border-none text-white text-[22px] cursor-pointer">×</button>
        </div>
      )}
    </div>
  )
}

export default AddComponentPage