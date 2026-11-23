import { siteConfig } from '../config/site'

const { currency, locale } = siteConfig.product

let formatter: Intl.NumberFormat | null = null

function getFormatter() {
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale, { style: 'currency', currency })
    } catch {
      // Invalid locale/currency in config — fall back to a neutral format.
      formatter = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }
  return formatter
}

/** Formats a price, or returns the “on request” label when no price is configured. */
export function formatPrice(amount: number | null): string {
  return amount === null ? 'Price on request' : getFormatter().format(amount)
}
