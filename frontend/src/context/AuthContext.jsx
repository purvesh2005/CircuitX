import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.user)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    setUser(res.data.user)
    return res.data
  }

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  }

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

export function useAuth() {
  return useContext(AuthContext)
}