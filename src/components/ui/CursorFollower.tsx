import { useEffect, useRef } from 'react'
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY, allowsPointerMotion } from '../../lib/media'
import './CursorFollower.css'

const INTERACTIVE = 'a[href], button:not(:disabled), label, input:not(:disabled), [role="button"]'
/** Share of the remaining distance covered per frame (elastic trail). */
const EASE = 0.2

/**
 * Elastic ring that trails the native cursor (which stays visible). It
 * grows over interactive elements and shows a short label over areas
 * tagged with `data-cursor="Label"`. Mouse/trackpad only, never with
 * reduced motion; positions are written straight to the DOM in a rAF
 * loop that sleeps whenever the ring has caught up.
 */
export function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ring = ringRef.current
    const label = labelRef.current
    if (!ring || !label) return

    const queries = [window.matchMedia(FINE_POINTER_QUERY), window.matchMedia(REDUCED_MOTION_QUERY)]
    const target = { x: -100, y: -100 }
    const current = { x: -100, y: -100 }
    let frame = 0
    let attached = false

    const place = () => {
      const transform = `translate3d(${current.x}px, ${current.y}px, 0)`
      ring.style.transform = transform
      label.style.transform = transform
    }

    const loop = () => {
      current.x += (target.x - current.x) * EASE
      current.y += (target.y - current.y) * EASE
      place()
      const settled = Math.abs(target.x - current.x) < 0.1 && Math.abs(target.y - current.y) < 0.1
      frame = settled ? 0 : requestAnimationFrame(loop)
    }

    const setState = (name: string, on: boolean) => {
      ring.classList.toggle(name, on)
      label.classList.toggle(name, on)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      target.x = event.clientX
      target.y = event.clientY
      if (!ring.classList.contains('is-visible')) {
        // First move: appear in place instead of flying in from a corner.
        current.x = target.x
        current.y = target.y
        place()
        setState('is-visible', true)
      }
      if (!frame) frame = requestAnimationFrame(loop)
    }

    const onOver = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null
      const interactive = Boolean(element?.closest(INTERACTIVE))
      const text = interactive ? '' : (element?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? '')
      setState('is-active', interactive)
      setState('has-label', Boolean(text))
      if (text) label.textContent = text
    }

    const onDown = () => setState('is-pressed', true)
    const onUp = () => setState('is-pressed', false)
    const onLeave = (event: PointerEvent) => {
      if (!event.relatedTarget) setState('is-visible', false)
    }

    const attach = () => {
      if (attached) return
      document.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerover', onOver, { passive: true })
      document.addEventListener('pointerdown', onDown, { passive: true })
      document.addEventListener('pointerup', onUp, { passive: true })
      document.addEventListener('pointerout', onLeave, { passive: true })
      attached = true
    }

    const detach = () => {
      if (!attached) return
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerout', onLeave)
      cancelAnimationFrame(frame)
      frame = 0
      ;['is-visible', 'is-active', 'has-label', 'is-pressed'].forEach((name) => setState(name, false))
      attached = false
    }

    const sync = () => (allowsPointerMotion() ? attach() : detach())
    sync()
    queries.forEach((query) => query.addEventListener('change', sync))

    return () => {
      queries.forEach((query) => query.removeEventListener('change', sync))
      detach()
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true" />
    </>
  )
}
