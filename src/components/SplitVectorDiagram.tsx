import { formatNumber } from '../lib/prismMath'
import type { SplitEyePrescription } from '../types'

export function SplitVectorDiagrams({ right, left, decimals }: { right: SplitEyePrescription; left: SplitEyePrescription; decimals: number }) {
  const maxMagnitude = Math.max(right.magnitude, left.magnitude, 1)
  return (
    <div className="split-vector-stack">
      <SingleEyeVector prescription={right} decimals={decimals} maxMagnitude={maxMagnitude} color="#2563eb" />
      <SingleEyeVector prescription={left} decimals={decimals} maxMagnitude={maxMagnitude} color="#16a34a" />
    </div>
  )
}

function SingleEyeVector({ prescription, decimals, maxMagnitude, color }: { prescription: SplitEyePrescription; decimals: number; maxMagnitude: number; color: string }) {
  const centerX = 150
  const centerY = 118
  const scale = 82 / maxMagnitude
  const endX = centerX + prescription.vector.x * scale
  const endY = centerY - prescription.vector.y * scale
  const rightLabel = prescription.eye === 'right' ? 'In' : 'Out'
  const leftLabel = prescription.eye === 'right' ? 'Out' : 'In'
  const markerId = `split-arrow-${prescription.eye}`
  return (
    <section className="split-vector-eye">
      <h3>{prescription.eye === 'right' ? '右眼' : '左眼'}：{formatNumber(prescription.magnitude, decimals)}△ {prescription.angle === null ? '方向なし' : `${formatNumber(prescription.angle, decimals)}°`}</h3>
      <svg viewBox="0 0 300 236" role="img" aria-label={`${prescription.eye === 'right' ? '右眼' : '左眼'}の分割プリズムベクトル図`}>
        <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={color} /></marker></defs>
        <circle cx={centerX} cy={centerY} r="82" fill="#f8fbff" stroke="#b9c4d4" strokeDasharray="4 4" />
        <line x1="48" y1={centerY} x2="252" y2={centerY} stroke="#8b98aa" />
        <line x1={centerX} y1="16" x2={centerX} y2="220" stroke="#8b98aa" />
        <text x="150" y="12" textAnchor="middle">Up 90°</text>
        <text x="150" y="234" textAnchor="middle">Down 270°</text>
        <text x="272" y="114" textAnchor="middle">{rightLabel}</text>
        <text x="272" y="130" textAnchor="middle">0°</text>
        <text x="28" y="114" textAnchor="middle">{leftLabel}</text>
        <text x="28" y="130" textAnchor="middle">180°</text>
        {prescription.magnitude > 0 && <line x1={centerX} y1={centerY} x2={endX} y2={endY} stroke={color} strokeWidth="4" markerEnd={`url(#${markerId})`} />}
      </svg>
    </section>
  )
}
