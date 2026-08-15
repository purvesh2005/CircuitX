import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import '../styles/wishlist.css'

function WishlistPage() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist')
      setProducts(res.data.products)
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
      }
      console.log('Error fetching wishlist:', err)
    }
  }

  const removeItem = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`)
      setProducts(products.filter(p => p.product_id !== productId))
    } catch (err) {
      console.log('Remove error:', err)
    }
  }

  const removeAll = async () => {
    try {
      await api.delete('/wishlist')
      setProducts([])
    } catch (err) {
      console.log('Remove all error:', err)
    }
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <div>
            <h1>My Wishlist</h1>
            <p>Your saved components</p>
          </div>

          {products.length > 0 && (
            <button className="remove-all-btn" onClick={removeAll}>
              <i className="fa-regular fa-trash-can"></i>
              Remove All
            </button>
          )}
        </div>

        <div className="wishlist-count">{products.length} Items</div>

        <div className="wishlist-items">
          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <i className="fa-regular fa-heart" style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '15px', display: 'block' }}></i>
              <h3 style={{ fontSize: '16px', color: '#374151', marginBottom: '8px' }}>Your wishlist is empty</h3>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '20px' }}>Save components you love and find them here later.</p>
              <Link to="/browse" className="browse-btn" style={{ display: 'inline-flex' }}>Browse Components</Link>
            </div>
          )}

          {products.map(product => (
            <div className="wishlist-card" key={product.product_id}>
              <div className="wishlist-image">
                <img src={product.image_url} alt={product.product_name} />
              </div>

              <div className="wishlist-details">
                <h2>{product.product_name}</h2>

                <div className="price-row">
                  <span className="current-price">₹{product.Price}</span>
                  <span className="old-price">₹{product.original_price}</span>
                  <span className="discount">{product.discount}% OFF</span>
                </div>

                <div className="product-info">
                  <span>
                    <i className="fa-regular fa-heart"></i>
                    {product.Product_condition}
                  </span>
                  <span>
                    <i className="fa-regular fa-clock"></i>
                    {Math.floor((new Date() - new Date(product.purchase_date)) / (1000 * 60 * 60 * 24))} days ago
                  </span>
                  <span>
                    <i className="fa-solid fa-location-dot"></i>
                    {product.city}, {product.state}
                  </span>
                </div>

                <p className="added-date">{product.created_at}</p>
              </div>

              <div className="wishlist-actions">
                <button className="delete-item-btn" onClick={() => removeItem(product.product_id)}>
                  <i className="fa-regular fa-trash-can"></i>
                </button>

                <Link to={`/productDetails/${product.product_id}`} className="details-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="wishlist-banner">
          <div className="banner-heart">
            <i className="fa-regular fa-heart"></i>
          </div>

          <div className="banner-text">
            <h3>Keep your favorites in one place!</h3>
            <p>Add more components you need.</p>
          </div>

          <Link to="/browse" className="browse-btn">Browse More Components</Link>
        </div>
      </div>
    </div>
  )
}

export default WishlistPage