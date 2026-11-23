import { useRef, type CSSProperties, type MouseEvent } from 'react'
import { navItems } from '../../config/navigation'
import { siteConfig } from '../../config/site'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useScrollLock } from '../../hooks/useScrollLock'
import { scrollToHash } from '../../lib/scroll'
import { ButtonLink } from '../ui/Button'
import { Sparkle } from '../ui/Decor'
import { ArrowRightIcon, CloseIcon } from '../ui/Icons'
import './MobileMenu.css'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useFocusTrap(panelRef, open, onClose)
  useScrollLock(open)

  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    onClose()
    requestAnimationFrame(() => scrollToHash(href))
  }

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      className={['mobile-menu', open && 'is-open'].filter(Boolean).join(' ')}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="mobile-menu__top">
        <span className="mobile-menu__logo">{siteConfig.brand.name}</span>
        <button type="button" className="icon-button mobile-menu__close" onClick={onClose} aria-label="Close menu">
          <CloseIcon size={20} />
        </button>
      </div>

      <nav className="mobile-menu__nav" aria-label="Mobile">
        <ol className="mobile-menu__list">
          {navItems.map((item, index) => (
            <li key={item.href} className="mobile-menu__item" style={{ '--i': index } as CSSProperties}>
              <a href={item.href} className="mobile-menu__link" onClick={(event) => navigate(event, item.href)}>
                <span className="mobile-menu__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mobile-menu__footer">
        <p className="mobile-menu__drop micro">
          <span className="drop-badge__dot" aria-hidden="true" />
          New drop — {siteConfig.product.colorway}
        </p>
        <ButtonLink
          variant="cream"
          href="#shop"
          block
          icon={<ArrowRightIcon size={18} />}
          onClick={(event) => navigate(event, '#shop')}
        >
          Shop the drop
        </ButtonLink>
      </div>

      <Sparkle className="mobile-menu__spark mobile-menu__spark--a" />
      <Sparkle className="mobile-menu__spark mobile-menu__spark--b" />
    </div>
  )
}
