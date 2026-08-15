import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import '../styles/home.css'

function HomePage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchLatestProducts()
  }, [])

  const fetchLatestProducts = async () => {
    try {
      const res = await api.get('/products/latest')
      setProducts(res.data.products)
    } catch (err) {
      console.log('Error fetching products:', err)
    }
  }

  const addToWishlist = async (e, productId) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await api.post('/wishlist/add', { product_id: productId })
    } catch (err) {
      console.log('Wishlist error:', err)
    }
  }

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="hero-content">
          <div className="tag">
            <i className="fa-solid fa-leaf"></i>
            Sustainable Future
          </div>
          <h1>
            Buy & Sell<br />
            Electronic <span>Components</span><br />
            Used by Students,<br />
            Loved by All.
          </h1>
          <p>
            Give your components a second life.<br />
            Save money. Reduce e-waste. Support sustainability.
          </p>
          <div className="hero-buttons">
            <Link to="/browse" className="primary-btn">Browse Components</Link>
            <Link to="/sell" className="secondary-btn">Sell Your Component</Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="floating-chip chip1"><i className="fa-solid fa-microchip"></i></div>
          <div className="floating-chip chip2"><i className="fa-solid fa-microchip"></i></div>
          <div className="floating-chip chip3"><i className="fa-solid fa-microchip"></i></div>
          <div className="floating-chip chip4"><i className="fa-solid fa-microchip"></i></div>

          <div className="recycle-bin">
            <div className="electronic-board"><i className="fa-solid fa-microchip"></i></div>
            <div className="bin"><i className="fa-solid fa-recycle"></i></div>
          </div>

          <div className="leaf leaf1">🍃</div>
          <div className="leaf leaf2">🍃</div>
          <div className="leaf leaf3">🍃</div>
          <div className="leaf leaf4">🍃</div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon"><i className="fa-solid fa-location-dot"></i></div>
          <div>
            <h3>Affordable</h3>
            <p>Save up to 60% on components</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><i className="fa-solid fa-recycle"></i></div>
          <div>
            <h3>Sustainable</h3>
            <p>Reduce electronic waste and help environment</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><i className="fa-solid fa-users"></i></div>
          <div>
            <h3>Trusted Students</h3>
            <p>Buy & sell with your college community</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><i className="fa-solid fa-shield-halved"></i></div>
          <div>
            <h3>Easy & Safe</h3>
            <p>Simple process and secure interactions</p>
          </div>
        </div>
      </section>

      {/* ================= POPULAR CATEGORIES ================= */}
      <section className="section">
        <div className="section-heading">
          <h2>Popular Categories</h2>
          <Link to="/categories">View All</Link>
        </div>

        <div className="categories">
          <Link to="/browse?category=Microcontrollers" className="category">
            <div className="category-img"><img src="/images/aurdino.png" alt="Arduino" /></div>
            <p>Arduino</p>
          </Link>

          <Link to="/browse?category=Sensors" className="category">
            <div className="category-img"><img src="/images/sensors.png" alt="Sensors" /></div>
            <p>Sensors</p>
          </Link>

          <Link to="/browse?category=Motors" className="category">
            <div className="category-img"><img src="/images/motor.png" alt="Motors" /></div>
            <p>Motors</p>
          </Link>

          <Link to="/browse?category=Development%20Boards" className="category">
            <div className="category-img"><img src="/images/esp32.png" alt="ESP32" /></div>
            <p>ESP32 / ESP8266</p>
          </Link>

          <Link to="/browse?category=ICs" className="category">
            <div className="category-img"><img src="/images/ICs.png" alt="ICs" /></div>
            <p>ICs</p>
          </Link>

          <Link to="/browse?category=Power%20Supply" className="category">
            <div className="category-img"><img src="/images/power_supply.png" alt="Power Supply" /></div>
            <p>Power Supply</p>
          </Link>

          <Link to="/browse?category=Tools%20%26%20Others" className="category">
            <div className="category-img"><img src="/images/robotics.png" alt="Robotics" /></div>
            <p>Robotics</p>
          </Link>

          <Link to="/categories" className="category">
            <div className="category-img more"><i className="fa-solid fa-grip"></i></div>
            <p>More</p>
          </Link>
        </div>
      </section>

      {/* ================= LATEST LISTINGS ================= */}
      <section className="section latest-section">
        <div className="section-heading">
          <h2>Latest Listings</h2>
          <Link to="/browse">View All</Link>
        </div>

        <div className="listings">
          {products.length === 0 && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6b7280', padding: '40px 0', fontSize: '14px' }}>
              No components listed yet. Be the first to sell!
            </p>
          )}

          {products.map(product => (
            <Link to={`/productDetails/${product.product_id}`} key={product.product_id} className="listing-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="listing-image">
                <img src={product.image_url} alt={product.product_name} />

                <button
                  className="wishlist"
                  style={{ position: 'absolute', right: '7px', top: '7px' }}
                  onClick={(e) => addToWishlist(e, product.product_id)}
                >
                  <i className="fa-regular fa-heart"></i>
                </button>

                {product.discount > 0 && (
                  <span style={{ position: 'absolute', left: '7px', top: '7px', background: '#ef4444', color: 'white', fontSize: '9px', fontWeight: 700, padding: '3px 6px', borderRadius: '4px' }}>
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              <div className="listing-info">
                <h3>{product.product_name}</h3>
                <div className="listing-bottom">
                  <strong>₹{product.Price}</strong>
                  <span>{product.Product_condition || product.condition}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default HomePage