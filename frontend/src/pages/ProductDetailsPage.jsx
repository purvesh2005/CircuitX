import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'
import '../styles/productDetails.css'

function ProductDetailsPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [seller, setSeller] = useState(null)
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`)
      setProduct(res.data.product)
      setSeller(res.data.seller)
      setWishlist(res.data.wishlist)
    } catch (err) {
      console.log('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = async () => {
    try {
      if (wishlist) {
        await api.delete(`/wishlist/${product.product_id}`)
        setWishlist(null)
      } else {
        await api.post('/wishlist/add', { product_id: product.product_id })
        setWishlist({ wishlist_id: 'temp' })
      }
    } catch (err) {
      console.log('Wishlist error:', err)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>

  if (!product) return <div style={{ textAlign: 'center', padding: '100px' }}>Product not found</div>

  const purchased = new Date(product.purchase_date)
  const today = new Date()
  const days = Math.floor((today - purchased) / (1000 * 60 * 60 * 24))

  return (
    <div className="product-page">
      <div className="breadcrumb">
        <Link to="/home">Home</Link>
        <span>›</span>
        <Link to={`/browse?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span>›</span>
        <span>{product.product_name}</span>
      </div>

      <div className="product-container">
        <div className="product-left">
          <div className="main-image">
            <img src={product.image_url} alt={product.product_name} />
          </div>
        </div>

        <div className="product-right">
          <div className="title-row">
            <h1>{product.product_name}</h1>
          </div>

          <div className="price-section">
            <div className="price">₹{product.Price}</div>
            <del>₹{product.original_price}</del>
            <span className="discount">{product.discount}% OFF</span>
            <span className="stock">In Stock</span>
          </div>

          <div className="product-meta">
            <span>
              <i className="fa-regular fa-circle-check"></i>
              {product.Product_condition}
            </span>
            <span>
              <i className="fa-regular fa-clock"></i>
              {days} days ago
            </span>
            <span>
              <i className="fa-solid fa-location-dot"></i>
              {product.city}, {product.state}
            </span>
            <span>
              <i className="fa-regular fa-calendar"></i>
              {new Date(product.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>

          <div className="divider"></div>

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
            <p>Quantity: {product.quantity}</p>
          </div>

          <div className="seller-card">
            <h3>Seller Information</h3>
            <div className="seller-content">
              <div className="seller-avatar">
                <img src={seller?.profile_image} alt="" />
              </div>
              <div className="seller-details">
                <strong>{seller?.name}</strong>
                <span>{seller?.college}</span>
                <span className="rating">
                  <i className="fa-solid fa-star"></i>
                  4.8
                  <small>(25 Reviews)</small>
                </span>
              </div>
              <Link to="/profile" className="view-profile">View Profile</Link>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={toggleWishlist} className="wishlist-btn">
              <i className={wishlist ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
              <span>{wishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <a href="#" className="buy-btn">Buy / Make Offer</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage