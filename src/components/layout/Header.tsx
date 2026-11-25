import { useCart } from '../../cart/useCart'
import { navItems, sectionIds } from '../../config/navigation'
import { siteConfig } from '../../config/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useHeaderState } from '../../hooks/useHeaderState'
import { Sparkle } from '../ui/Decor'
import { BagIcon } from '../ui/Icons'
import './Header.css'

interface HeaderProps {
  menuOpen: boolean
  onMenuOpen: () => void
}

export function Header({ menuOpen, onMenuOpen }: HeaderProps) {
  const { scrolled, hidden } = useHeaderState()
  const activeSection = useActiveSection(sectionIds)
  const { itemCount, openCart, isOpen: cartOpen } = useCart()
  const isHidden = hidden && !menuOpen && !cartOpen
  const brand = siteConfig.brand.name

  return (
    <header
      className={['site-header', scrolled && 'is-scrolled', isHidden && 'is-hidden']
        .filter(Boolean)
        .join(' ')}
    >
      <div className="site-header__inner">
        <a href="#top" className="logo" aria-label={`${brand} — back to top`}>
          <span className="logo__word">{brand}</span>
          <Sparkle className="logo__spark" />
        </a>

        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__list">
            {navItems.map((item) => {
              const isActive = item.sections.includes(activeSection)
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={['site-nav__link', isActive && 'is-active'].filter(Boolean).join(' ')}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="site-header__actions">
          <a href="#shop" className="drop-badge">
            <span className="drop-badge__dot" aria-hidden="true" />
            <span>
              New<span className="drop-badge__extra"> drop</span>
            </span>
          </a>

          <button
            type="button"
            className="icon-button bag-button"
            onClick={openCart}
            aria-haspopup="dialog"
            aria-label={`Open bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            data-bag-target
          >
            <BagIcon size={20} />
            {itemCount > 0 ? (
              <span key={itemCount} className="bag-button__count" aria-hidden="true">
                {itemCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            className="icon-button menu-toggle"
            onClick={onMenuOpen}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
          >
            <span className="menu-toggle__bars" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
