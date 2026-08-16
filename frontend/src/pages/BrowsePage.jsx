import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api'

/**
 * BrowsePage Component
 * Displays all components with search, filter, sorting, and pagination.
 *
 * Features:
 * - Search bar to find components by name
 * - Sidebar filters: Category, Condition, Max Price, Location
 * - Sort by newest, price low-to-high, price high-to-low
 * - Pagination to browse through multiple pages of results
 * - Wishlist heart button on each product card
 *
 * Uses Tailwind CSS for all styling.
 */
function BrowsePage() {
  // Query params from the URL control the current filters/sorting/page
  const [searchParams, setSearchParams] = useSearchParams()

  // Product data state
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter states (initialized from URL search params)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [condition, setCondition] = useState(searchParams.get('condition') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')

  // Fetch products whenever the URL search params change
  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  /**
   * Fetches products from the backend API using the current URL filter params.
   * GET /api/products returns products, totalPages, and currentPage.
   */
  const fetchProducts = async () => {
    try {
      // Build query params object from URL search params
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

  /**
   * Handles the search form submission.
   * Updates URL search params to trigger a new fetch.
   */
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

  /**
   * Updates the category filter when a category link is clicked.
   */
  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (cat) params.set('category', cat)
    setSearchParams(params)
  }

  /**
   * Updates the sort order when the sort dropdown changes.
   */
  const handleSortChange = (e) => {
    const value = e.target.value
    setSort(value)
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'newest') params.set('sort', value)
    else params.delete('sort')
    setSearchParams(params)
  }

  /**
   * Generates a URL string for a given page number (for pagination links).
   */
  const pageUrl = (pageNumber) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber)
    return `?${params.toString()}`
  }

  /**
   * Adds a product to the wishlist.
   * Prevents navigation when clicking the heart icon.
   */
  const addToWishlist = async (e, productId) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await api.post('/wishlist/add', { product_id: productId })
    } catch (err) {
      console.log('Wishlist error:', err)
    }
  }

  // Category list displayed in the sidebar
  const categories = [
    'Resistors', 'Capacitors', 'Sensors', 'Motors',
    'Power Supply', 'ICs', 'Microcontrollers', 'Development Boards', 'Tools & Others'
  ]

  return (
    <div className="w-full max-w-[1280px] mx-auto px-3 pt-[22px] pb-10 max-[1100px]:px-[15px] max-[450px]:px-2.5">
      {/* Top section - search bar and sell button */}
      <div className="flex items-center justify-end gap-5 mb-6 max-[650px]:justify-center max-[650px]:flex-wrap">
        <form className="w-[560px] h-[46px] flex items-center bg-white border border-[#dfe5e2] rounded-[7px] overflow-hidden max-[1100px]:w-[450px] max-[850px]:w-[350px] max-[650px]:w-full" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search components, e.g. Arduino UNO"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 w-full border-none outline-none px-4 text-sm text-[#374151] placeholder:text-[#9ca3af]"
          />
          <button type="submit" className="w-[52px] h-full border-none border-l border-[#e5e7eb] bg-white text-[23px] text-[#374151] cursor-pointer">⌕</button>
        </form>

        <Link to="/sell" className="flex items-center justify-center h-[46px] px-6 bg-[#059669] text-white rounded-md text-[13px] font-semibold whitespace-nowrap transition duration-200 hover:bg-[#047857] max-[650px]:w-full">Sell Component</Link>
      </div>

      {/* Main content: sidebar filters + product grid */}
      <div className="grid grid-cols-[220px_1fr] gap-[35px] items-start max-[1100px]:grid-cols-[200px_1fr] max-[1100px]:gap-[25px] max-[850px]:grid-cols-[180px_1fr] max-[850px]:gap-5 max-[650px]:grid-cols-1">
        {/* Sidebar with category list and filters */}
        <aside className="min-w-0 bg-transparent max-[650px]:hidden">
          {/* Category list section */}
          <section className="pb-[22px] mb-[22px] border-b border-[#e1e5e3]">
            <h3 className="mb-[15px] text-[17px] font-semibold text-[#1f2937]">Categories</h3>
            <ul className="list-none">
              {/* "All Categories" - clears the category filter */}
              <li className={`mb-1 rounded-md hover:bg-[#edf8f3] ${!category ? 'bg-[#e3f5ed]' : ''}`}>
                <a href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick('') }} className={`block px-[11px] py-[9px] text-[13px] ${!category ? 'text-[#059669] font-semibold' : 'text-[#4b5563]'}`}>All Categories</a>
              </li>
              {/* Individual category links */}
              {categories.map(cat => (
                <li key={cat} className={`mb-1 rounded-md hover:bg-[#edf8f3] ${category === cat ? 'bg-[#e3f5ed]' : ''}`}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick(cat) }} className={`block px-[11px] py-[9px] text-[13px] ${category === cat ? 'text-[#059669] font-semibold' : 'text-[#4b5563]'}`}>{cat}</a>
                </li>
              ))}
            </ul>
          </section>

          {/* Filters section */}
          <form onSubmit={handleSearch}>
            <section className="pb-[22px] mb-[22px] border-b border-[#e1e5e3]">
              <h3 className="mb-[15px] text-[17px] font-semibold text-[#1f2937]">Filters</h3>

              {/* Condition radio buttons */}
              <div className="mt-[21px]">
                <h4 className="mb-[11px] text-[13px] font-semibold text-[#374151]">Condition</h4>
                {['', 'New', 'Like New', 'Good', 'Used'].map(cond => (
                  <label key={cond || 'all'} className="flex items-center mb-2.5 text-[13px] text-[#4b5563] cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      value={cond}
                      checked={condition === cond}
                      onChange={() => setCondition(cond)}
                      className="w-[15px] h-[15px] mr-[9px] accent-[#059669] cursor-pointer"
                    />
                    {cond || 'All'}
                  </label>
                ))}
              </div>

              {/* Max price input */}
              <div className="mt-[21px]">
                <h4 className="mb-[11px] text-[13px] font-semibold text-[#374151]">Max Price</h4>
                <input
                  type="number"
                  name="maxPrice"
                  min="0"
                  placeholder="e.g. 5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-[38px] px-2.5 bg-white border border-[#d5dcd8] rounded text-xs text-[#4b5563] outline-none cursor-pointer"
                />
              </div>

              {/* Location dropdown */}
              <div className="mt-[21px]">
                <h4 className="mb-[11px] text-[13px] font-semibold text-[#374151]">Location</h4>
                <select name="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full h-[38px] px-2.5 bg-white border border-[#d5dcd8] rounded text-xs text-[#4b5563] outline-none cursor-pointer">
                  <option value="">Select location</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              {/* Apply filters button */}
              <button type="submit" className="w-full h-[38px] mt-5 border-none rounded bg-[#059669] text-white text-xs font-semibold cursor-pointer transition duration-200 hover:bg-[#047857]">Apply Filters</button>
            </section>
          </form>
        </aside>

        {/* Main products area */}
        <main className="min-w-0">
          {/* Header: title + sort dropdown */}
          <div className="flex items-center justify-between mb-[18px] max-[450px]:flex-col max-[450px]:items-start max-[450px]:gap-3">
            <h2 className="text-xl font-semibold text-[#1f2937]">All Components</h2>
            <div className="flex items-center gap-2.5 text-xs text-[#6b7280]">
              <span>Sort by:</span>
              <select value={sort} onChange={handleSortChange} className="h-9 px-3 bg-white border border-[#d8dedb] rounded text-xs text-[#374151] outline-none cursor-pointer">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-3 gap-[18px] max-[850px]:grid-cols-2 max-[650px]:grid-cols-2 max-[650px]:gap-3 max-[450px]:grid-cols-1">
            {/* Empty state message */}
            {products.length === 0 && (
              <p className="col-span-full text-center text-[#6b7280] py-[60px] text-sm">
                No components found. Try adjusting your filters.
              </p>
            )}

            {/* Product cards */}
            {products.map(product => (
              <Link to={`/productDetails/${product.product_id}`} key={product.product_id} className="no-underline bg-white border border-[#e1e5e3] rounded-lg overflow-hidden transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
                <div className="w-full h-[180px] relative flex items-center justify-center bg-[#f5f7f6] max-[1100px]:h-[165px] max-[650px]:h-[150px]">
                  <img src={product.image_url} alt={product.product_name} className="w-full h-full object-contain" />

                  {/* Wishlist button */}
                  <button
                    className="absolute top-2.5 right-2.5 w-[34px] h-[34px] flex items-center justify-center border-none rounded-full bg-white text-[#9ca3af] text-[23px] cursor-pointer shadow-[0_2px_7px_rgba(0,0,0,0.10)] hover:text-[#ef4444]"
                    onClick={(e) => addToWishlist(e, product.product_id)}
                  >
                    <i className="fa-regular fa-heart"></i>
                  </button>

                  {/* Discount badge */}
                  {product.discount > 0 && (
                    <span className="absolute left-2.5 top-2.5 px-2 py-1 bg-[#ef4444] text-white rounded font-bold text-[10px]">{product.discount}% OFF</span>
                  )}
                </div>

                {/* Product info: name, price, location */}
                <div className="px-[15px] pt-3.5 pb-[15px]">
                  <h3 className="mb-[11px] text-sm font-medium text-[#1f2937] whitespace-nowrap overflow-hidden text-ellipsis">{product.product_name}</h3>
                  <div className="flex items-center gap-[9px]">
                    <strong className="text-base font-semibold text-[#111827]">₹{product.Price}</strong>
                    <del className="text-[11px] text-[#9ca3af]">₹{product.original_price}</del>
                    {product.discount > 0 && <span className="px-[7px] py-1 bg-[#e5f6ee] text-[#059669] rounded text-[9px] font-semibold">{product.discount}% OFF</span>}
                  </div>
                  <p className="mt-3 text-[11px] text-[#6b7280]">📍 {product.city}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination - shown when there is more than one page of results */}
          {totalPages > 1 && (
            <div className="w-full min-h-9 flex items-center justify-center gap-[14px] mt-[35px] mb-[25px]">
              {/* Previous page arrow */}
              {currentPage > 1 && (
                <Link to={pageUrl(currentPage - 1)} className="w-6 h-8 flex items-center justify-center text-[#6b7280] text-[22px] font-normal no-underline cursor-pointer transition duration-200 hover:text-[#059669]" aria-label="Previous page">‹</Link>
              )}

              {/* Page number buttons with ellipsis for large page ranges */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(i => {
                if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                  return (
                    <Link to={pageUrl(i)} key={i} className={`w-8 h-8 flex items-center justify-center rounded text-xs font-medium no-underline cursor-pointer transition duration-200 hover:text-[#059669] ${currentPage === i ? 'bg-[#059669] text-white font-semibold' : 'text-[#4b5563]'}`}>
                      {i}
                    </Link>
                  )
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                  return <span className="w-5 text-center text-[#6b7280] text-xs" key={i}>...</span>
                }
                return null
              })}

              {/* Next page arrow */}
              {currentPage < totalPages && (
                <Link to={pageUrl(currentPage + 1)} className="w-6 h-8 flex items-center justify-center text-[#6b7280] text-[22px] font-normal no-underline cursor-pointer transition duration-200 hover:text-[#059669]" aria-label="Next page">›</Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default BrowsePage