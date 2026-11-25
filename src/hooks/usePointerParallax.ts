import { useEffect, type RefObject } from 'react'
import { whilePointerMotionAllowed } from '../lib/media'

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

    const write = (x: number, y: number) => {
      element.style.setProperty('--px', x.toFixed(3))
      element.style.setProperty('--py', y.toFixed(3))
    }

    const stop = whilePointerMotionAllowed(() => {
      let frame = 0
      let pending: { x: number; y: number } | null = null

      const flush = () => {
        frame = 0
        if (pending) write(pending.x, pending.y)
        pending = null
      }

      const schedule = (next: { x: number; y: number }) => {
        pending = next
        if (!frame) frame = requestAnimationFrame(flush)
      }

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
        const rect = element.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        const clamp = (value: number) => Math.max(-1, Math.min(1, value))
        schedule({
          x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1),
          y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1),
        })
      }

      const onLeave = () => schedule({ x: 0, y: 0 })

      element.addEventListener('pointermove', onMove, { passive: true })
      element.addEventListener('pointerleave', onLeave)

      return () => {
        element.removeEventListener('pointermove', onMove)
        element.removeEventListener('pointerleave', onLeave)
        cancelAnimationFrame(frame)
        write(0, 0)
      }
    })

    return () => {
      stop()
      element.style.removeProperty('--px')
      element.style.removeProperty('--py')
    }
  }, [ref])
}
