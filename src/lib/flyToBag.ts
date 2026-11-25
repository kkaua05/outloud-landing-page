import { prefersReducedMotion } from './media'

const FLIGHT_MS = 760
/** Product photo proportions (640 × 991). */
const IMAGE_RATIO = 991 / 640

const isOnScreen = (rect: DOMRect) =>
  rect.width > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth

/**
 * Resting position of the header bag button, even while the header is
 * tucked away above the viewport (it slides back when the bag opens).
 */
function bagTargetRect(target: HTMLElement) {
  const rect = target.getBoundingClientRect()
  const header = target.closest('header')
  const offset = header ? Math.max(0, -header.getBoundingClientRect().top) : 0
  return { x: rect.left + rect.width / 2, y: rect.top + offset + rect.height / 2 }
}

/**
 * Flies a thumbnail of the product from the first visible source element
 * into the header bag, then bumps the bag. Resolves when the flight ends
 * (immediately when motion is reduced or nothing can be measured), so the
 * caller can open the bag afterwards.
 */
export function flyToBag(sources: Array<Element | null | undefined>, imageSrc: string): Promise<void> {
  const target = document.querySelector<HTMLElement>('[data-bag-target]')
  if (!target || prefersReducedMotion() || typeof document.body.animate !== 'function') {
    return Promise.resolve()
  }

  const from = sources
    .filter((source): source is Element => Boolean(source))
    .map((source) => source.getBoundingClientRect())
    .find(isOnScreen)
  if (!from) return Promise.resolve()

  const to = bagTargetRect(target)
  const width = Math.min(from.width * 0.5, 220)
  const height = width * IMAGE_RATIO
  const start = { x: from.left + from.width / 2, y: from.top + from.height / 2 }
  const dx = to.x - start.x
  const dy = to.y - start.y
  // Arc: the shoe lifts before diving into the bag.
  const lift = Math.min(160, Math.abs(dy) * 0.35 + 60)

  const ghost = document.createElement('img')
  ghost.src = imageSrc
  ghost.alt = ''
  ghost.setAttribute('aria-hidden', 'true')
  ghost.className = 'bag-flight'
  Object.assign(ghost.style, {
    left: `${start.x}px`,
    top: `${start.y}px`,
    width: `${width}px`,
    height: `${height}px`,
  })
  document.body.append(ghost)

  const base = 'translate(-50%, -50%)'
  const flight = ghost.animate(
    [
      { transform: `${base} translate(0, 0) scale(1) rotate(0deg)`, opacity: 1 },
      {
        transform: `${base} translate(${dx * 0.42}px, ${dy * 0.42 - lift}px) scale(0.6) rotate(-16deg)`,
        opacity: 1,
        offset: 0.45,
      },
      { transform: `${base} translate(${dx}px, ${dy}px) scale(0.08) rotate(-32deg)`, opacity: 0.5 },
    ],
    { duration: FLIGHT_MS, easing: 'cubic-bezier(0.55, 0, 0.35, 1)', fill: 'forwards' },
  )

  return flight.finished
    .then(() => {
      target.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.22)' }, { transform: 'scale(1)' }],
        { duration: 460, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      )
    })
    .catch(() => undefined)
    .finally(() => ghost.remove())
}
