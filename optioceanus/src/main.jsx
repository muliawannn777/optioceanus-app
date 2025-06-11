import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import { AuthProvider } from './AuthContext.jsx' // Impor AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider> {/* Bungkus App dengan AuthProvider */}
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
