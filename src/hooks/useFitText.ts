import { useLayoutEffect, type RefObject } from 'react'

/**
 * Scales an element's font-size so its single line of text fills the
 * width of its parent exactly. Works for any brand name length.
 * The element must be `display: inline-block; white-space: nowrap`.
 * The result is written to the `--fit-size` custom property — on the
 * parent by default, or on `varTarget` so other elements (outline echoes,
 * spacing calculations) can reuse the value.
 */
export function useFitText(
  ref: RefObject<HTMLElement | null>,
  varTarget?: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const element = ref.current
    const container = element?.parentElement
    if (!element || !container) return
    const target = varTarget?.current ?? container

    let frame = 0

    const fit = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const styles = getComputedStyle(container)
        const available =
          container.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight)
        const current = parseFloat(getComputedStyle(element).fontSize)
        const width = element.getBoundingClientRect().width
        if (!available || !width || !current) return
        const next = (current * available) / width
        const previous = parseFloat(target.style.getPropertyValue('--fit-size'))
        if (!(Math.abs(next - previous) <= 0.25)) {
          target.style.setProperty('--fit-size', `${next.toFixed(2)}px`)
        }
      })
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(container)
    document.fonts?.ready.then(fit).catch(() => undefined)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [ref, varTarget])
}
