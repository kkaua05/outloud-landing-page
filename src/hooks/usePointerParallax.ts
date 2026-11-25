import { useEffect, type RefObject } from 'react'
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY, allowsPointerMotion } from '../lib/media'

/**
 * Writes the pointer position relative to the element's centre as
 * `--px` / `--py` (−1 → 1) on the element itself. CSS turns those into
 * depth layers (tilt, offsets), so React never re-renders on pointer move.
 * Disabled on touch devices and when the user prefers reduced motion.
 */
export function usePointerParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const queries = [window.matchMedia(FINE_POINTER_QUERY), window.matchMedia(REDUCED_MOTION_QUERY)]
    let frame = 0
    let pending: { x: number; y: number } | null = null
    let attached = false

    const write = (x: number, y: number) => {
      element.style.setProperty('--px', x.toFixed(3))
      element.style.setProperty('--py', y.toFixed(3))
    }

    const flush = () => {
      frame = 0
      if (pending) write(pending.x, pending.y)
      pending = null
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
      const rect = element.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const clamp = (value: number) => Math.max(-1, Math.min(1, value))
      pending = {
        x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1),
        y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1),
      }
      if (!frame) frame = requestAnimationFrame(flush)
    }

    const onLeave = () => {
      pending = { x: 0, y: 0 }
      if (!frame) frame = requestAnimationFrame(flush)
    }

    const attach = () => {
      if (attached) return
      element.addEventListener('pointermove', onMove, { passive: true })
      element.addEventListener('pointerleave', onLeave)
      attached = true
    }

    const detach = () => {
      if (!attached) return
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
      frame = 0
      pending = null
      write(0, 0)
      attached = false
    }

    const sync = () => (allowsPointerMotion() ? attach() : detach())

    sync()
    queries.forEach((query) => query.addEventListener('change', sync))

    return () => {
      queries.forEach((query) => query.removeEventListener('change', sync))
      detach()
      element.style.removeProperty('--px')
      element.style.removeProperty('--py')
    }
  }, [ref])
}
