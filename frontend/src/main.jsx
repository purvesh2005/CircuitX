import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Entry point of the React application
// - ReactDOM.createRoot: Creates a React root for concurrent rendering
// - BrowserRouter: Enables client-side routing using the History API
// - React.StrictMode: Helps detect potential problems in the app during development
// - App: The main application component containing all routes and providers
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)