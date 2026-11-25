import { useRef, type CSSProperties } from 'react'
import { useScrollVelocityPlayback } from '../../hooks/useScrollVelocityPlayback'
import { Sparkle } from './Decor'
import './Marquee.css'

interface MarqueeProps {
  items: string[]
  variant?: 'royal' | 'pink' | 'cream-outline'
  /** Rotation of the band in degrees. */
  tilt?: number
  /** Seconds for one full loop. */
  duration?: number
  reverse?: boolean
  /** How many times the items repeat inside one loop (keeps wide screens filled). */
  repeat?: number
  className?: string
}

/**
 * Infinite ticker band. Purely decorative (it repeats copy that already
 * exists on the page), so it is hidden from assistive technology.
 */
export function Marquee({
  items,
  variant = 'royal',
  tilt = 0,
  duration = 32,
  reverse = false,
  repeat = 2,
  className,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  useScrollVelocityPlayback(trackRef)

  const style = { '--tilt': `${tilt}deg`, '--duration': `${duration}s` } as CSSProperties
  const sequence = Array.from({ length: repeat }, () => items).flat()
  const group = (
    <ul className="marquee__group">
      {sequence.map((item, index) => (
        <li key={`${item}-${index}`} className="marquee__item">
          <span>{item}</span>
          <Sparkle className="marquee__sparkle" />
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className={['marquee', `marquee--${variant}`, reverse && 'marquee--reverse', className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-hidden="true"
    >
      <div ref={trackRef} className="marquee__track">
        {group}
        {group}
      </div>
    </div>
  )
}
