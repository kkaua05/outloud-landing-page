import { MinusIcon, PlusIcon } from '../ui/Icons'

interface QuantityStepperProps {
  value: number
  max: number
  onChange: (value: number) => void
  /** Used in the accessible labels, e.g. "size 41". */
  label: string
}

export function QuantityStepper({ value, max, onChange, label }: QuantityStepperProps) {
  return (
    <div className="stepper" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        className="stepper__button"
        onClick={() => onChange(value - 1)}
        aria-label={value <= 1 ? `Remove ${label}` : `Decrease quantity for ${label}`}
      >
        <MinusIcon size={16} />
      </button>
      <span className="stepper__value">{value}</span>
      <button
        type="button"
        className="stepper__button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity for ${label}`}
      >
        <PlusIcon size={16} />
      </button>
    </div>
  )
}
