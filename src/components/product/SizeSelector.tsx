import { useId, type Ref } from 'react'
import type { SizeOption } from '../../config/site'
import './SizeSelector.css'

interface SizeSelectorProps {
  sizes: SizeOption[]
  system: string
  value: string | null
  onChange: (size: string) => void
  error?: string | null
  ref?: Ref<HTMLFieldSetElement>
}

export function SizeSelector({ sizes, system, value, onChange, error, ref }: SizeSelectorProps) {
  const name = useId()
  const errorId = `${name}-error`
  const hasAvailable = sizes.some((size) => size.available)

  return (
    <fieldset
      ref={ref}
      className={['size-selector', error && 'has-error'].filter(Boolean).join(' ')}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="size-selector__legend">
        <span>Select size</span>
        <span className="size-selector__system micro">{system}</span>
      </legend>

      <div className="size-selector__grid">
        {sizes.map((size) => {
          const selected = value === size.label
          return (
            <label
              key={size.label}
              className={[
                'size-option',
                selected && 'is-selected',
                !size.available && 'is-unavailable',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <input
                className="size-option__input"
                type="radio"
                name={name}
                value={size.label}
                checked={selected}
                disabled={!size.available}
                onChange={() => onChange(size.label)}
              />
              <span className="size-option__label">
                {size.label}
                {!size.available ? <span className="sr-only"> — unavailable</span> : null}
              </span>
            </label>
          )
        })}
      </div>

      {!hasAvailable ? (
        <p className="size-selector__hint">No sizes are available right now.</p>
      ) : null}

      <p id={errorId} className="size-selector__error" role="alert">
        {error ?? ''}
      </p>
    </fieldset>
  )
}
