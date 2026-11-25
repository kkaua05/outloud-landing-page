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
