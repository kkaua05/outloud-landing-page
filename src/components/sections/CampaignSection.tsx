import type { CSSProperties } from 'react'
import { siteConfig } from '../../config/site'
import { ProductImage } from '../product/ProductImage'
import { ButtonLink } from '../ui/Button'
import { CornerMarks, Sparkle, SpeedLines } from '../ui/Decor'
import { ArrowRightIcon } from '../ui/Icons'
import { Marquee } from '../ui/Marquee'
import './CampaignSection.css'

const { brand, product } = siteConfig

export function CampaignSection() {
  return (
    <section className="campaign" id="campaign" aria-labelledby="campaign-title">
      <div className="container campaign__inner">
        <CornerMarks className="campaign__marks" />

        <div className="campaign__meta micro" data-reveal="fade">
          <span className="section-index">
            <span className="section-index__num">04</span> Campaign
          </span>
          <span>
            {brand.name} / {product.colorway}
          </span>
        </div>

        <h2 id="campaign-title" className="campaign__title display">
          <span className="campaign__line campaign__line--1" data-reveal>
            Own
          </span>{' '}
          <span
            className="campaign__line campaign__line--2"
            data-reveal
            style={{ '--reveal-delay': 120 } as CSSProperties}
          >
            your
          </span>{' '}
          <span
            className="campaign__line campaign__line--3"
            data-reveal
            style={{ '--reveal-delay': 240 } as CSSProperties}
          >
            style<span className="campaign__dot">.</span>
          </span>
        </h2>

        <div className="campaign__visual" data-reveal="scale">
          <span className="campaign__sun" aria-hidden="true" />
          <span className="campaign__ring" aria-hidden="true" />
          <SpeedLines className="campaign__speed" />
          <ProductImage
            className="campaign__shoe"
            sizes="(max-width: 900px) 64vw, 30vw"
            alt={`${product.name} ${product.colorway} tilted mid-air over a pink circle`}
          />
          <span className="campaign__sticker micro" aria-hidden="true">
            {product.colorway}
          </span>
          <Sparkle className="campaign__spark campaign__spark--a sparkle--twinkle" />
          <Sparkle
            className="campaign__spark campaign__spark--b sparkle--twinkle"
            style={{ '--twinkle-delay': '1.4s' } as CSSProperties}
          />
        </div>

        <div className="campaign__footer" data-reveal>
          <p className="campaign__text">Different energy. Same attitude.</p>
          <ButtonLink variant="ghost-light" href="#shop" icon={<ArrowRightIcon size={18} />}>
            Shop the drop
          </ButtonLink>
        </div>
      </div>

      <Marquee
        className="campaign__marquee"
        variant="cream-outline"
        reverse
        duration={40}
        items={['Own your style', 'Different energy', 'Same attitude', 'Not made to blend in']}
      />
    </section>
  )
}
