import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

// Resolve the directory path for the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Vite configuration for the CircuitX frontend.
 *
 * - root: Sets the frontend folder as the root directory
 * - plugins: Enables React JSX support and Tailwind CSS processing
 * - server.port: Dev server runs on port 5173
 * - server.proxy: Forwards '/api' requests to the backend on port 8080
 *                 so the frontend can call API endpoints without CORS issues
 */
export default defineConfig({
  root: __dirname,
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        credentials: true
      }
    }
  }
})