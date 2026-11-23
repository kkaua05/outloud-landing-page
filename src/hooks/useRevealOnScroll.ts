import { useEffect } from 'react'

/**
 * Reveals every `[data-reveal]` element once it enters the viewport,
 * using a single shared IntersectionObserver. Elements stay visible if
 * the API is missing or the user prefers reduced motion (handled in CSS).
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const root = document.documentElement
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!('IntersectionObserver' in window) || targets.length === 0) return

    root.classList.add('reveal-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )

    targets.forEach((target) => observer.observe(target))

    return () => {
      observer.disconnect()
      root.classList.remove('reveal-ready')
    }
  }, [])
}
