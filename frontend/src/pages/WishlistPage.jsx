import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

/**
 * WishlistPage Component
 * Displays the user's saved/wishlisted components.
 *
 * Features:
 * - List of wishlisted products with image, price, and details
 * - Remove individual items from the wishlist
 * - Remove all items at once
 * - Link to view product details
 * - Banner at the bottom prompting to browse more components
 *
 * Uses Tailwind CSS for all styling.
 */
function WishlistPage() {
  // State for the list of wishlisted products
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  // Fetch wishlist on component mount
  useEffect(() => {
    fetchWishlist()
  }, [])

  /**
   * Fetches the user's wishlist from the backend.
   * GET /api/wishlist returns the list of saved products.
   * Redirects to login if the user is not authenticated (401).
   */
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

  /**
   * Removes a single product from the wishlist.
   * Updates local state to reflect the removal.
   */
  const removeItem = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`)
      setProducts(products.filter(p => p.product_id !== productId))
    } catch (err) {
      console.log('Remove error:', err)
    }
  }

  /**
   * Removes ALL products from the wishlist at once.
   */
  const removeAll = async () => {
    try {
      await api.delete('/wishlist')
      setProducts([])
    } catch (err) {
      console.log('Remove all error:', err)
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f7f9f8] px-4 pt-[30px] pb-10">
      <div className="max-w-[1100px] mx-auto bg-white border border-[#eeeeee] rounded-xl px-8 pt-[30px] pb-10 shadow-[0_2px_15px_rgba(0,0,0,0.04)] max-[700px]:px-[18px] max-[700px]:pt-[22px] max-[700px]:pb-[30px]">
        {/* Header: title + remove all button */}
        <div className="flex items-start justify-between mb-3 max-[500px]:flex-col max-[500px]:gap-[15px]">
          <div>
            <h1 className="text-[22px] mb-1.5 font-bold">My Wishlist</h1>
            <p className="text-xs text-[#555]">Your saved components</p>
          </div>

          {/* Remove All button - only shown when there are items */}
          {products.length > 0 && (
            <button className="h-[34px] px-[13px] flex items-center gap-[7px] bg-white text-[#e53935] border border-[#ff8c8c] rounded-md text-[9px] font-semibold cursor-pointer transition duration-200 hover:bg-[#fff4f4]" onClick={removeAll}>
              <i className="fa-regular fa-trash-can"></i>
              Remove All
            </button>
          )}
        </div>

        {/* Item count */}
        <div className="text-[#078b58] text-[11px] font-semibold pb-[15px] border-b border-[#eeeeee]">{products.length} Items</div>

        {/* Wishlist items list */}
        <div className="flex flex-col gap-2.5">
          {/* Empty state - shown when wishlist is empty */}
          {products.length === 0 && (
            <div className="text-center py-[60px] px-5">
              <i className="fa-regular fa-heart block text-[48px] text-[#d1d5db] mb-[15px]"></i>
              <h3 className="text-base text-[#374151] mb-2">Your wishlist is empty</h3>
              <p className="text-xs text-[#6b7280] mb-5">Save components you love and find them here later.</p>
              <Link to="/browse" className="inline-flex items-center justify-center h-[35px] px-[18px] bg-[#078b58] text-white rounded text-[9px] font-semibold no-underline transition duration-200 hover:bg-[#056f46]">Browse Components</Link>
            </div>
          )}

          {/* Wishlist product cards */}
          {products.map(product => (
            <div className="min-h-[190px] border border-[#e7e7e7] rounded-[10px] grid grid-cols-[183px_1fr_115px] gap-[30px] items-center py-[6px] pl-0 pr-5 overflow-hidden transition duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:border-[#d7eee5] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] max-[900px]:grid-cols-[150px_1fr_100px] max-[900px]:gap-5 max-[700px]:grid-cols-[130px_1fr] max-[700px]:gap-[15px] max-[700px]:p-2 max-[500px]:grid-cols-1" key={product.product_id}>
              {/* Product image */}
              <div className="w-[183px] h-[178px] bg-[#fafafa] flex items-center justify-center overflow-hidden rounded-lg max-[900px]:w-[150px] max-[900px]:h-[165px] max-[700px]:w-[130px] max-[700px]:h-[150px] max-[500px]:w-full max-[500px]:h-[180px]">
                <img src={product.image_url} alt={product.product_name} className="w-[90%] h-[90%] object-contain" />
              </div>

              {/* Product details */}
              <div className="min-w-0">
                <h2 className="text-sm font-bold mb-[18px] text-[#151515]">{product.product_name}</h2>

                {/* Price row: current, old, discount */}
                <div className="flex items-center gap-[13px] mb-5">
                  <span className="text-lg font-bold text-[#111]">₹{product.Price}</span>
                  <span className="text-[10px] text-[#777] line-through">₹{product.original_price}</span>
                  <span className="px-2 py-[5px] bg-[#eaf8f1] text-[#087d53] rounded font-bold text-[8px]">{product.discount}% OFF</span>
                </div>

                {/* Product meta: condition, age, location */}
                <div className="flex items-center gap-5 flex-wrap mb-[19px] max-[700px]:gap-2.5">
                  <span className="flex items-center gap-[5px] font-[9px] text-[#444] whitespace-nowrap">
                    <i className="fa-regular fa-heart text-[10px] text-[#333]"></i>
                    {product.Product_condition}
                  </span>
                  <span className="flex items-center gap-[5px] font-[9px] text-[#444] whitespace-nowrap">
                    <i className="fa-regular fa-clock text-[10px] text-[#333]"></i>
                    {Math.floor((new Date() - new Date(product.purchase_date)) / (1000 * 60 * 60 * 24))} days ago
                  </span>
                  <span className="flex items-center gap-[5px] font-[9px] text-[#444] whitespace-nowrap">
                    <i className="fa-solid fa-location-dot text-[10px] text-[#333]"></i>
                    {product.city}, {product.state}
                  </span>
                </div>

                {/* Added date */}
                <p className="text-[9px] text-[#777]">{product.created_at}</p>
              </div>

              {/* Action buttons: delete and view details */}
              <div className="h-full flex flex-col items-end justify-between py-5 max-[700px]:grid max-[700px]:col-start-2 max-[700px]:h-auto max-[700px]:flex-row max-[700px]:items-center max-[700px]:justify-start max-[700px]:gap-3 max-[700px]:p-0 max-[700px]:pb-2 max-[500px]:col-start-1 max-[500px]:justify-between max-[500px]:p-[5px]">
                <button className="w-[34px] h-[34px] bg-white border border-[#e5e5e5] rounded-md text-[#555] cursor-pointer text-xs flex items-center justify-center hover:text-[#e53935] hover:border-[#ffb1b1] hover:bg-[#fff6f6]" onClick={() => removeItem(product.product_id)}>
                  <i className="fa-regular fa-trash-can"></i>
                </button>

                <Link to={`/productDetails/${product.product_id}`} className="w-[100px] h-[34px] border border-[#72c6a7] rounded-md flex items-center justify-center text-[#087d53] bg-white no-underline text-[9px] font-semibold transition duration-200 hover:bg-[#eaf8f3] max-[700px]:order-3">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom banner - encourages browsing more components */}
        <div className="min-h-[77px] mt-[25px] px-[22px] py-3 rounded-[10px] bg-[#eef9f4] flex items-center gap-[15px] max-[700px]:flex-wrap">
          <div className="w-[45px] h-[45px] flex-shrink-0 rounded-full bg-white flex items-center justify-center">
            <i className="fa-regular fa-heart text-[#087d53] text-[22px]"></i>
          </div>

          <div className="flex-1 max-[700px]:min-w-[calc(100%-65px)]">
            <h3 className="text-[11px] font-bold mb-[5px]">Keep your favorites in one place!</h3>
            <p className="text-[9px] text-[#555]">Add more components you need.</p>
          </div>

          <Link to="/browse" className="h-[35px] px-[18px] flex items-center justify-center bg-[#078b58] text-white rounded font-semibold text-[9px] no-underline whitespace-nowrap transition duration-200 hover:bg-[#056f46] max-[700px]:ml-[60px] max-[500px]:ml-0">Browse More Components</Link>
        </div>
      </div>
    </div>
  )
}

export default WishlistPage