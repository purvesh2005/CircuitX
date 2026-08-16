import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

/**
 * HomePage Component
 * The landing page of the app, displayed at /home.
 *
 * Sections:
 * 1. Hero - Big banner with sustainable future tagline and decorative graphics
 * 2. Features - Four-value proposition cards (Affordable, Sustainable, Trusted, Easy)
 * 3. Popular Categories - Grid of clickable category cards linking to browse
 * 4. Latest Listings - Recently added products fetched from the API
 *
 * Uses Tailwind CSS for all styling.
 */
function HomePage() {
  const [products, setProducts] = useState([])

  // Fetch the latest products once when the component mounts
  useEffect(() => {
    fetchLatestProducts()
  }, [])

  /**
   * Fetches latest products from the backend API.
   * GET /api/products/latest returns the most recent listings.
   */
  const fetchLatestProducts = async () => {
    try {
      const res = await api.get('/products/latest')
      setProducts(res.data.products)
    } catch (err) {
      console.log('Error fetching products:', err)
    }
  }

  /**
   * Adds a product to the user's wishlist.
   * Prevented default to avoid navigating when clicking the heart icon.
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

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      {/* Displays the main tagline, call-to-action buttons, and decorative chip graphics */}
      <section className="min-h-[310px] flex items-center justify-between px-[38px] pt-10 pb-[25px] max-[650px]:flex-col max-[650px]:px-5 max-[650px]:pt-[30px] max-[650px]:pb-5" style={{ background: 'radial-gradient(circle at 80% 50%, #effcf6 0%, transparent 35%)' }}>
        {/* Left side: Tag badge, heading, description, buttons */}
        <div className="w-[54%] max-[650px]:w-full">
          {/* Sustainability badge */}
          <div className="inline-flex items-center gap-[5px] bg-[#e8f8f1] text-[#00875a] px-[9px] py-[5px] rounded-full text-xs font-semibold mb-[13px]">
            <i className="fa-solid fa-leaf"></i>
            Sustainable Future
          </div>

          {/* Hero heading with highlighted span */}
          <h1 className="text-[33px] leading-[1.17] tracking-[-1px] font-extrabold mb-[13px] max-[900px]:text-[26px]">
            Buy & Sell<br />
            Electronic <span className="text-[#009b63]">Components</span><br />
            Used by Students,<br />
            Loved by All.
          </h1>

          {/* Hero description */}
          <p className="text-sm leading-relaxed text-[#4b5563] mb-[19px]">
            Give your components a second life.<br />
            Save money. Reduce e-waste. Support sustainability.
          </p>

          {/* Call-to-action buttons */}
          <div className="flex gap-[13px]">
            <Link to="/browse" className="no-underline text-[15px] font-semibold py-[11px] px-[19px] rounded-md bg-[#009b63] text-white">Browse Components</Link>
            <Link to="/sell" className="no-underline text-[15px] font-semibold py-[11px] px-[19px] rounded-md border border-[#009b63] text-[#009b63] bg-white">Sell Your Component</Link>
          </div>
        </div>

        {/* Right side: Decorative hero image area with floating chips and recycle bin */}
        <div className="relative w-[42%] h-[270px] max-[650px]:w-full max-[650px]:mt-5">
          {/* Floating microchip decorations */}
          <div className="absolute left-[55px] top-[48px] w-[35px] h-[35px] bg-[#164f73] rounded border border-[#164f73] flex items-center justify-center text-[#7ee1b4] text-lg shadow-[0_8px_15px_rgba(0,0,0,0.12)]" style={{ transform: 'rotate(-18deg)' }}>
            <i className="fa-solid fa-microchip"></i>
          </div>
          <div className="absolute right-[55px] top-[40px] w-[35px] h-[35px] bg-[#164f73] rounded border border-[#164f73] flex items-center justify-center text-[#7ee1b4] text-lg shadow-[0_8px_15px_rgba(0,0,0,0.12)]" style={{ transform: 'rotate(20deg)' }}>
            <i className="fa-solid fa-microchip"></i>
          </div>
          <div className="absolute right-5 top-[105px] w-[35px] h-[35px] bg-[#164f73] rounded border border-[#164f73] flex items-center justify-center text-[#7ee1b4] text-lg shadow-[0_8px_15px_rgba(0,0,0,0.12)]" style={{ transform: 'rotate(-15deg)' }}>
            <i className="fa-solid fa-microchip"></i>
          </div>
          <div className="absolute left-[110px] top-[125px] w-[35px] h-[35px] bg-[#164f73] rounded border border-[#164f73] flex items-center justify-center text-[#7ee1b4] text-lg shadow-[0_8px_15px_rgba(0,0,0,0.12)]" style={{ transform: 'rotate(20deg)' }}>
            <i className="fa-solid fa-microchip"></i>
          </div>

          {/* Recycle bin graphic with an electronic board */}
          <div className="absolute right-[50px] bottom-[13px] w-[130px] h-[130px]">
            <div className="absolute w-[58px] h-[35px] bg-[#1d4f70] rounded left-8 top-3 z-[2] flex items-center justify-center text-[#76d6a9]" style={{ transform: 'rotate(-10deg)' }}>
              <i className="fa-solid fa-microchip"></i>
            </div>
            <div className="absolute bottom-0 left-0 w-[120px] h-[75px] bg-[#009b63] rounded-[5px_5px_18px_18px] flex items-center justify-center text-white text-[45px]" style={{ transform: 'perspective(200px) rotateX(-5deg)' }}>
              <i className="fa-solid fa-recycle"></i>
            </div>
          </div>

          {/* Decorative leaf emojis */}
          <div className="absolute right-[10px] top-[55px] text-[#c9ebdc] text-[27px]">🍃</div>
          <div className="absolute right-[90px] top-[5px] text-[#c9ebdc] text-[27px]">🍃</div>
          <div className="absolute left-[25px] bottom-[35px] text-[#c9ebdc] text-[27px]">🍃</div>
          <div className="absolute right-[35px] bottom-[15px] text-[#c9ebdc] text-[27px]">🍃</div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      {/* Four feature cards explaining why users should trust CircuitX */}
      <section className="grid grid-cols-4 gap-3 px-[38px] pb-7 max-[650px]:grid-cols-2 max-[650px]:px-5 max-[650px]:pb-6">
        {[
          { icon: 'fa-location-dot', title: 'Affordable', desc: 'Save up to 60% on components' },
          { icon: 'fa-recycle', title: 'Sustainable', desc: 'Reduce electronic waste and help environment' },
          { icon: 'fa-users', title: 'Trusted Students', desc: 'Buy & sell with your college community' },
          { icon: 'fa-shield-halved', title: 'Easy & Safe', desc: 'Simple process and secure interactions' }
        ].map(f => (
          <div key={f.title} className="min-h-[80px] bg-[#f2f3f5] rounded-lg flex items-center gap-2.5 p-2.5">
            <div className="min-w-[50px] h-[50px] border-2 border-[#00a66a] rounded-full flex items-center justify-center text-[#00a66a] text-xl">
              <i className={`fa-solid ${f.icon}`}></i>
            </div>
            <div>
              <h3 className="text-[15px] mb-[3px]">{f.title}</h3>
              <p className="text-[#6b7280] text-[10px] leading-[1.4]">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ================= POPULAR CATEGORIES ================= */}
      {/* Grid of category cards that link to the browse page with a category filter */}
      <section className="px-[38px] pb-7 max-[650px]:px-5">
        <div className="flex items-center justify-between mb-[13px]">
          <h2 className="text-[15px] font-bold">Popular Categories</h2>
          <Link to="/categories" className="text-[#009b63] no-underline text-xs font-semibold">View All</Link>
        </div>

        <div className="grid grid-cols-8 gap-2.5 max-[900px]:grid-cols-4 max-[650px]:grid-cols-4">
          <Link to="/browse?category=Microcontrollers" className="no-underline text-center text-[#111827]">
            <div className="h-[75px] bg-[#f2f3f5] rounded-lg flex items-center justify-center mb-1.5 overflow-hidden">
              <img src="/images/aurdino.png" alt="Arduino" className="w-[90px] h-[70px] object-contain" />
            </div>
            <p className="text-[13px] text-[#374151]">Arduino</p>
          </Link>

          <Link to="/browse?category=Sensors" className="no-underline text-center text-[#111827]">
            <div className="h-[75px] bg-[#f2f3f5] rounded-lg flex items-center justify-center mb-1.5 overflow-hidden">
              <img src="/images/sensors.png" alt="Sensors" className="w-[90px] h-[70px] object-contain" />
            </div>
            <p className="text-[13px] text-[#374151]">Sensors</p>
          </Link>

          <Link to="/browse?category=Motors" className="no-underline text-center text-[#111827]">
            <div className="h-[75px] bg-[#f2f3f5] rounded-lg flex items-center justify-center mb-1.5 overflow-hidden">
              <img src="/images/motor.png" alt="Motors" className="w-[90px] h-[70px] object-contain" />
            </div>
            <p className="text-[13px] text-[#374151]">Motors</p>
          </Link>

          <Link to="/browse?category=Development%20Boards" className="no-underline text-center text-[#111827]">
            <div className="h-[75px] bg-[#f2f3f5] rounded-lg flex items-center justify-center mb-1.5 overflow-hidden">
              <img src="/images/esp32.png" alt="ESP32" className="w-[90px] h-[70px] object-contain" />
            </div>
            <p className="text-[13px] text-[#374151]">ESP32 / ESP8266</p>
          </Link>

          <Link to="/browse?category=ICs" className="no-underline text-center text-[#111827]">
            <div className="h-[75px] bg-[#f2f3f5] rounded-lg flex items-center justify-center mb-1.5 overflow-hidden">
              <img src="/images/ICs.png" alt="ICs" className="w-[90px] h-[70px] object-contain" />
            </div>
            <p className="text-[13px] text-[#374151]">ICs</p>
          </Link>

          <Link to="/browse?category=Power%20Supply" className="no-underline text-center text-[#111827]">
            <div className="h-[75px] bg-[#f2f3f5] rounded-lg flex items-center justify-center mb-1.5 overflow-hidden">
              <img src="/images/power_supply.png" alt="Power Supply" className="w-[90px] h-[70px] object-contain" />
            </div>
            <p className="text-[13px] text-[#374151]">Power Supply</p>
          </Link>

          <Link to="/browse?category=Tools%20%26%20Others" className="no-underline text-center text-[#111827]">
            <div className="h-[75px] bg-[#f2f3f5] rounded-lg flex items-center justify-center mb-1.5 overflow-hidden">
              <img src="/images/robotics.png" alt="Robotics" className="w-[90px] h-[70px] object-contain" />
            </div>
            <p className="text-[13px] text-[#374151]">Robotics</p>
          </Link>

          {/* "More" card - links to all categories */}
          <Link to="/categories" className="no-underline text-center text-[#111827]">
            <div className="h-[75px] bg-[#f2f3f5] rounded-lg flex items-center justify-center mb-1.5 overflow-hidden text-[#008f5a] text-[40px]">
              <i className="fa-solid fa-grip"></i>
            </div>
            <p className="text-[13px] text-[#374151]">More</p>
          </Link>
        </div>
      </section>

      {/* ================= LATEST LISTINGS ================= */}
      {/* Displays the most recent products fetched from the API */}
      <section className="px-[38px] pb-10 max-[650px]:px-5">
        <div className="flex items-center justify-between mb-[13px]">
          <h2 className="text-[15px] font-bold">Latest Listings</h2>
          <Link to="/browse" className="text-[#009b63] text-xs font-semibold no-underline">View All</Link>
        </div>

        <div className="grid grid-cols-5 gap-2.5 max-[900px]:grid-cols-3 max-[650px]:grid-cols-2">
          {/* Message shown when no products exist yet */}
          {products.length === 0 && (
            <p className="col-span-full text-center text-[#6b7280] py-10 text-sm">
              No components listed yet. Be the first to sell!
            </p>
          )}

          {/* Render each product as a clickable card linking to its details page */}
          {products.map(product => (
            <Link to={`/productDetails/${product.product_id}`} key={product.product_id} className="no-underline text-inherit bg-white border border-[#eeeeee] rounded-lg overflow-hidden transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_7px_20px_rgba(0,0,0,0.08)]">
              <div className="h-[108px] bg-[#f7f8f9] relative flex items-center justify-center">
                <img src={product.image_url} alt={product.product_name} className="w-[80%] h-[80%] object-contain" />

                {/* Wishlist heart button - adds product to wishlist */}
                <button
                  className="absolute right-[7px] top-[7px] w-[18px] h-[18px] border-none bg-transparent cursor-pointer text-[#9ca3af] text-[11px] hover:text-[#ef4444]"
                  onClick={(e) => addToWishlist(e, product.product_id)}
                >
                  <i className="fa-regular fa-heart"></i>
                </button>

                {/* Discount badge shown when product has a discount */}
                {product.discount > 0 && (
                  <span className="absolute left-[7px] top-[7px] bg-[#ef4444] text-white text-[9px] font-bold px-1.5 py-[3px] rounded">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Product name and price/condition info */}
              <div className="p-2">
                <h3 className="text-[13px] font-semibold mb-[7px] whitespace-nowrap overflow-hidden text-ellipsis">{product.product_name}</h3>
                <div className="flex justify-between items-center">
                  <strong className="text-xs">₹{product.Price}</strong>
                  <span className="text-[#6b7280] text-[10px]">{product.Product_condition || product.condition}</span>
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