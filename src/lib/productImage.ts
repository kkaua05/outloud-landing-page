/**
 * Product photography — Nike Dunk High “Game Royal”.
 * Cut out from the original campaign photo (no recolouring or reshaping),
 * exported as AVIF + WebP. Files live in /public/images so the hero
 * image can be preloaded from index.html.
 */
export const productImage = {
  alt: 'Nike Dunk High in Game Royal: royal blue and white leather high-top sneaker, side view',
  /** Intrinsic size of the largest variant (prevents layout shift). */
  width: 640,
  height: 991,
  avifSrcSet: '/images/dunk-high-game-royal-400.avif 400w, /images/dunk-high-game-royal-640.avif 640w',
  webpSrcSet: '/images/dunk-high-game-royal-400.webp 400w, /images/dunk-high-game-royal-640.webp 640w',
  src: '/images/dunk-high-game-royal-640.webp',
  thumb: '/images/dunk-high-game-royal-200.webp',
} as const

/** Must stay in sync with the <link rel="preload"> in index.html. */
export const HERO_IMAGE_SIZES = '(max-width: 640px) 62vw, (max-width: 1023px) 46vw, 30vw'
