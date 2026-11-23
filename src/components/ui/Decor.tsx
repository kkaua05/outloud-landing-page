import { useId, type CSSProperties, type ReactNode } from 'react'
import './Decor.css'

interface DecorProps {
  className?: string
  style?: CSSProperties
}

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(' ')

/** Four-point Y2K sparkle. */
export function Sparkle({ className, style }: DecorProps) {
  return (
    <svg
      className={cx('sparkle', className)}
      style={style}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 0c.7 6.6 4.8 10.9 12 12-7.2 1.1-11.3 5.4-12 12-.7-6.6-4.8-10.9-12-12C7.2 10.9 11.3 6.6 12 0Z"
      />
    </svg>
  )
}

interface CircleBadgeProps extends DecorProps {
  /** Text repeated around the circle. Keep it short; separators are added automatically. */
  words: string[]
  center?: ReactNode
}

/** Rotating circular text sticker. */
export function CircleBadge({ words, center, className, style }: CircleBadgeProps) {
  const pathId = useId()
  const text = `${words.join(' ✦ ')} ✦ `
  return (
    <div className={cx('circle-badge', className)} style={style} aria-hidden="true">
      <svg className="circle-badge__ring" viewBox="0 0 200 200" focusable="false">
        <defs>
          <path id={pathId} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
        </defs>
        <circle className="circle-badge__disc" cx="100" cy="100" r="99" />
        <text className="circle-badge__text">
          <textPath href={`#${pathId}`} textLength="448" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="circle-badge__center">{center ?? <Sparkle />}</span>
    </div>
  )
}

/** Dashed elliptical orbit — suggests movement around the product. */
export function Orbit({ className, style }: DecorProps) {
  return (
    <svg
      className={cx('orbit', className)}
      style={style}
      viewBox="0 0 400 240"
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <ellipse cx="200" cy="120" rx="196" ry="116" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** Three stacked motion lines. */
export function SpeedLines({ className, style }: DecorProps) {
  return (
    <svg
      className={cx('speed-lines', className)}
      style={style}
      viewBox="0 0 120 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M38 6h80" />
        <path d="M14 24h104" />
        <path d="M58 42h60" />
      </g>
    </svg>
  )
}

/** Hand-drawn strike used over a word. Draws itself when revealed. */
export function Scribble({ className, style }: DecorProps) {
  return (
    <svg
      className={cx('scribble', className)}
      style={style}
      viewBox="0 0 600 80"
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <path
        pathLength="1"
        d="M6 52c62-14 128-24 196-26 74-2 138 6 206 2 62-4 120-14 186-26M24 62c90-10 170-14 262-12 94 2 176-2 296-18"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** Print-style registration marks in the four corners of the parent. */
export function CornerMarks({ className }: { className?: string }) {
  return (
    <div className={cx('corner-marks', className)} aria-hidden="true">
      <span className="corner-marks__mark corner-marks__mark--tl" />
      <span className="corner-marks__mark corner-marks__mark--tr" />
      <span className="corner-marks__mark corner-marks__mark--bl" />
      <span className="corner-marks__mark corner-marks__mark--br" />
    </div>
  )
}
