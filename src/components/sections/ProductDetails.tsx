import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useCart } from '../../cart/useCart'
import { useBuyBarVisibility } from '../../hooks/useBuyBarVisibility'
import { siteConfig } from '../../config/site'
import { flyToBag } from '../../lib/flyToBag'
import { formatPrice } from '../../lib/format'
import { prefersReducedMotion } from '../../lib/media'
import { productImage } from '../../lib/productImage'
import { ProductGallery } from '../product/ProductGallery'
import { SizeSelector } from '../product/SizeSelector'
import { StickyBuyBar } from '../product/StickyBuyBar'
import { Button } from '../ui/Button'
import { CornerMarks, Sparkle } from '../ui/Decor'
import { BagIcon, CheckIcon } from '../ui/Icons'
import './ProductDetails.css'

const { product } = siteConfig

const SIZE_ERROR = 'Select a size to add this pair to your bag.'

export function ProductDetails() {
  const { addItem, openCart } = useCart()
  const [size, setSize] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [justAdded, setJustAdded] = useState(false)
  const selectorRef = useRef<HTMLFieldSetElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const purchaseRef = useRef<HTMLDivElement>(null)
  const buyBarVisible = useBuyBarVisibility(purchaseRef)

  useEffect(() => {
    if (!justAdded) return
    const timer = window.setTimeout(() => setJustAdded(false), 2200)
    return () => window.clearTimeout(timer)
  }, [justAdded])

  const handleSizeChange = (next: string) => {
    setSize(next)
    setError(null)
  }

  const flagMissingSize = () => {
    setError(SIZE_ERROR)
    const selector = selectorRef.current
    if (!selector) return
    selector.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus({ preventScroll: true })
    const reduceMotion = prefersReducedMotion()
    selector.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
    if (!reduceMotion) {
      selector.querySelector('.size-selector__grid')?.animate(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-8px)' },
          { transform: 'translateX(7px)' },
          { transform: 'translateX(-4px)' },
          { transform: 'translateX(0)' },
        ],
        { duration: 420, easing: 'ease-out' },
      )
    }
  }

  const handleAdd = (event: MouseEvent<HTMLButtonElement>) => {
    if (!size) {
      flagMissingSize()
      return
    }
    const trigger = event.currentTarget
    // The line is added (and announced) at once; the bag opens when the
    // product lands in it, so the flight is never hidden by the drawer.
    addItem(size, { open: false })
    setJustAdded(true)
    void flyToBag([stageRef.current?.querySelector('.gallery__main'), trigger], productImage.thumb).then(
      openCart,
    )
  }

  const noSizesAvailable = !product.sizes.some((option) => option.available)

  return (
    <section className="details" id="shop" aria-labelledby="details-title">
      <div className="container details__grid">
        <div ref={stageRef} className="details__stage" data-reveal="fade">
          <CornerMarks />
          <span className="details__stage-word" aria-hidden="true">
            Dunk
          </span>
          <p className="details__stage-meta micro" aria-hidden="true">
            <span>Fig. 02</span>
            <span>{product.colorway}</span>
          </p>
          <Sparkle className="details__stage-spark sparkle--twinkle" />
          <ProductGallery />
        </div>

        <div className="details__info">
          <p className="section-index micro details__index" data-reveal>
            <span className="section-index__num">03</span> The drop
          </p>

          <p className="details__eyebrow micro" data-reveal>
            New drop — {product.colorway}
          </p>

          <h2 id="details-title" className="details__title display" data-reveal>
            {product.name}
          </h2>

          <div className="details__colorway" data-reveal>
            <span className="details__swatches" aria-hidden="true">
              <span className="details__swatch details__swatch--royal" />
              <span className="details__swatch details__swatch--white" />
            </span>
            <span className="details__colorway-name">{product.colorway}</span>
            <span className="details__colorway-tones micro">Royal blue / White</span>
          </div>

          <p className="details__summary" data-reveal>
            {product.summary}
          </p>

          <div ref={purchaseRef} className="details__purchase" data-reveal>
            <div className="details__price-row">
              <span className="micro details__price-label">Price</span>
              <p className={['details__price', product.price === null && 'is-on-request'].filter(Boolean).join(' ')}>
                {formatPrice(product.price)}
              </p>
            </div>

            <SizeSelector
              ref={selectorRef}
              sizes={product.sizes}
              system={product.sizeSystem}
              value={size}
              onChange={handleSizeChange}
              error={error}
            />

            <Button
              variant="royal"
              block
              className={['details__add', justAdded && 'is-added'].filter(Boolean).join(' ')}
              onClick={handleAdd}
              disabled={noSizesAvailable}
              icon={justAdded ? <CheckIcon size={18} /> : <BagIcon size={18} />}
            >
              {justAdded ? 'Added to bag' : 'Add to bag'}
            </Button>

            <p className="details__note micro">Your bag is saved on this device.</p>
          </div>
        </div>
      </div>

      <StickyBuyBar
        visible={buyBarVisible}
        size={size}
        justAdded={justAdded}
        disabled={noSizesAvailable}
        onAdd={handleAdd}
      />
    </section>
  )
}
