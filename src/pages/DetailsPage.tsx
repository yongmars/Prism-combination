import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { SplitVectorDiagrams } from '../components/SplitVectorDiagram'
import { VectorDiagram } from '../components/VectorDiagram'
import { useApp } from '../context/AppContext'
import { DIRECTION_NAMES, formatNumber } from '../lib/prismMath'
import type { CalculationRecord, SplitCalculationRecord, SplitEyePrescription } from '../types'

type DetailTab = 'vector' | 'components' | 'formula'

export function DetailsPage() {
  const { current, settings } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState<DetailTab>('vector')
  if (!current) return <Navigate to="/" replace />
  const d = settings.decimals

  return (
    <div className="page details-page">
      <button type="button" className="back-button" onClick={() => navigate('/result')}><ArrowLeft />計算結果へ戻る</button>
      <div className="detail-tabs" role="tablist" aria-label="詳細表示">
        <button role="tab" aria-selected={tab === 'vector'} className={tab === 'vector' ? 'active' : ''} onClick={() => setTab('vector')}>ベクトル図</button>
        <button role="tab" aria-selected={tab === 'components'} className={tab === 'components' ? 'active' : ''} onClick={() => setTab('components')}>成分値</button>
        <button role="tab" aria-selected={tab === 'formula'} className={tab === 'formula' ? 'active' : ''} onClick={() => setTab('formula')}>計算過程</button>
      </div>
      {current.kind === 'split'
        ? <SplitDetails current={current} decimals={d} tab={tab} />
        : <CombineDetails current={current} decimals={d} tab={tab} />}
    </div>
  )
}

function CombineDetails({ current, decimals: d, tab }: { current: CalculationRecord; decimals: number; tab: DetailTab }) {
  return <>
    {tab === 'vector' && <section className="card"><VectorDiagram record={current} decimals={d} /></section>}
    {tab === 'components' && <section className="card detail-section"><h2>成分値（直交座標）</h2><CombineComponentTable current={current} decimals={d} /></section>}
    {tab === 'formula' && <section className="card detail-section formula-section"><h2>計算過程</h2>
      {current.vectors.map((vector, index) => <div className="formula-card" key={index}><h3>プリズム{index === 0 ? '①' : '②'}</h3><p>x = {formatNumber(vector.magnitude, d)} × cos({formatNumber(vector.angle, d)}°) = <strong>{formatNumber(vector.x, d, true)}</strong></p><p>y = {formatNumber(vector.magnitude, d)} × sin({formatNumber(vector.angle, d)}°) = <strong>{formatNumber(vector.y, d, true)}</strong></p></div>)}
      <div className="formula-card total-formula"><h3>合成</h3><p>x合計 = {formatNumber(current.totalX, d, true)}</p><p>y合計 = {formatNumber(current.totalY, d, true)}</p><p>P = √(x² + y²) = <strong>{formatNumber(current.resultMagnitude, d)}△</strong></p><p>θ = atan2(y, x) = <strong>{current.resultAngle === null ? '方向なし' : `${formatNumber(current.resultAngle, d)}°`}</strong></p></div>
    </section>}
    {tab === 'vector' && <section className="card compact-components"><h2>成分値</h2><CombineComponentTable current={current} decimals={d} /></section>}
  </>
}

function SplitDetails({ current, decimals: d, tab }: { current: SplitCalculationRecord; decimals: number; tab: DetailTab }) {
  return <>
    {tab === 'vector' && <section className="card split-vector-section"><SplitVectorDiagrams right={current.right} left={current.left} decimals={d} /></section>}
    {tab === 'components' && <section className="card detail-section"><h2>左右眼の成分値</h2><SplitComponentTable current={current} decimals={d} /><SplitNotation current={current} decimals={d} /></section>}
    {tab === 'formula' && <section className="card detail-section formula-section"><h2>分割の計算過程</h2>
      <div className="formula-card"><h3>分割量</h3><p>元の眼 = {formatNumber(current.originalMagnitude, d)} × {formatNumber(current.sourceShare, 2)} = <strong>{formatNumber(current.sourceEye === 'right' ? current.right.magnitude : current.left.magnitude, d)}△</strong></p><p>反対眼 = {formatNumber(current.originalMagnitude, d)} × {formatNumber(current.fellowShare, 2)} = <strong>{formatNumber(current.sourceEye === 'right' ? current.left.magnitude : current.right.magnitude, d)}△</strong></p></div>
      <div className="formula-card"><h3>角度変換</h3><p>元の眼 θ = {formatNumber(current.originalAngle, d)}°</p><p>反対眼 θ = ({formatNumber(current.originalAngle, d)}° + 180°) mod 360° = <strong>{formatNumber(current.sourceEye === 'right' ? current.left.angle ?? 0 : current.right.angle ?? 0, d)}°</strong></p></div>
      {[current.right, current.left].map((eye) => <div className="formula-card" key={eye.eye}><h3>{eye.eye === 'right' ? '右眼' : '左眼'}の成分</h3><p>x = {formatNumber(eye.magnitude, d)} × cos({formatNumber(eye.angle ?? 0, d)}°) = <strong>{formatNumber(eye.vector.x, d, true)}</strong></p><p>y = {formatNumber(eye.magnitude, d)} × sin({formatNumber(eye.angle ?? 0, d)}°) = <strong>{formatNumber(eye.vector.y, d, true)}</strong></p></div>)}
    </section>}
    {tab === 'vector' && <section className="card compact-components"><h2>左右眼の成分値</h2><SplitComponentTable current={current} decimals={d} /></section>}
  </>
}

function CombineComponentTable({ current, decimals }: { current: CalculationRecord; decimals: number }) {
  return <div className="table-scroll"><table><thead><tr><th /><th>x成分（検者右+）</th><th>y成分（上+）</th></tr></thead><tbody>
    <tr><th>プリズム①</th><td>{formatNumber(current.vectors[0].x, decimals, true)}</td><td>{formatNumber(current.vectors[0].y, decimals, true)}</td></tr>
    <tr><th>プリズム②</th><td>{formatNumber(current.vectors[1].x, decimals, true)}</td><td>{formatNumber(current.vectors[1].y, decimals, true)}</td></tr>
    <tr className="total-row"><th>合成値</th><td>{formatNumber(current.totalX, decimals, true)}</td><td>{formatNumber(current.totalY, decimals, true)}</td></tr>
  </tbody></table></div>
}

function SplitComponentTable({ current, decimals }: { current: SplitCalculationRecord; decimals: number }) {
  return <div className="table-scroll"><table><thead><tr><th /><th>x成分（検者右+）</th><th>y成分（上+）</th></tr></thead><tbody>
    <tr><th>右眼</th><td>{formatNumber(current.right.vector.x, decimals, true)}</td><td>{formatNumber(current.right.vector.y, decimals, true)}</td></tr>
    <tr><th>左眼</th><td>{formatNumber(current.left.vector.x, decimals, true)}</td><td>{formatNumber(current.left.vector.y, decimals, true)}</td></tr>
  </tbody></table></div>
}

function SplitNotation({ current, decimals }: { current: SplitCalculationRecord; decimals: number }) {
  const text = (part: SplitEyePrescription['horizontal']) => part.direction ? `${formatNumber(part.magnitude, decimals)}△ ${part.direction}（${DIRECTION_NAMES[part.direction].ja}）` : '0△'
  return <div className="split-notation"><p><strong>右眼</strong><span>水平：{text(current.right.horizontal)}</span><span>垂直：{text(current.right.vertical)}</span></p><p><strong>左眼</strong><span>水平：{text(current.left.horizontal)}</span><span>垂直：{text(current.left.vertical)}</span></p></div>
}
