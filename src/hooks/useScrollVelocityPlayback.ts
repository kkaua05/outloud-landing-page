import { useEffect, type RefObject } from 'react'
import { prefersReducedMotion } from '../lib/media'

/** Extra speed per px/ms of scroll velocity. */
const GAIN = 1.6
/** Maximum extra speed on top of the base rate. */
const MAX_BOOST = 4
/** Per-frame decay of the boost once scrolling slows down. */
const DECAY = 0.92
/** Per-frame easing of the playback rate towards its target. */
const EASE = 0.14
/** Iterations of runway so the reversed animation never reaches its start. */
const REVERSE_RUNWAY = 10_000

/**
 * Couples the element's CSS animation to scroll: it speeds up with scroll
 * velocity and follows the scroll direction (reverses when scrolling up),
 * then eases back to its base speed. A rAF loop runs only while the rate
 * is changing. Skipped with reduced motion.
 */
export function useScrollVelocityPlayback(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element || typeof element.getAnimations !== 'function' || prefersReducedMotion()) return
    const [animation] = element.getAnimations()
    if (!animation) return

    // A reversed infinite animation stops at time 0 — give it a long runway.
    const duration = Number(animation.effect?.getTiming().duration) || 0
    if (duration > 0 && typeof animation.currentTime === 'number') {
      animation.currentTime = (animation.currentTime % duration) + duration * REVERSE_RUNWAY
    }

    let lastY = window.scrollY
    let lastTime = performance.now()
    let direction = 1
    let boost = 0
    let rate = 1
    let frame = 0

    const tick = () => {
      boost *= DECAY
      const target = direction * (1 + boost)
      rate += (target - rate) * EASE
      if (Math.abs(target - rate) < 0.01 && boost < 0.01) {
        rate = direction
        animation.playbackRate = rate
        frame = 0
        return
      }
      animation.playbackRate = rate
      frame = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      const now = performance.now()
      const y = window.scrollY
      const velocity = (y - lastY) / Math.max(16, now - lastTime)
      lastY = y
      lastTime = now
      if (velocity !== 0) direction = velocity > 0 ? 1 : -1
      boost = Math.min(MAX_BOOST, Math.max(boost, Math.abs(velocity) * GAIN))
      if (!frame) frame = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      animation.playbackRate = 1
    }
  }, [ref])
}
