import type { CartItem } from '../../cart/cartStore'
import { siteConfig } from '../../config/site'
import { formatPrice } from '../../lib/format'
import { productImage } from '../../lib/productImage'
import { QuantityStepper } from './QuantityStepper'

const { product } = siteConfig

interface CartLineItemProps {
  item: CartItem
  onQuantityChange: (size: string, quantity: number) => void
  onRemove: (size: string) => void
}

export function CartLineItem({ item, onQuantityChange, onRemove }: CartLineItemProps) {
  const sizeLabel = `size ${item.size}`
  const lineTotal = product.price === null ? null : product.price * item.quantity

  return (
    <li className="cart-line">
      <div className="cart-line__thumb">
        <img src={productImage.thumb} alt="" width={200} height={310} loading="lazy" decoding="async" />
      </div>

      <div className="cart-line__body">
        <div className="cart-line__head">
          <p className="cart-line__name">{product.name}</p>
          {lineTotal === null ? null : <p className="cart-line__price">{formatPrice(lineTotal)}</p>}
        </div>
        <p className="cart-line__meta micro">
          {product.colorway} · Size {item.size} ({product.sizeSystem})
        </p>

        <div className="cart-line__actions">
          <QuantityStepper
            value={item.quantity}
            max={product.maxQuantityPerLine}
            label={sizeLabel}
            onChange={(quantity) => onQuantityChange(item.size, quantity)}
          />
          <button
            type="button"
            className="cart-line__remove"
            onClick={() => onRemove(item.size)}
            aria-label={`Remove ${product.name} ${sizeLabel} from bag`}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
