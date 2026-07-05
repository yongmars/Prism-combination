import { CheckCircle2, ChevronRight, Save } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { describeAngle, DIRECTION_NAMES, formatNumber } from '../lib/prismMath'

export function ResultPage() {
  const { current, settings, saveCurrent } = useApp()
  const navigate = useNavigate()
  if (!current) return <Navigate to="/" replace />

  const inputLabel = (index: 0 | 1) => {
    const input = current.inputs[index]
    const vector = current.vectors[index]
    const direction = input.direction === 'angle' ? '角度指定' : DIRECTION_NAMES[input.direction].en
    return `${formatNumber(input.magnitude, settings.decimals)}△ ${direction}（${formatNumber(vector.angle, settings.decimals)}°）`
  }

  return (
    <div className="page result-page">
      <div className="success-message"><CheckCircle2 />合成計算が完了しました</div>
      <section className="result-hero">
        <span className="eye-badge">{current.eye === 'right' ? '右眼' : '左眼'}</span>
        <h2>合成プリズム量</h2>
        <div className="result-value">{formatNumber(current.resultMagnitude, settings.decimals)} <small>△</small></div>
        <h2>基底方向（角度）</h2>
        <div className="result-angle">{current.resultAngle === null ? '方向なし' : `${formatNumber(current.resultAngle, settings.decimals)}°`}</div>
        <p className="clinical-direction">{describeAngle(current.resultAngle, current.eye, settings.angles)}</p>
        <button type="button" className="detail-button" onClick={() => navigate('/details')}>詳細を見る<ChevronRight /></button>
      </section>

      <section className="card input-summary">
        <h2>入力したプリズム</h2>
        <p><span className="number-dot number-dot--blue">1</span>{inputLabel(0)}</p>
        <p><span className="number-dot number-dot--green">2</span>{inputLabel(1)}</p>
      </section>

      <div className="two-actions">
        <button type="button" className="secondary-button" onClick={() => navigate('/')}>もう一度計算</button>
        <button type="button" className="primary-button" disabled={current.saved} onClick={saveCurrent}>
          <Save size={18} />{current.saved ? '保存済み' : '保存する'}
        </button>
      </div>
    </div>
  )
}
