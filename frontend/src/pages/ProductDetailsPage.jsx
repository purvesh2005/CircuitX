import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'

/**
 * ProductDetailsPage Component
 * Shows detailed information about a single product.
 * Layout: breadcrumb, product image on the left, product info on the right.
 *
 * Includes:
 * - Product name, price, discount, stock status
 * - Product meta: condition, days ago, location, created date
 * - Description and quantity
 * - Seller information card with profile image and rating
 * - Wishlist toggle button and Buy button
 *
 * Uses Tailwind CSS for all styling.
 */
function ProductDetailsPage() {
  // Get the product ID from the URL route parameter
  const { id } = useParams()

  // State for product, seller, wishlist status, and loading state
  const [product, setProduct] = useState(null)
  const [seller, setSeller] = useState(null)
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch product details when the ID changes
  useEffect(() => {
    fetchProduct()
  }, [id])

  /**
   * Fetches product details and seller info from the backend.
   * GET /api/products/:id returns product, seller, and wishlist status.
   */
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

  /**
   * Toggles the product in the user's wishlist.
   * If the product is wishlisted, removes it; otherwise adds it.
   */
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

  // Loading state while product data is being fetched
  if (loading) return <div className="text-center py-[100px]">Loading...</div>

  // Product not found state
  if (!product) return <div className="text-center py-[100px]">Product not found</div>

  // Calculate how many days ago the product was purchased
  const purchased = new Date(product.purchase_date)
  const today = new Date()
  const days = Math.floor((today - purchased) / (1000 * 60 * 60 * 24))

  return (
    <div className="w-full max-w-[1200px] min-h-screen mx-auto px-6 pt-7 pb-7 bg-white rounded-b-[10px] max-[900px]:px-[18px] max-[550px]:px-3">
      {/* Breadcrumb navigation: Home > Category > Product Name */}
      <div className="flex items-center gap-2 mb-5 text-[15px] text-[#6b7280] max-[550px]:text-[10px]">
        <Link to="/home" className="text-[#059669] no-underline hover:underline">Home</Link>
        <span className="text-[#9ca3af]">›</span>
        <Link to={`/browse?category=${encodeURIComponent(product.category)}`} className="text-[#059669] no-underline hover:underline">{product.category}</Link>
        <span className="text-[#9ca3af]">›</span>
        <span>{product.product_name}</span>
      </div>

      {/* Product layout: image on left, info on right */}
      <div className="grid grid-cols-[47%_53%] gap-[30px] max-[900px]:grid-cols-1">
        {/* Product image */}
        <div className="w-full">
          <div className="w-full h-[410px] flex items-center justify-center bg-[#f8f9f9] border border-[#e1e5e3] rounded-lg overflow-hidden max-[900px]:h-[380px] max-[550px]:h-[300px]">
            <img src={product.image_url} alt={product.product_name} className="w-[90%] h-[90%] object-contain" />
          </div>
        </div>

        {/* Product info */}
        <div className="min-w-0 pt-1 pr-5 pl-[5px] max-[900px]:pt-2.5 max-[550px]:pr-0">
          {/* Product name */}
          <div className="flex items-center justify-between mb-3.5">
            <h1 className="text-[25px] font-semibold text-[#111827] max-[550px]:text-lg">{product.product_name}</h1>
          </div>

          {/* Price section: current price, original price, discount, stock */}
          <div className="flex items-center gap-3 mb-[18px]">
            <div className="text-[22px] font-bold text-[#111827]">₹{product.Price}</div>
            <del className="text-[13px] text-[#9ca3af]">₹{product.original_price}</del>
            <span className="px-2 py-[5px] bg-[#e5f6ee] text-[#059669] rounded text-xs font-semibold">{product.discount}% OFF</span>
            <span className="ml-auto px-2.5 py-[7px] bg-[#e5f6ee] text-[#059669] rounded font-semibold text-xs">In Stock</span>
          </div>

          {/* Product meta info: condition, date, location */}
          <div className="flex flex-wrap gap-x-5 gap-y-3.5 text-xs text-[#5f6663] max-[550px]:flex-col max-[550px]:gap-[9px]">
            <span className="flex items-center gap-1.5">
              <i className="fa-regular fa-circle-check text-[10px] text-[#6b7280]"></i>
              {product.Product_condition}
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-regular fa-clock text-[10px] text-[#6b7280]"></i>
              {days} days ago
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-location-dot text-[10px] text-[#6b7280]"></i>
              {product.city}, {product.state}
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-regular fa-calendar text-[10px] text-[#6b7280]"></i>
              {new Date(product.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Divider line */}
          <div className="w-full h-px bg-[#e5e7eb] my-[17px]"></div>

          {/* Description section */}
          <div>
            <h3 className="mb-[11px] text-[15px] font-semibold text-[#111827]">Description</h3>
            <p className="mb-[7px] text-xs leading-[1.4] text-[#4b5563]">{product.description}</p>
            <p className="mb-[7px] text-xs leading-[1.4] text-[#4b5563]">Quantity: {product.quantity}</p>
          </div>

          {/* Seller information card */}
          <div className="w-full mt-5 p-[13px] border border-[#e1e5e3] rounded-[7px] bg-white">
            <h3 className="mb-3 text-[11px] font-semibold text-[#111827]">Seller Information</h3>
            <div className="flex items-center gap-2.5 max-[550px]:flex-wrap">
              {/* Seller avatar */}
              <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex-shrink-0 bg-[#e5e7eb] border-2 border-white">
                <img src={seller?.profile_image} alt="" className="w-full h-full object-cover block" />
              </div>
              {/* Seller details: name, college, rating */}
              <div className="flex flex-col gap-[3px] flex-1">
                <strong className="text-[10px] text-[#111827]">{seller?.name}</strong>
                <span className="text-[8px] text-[#6b7280]">{seller?.college}</span>
                <span className="text-[#f59e0b] text-[9px]">
                  <i className="fa-solid fa-star"></i>
                  4.8
                  <small className="text-[#6b7280] text-[8px]">(25 Reviews)</small>
                </span>
              </div>
              <Link to="/profile" className="py-2 px-[13px] border border-[#80cdb0] rounded text-[#059669] text-[9px] font-semibold no-underline whitespace-nowrap transition duration-200 hover:bg-[#effaf5]">View Profile</Link>
            </div>
          </div>

          {/* Action buttons: wishlist toggle and buy */}
          <div className="grid grid-cols-2 gap-[14px] mt-[34px] max-[550px]:grid-cols-1 max-[550px]:mt-5">
            <button onClick={toggleWishlist} className="w-full h-[42px] flex items-center justify-center gap-2 px-[18px] border border-[#059669] rounded-md bg-white text-[#059669] font-inherit text-[11px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#effaf5] active:scale-[0.98]">
              <i className={wishlist ? 'fa-solid fa-heart text-sm' : 'fa-regular fa-heart text-sm'}></i>
              <span>{wishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <a href="#" className="w-full h-[42px] flex items-center justify-center border border-[#059669] rounded-md bg-[#059669] text-white text-[11px] font-semibold no-underline transition duration-200 hover:bg-[#047857] hover:border-[#047857]">Buy / Make Offer</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage