import { useEffect, useState } from 'react'

interface HeaderState {
  /** Page has scrolled past the top. */
  scrolled: boolean
  /** User is scrolling down past the hero — header tucks away. */
  hidden: boolean
}

export function useHeaderState(hideAfter = 520): HeaderState {
  const [state, setState] = useState<HeaderState>({ scrolled: false, hidden: false })

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - lastY
      // Ignore tiny jitters (e.g. momentum scrolling on touch screens).
      if (Math.abs(delta) < 6 && y > 24) return
      const next = { scrolled: y > 24, hidden: delta > 0 && y > hideAfter }
      lastY = y
      setState((previous) =>
        previous.scrolled === next.scrolled && previous.hidden === next.hidden ? previous : next,
      )
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [hideAfter])

  return state
}
