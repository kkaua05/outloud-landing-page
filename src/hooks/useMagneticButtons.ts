import { useEffect } from 'react'
import { whilePointerMotionAllowed } from '../lib/media'

const SELECTOR = '.btn:not(:disabled), .icon-button'
/** Share of the pointer's offset from the centre the element follows. */
const STRENGTH = 0.25
/** Hard cap so buttons never drift away from their layout slot. */
const MAX_PX = 10

const clamp = (value: number) => Math.max(-MAX_PX, Math.min(MAX_PX, value))

/**
 * Buttons lean towards the pointer while hovered. One delegated listener
 * for the whole document; the offset is written as --mag-x / --mag-y and
 * applied through the independent `translate` property, so it composes
 * with each button's own hover transform.
 */
export function useMagneticButtons() {
  useEffect(
    () =>
      whilePointerMotionAllowed(() => {
        let active: HTMLElement | null = null
        let frame = 0
        let pending: { element: HTMLElement; x: number; y: number } | null = null

        const reset = (element: HTMLElement | null) => {
          element?.style.removeProperty('--mag-x')
          element?.style.removeProperty('--mag-y')
        }

        const flush = () => {
          frame = 0
          if (!pending) return
          pending.element.style.setProperty('--mag-x', `${pending.x.toFixed(2)}px`)
          pending.element.style.setProperty('--mag-y', `${pending.y.toFixed(2)}px`)
          pending = null
        }

        const onMove = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse') return
          const element =
            event.target instanceof Element ? event.target.closest<HTMLElement>(SELECTOR) : null
          if (element !== active) {
            reset(active)
            pending = null
            active = element
          }
          if (!element) return
          // Measure the resting position: subtract the offset already applied.
          const rect = element.getBoundingClientRect()
          const appliedX = parseFloat(element.style.getPropertyValue('--mag-x')) || 0
          const appliedY = parseFloat(element.style.getPropertyValue('--mag-y')) || 0
          const centerX = rect.left - appliedX + rect.width / 2
          const centerY = rect.top - appliedY + rect.height / 2
          pending = {
            element,
            x: clamp((event.clientX - centerX) * STRENGTH),
            y: clamp((event.clientY - centerY) * STRENGTH),
          }
          if (!frame) frame = requestAnimationFrame(flush)
        }

        const onLeaveDocument = (event: PointerEvent) => {
          if (event.relatedTarget) return
          reset(active)
          active = null
        }

        document.addEventListener('pointermove', onMove, { passive: true })
        document.addEventListener('pointerout', onLeaveDocument, { passive: true })

        return () => {
          document.removeEventListener('pointermove', onMove)
          document.removeEventListener('pointerout', onLeaveDocument)
          cancelAnimationFrame(frame)
          reset(active)
          active = null
        }
      }),
    [],
  )
}
