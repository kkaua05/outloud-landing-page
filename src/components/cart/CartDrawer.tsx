import { useEffect, useRef, type MouseEvent } from 'react'
import { useCart } from '../../cart/useCart'
import { siteConfig } from '../../config/site'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useScrollLock } from '../../hooks/useScrollLock'
import { formatPrice } from '../../lib/format'
import { scrollToHash } from '../../lib/scroll'
import { Button, ButtonLink } from '../ui/Button'
import { Sparkle } from '../ui/Decor'
import { ArrowRightIcon, CloseIcon, MailIcon } from '../ui/Icons'
import { CartLineItem } from './CartLineItem'
import './CartDrawer.css'

export function CartDrawer() {
  const { items, isOpen, closeCart, itemCount, subtotal, setQuantity, removeItem } = useCart()
  const panelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const previousLineCount = useRef(items.length)

  useFocusTrap(panelRef, isOpen, closeCart)
  useScrollLock(isOpen)

  // When a line disappears its controls go with it — keep focus in the dialog.
  useEffect(() => {
    if (isOpen && items.length < previousLineCount.current) {
      titleRef.current?.focus()
    }
    previousLineCount.current = items.length
  }, [items.length, isOpen])

  const goToShop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    closeCart()
    requestAnimationFrame(() => scrollToHash('#shop'))
  }

  const { checkoutUrl } = siteConfig.commerce
  // Until checkout exists, a configured contact email turns the dead end into a lead.
  const notifyHref = siteConfig.contact.email
    ? `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
        `Notify me: ${siteConfig.product.name} ${siteConfig.product.colorway}`,
      )}&body=${encodeURIComponent(
        `Hi! Please let me know when the ${siteConfig.product.name} “${siteConfig.product.colorway}” is available.\n\nSizes I'm interested in: ${items.map((item) => item.size).join(', ')}`,
      )}`
    : null

  return (
    <div
      className={['cart', isOpen && 'is-open'].filter(Boolean).join(' ')}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div className="cart__backdrop" onClick={closeCart} />

      <div
        ref={panelRef}
        className="cart__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="cart__header">
          <h2 id="cart-title" ref={titleRef} tabIndex={-1} className="cart__title display">
            Your bag
            <span className="cart__count" aria-label={`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}>
              {itemCount}
            </span>
          </h2>
          <button
            type="button"
            className="icon-button cart__close"
            onClick={closeCart}
            aria-label="Close bag"
            data-autofocus
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart__empty">
            <Sparkle className="cart__empty-spark" />
            <p className="cart__empty-title display">Your bag is empty.</p>
            <p className="cart__empty-text">Pick your size and make your move.</p>
            <ButtonLink variant="royal" href="#shop" onClick={goToShop} icon={<ArrowRightIcon size={18} />}>
              Shop the drop
            </ButtonLink>
          </div>
        ) : (
          <>
            <ul className="cart__lines" aria-label="Items in your bag">
              {items.map((item) => (
                <CartLineItem
                  key={`${item.productId}-${item.size}`}
                  item={item}
                  onQuantityChange={setQuantity}
                  onRemove={removeItem}
                />
              ))}
            </ul>

            <div className="cart__footer">
              <div className="cart__summary">
                <span className="micro">
                  Subtotal · {itemCount} {itemCount === 1 ? 'pair' : 'pairs'}
                </span>
                <span className={['cart__subtotal', subtotal === null && 'is-on-request'].filter(Boolean).join(' ')}>
                  {formatPrice(subtotal)}
                </span>
              </div>

              {checkoutUrl ? (
                <ButtonLink variant="royal" block href={checkoutUrl} icon={<ArrowRightIcon size={18} />}>
                  Checkout
                </ButtonLink>
              ) : (
                <>
                  <Button variant="royal" block disabled aria-describedby="checkout-note">
                    Checkout
                  </Button>
                  <p id="checkout-note" className="cart__note">
                    Online checkout isn’t available yet.
                    {import.meta.env.DEV ? ' (Dev: set commerce.checkoutUrl in src/config/site.ts.)' : null}
                  </p>
                  {notifyHref ? (
                    <ButtonLink variant="ghost" block href={notifyHref} icon={<MailIcon size={18} />}>
                      Notify me at launch
                    </ButtonLink>
                  ) : null}
                </>
              )}

              <button type="button" className="cart__continue" onClick={closeCart}>
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
