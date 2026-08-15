import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/productDetails/:id" element={<ProductDetailsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/sell" element={<AddComponentPage />} />
          <Route path="/editComponent/:id" element={<EditComponentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  )
}

export default App