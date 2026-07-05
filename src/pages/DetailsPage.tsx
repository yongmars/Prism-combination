import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { VectorDiagram } from '../components/VectorDiagram'
import { useApp } from '../context/AppContext'
import { formatNumber } from '../lib/prismMath'

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

      {tab === 'vector' && <section className="card"><VectorDiagram record={current} decimals={d} /></section>}
      {tab === 'components' && (
        <section className="card detail-section">
          <h2>成分値（直交座標）</h2>
          <ComponentTable current={current} decimals={d} />
        </section>
      )}
      {tab === 'formula' && (
        <section className="card detail-section formula-section">
          <h2>計算過程</h2>
          {current.vectors.map((vector, index) => (
            <div className="formula-card" key={index}>
              <h3>プリズム{index === 0 ? '①' : '②'}</h3>
              <p>x = {formatNumber(vector.magnitude, d)} × cos({formatNumber(vector.angle, d)}°) = <strong>{formatNumber(vector.x, d, true)}</strong></p>
              <p>y = {formatNumber(vector.magnitude, d)} × sin({formatNumber(vector.angle, d)}°) = <strong>{formatNumber(vector.y, d, true)}</strong></p>
            </div>
          ))}
          <div className="formula-card total-formula">
            <h3>合成</h3>
            <p>x合計 = {formatNumber(current.totalX, d, true)}</p>
            <p>y合計 = {formatNumber(current.totalY, d, true)}</p>
            <p>P = √(x² + y²) = <strong>{formatNumber(current.resultMagnitude, d)}△</strong></p>
            <p>θ = atan2(y, x) = <strong>{current.resultAngle === null ? '方向なし' : `${formatNumber(current.resultAngle, d)}°`}</strong></p>
          </div>
        </section>
      )}

      {tab === 'vector' && (
        <section className="card compact-components">
          <h2>成分値</h2>
          <ComponentTable current={current} decimals={d} />
        </section>
      )}
    </div>
  )
}

function ComponentTable({ current, decimals }: { current: NonNullable<ReturnType<typeof useApp>['current']>; decimals: number }) {
  return (
    <div className="table-scroll">
      <table>
        <thead><tr><th /><th>x成分（検者右+）</th><th>y成分（上+）</th></tr></thead>
        <tbody>
          <tr><th>プリズム①</th><td>{formatNumber(current.vectors[0].x, decimals, true)}</td><td>{formatNumber(current.vectors[0].y, decimals, true)}</td></tr>
          <tr><th>プリズム②</th><td>{formatNumber(current.vectors[1].x, decimals, true)}</td><td>{formatNumber(current.vectors[1].y, decimals, true)}</td></tr>
          <tr className="total-row"><th>合成値</th><td>{formatNumber(current.totalX, decimals, true)}</td><td>{formatNumber(current.totalY, decimals, true)}</td></tr>
        </tbody>
      </table>
    </div>
  )
}
