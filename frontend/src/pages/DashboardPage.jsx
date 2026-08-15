import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import '../styles/dashboard.css'

function DashboardPage() {
  const [products, setProducts] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products/seller/${user.user_id}`)
      setProducts(res.data.products)
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
      }
      console.log('Error fetching products:', err)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this component?')) return

    try {
      await api.delete(`/products/${productId}`)
      setProducts(products.filter(p => p.product_id !== productId))
    } catch (err) {
      console.log('Delete error:', err)
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <Link to="/dashboard" className="sidebar-item active">
            <i className="fa-solid fa-gauge-high"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/dashboard" className="sidebar-item">
            <i className="fa-regular fa-rectangle-list"></i>
            <span>My Listings</span>
          </Link>
          <Link to="/wishlist" className="sidebar-item">
            <i className="fa-regular fa-heart"></i>
            <span>Wishlist</span>
          </Link>
          <Link to="/browse" className="sidebar-item">
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Browse</span>
          </Link>
          <Link to="/sell" className="sidebar-item">
            <i className="fa-solid fa-plus"></i>
            <span>Sell Component</span>
          </Link>
          <Link to="/categories" className="sidebar-item">
            <i className="fa-solid fa-tags"></i>
            <span>Categories</span>
          </Link>
          <Link to="/profile" className="sidebar-item">
            <i className="fa-solid fa-user"></i>
            <span>Profile</span>
          </Link>
          <Link to="/logout" className="sidebar-item logout">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Logout</span>
          </Link>
        </aside>

        <main className="dashboard-content">
          <h1>My Dashboard</h1>

          <div className="listings-header">
            <h2>My Listings</h2>
            <Link to="/sell" className="add-component-btn">Add New Component</Link>
          </div>

          <div className="listings-table">
            <div className="table-header">
              <div>Component</div>
              <div>Price</div>
              <div>Status</div>
              <div>Views</div>
              <div>Actions</div>
            </div>

            {products.length === 0 && (
              <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                <i className="fa-regular fa-rectangle-list" style={{ fontSize: '40px', color: '#d1d5db', marginBottom: '12px', display: 'block' }}></i>
                <h3 style={{ fontSize: '15px', color: '#374151', marginBottom: '6px' }}>No listings yet</h3>
                <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '15px' }}>Start selling your components today!</p>
                <Link to="/sell" className="add-component-btn" style={{ display: 'inline-flex' }}>Add New Component</Link>
              </div>
            )}

            {products.map(product => (
              <div
                className="listing-row"
                key={product.product_id}
                onClick={() => navigate(`/productDetails/${product.product_id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="component-info">
                  <div className="component-image">
                    <img src={product.image_url} alt={product.product_name} />
                  </div>
                  <span>{product.product_name}</span>
                </div>

                <div className="price">₹{product.Price}</div>
                <div className="status available">Available</div>
                <div className="views">{product.views || 0}</div>

                <div className="actions">
                  <Link to={`/editComponent/${product.product_id}`} onClick={(e) => e.stopPropagation()}>
                    <button className="edit-btn" type="button">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                  </Link>

                  <button
                    className="delete-btn"
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(product.product_id) }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage