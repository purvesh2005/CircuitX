import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BrowsePage from './pages/BrowsePage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import DashboardPage from './pages/DashboardPage'
import WishlistPage from './pages/WishlistPage'
import CategoriesPage from './pages/CategoriesPage'
import AddComponentPage from './pages/AddComponentPage'
import EditComponentPage from './pages/EditComponentPage'
import ProfilePage from './pages/ProfilePage'


/**
 * AppContent component
 * Sets up the main application layout with Navbar, routed pages, and Footer.
 * The Navbar is hidden on login and register pages for a cleaner auth experience.
 */
function AppContent() {

  const location = useLocation()

  // Hide the navbar on authentication pages (login/register)
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register"

  return (
    <>
      {/* Navbar - hidden on login/register pages */}
      {!hideNavbar && <Navbar />}

      {/* Main content area - all application routes are defined here */}
      <main>
        <Routes>
          {/* Redirect root "/" to the home page */}
          <Route path="/" element={<Navigate to="/home" />} />

          {/* Page routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/browse" element={<BrowsePage />} />

          {/* Product details - :id is the product ID from the URL */}
          <Route path="/productDetails/:id" element={<ProductDetailsPage />} />

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/sell" element={<AddComponentPage />} />
          <Route path="/editComponent/:id" element={<EditComponentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      {/* Footer - displayed on all pages */}
      <Footer />
    </>
  )
}


/**
 * App - Root component
 * Wraps the entire application in AuthProvider to provide
 * authentication state (user, login, logout, register) to all child components.
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App