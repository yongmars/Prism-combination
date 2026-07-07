import { CornerUpRight, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { createDecomposeCalculation } from '../lib/prismMath'
import type { EyeSide, PrismInput } from '../types'

function validateInput(magnitudeText: string, angleText: string): string | undefined {
  if (magnitudeText.trim() === '') return 'プリズム量を入力してください。'
  const magnitude = Number(magnitudeText)
  if (!Number.isFinite(magnitude)) return 'プリズム量を数値で入力してください。'
  if (magnitude < 0) return 'プリズム量は0以上で入力してください。'
  if (angleText.trim() === '') return '角度を入力してください。'
  const angle = Number(angleText)
  if (!Number.isFinite(angle) || angle < 0 || angle > 360) return '角度は0〜360°で入力してください。'
  return undefined
}

export function DecomposeCalculator() {
  const { settings, setCurrent } = useApp()
  const navigate = useNavigate()
  const [eye, setEye] = useState<EyeSide>('right')
  const [magnitude, setMagnitude] = useState('')
  const [angle, setAngle] = useState('')
  const [error, setError] = useState<string | undefined>()

  const calculate = () => {
    const nextError = validateInput(magnitude, angle)
    setError(nextError)
    if (nextError) return
    const parsed: PrismInput = {
      magnitude: Number(magnitude),
      direction: 'angle',
      customAngle: Number(angle),
    }
    setCurrent(createDecomposeCalculation(parsed, eye, settings.angles))
    navigate('/result')
  }

  const clear = () => {
    setEye('right')
    setMagnitude('')
    setAngle('')
    setError(undefined)
  }

  return (
    <div className="decompose-mode">
      <div className="split-explanation">
        <CornerUpRight aria-hidden="true" />
        <div><strong>合成されたプリズムを、水平・垂直成分へ分けます</strong></div>
      </div>
      <section className="eye-selector card" aria-labelledby="decompose-eye-title">
        <div><h2 id="decompose-eye-title">計算する眼</h2><p>左右眼でBI・BOの角度と表示が切り替わります</p></div>
        <div className="segmented" role="group" aria-label="成分分解する眼">
          <button type="button" className={eye === 'right' ? 'active' : ''} aria-pressed={eye === 'right'} onClick={() => setEye('right')}>右眼</button>
          <button type="button" className={eye === 'left' ? 'active' : ''} aria-pressed={eye === 'left'} onClick={() => setEye('left')}>左眼</button>
        </div>
      </section>
      <section className="prism-card prism-card--red decompose-input-card" aria-labelledby="decompose-prism-title">
        <h2 id="decompose-prism-title">元のプリズム</h2>
        <label className="split-field"><span>プリズム量</span><span className="input-with-unit"><input aria-label="成分分解するプリズム量" type="number" min="0" step="any" inputMode="decimal" value={magnitude} placeholder="例：10" onChange={(event) => {
          setMagnitude(event.target.value)
          if (error) setError(undefined)
        }} /><b>△</b></span></label>
        <label className="split-field"><span>角度</span><span className="input-with-unit"><input aria-label="成分分解する角度" type="number" min="0" max="360" step="any" inputMode="decimal" value={angle} placeholder="例：300" onChange={(event) => {
          setAngle(event.target.value)
          if (error) setError(undefined)
        }} /><b>°</b></span></label>
        {error && <p className="field-error" role="alert">{error}</p>}
      </section>
      <div className="action-card card">
        <button type="button" className="primary-button" onClick={calculate}>成分分解する</button>
        <button type="button" className="secondary-button" onClick={clear}><RotateCcw size={18} />クリア</button>
      </div>
    </div>
  )
}
