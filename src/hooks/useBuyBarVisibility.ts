import { useEffect, useState, type RefObject } from 'react'

/**
 * The quick-buy bar is shown only when it adds something: never while the
 * real purchase block, the hero (its own CTAs) or the footer is on screen.
 */
export function useBuyBarVisibility(purchaseRef: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const purchase = purchaseRef.current
    if (!purchase || !('IntersectionObserver' in window)) return

    const blockers = [purchase, document.getElementById('top'), document.getElementById('contact')].filter(
      (element): element is HTMLElement => element !== null,
    )
    const onScreen = new Map<Element, boolean>()

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) onScreen.set(entry.target, entry.isIntersecting)
      // Wait until every blocker has reported once before deciding.
      if (onScreen.size < blockers.length) return
      setVisible(blockers.every((element) => !onScreen.get(element)))
    })

    blockers.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [purchaseRef])

  return visible
}
