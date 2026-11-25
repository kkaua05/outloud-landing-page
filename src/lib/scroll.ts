import { prefersReducedMotion } from './media'

/**
 * Smooth-scrolls to an in-page anchor and moves keyboard focus there,
 * mirroring native anchor behaviour. Used when an overlay (menu, bag)
 * must close before navigating.
 */
export function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, '')
  const target = document.getElementById(id)
  if (!target) return

  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })

  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })

  if (window.location.hash !== `#${id}`) {
    window.history.pushState(null, '', `#${id}`)
  }
}
