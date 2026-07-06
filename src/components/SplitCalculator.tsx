import { ArrowRightLeft, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatNumber } from '../lib/prismMath'
import { createSplitCalculation } from '../lib/prismSplit'
import type { EyeSide } from '../types'

type RatioMode = '50' | '60' | '70' | 'custom'

export function SplitCalculator() {
  const { settings, setCurrent } = useApp()
  const navigate = useNavigate()
  const [sourceEye, setSourceEye] = useState<EyeSide>('right')
  const [magnitude, setMagnitude] = useState('')
  const [angle, setAngle] = useState('')
  const [ratioMode, setRatioMode] = useState<RatioMode>('50')
  const [customSource, setCustomSource] = useState('50')
  const [customFellow, setCustomFellow] = useState('50')
  const [error, setError] = useState('')

  const ratio = useMemo(() => {
    if (ratioMode !== 'custom') return Number(ratioMode) / 100
    const source = Number(customSource)
    const fellow = Number(customFellow)
    return source + fellow > 0 ? source / (source + fellow) : Number.NaN
  }, [ratioMode, customSource, customFellow])

  const calculate = () => {
    const prism = Number(magnitude)
    const degrees = Number(angle)
    if (magnitude.trim() === '' || !Number.isFinite(prism) || prism <= 0) {
      setError('プリズム量は0より大きい数値で入力してください。')
      return
    }
    if (angle.trim() === '' || !Number.isFinite(degrees) || degrees < 0 || degrees > 360) {
      setError('角度は0〜360°で入力してください。')
      return
    }
    if (ratioMode === 'custom') {
      const source = Number(customSource)
      const fellow = Number(customFellow)
      if (!Number.isFinite(source) || !Number.isFinite(fellow) || source < 0 || fellow < 0 || source + fellow <= 0) {
        setError('任意割合は0以上で、合計が0より大きくなるよう入力してください。')
        return
      }
    }
    setCurrent(createSplitCalculation(sourceEye, prism, degrees, ratio, settings.angles))
    setError('')
    navigate('/result')
  }

  const clear = () => {
    setMagnitude('')
    setAngle('')
    setRatioMode('50')
    setCustomSource('50')
    setCustomFellow('50')
    setError('')
  }

  const sourcePercent = Number.isFinite(ratio) ? ratio * 100 : 0
  const fellowPercent = 100 - sourcePercent

  return (
    <div className="split-mode">
      <div className="split-explanation">
        <ArrowRightLeft aria-hidden="true" />
        <div><strong>片眼のプリズムを左右眼へ分割</strong><span>反対眼へ移す角度は180°反転します</span></div>
      </div>

      <section className="card split-input-card">
        <h2>元のプリズム</h2>
        <label className="split-field"><span>元の眼</span><span className="segmented split-eye">
          <button type="button" className={sourceEye === 'right' ? 'active' : ''} onClick={() => setSourceEye('right')}>右眼</button>
          <button type="button" className={sourceEye === 'left' ? 'active' : ''} onClick={() => setSourceEye('left')}>左眼</button>
        </span></label>
        <label className="split-field"><span>プリズム量</span><span className="input-with-unit"><input aria-label="分割するプリズム量" type="number" min="0" step="any" inputMode="decimal" value={magnitude} placeholder="例：10" onChange={(event) => setMagnitude(event.target.value)} /><b>△</b></span></label>
        <label className="split-field"><span>角度</span><span className="input-with-unit"><input aria-label="分割する角度" type="number" min="0" max="360" step="any" inputMode="decimal" value={angle} placeholder="例：300" onChange={(event) => setAngle(event.target.value)} /><b>°</b></span></label>
      </section>

      <section className="card split-input-card">
        <h2>分割割合</h2>
        <p className="ratio-caption">元の眼：反対眼</p>
        <div className="ratio-options">
          {(['50', '60', '70'] as RatioMode[]).map((value) => (
            <button type="button" className={ratioMode === value ? 'active' : ''} key={value} onClick={() => setRatioMode(value)}>{value}:{100 - Number(value)}</button>
          ))}
          <button type="button" className={ratioMode === 'custom' ? 'active' : ''} onClick={() => setRatioMode('custom')}>任意入力</button>
        </div>
        {ratioMode === 'custom' && <div className="custom-ratio">
          <label>元の眼<input type="number" min="0" inputMode="decimal" value={customSource} onChange={(event) => setCustomSource(event.target.value)} /></label>
          <span>：</span>
          <label>反対眼<input type="number" min="0" inputMode="decimal" value={customFellow} onChange={(event) => setCustomFellow(event.target.value)} /></label>
        </div>}
        <p className="ratio-preview">{sourceEye === 'right' ? '右眼' : '左眼'} {formatNumber(sourcePercent, 1)}% ／ {sourceEye === 'right' ? '左眼' : '右眼'} {formatNumber(fellowPercent, 1)}%</p>
      </section>

      {error && <p className="field-error split-error" role="alert">{error}</p>}
      <div className="action-card card">
        <button type="button" className="primary-button" onClick={calculate}>左右眼に分割する</button>
        <button type="button" className="secondary-button" onClick={clear}><RotateCcw size={18} />クリア</button>
      </div>
    </div>
  )
}
