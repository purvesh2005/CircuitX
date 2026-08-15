import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api'
import '../styles/browse.css'

function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [condition, setCondition] = useState(searchParams.get('condition') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')

  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  const fetchProducts = async () => {
    try {
      const params = {}
      const sp = searchParams
      if (sp.get('category')) params.category = sp.get('category')
      if (sp.get('condition')) params.condition = sp.get('condition')
      if (sp.get('search')) params.search = sp.get('search')
      if (sp.get('location')) params.location = sp.get('location')
      if (sp.get('maxPrice')) params.maxPrice = sp.get('maxPrice')
      if (sp.get('sort')) params.sort = sp.get('sort')
      if (sp.get('page')) params.page = sp.get('page')

      const res = await api.get('/products', { params })
      setProducts(res.data.products)
      setTotalPages(res.data.totalPages)
      setCurrentPage(res.data.currentPage)
    } catch (err) {
      console.log('Error fetching products:', err)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (condition) params.set('condition', condition)
    if (location) params.set('location', location)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (sort && sort !== 'newest') params.set('sort', sort)
    setSearchParams(params)
  }

  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (cat) params.set('category', cat)
    setSearchParams(params)
  }

  const handleSortChange = (e) => {
    const value = e.target.value
    setSort(value)
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'newest') params.set('sort', value)
    else params.delete('sort')
    setSearchParams(params)
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page)
    setSearchParams(params)
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

  const categories = [
    'Resistors', 'Capacitors', 'Sensors', 'Motors',
    'Power Supply', 'ICs', 'Microcontrollers', 'Development Boards', 'Tools & Others'
  ]

  const pageUrl = (pageNumber) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber)
    return `?${params.toString()}`
  }

  return (
    <div className="browse-page">
      <div className="top-section">
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search components, e.g. Arduino UNO"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">⌕</button>
        </form>

        <Link to="/sell" className="sell-btn">Sell Component</Link>
      </div>

      <div className="content">
        <aside className="sidebar">
          <section className="filter-section">
            <h3>Categories</h3>
            <ul className="category-list">
              <li className={!category ? 'selected' : ''}>
                <a href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick('') }}>All Categories</a>
              </li>
              {categories.map(cat => (
                <li key={cat} className={category === cat ? 'selected' : ''}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick(cat) }}>{cat}</a>
                </li>
              ))}
            </ul>
          </section>

          <form onSubmit={handleSearch}>
            <section className="filter-section">
              <h3>Filters</h3>

              <div className="filter-group">
                <h4>Condition</h4>
                {['', 'New', 'Like New', 'Good', 'Used'].map(cond => (
                  <label key={cond || 'all'}>
                    <input
                      type="radio"
                      name="condition"
                      value={cond}
                      checked={condition === cond}
                      onChange={() => setCondition(cond)}
                    />
                    {cond || 'All'}
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <h4>Max Price</h4>
                <input
                  type="number"
                  name="maxPrice"
                  min="0"
                  placeholder="e.g. 5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="price-range"
                />
              </div>

              <div className="filter-group">
                <h4>Location</h4>
                <select name="location" value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="">Select location</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              <button type="submit" className="filter-btn">Apply Filters</button>
            </section>
          </form>
        </aside>

        <main className="products-area">
          <div className="products-header">
            <h2>All Components</h2>
            <div className="sort">
              <span>Sort by:</span>
              <select value={sort} onChange={handleSortChange}>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="product-grid">
            {products.length === 0 && (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6b7280', padding: '60px 0', fontSize: '14px' }}>
                No components found. Try adjusting your filters.
              </p>
            )}

            {products.map(product => (
              <Link to={`/productDetails/${product.product_id}`} key={product.product_id} className="product-card">
                <div className="product-image">
                  <img src={product.image_url} alt={product.product_name} />

                  <button
                    className="wishlist-btn"
                    onClick={(e) => addToWishlist(e, product.product_id)}
                  >
                    <i className="fa-regular fa-heart"></i>
                  </button>

                  {product.discount > 0 && (
                    <span className="discount-badge">{product.discount}% OFF</span>
                  )}
                </div>

                <div className="product-info">
                  <h3>{product.product_name}</h3>
                  <div className="price-row">
                    <strong>₹{product.Price}</strong>
                    <del>₹{product.original_price}</del>
                    {product.discount > 0 && <span>{product.discount}% OFF</span>}
                  </div>
                  <p className="location">📍 {product.city}</p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {currentPage > 1 && (
                <Link to={pageUrl(currentPage - 1)} className="page-arrow" aria-label="Previous page">‹</Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(i => {
                if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                  return (
                    <Link to={pageUrl(i)} key={i} className={currentPage === i ? 'current' : ''}>
                      {i}
                    </Link>
                  )
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                  return <span className="dots" key={i}>...</span>
                }
                return null
              })}

              {currentPage < totalPages && (
                <Link to={pageUrl(currentPage + 1)} className="page-arrow" aria-label="Next page">›</Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default BrowsePage