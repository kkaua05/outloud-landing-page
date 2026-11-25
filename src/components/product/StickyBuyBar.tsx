import type { MouseEvent } from 'react'
import { siteConfig } from '../../config/site'
import { formatPrice } from '../../lib/format'
import { productImage } from '../../lib/productImage'
import { Button } from '../ui/Button'
import { BagIcon, CheckIcon } from '../ui/Icons'
import './StickyBuyBar.css'

const { product } = siteConfig

interface StickyBuyBarProps {
  visible: boolean
  size: string | null
  justAdded: boolean
  disabled: boolean
  onAdd: (event: MouseEvent<HTMLButtonElement>) => void
}

/**
 * Mobile quick-buy bar: keeps the purchase one tap away once the product
 * block has scrolled out of view. Hidden on desktop, where the product
 * stage is sticky and the header bag is always reachable.
 */
export function StickyBuyBar({ visible, size, justAdded, disabled, onAdd }: StickyBuyBarProps) {
  const label = justAdded ? 'Added' : size ? 'Add to bag' : 'Select size'
  return (
    <div
      className={['buy-bar', visible && 'is-visible'].filter(Boolean).join(' ')}
      role="region"
      aria-label="Quick purchase"
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="buy-bar__thumb">
        <img src={productImage.thumb} alt="" width={200} height={310} loading="lazy" decoding="async" />
      </div>
      <div className="buy-bar__info">
        <p className="buy-bar__name">
          {product.name} <span className="buy-bar__colorway">{product.colorway}</span>
        </p>
        <p className="buy-bar__meta micro">
          {size ? `Size ${size} · ` : null}
          {formatPrice(product.price)}
        </p>
      </div>
      <Button
        variant="royal"
        className={['buy-bar__cta', justAdded && 'is-added'].filter(Boolean).join(' ')}
        onClick={onAdd}
        disabled={disabled}
        icon={justAdded ? <CheckIcon size={16} /> : <BagIcon size={16} />}
      >
        {label}
      </Button>
    </div>
  )
}
