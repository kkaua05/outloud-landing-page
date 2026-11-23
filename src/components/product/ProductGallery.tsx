import { useState, type CSSProperties } from 'react'
import { productImage } from '../../lib/productImage'
import { ProductImage } from './ProductImage'
import './ProductGallery.css'

interface GalleryView {
  id: string
  label: string
  /** Zoom factor and focal point (percent of the image) for this view. */
  scale: number
  x: number
  y: number
}

/**
 * Detail views are crops of the single product photograph — no angles
 * that do not exist in the source imagery are suggested.
 */
const views: GalleryView[] = [
  { id: 'full', label: 'Full view', scale: 1, x: 50, y: 50 },
  { id: 'collar', label: 'Collar', scale: 1.9, x: 34, y: 10 },
  { id: 'side', label: 'Side panel', scale: 1.8, x: 30, y: 52 },
  { id: 'outsole', label: 'Outsole', scale: 1.8, x: 84, y: 66 },
]

const zoomStyle = (view: GalleryView) =>
  ({ transformOrigin: `${view.x}% ${view.y}%`, transform: `scale(${view.scale})` }) as CSSProperties

export function ProductGallery() {
  const [activeId, setActiveId] = useState(views[0].id)
  const active = views.find((view) => view.id === activeId) ?? views[0]

  return (
    <div className="gallery">
      <div className="gallery__main">
        <div
          className={['gallery__zoom', active.scale > 1 && 'is-zoomed'].filter(Boolean).join(' ')}
          style={zoomStyle(active)}
        >
          <ProductImage
            className="gallery__image"
            sizes="(max-width: 900px) 78vw, 34vw"
            alt={active.id === 'full' ? productImage.alt : `${productImage.alt} — ${active.label.toLowerCase()} detail`}
          />
        </div>
      </div>

      <div className="gallery__thumbs" role="group" aria-label="Product views">
        {views.map((view) => {
          const isActive = view.id === activeId
          return (
            <button
              key={view.id}
              type="button"
              className={['gallery__thumb', isActive && 'is-active'].filter(Boolean).join(' ')}
              aria-pressed={isActive}
              onClick={() => setActiveId(view.id)}
            >
              <span className="gallery__thumb-frame">
                <img
                  src={productImage.thumb}
                  alt=""
                  width={200}
                  height={310}
                  loading="lazy"
                  decoding="async"
                  style={zoomStyle(view)}
                />
              </span>
              <span className="gallery__thumb-label micro">{view.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
