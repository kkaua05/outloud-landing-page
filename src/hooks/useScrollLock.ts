import { useEffect } from 'react'

/*
 * Shared across every overlay: with a single counter, closing one overlay
 * while another is still open never re-enables page scrolling, regardless
 * of the order in which they open and close.
 */
let lockCount = 0
let previousOverflow = ''

/** Prevents the page behind an overlay from scrolling while `active`. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const root = document.documentElement
    if (lockCount === 0) {
      previousOverflow = root.style.overflow
      root.style.overflow = 'hidden'
    }
    lockCount += 1
    return () => {
      lockCount -= 1
      if (lockCount === 0) root.style.overflow = previousOverflow
    }
  }, [active])
}
