import { useNow } from '../../hooks/useNow'
import { dropStartsAt, splitTimeLeft } from '../../lib/drop'
import './DropCountdown.css'

interface DropCountdownProps {
  className?: string
}

const pad = (value: number) => String(value).padStart(2, '0')
const plural = (value: number, word: string) => `${value} ${word}${value === 1 ? '' : 's'}`

/**
 * Live countdown to `drop.startsAt` (src/config/site.ts), then “Live now”.
 * Renders nothing when no release date is configured.
 */
export function DropCountdown({ className }: DropCountdownProps) {
  const now = useNow(dropStartsAt)
  if (dropStartsAt === null) return null

  const classes = (state: string) => ['countdown', state, className].filter(Boolean).join(' ')

  if (now >= dropStartsAt) {
    return (
      <p className={classes('is-live')}>
        <span className="countdown__dot" aria-hidden="true" />
        Live now
      </p>
    )
  }

  const { days, hours, minutes, seconds } = splitTimeLeft(dropStartsAt - now)
  const units = [
    { key: 'd', value: days },
    { key: 'h', value: hours },
    { key: 'm', value: minutes },
    { key: 's', value: seconds },
  ]

  return (
    // The accessible name changes once a minute; the ticking digits are hidden
    // from assistive technology so screen readers are not flooded.
    <p
      className={classes('is-counting')}
      role="timer"
      aria-label={`Drop starts in ${plural(days, 'day')}, ${plural(hours, 'hour')} and ${plural(minutes, 'minute')}`}
    >
      <span className="countdown__dot" aria-hidden="true" />
      <span className="countdown__label">Drop in</span>
      <span className="countdown__units" aria-hidden="true">
        {units.map((unit) => (
          <span key={unit.key} className="countdown__unit">
            {pad(unit.value)}
            <span className="countdown__suffix">{unit.key}</span>
          </span>
        ))}
      </span>
    </p>
  )
}
