import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

/**
 * DashboardPage Component
 * Personal dashboard for the logged-in user to manage their component listings.
 *
 * Features:
 * - Sidebar navigation with links to dashboard areas
 * - List of the user's product listings in a table format
 * - Edit button to modify a listing
 * - Delete button to remove a listing (with confirmation)
 * - "Add New Component" button to create a new listing
 *
 * Uses Tailwind CSS for all styling.
 */
function DashboardPage() {
  // State for user's product listings
  const [products, setProducts] = useState([])

  // Get the logged-in user from AuthContext
  const { user } = useAuth()
  const navigate = useNavigate()

  // Fetch the user's products once the user is available
  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  /**
   * Fetches all products belonging to the current user (seller).
   * GET /api/products/seller/:userId returns the user's listings.
   * Redirects to login if the user is not authenticated (401).
   */
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

  /**
   * Deletes a product listing after user confirmation.
   * Removes the product from the local state list on success.
   */
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this component?')) return

    try {
      await api.delete(`/products/${productId}`)
      setProducts(products.filter(p => p.product_id !== productId))
    } catch (err) {
      console.log('Delete error:', err)
    }
  }

  // Grid column template for the listings table (responsive)
  const gridCols = 'grid-cols-[minmax(180px,2.2fr)_minmax(60px,0.8fr)_minmax(80px,1fr)_minmax(50px,0.6fr)_minmax(70px,0.8fr)] max-[800px]:grid-cols-[minmax(140px,2fr)_60px_70px_45px_65px]'

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f7f9f8] px-4 pt-[30px] pb-10">
      <div className="max-w-[1500px] min-h-[600px] mx-auto grid grid-cols-[185px_1fr] bg-white border border-[#eeeeee] rounded-xl overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.04)] max-[800px]:grid-cols-[150px_1fr] max-[650px]:grid-cols-1">
        {/* Sidebar navigation */}
        <aside className="border-r border-[#eeeeee] p-3 bg-white max-[650px]:border-r-0 max-[650px]:border-b max-[650px]:flex max-[650px]:overflow-x-auto max-[650px]:p-2.5 max-[650px]:gap-[5px]">
          {/* Dashboard (active) link */}
          <Link to="/dashboard" className="h-9 flex items-center gap-3 px-3 mb-[5px] rounded-md no-underline text-[#252525] text-[15px] font-medium transition duration-200 hover:bg-[#f0f8f5] hover:text-[#08a568] bg-[#e9f7f1] text-[#222] font-semibold max-[650px]:flex-shrink-0 max-[650px]:m-0">
            <i className="fa-solid fa-gauge-high w-[14px] text-center text-[15px]"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/dashboard" className="h-9 flex items-center gap-3 px-3 mb-[5px] rounded-md no-underline text-[#252525] text-[15px] font-medium transition duration-200 hover:bg-[#f0f8f5] hover:text-[#08a568] max-[650px]:flex-shrink-0 max-[650px]:m-0">
            <i className="fa-regular fa-rectangle-list w-[14px] text-center text-[15px]"></i>
            <span>My Listings</span>
          </Link>
          <Link to="/wishlist" className="h-9 flex items-center gap-3 px-3 mb-[5px] rounded-md no-underline text-[#252525] text-[15px] font-medium transition duration-200 hover:bg-[#f0f8f5] hover:text-[#08a568] max-[650px]:flex-shrink-0 max-[650px]:m-0">
            <i className="fa-regular fa-heart w-[14px] text-center text-[15px]"></i>
            <span>Wishlist</span>
          </Link>
          <Link to="/browse" className="h-9 flex items-center gap-3 px-3 mb-[5px] rounded-md no-underline text-[#252525] text-[15px] font-medium transition duration-200 hover:bg-[#f0f8f5] hover:text-[#08a568] max-[650px]:flex-shrink-0 max-[650px]:m-0">
            <i className="fa-solid fa-magnifying-glass w-[14px] text-center text-[15px]"></i>
            <span>Browse</span>
          </Link>
          <Link to="/sell" className="h-9 flex items-center gap-3 px-3 mb-[5px] rounded-md no-underline text-[#252525] text-[15px] font-medium transition duration-200 hover:bg-[#f0f8f5] hover:text-[#08a568] max-[650px]:flex-shrink-0 max-[650px]:m-0">
            <i className="fa-solid fa-plus w-[14px] text-center text-[15px]"></i>
            <span>Sell Component</span>
          </Link>
          <Link to="/categories" className="h-9 flex items-center gap-3 px-3 mb-[5px] rounded-md no-underline text-[#252525] text-[15px] font-medium transition duration-200 hover:bg-[#f0f8f5] hover:text-[#08a568] max-[650px]:flex-shrink-0 max-[650px]:m-0">
            <i className="fa-solid fa-tags w-[14px] text-center text-[15px]"></i>
            <span>Categories</span>
          </Link>
          <Link to="/profile" className="h-9 flex items-center gap-3 px-3 mb-[5px] rounded-md no-underline text-[#252525] text-[15px] font-medium transition duration-200 hover:bg-[#f0f8f5] hover:text-[#08a568] max-[650px]:flex-shrink-0 max-[650px]:m-0">
            <i className="fa-solid fa-user w-[14px] text-center text-[15px]"></i>
            <span>Profile</span>
          </Link>
          <Link to="/logout" className="h-9 flex items-center gap-3 px-3 mt-2 rounded-md no-underline text-[#252525] text-[15px] font-medium transition duration-200 hover:bg-[#f0f8f5] hover:text-[#08a568] max-[650px]:flex-shrink-0 max-[650px]:mt-0">
            <i className="fa-solid fa-arrow-right-from-bracket w-[14px] text-center text-[15px]"></i>
            <span>Logout</span>
          </Link>
        </aside>

        {/* Main content area */}
        <main className="pt-[30px] px-7 pb-[30px] min-w-0 max-[800px]:pt-[25px] max-[800px]:px-[18px]">
          <h1 className="text-lg font-bold mb-[25px]">My Dashboard</h1>

          {/* Header with "Add New Component" button */}
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-base font-bold">My Listings</h2>
            <Link to="/sell" className="flex items-center justify-center h-8 px-3.5 bg-[#08a568] text-white rounded-md no-underline text-[11px] font-semibold transition duration-200 hover:bg-[#078b58]">Add New Component</Link>
          </div>

          {/* Listings table */}
          <div className="w-full max-h-[450px] overflow-y-auto border border-[#eeeeee] rounded-md [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Table header row */}
            <div className={`min-h-[34px] grid items-center bg-[#fafafa] border-b border-[#eeeeee] px-2.5 text-[11px] font-semibold text-[#333] sticky top-0 z-10 ${gridCols}`}>
              <div>Component</div>
              <div>Price</div>
              <div>Status</div>
              <div>Views</div>
              <div>Actions</div>
            </div>

            {/* Empty state - shown when the user has no listings */}
            {products.length === 0 && (
              <div className="text-center py-[50px] px-5">
                <i className="fa-regular fa-rectangle-list block text-[40px] text-[#d1d5db] mb-3"></i>
                <h3 className="text-[15px] text-[#374151] mb-1.5">No listings yet</h3>
                <p className="text-[11px] text-[#6b7280] mb-[15px]">Start selling your components today!</p>
                <Link to="/sell" className="inline-flex items-center justify-center h-8 px-3.5 bg-[#08a568] text-white rounded-md no-underline text-[11px] font-semibold">Add New Component</Link>
              </div>
            )}

            {/* Listing rows */}
            {products.map(product => (
              <div
                className={`min-h-[58px] grid items-center px-2.5 border-b border-[#eeeeee] last:border-b-0 cursor-pointer ${gridCols}`}
                key={product.product_id}
                onClick={() => navigate(`/productDetails/${product.product_id}`)}
              >
                {/* Product image and name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded bg-[#f5f5f5] flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={product.image_url} alt={product.product_name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[11px] font-medium whitespace-nowrap overflow-hidden text-ellipsis">{product.product_name}</span>
                </div>

                {/* Price */}
                <div className="text-[11px] font-semibold">₹{product.Price}</div>

                {/* Status badge */}
                <div className="text-[10px] font-semibold text-[#08a568]">Available</div>

                {/* View count */}
                <div className="text-[11px] text-[#333]">{product.views || 0}</div>

                {/* Action buttons: edit and delete */}
                <div className="flex items-center gap-[7px]">
                  <Link to={`/editComponent/${product.product_id}`} onClick={(e) => e.stopPropagation()}>
                    <button className="w-[25px] h-[25px] rounded-md flex items-center justify-center cursor-pointer bg-white text-[11px] border border-[#d7eee5] text-[#08a568] hover:bg-[#eaf8f3]" type="button">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                  </Link>

                  <button
                    className="w-[25px] h-[25px] rounded-md flex items-center justify-center cursor-pointer bg-white text-[11px] border border-[#f2d9d9] text-[#e55b5b] hover:bg-[#fff1f1]"
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