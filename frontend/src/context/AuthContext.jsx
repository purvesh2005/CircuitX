import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../api'

// Create a React Context for authentication state
// This will be used to provide/consume auth-related data across the app
const AuthContext = createContext()

/**
 * AuthProvider Component
 * Wraps the entire application and provides authentication state and functions.
 *
 * Available via useAuth() hook:
 * - user: The currently logged-in user object (or null)
 * - setUser: Directly update the user state
 * - loading: Whether the initial auth check is still in progress
 * - login(email, password): Logs in a user and stores their session
 * - register(formData): Registers a new user
 * - logout(): Logs out the current user
 * - checkAuth(): Verifies if the user has an active session
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On component mount, check if the user already has an active session
  useEffect(() => {
    checkAuth()
  }, [])

  /**
   * Calls the /auth/me endpoint to check if the server
   * has a valid session for the current browser (via cookies).
   * If valid, the user data is stored in state.
   */
  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.user)
    } catch (err) {
      // No active session - user is logged out
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Log in a user with email and password.
   * Throws an error if login fails so the caller can handle it.
   */
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    setUser(res.data.user)
    return res.data
  }

  /**
   * Register a new user.
   * Sends form data (including profile image upload) to the backend.
   */
  const register = async (formData) => {
    const res = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  }

  /**
   * Log out the current user by calling the backend
   * and clearing the local user state.
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.log('Logout error:', err)
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to easily access authentication state and functions.
 * Usage: const { user, login, logout } = useAuth()
 */
export function useAuth() {
  return useContext(AuthContext)
}