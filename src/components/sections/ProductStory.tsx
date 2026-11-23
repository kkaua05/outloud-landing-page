import type { CSSProperties } from 'react'
import { siteConfig } from '../../config/site'
import { ProductImage } from '../product/ProductImage'
import { CircleBadge, Sparkle } from '../ui/Decor'
import './ProductStory.css'

const { product } = siteConfig

const pillars = [product.colorway, 'Street culture', 'Classic design']

export function ProductStory() {
  return (
    <section className="story" id="collection" aria-labelledby="story-title">
      <div className="container story__grid">
        <p className="story__index section-index micro" data-reveal>
          <span className="section-index__num">02</span> The story
        </p>

        <h2 id="story-title" className="story__title display" data-reveal>
          More than <br />a <span className="story__title-accent">sneaker.</span>
          <Sparkle className="story__title-spark" />
        </h2>

        <p className="story__text" lang="pt-BR" data-reveal style={{ '--reveal-delay': 120 } as CSSProperties}>
          Uma silhueta clássica que atravessa gerações. O contraste entre o azul Royal e o branco
          transforma o Dunk High em uma peça de personalidade, atitude e expressão.
        </p>

        <ul className="story__pillars" aria-label="Highlights">
          {pillars.map((pillar, index) => (
            <li
              key={pillar}
              className="story__pillar"
              data-reveal
              style={{ '--reveal-delay': 160 + index * 90 } as CSSProperties}
            >
              <span className="story__pillar-num micro" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="story__pillar-label">{pillar}</span>
              <Sparkle className="story__pillar-spark" />
            </li>
          ))}
        </ul>

        <figure className="story__visual" data-reveal="scale">
          <div className="story__frame">
            <span className="story__frame-word" aria-hidden="true">
              Dunk High
            </span>
          </div>
          <ProductImage
            className="story__shoe"
            sizes="(max-width: 900px) 70vw, 32vw"
            alt={`${product.name} ${product.colorway}, shown at an angle against a royal blue arch`}
          />
          <CircleBadge
            className="story__badge circle-badge--pink"
            words={['Classic silhouette', 'Unmistakable attitude']}
          />
          <Sparkle className="story__spark sparkle--twinkle" />
          <figcaption className="story__caption micro">
            Fig. 01 — {product.name} / {product.colorway}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
