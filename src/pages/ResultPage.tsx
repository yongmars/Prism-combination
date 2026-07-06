import { ArrowRightLeft, CheckCircle2, ChevronRight, Save } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { SplitResultCards } from '../components/SplitResultCards'
import { useApp } from '../context/AppContext'
import { describeAngle, DIRECTION_NAMES, formatNumber } from '../lib/prismMath'
import type { CalculationRecord, SplitCalculationRecord } from '../types'

export function ResultPage() {
  const { current, settings, saveCurrent } = useApp()
  const navigate = useNavigate()
  if (!current) return <Navigate to="/" replace />

  return current.kind === 'split'
    ? <SplitResultPage current={current} decimals={settings.decimals} saveCurrent={saveCurrent} navigate={navigate} />
    : <CombineResultPage current={current} decimals={settings.decimals} angles={settings.angles} saveCurrent={saveCurrent} navigate={navigate} />
}

function CombineResultPage({ current, decimals, angles, saveCurrent, navigate }: { current: CalculationRecord; decimals: number; angles: Parameters<typeof describeAngle>[2]; saveCurrent: () => void; navigate: ReturnType<typeof useNavigate> }) {
  const inputLabel = (index: 0 | 1) => {
    const input = current.inputs[index]
    const vector = current.vectors[index]
    const direction = input.direction === 'angle' ? '角度指定' : DIRECTION_NAMES[input.direction].en
    return `${formatNumber(input.magnitude, decimals)}△ ${direction}（${formatNumber(vector.angle, decimals)}°）`
  }
  return (
    <div className="page result-page">
      <div className="success-message"><CheckCircle2 />合成計算が完了しました</div>
      <section className="result-hero">
        <span className="eye-badge">{current.eye === 'right' ? '右眼' : '左眼'}</span>
        <h2>合成プリズム量</h2>
        <div className="result-value">{formatNumber(current.resultMagnitude, decimals)} <small>△</small></div>
        <h2>基底方向（角度）</h2>
        <div className="result-angle">{current.resultAngle === null ? '方向なし' : `${formatNumber(current.resultAngle, decimals)}°`}</div>
        <p className="clinical-direction">{describeAngle(current.resultAngle, current.eye, angles)}</p>
        <button type="button" className="detail-button" onClick={() => navigate('/details')}>詳細を見る<ChevronRight /></button>
      </section>
      <section className="card input-summary"><h2>入力したプリズム</h2><p><span className="number-dot number-dot--blue">1</span>{inputLabel(0)}</p><p><span className="number-dot number-dot--green">2</span>{inputLabel(1)}</p></section>
      <ResultActions saved={current.saved} saveCurrent={saveCurrent} navigate={navigate} />
    </div>
  )
}

function SplitResultPage({ current, decimals, saveCurrent, navigate }: { current: SplitCalculationRecord; decimals: number; saveCurrent: () => void; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="page result-page split-result-page">
      <div className="success-message"><CheckCircle2 />左右分割計算が完了しました</div>
      <section className="card split-result-summary">
        <div className="split-summary-title"><ArrowRightLeft /><div><h2>左右眼への分割結果</h2><p>元の眼 {formatNumber(current.sourceShare * 100, 1)}%：反対眼 {formatNumber(current.fellowShare * 100, 1)}%</p></div></div>
        <SplitResultCards result={current} decimals={decimals} />
        <button type="button" className="detail-button" onClick={() => navigate('/details')}>詳細を見る<ChevronRight /></button>
      </section>
      <section className="card input-summary">
        <h2>元のプリズム</h2>
        <p><span className="eye-badge">{current.sourceEye === 'right' ? '右眼' : '左眼'}</span>{formatNumber(current.originalMagnitude, decimals)}△　{formatNumber(current.originalAngle, decimals)}°</p>
      </section>
      <ResultActions saved={current.saved} saveCurrent={saveCurrent} navigate={navigate} />
    </div>
  )
}

function ResultActions({ saved, saveCurrent, navigate }: { saved: boolean; saveCurrent: () => void; navigate: ReturnType<typeof useNavigate> }) {
  return <div className="two-actions">
    <button type="button" className="secondary-button" onClick={() => navigate('/')}>もう一度計算</button>
    <button type="button" className="primary-button" disabled={saved} onClick={saveCurrent}><Save size={18} />{saved ? '保存済み' : '保存する'}</button>
  </div>
}
