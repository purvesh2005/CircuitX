import axios from 'axios'

/**
 * Axios instance configured for the CircuitX API.
 *
 * - baseURL: All requests will be prefixed with '/api'
 *            (e.g., api.get('/products') becomes GET /api/products)
 * - withCredentials: Sends cookies with requests so the backend
 *                    can maintain session-based authentication.
 */
const api = axios.create({
  baseURL: '/api',
  withCredentials: true
})

export default api