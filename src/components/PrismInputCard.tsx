import type { AngleSettings, BaseDirection, DraftPrismInput, EyeSide } from '../types'
import { angleForEye, DIRECTION_NAMES } from '../lib/prismMath'

interface Props {
  index: 1 | 2
  value: DraftPrismInput
  eye: EyeSide
  angles: AngleSettings
  error?: string
  onChange: (value: DraftPrismInput) => void
}

const directions: BaseDirection[] = ['BU', 'BD', 'BI', 'BO']

export function PrismInputCard({ index, value, eye, angles, error, onChange }: Props) {
  const currentAngle = value.direction === 'angle'
    ? value.customAngle || '-'
    : angleForEye(value.direction, eye, angles)
  const directionName = value.direction === 'angle'
    ? '任意角度'
    : DIRECTION_NAMES[value.direction].en
  const accent = index === 1 ? 'blue' : 'green'

  return (
    <section className={`prism-card prism-card--${accent}`} aria-labelledby={`prism-${index}-title`}>
      <h2 id={`prism-${index}-title`}>プリズム{index === 1 ? '①' : '②'}</h2>
      <label className="field-row">
        <span>プリズム量</span>
        <span className="input-with-unit">
          <input
            inputMode="decimal"
            type="number"
            min="0"
            step="any"
            value={value.magnitude}
            onChange={(event) => onChange({ ...value, magnitude: event.target.value })}
            aria-describedby={error ? `prism-${index}-error` : undefined}
            placeholder="例：3.0"
          />
          <b>△</b>
        </span>
      </label>
      <fieldset>
        <legend>基底方向</legend>
        <div className="direction-grid">
          {directions.map((direction) => (
            <button
              key={direction}
              type="button"
              className={value.direction === direction ? 'selected' : ''}
              onClick={() => onChange({ ...value, direction })}
              aria-pressed={value.direction === direction}
            >
              <strong>{direction}</strong>
              <small>{angleForEye(direction, eye, angles)}°</small>
            </button>
          ))}
          <button
            type="button"
            className={`custom-direction ${value.direction === 'angle' ? 'selected' : ''}`}
            onClick={() => onChange({ ...value, direction: 'angle' })}
            aria-pressed={value.direction === 'angle'}
          >
            角度指定
          </button>
        </div>
      </fieldset>
      {value.direction === 'angle' && (
        <label className="custom-angle">
          <span>角度（0〜360°）</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            max="360"
            step="any"
            value={value.customAngle}
            onChange={(event) => onChange({ ...value, customAngle: event.target.value })}
            placeholder="例：45"
          />
        </label>
      )}
      <p className="current-direction">→ 現在の基底方向：{directionName}（{currentAngle}°）</p>
      {error && <p id={`prism-${index}-error`} className="field-error" role="alert">{error}</p>}
    </section>
  )
}
