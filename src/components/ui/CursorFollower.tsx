import { useEffect, useRef } from 'react'
import { whilePointerMotionAllowed } from '../../lib/media'
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

    const target = { x: -100, y: -100 }
    const current = { x: -100, y: -100 }
    let frame = 0

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

    const listeners = [
      ['pointermove', onMove],
      ['pointerover', onOver],
      ['pointerdown', onDown],
      ['pointerup', onUp],
      ['pointerout', onLeave],
    ] as const

    return whilePointerMotionAllowed(() => {
      listeners.forEach(([type, listener]) => document.addEventListener(type, listener, { passive: true }))
      return () => {
        listeners.forEach(([type, listener]) => document.removeEventListener(type, listener))
        cancelAnimationFrame(frame)
        frame = 0
        ;['is-visible', 'is-active', 'has-label', 'is-pressed'].forEach((name) => setState(name, false))
      }
    })
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true" />
    </>
  )
}
