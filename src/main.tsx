import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import App from './App.tsx'
import { CartProvider } from './cart/CartProvider.tsx'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element #root not found in index.html.')
}

createRoot(container).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)
