import type { CSSProperties, ReactNode } from 'react'

interface MaskLineProps {
  /** Position of the line inside its heading — staggers the reveal. */
  index: number
  children: ReactNode
}

/**
 * One line of a display heading that rises out of a mask when its
 * `[data-reveal="mask"]` ancestor is revealed (see base.css).
 * Without JS or with reduced motion it renders as a plain line.
 */
export function MaskLine({ index, children }: MaskLineProps) {
  return (
    <span className="mask-line" style={{ '--line': index } as CSSProperties}>
      <span className="mask-line__inner">{children}</span>
    </span>
  )
}
