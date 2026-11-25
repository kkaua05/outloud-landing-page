import { useEffect, useState } from 'react'

/**
 * Current time, ticking every second until `until` (epoch ms) is reached.
 * Pass `null` to keep it idle (no timer at all).
 */
export function useNow(until: number | null) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (until === null) return
    const id = window.setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (current >= until) window.clearInterval(id)
    }, 1000)
    return () => window.clearInterval(id)
  }, [until])

  return now
}
