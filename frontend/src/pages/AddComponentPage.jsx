import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import '../styles/form.css'

function AddComponentPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: '',
    price: '',
    originalPrice: '',
    quantity: '',
    description: '',
    city: '',
    state: '',
    date: ''
  })
  const [image, setImage] = useState(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
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

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h1>Add New Component</h1>

        <div className="form-layout">
          <div className="left-form">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label>Title <span>*</span></label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Arduino UNO R3"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category <span>*</span></label>
                <select name="category" value={formData.category} onChange={handleChange} required>
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

              <div className="form-group">
                <label>Condition <span>*</span></label>
                <select name="condition" value={formData.condition} onChange={handleChange} required>
                  <option value="">Select Condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Used">Used</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) <span>*</span></label>
                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 450"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Original Price (₹)</label>
                <input
                  type="number"
                  name="originalPrice"
                  placeholder="e.g. 900"
                  value={formData.originalPrice}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group quantity">
              <label>Quantity <span>*</span></label>
              <input
                type="number"
                name="quantity"
                placeholder="e.g. 1"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description <span>*</span></label>
              <textarea
                name="description"
                placeholder="Describe your component..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          <div className="right-form">
            <div className="upload-box">
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <h4>{fileName || 'Upload Images'}</h4>
              <p>{fileName ? '' : 'Drag & drop or click to browse'}</p>
              <small>{fileName ? '' : 'Up to 5mb image file'}</small>
              <input
                type="file"
                name="image"
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleImageChange}
                required
              />
            </div>

            <h3 className="other-title">Other Details</h3>

            <div className="form-group">
              <label>City <span>*</span></label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Pune"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>State <span>*</span></label>
              <input
                type="text"
                name="state"
                placeholder="e.g. Maharashtra"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date Purchased</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="list-btn">List Component</button>
          </div>
        </div>
      </form>

      {error && (
        <div className="error-popup">
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
    </div>
  )
}

export default AddComponentPage