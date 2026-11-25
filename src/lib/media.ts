/** Shared media queries: one definition for every motion and pointer decision. */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

const matches = (query: string) =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false

export const prefersReducedMotion = () => matches(REDUCED_MOTION_QUERY)

/** True on mouse/trackpad devices — pointer-driven effects are pointless on touch. */
export const hasFinePointer = () => matches(FINE_POINTER_QUERY)

/** Pointer-driven motion is allowed: precise pointer and no reduced-motion preference. */
export const allowsPointerMotion = () => hasFinePointer() && !prefersReducedMotion()

/**
 * Runs `enable` while pointer-driven motion is allowed and calls the
 * teardown it returns as soon as it is not (e.g. the user switches on
 * reduced motion or plugs in a touch screen). Returns a full cleanup.
 */
export function whilePointerMotionAllowed(enable: () => () => void) {
  const queries = [window.matchMedia(FINE_POINTER_QUERY), window.matchMedia(REDUCED_MOTION_QUERY)]
  let disable: (() => void) | null = null

  const sync = () => {
    if (allowsPointerMotion()) {
      disable ??= enable()
    } else if (disable) {
      disable()
      disable = null
    }
  }

  sync()
  queries.forEach((query) => query.addEventListener('change', sync))
  return () => {
    queries.forEach((query) => query.removeEventListener('change', sync))
    disable?.()
    disable = null
  }
}
