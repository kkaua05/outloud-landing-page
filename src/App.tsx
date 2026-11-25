import { useCallback, useEffect, useState } from 'react'
import { useCart } from './cart/useCart'
import { CartDrawer } from './components/cart/CartDrawer'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { MobileMenu } from './components/layout/MobileMenu'
import { BrandStatement } from './components/sections/BrandStatement'
import { CampaignSection } from './components/sections/CampaignSection'
import { HeroSection } from './components/sections/HeroSection'
import { ProductDetails } from './components/sections/ProductDetails'
import { ProductStory } from './components/sections/ProductStory'
import { CursorFollower } from './components/ui/CursorFollower'
import { useMagneticButtons } from './hooks/useMagneticButtons'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'

const DESKTOP_QUERY = '(min-width: 901px)'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isOpen: cartOpen } = useCart()
  const overlayOpen = menuOpen || cartOpen

  useRevealOnScroll()
  useMagneticButtons()

  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // The mobile menu does not exist on desktop layouts — close it if the viewport grows.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY)
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="app" inert={overlayOpen}>
        <Header menuOpen={menuOpen} onMenuOpen={openMenu} />
        <main id="main" tabIndex={-1}>
          <HeroSection />
          <ProductStory />
          <ProductDetails />
          <CampaignSection />
          <BrandStatement />
        </main>
        <Footer />
      </div>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
      <CartDrawer />
      <CursorFollower />
    </>
  )
}
