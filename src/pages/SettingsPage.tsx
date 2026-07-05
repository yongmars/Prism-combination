import { RotateCcw, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { angleForEye, normalizeAngle } from '../lib/prismMath'
import type { BaseDirection, DecimalPlaces } from '../types'

const directions: BaseDirection[] = ['BO', 'BU', 'BI', 'BD']

export function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useApp()
  const [angles, setAngles] = useState<Record<BaseDirection, string>>(() => Object.fromEntries(directions.map((key) => [key, String(settings.angles[key])])) as Record<BaseDirection, string>)
  const [decimals, setDecimals] = useState<DecimalPlaces>(settings.decimals)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setAngles(Object.fromEntries(directions.map((key) => [key, String(settings.angles[key])])) as Record<BaseDirection, string>)
    setDecimals(settings.decimals)
  }, [settings])

  const parsed = Object.fromEntries(directions.map((key) => [key, normalizeAngle(Number(angles[key]))])) as Record<BaseDirection, number>

  const save = () => {
    setMessage('')
    const values = directions.map((key) => Number(angles[key]))
    if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 360)) {
      setError('各角度は0〜360°で入力してください。')
      return
    }
    const normalized = values.map(normalizeAngle)
    if (new Set(normalized).size !== normalized.length) {
      setError('同じ角度に複数の方向を設定することはできません。')
      return
    }
    updateSettings({ angles: parsed, decimals })
    setError('')
    setMessage('設定を保存しました。')
  }

  const reset = () => {
    if (window.confirm('角度対応と表示桁数を既定値に戻しますか？')) {
      resetSettings()
      setError('')
      setMessage('既定値に戻しました。')
    }
  }

  return (
    <div className="page settings-page">
      <section className="card settings-section">
        <h2>基底方向の角度対応</h2>
        <p>右眼を基準に設定します。左眼は左右反転して自動計算されます。</p>
        <div className="angle-settings-grid">
          <span className="grid-head">方向</span><span className="grid-head">右眼</span><span className="grid-head">左眼</span>
          {directions.map((direction) => (
            <div className="settings-row" key={direction}>
              <strong>{direction}</strong>
              <label><span className="sr-only">右眼の{direction}</span><input type="number" min="0" max="360" value={angles[direction]} onChange={(event) => setAngles({ ...angles, [direction]: event.target.value })} /><span>°</span></label>
              <output>{Number.isFinite(Number(angles[direction])) ? angleForEye(direction, 'left', parsed) : '—'}°</output>
            </div>
          ))}
        </div>
        <div className="mapping-note">
          <strong>患者基準の座標</strong>
          <span>0°：画面右　90°：上　180°：画面左　270°：下</span>
        </div>
      </section>

      <section className="card settings-section">
        <h2>小数点表示桁数</h2>
        <div className="decimal-options" role="radiogroup" aria-label="小数点表示桁数">
          {([1, 2, 3] as DecimalPlaces[]).map((value) => (
            <button type="button" role="radio" aria-checked={decimals === value} className={decimals === value ? 'active' : ''} key={value} onClick={() => setDecimals(value)}>{value}桁<br /><small>{(5.83).toFixed(value)}</small></button>
          ))}
        </div>
      </section>

      {error && <p className="settings-feedback error" role="alert">{error}</p>}
      {message && <p className="settings-feedback success" role="status">{message}</p>}
      <div className="two-actions">
        <button type="button" className="secondary-button" onClick={reset}><RotateCcw size={18} />既定値に戻す</button>
        <button type="button" className="primary-button" onClick={save}><Save size={18} />保存する</button>
      </div>
    </div>
  )
}
