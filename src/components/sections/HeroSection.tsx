import { useRef, type CSSProperties } from 'react'
import { siteConfig } from '../../config/site'
import { useFitText } from '../../hooks/useFitText'
import { usePointerParallax } from '../../hooks/usePointerParallax'
import { dropStartsAt } from '../../lib/drop'
import { HERO_IMAGE_SIZES } from '../../lib/productImage'
import { ProductImage } from '../product/ProductImage'
import { ButtonLink } from '../ui/Button'
import { CircleBadge, Orbit, Sparkle, SpeedLines } from '../ui/Decor'
import { DropCountdown } from '../ui/DropCountdown'
import { ArrowDownIcon, ArrowRightIcon } from '../ui/Icons'
import { Marquee } from '../ui/Marquee'
import './HeroSection.css'

const { brand, product } = siteConfig

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const wordmarkRef = useRef<HTMLSpanElement>(null)
  // The fitted size is shared on the section: spacing around the product depends on it.
  useFitText(wordmarkRef, heroRef)
  // Pointer position drives the product tilt and the depth of the decor layers.
  usePointerParallax(heroRef)

  return (
    <section ref={heroRef} className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__meta">
          {dropStartsAt === null ? (
            <p className="hero__tag micro">
              <span className="hero__tag-dot" aria-hidden="true" />
              New drop — {product.colorway}
            </p>
          ) : (
            <DropCountdown className="hero__tag" />
          )}
          <div className="hero__meta-group">
            <p className="hero__meta-item micro">
              <Sparkle className="hero__meta-spark" /> Street culture
            </p>
            <p className="hero__meta-item hero__meta-item--tones micro">Royal blue / White</p>
          </div>
        </div>

        <div className="hero__visual">
          {/* The brand wordmark works as a graphic layer behind the product. */}
          <p className="hero__wordmark" aria-hidden="true">
            <span className="hero__wordmark-line hero__wordmark-line--echo">{brand.name}</span>
            <span ref={wordmarkRef} className="hero__wordmark-line hero__wordmark-line--main">
              {Array.from(brand.name).map((letter, index) => (
                <span key={index} className="hero__letter" style={{ '--i': index } as CSSProperties}>
                  {letter}
                </span>
              ))}
            </span>
            <span className="hero__wordmark-line hero__wordmark-line--echo">{brand.name}</span>
          </p>

          <div className="hero__stage">
            <Orbit className="hero__orbit" />
            <SpeedLines className="hero__speed" />
            <div className="hero__product">
              <div className="hero__tilt">
                <div className="hero__float">
                  <ProductImage priority sizes={HERO_IMAGE_SIZES} className="hero__shoe" />
                </div>
              </div>
              <span className="hero__shadow" aria-hidden="true" />
            </div>
            <CircleBadge
              className="hero__badge"
              words={['New drop', product.colorway, 'Make your move']}
            />
            <Sparkle className="hero__spark hero__spark--a sparkle--twinkle" />
            <Sparkle
              className="hero__spark hero__spark--b sparkle--twinkle"
              style={{ '--twinkle-delay': '1.2s' } as CSSProperties}
            />
            <Sparkle
              className="hero__spark hero__spark--c sparkle--twinkle"
              style={{ '--twinkle-delay': '2.1s' } as CSSProperties}
            />
          </div>
        </div>

        <div className="hero__bottom">
          <div className="hero__copy">
            <h1 id="hero-title" className="hero__title display">
              Make your <span className="hero__title-accent">move.</span>
            </h1>
            <p className="hero__sub">Classic silhouette. Unmistakable attitude.</p>
            <div className="hero__ctas">
              <ButtonLink variant="cream" href="#shop" icon={<ArrowRightIcon size={18} />}>
                Shop the drop
              </ButtonLink>
              <ButtonLink variant="ghost" href="#collection">
                Explore the collection
              </ButtonLink>
            </div>
          </div>

          <div className="hero__aside">
            <p className="hero__index micro">
              <span>{product.name}</span>
              <span>{product.colorway}</span>
            </p>
            <a href="#collection" className="hero__scroll micro">
              Scroll
              <span className="hero__scroll-icon" aria-hidden="true">
                <ArrowDownIcon size={16} />
              </span>
            </a>
          </div>
        </div>
      </div>

      <Marquee
        className="hero__marquee"
        tilt={-2}
        items={[
          'New drop',
          product.colorway,
          'Make your move',
          'Classic silhouette',
          'Unmistakable attitude',
        ]}
      />
    </section>
  )
}
