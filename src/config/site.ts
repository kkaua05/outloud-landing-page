/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — single source of truth
 * ─────────────────────────────────────────────────────────────
 *  Brand name, product data, pricing, sizes, contact channels and
 *  checkout live here. Everything in the UI (and the <head> meta
 *  tags in index.html, via vite.config.ts) reads from this file.
 *
 *  Commercial fields are intentionally left empty: fill them with
 *  real information before going live. Empty values render as
 *  neutral, honest fallbacks — nothing is invented.
 */

export interface SizeOption {
  /** Label shown on the selector, e.g. "40". */
  label: string
  /** Set to false to render the size as unavailable. */
  available: boolean
}

const brandName = 'OUTLOUD'

export const siteConfig = {
  brand: {
    name: brandName,
    tagline: 'Not made to blend in.',
  },

  seo: {
    title: `${brandName} — Nike Dunk High “Game Royal” | New Drop`,
    description:
      'Nike Dunk High in Game Royal: royal blue and white, presented by ' +
      `${brandName}. Classic silhouette. Unmistakable attitude. Make your move.`,
    /** Absolute production URL (e.g. "https://outloud.com"). Used for Open Graph. */
    siteUrl: '',
  },

  product: {
    id: 'nike-dunk-high-game-royal',
    name: 'Nike Dunk High',
    colorway: 'Game Royal',
    summary:
      'The high-top silhouette in its most recognisable contrast — royal blue ' +
      'overlays on a crisp white base. Built for the street, made to be seen.',
    /**
     * Unit price. `null` shows “Price on request” everywhere.
     * Example: 999.99
     */
    price: null as number | null,
    currency: 'BRL',
    /** Locale used to format the price. */
    locale: 'pt-BR',
    /** Label shown next to sizes, e.g. "BR", "US", "EU". */
    sizeSystem: 'BR',
    /**
     * Sizes offered on the selector. Availability is NOT connected to
     * real stock — set `available: false` manually for sold-out sizes.
     */
    sizes: [
      { label: '37', available: true },
      { label: '38', available: true },
      { label: '39', available: true },
      { label: '40', available: true },
      { label: '41', available: true },
      { label: '42', available: true },
      { label: '43', available: true },
      { label: '44', available: true },
    ] satisfies SizeOption[],
    /** UI guard for the quantity stepper in the bag. */
    maxQuantityPerLine: 10,
  },

  commerce: {
    /**
     * External checkout URL (Shopify, Stripe Payment Link, etc.).
     * Empty = checkout is shown as “not available yet”. No payment
     * flow is simulated.
     */
    checkoutUrl: '',
  },

  contact: {
    /** e.g. "hello@yourbrand.com" — empty renders “coming soon”. */
    email: '',
    /** e.g. "@outloud" */
    instagramHandle: '',
    /** e.g. "https://www.instagram.com/outloud" */
    instagramUrl: '',
  },

  legal: {
    trademarkNotice: 'Nike and Dunk are trademarks of Nike, Inc.',
  },
}

export type SiteConfig = typeof siteConfig
