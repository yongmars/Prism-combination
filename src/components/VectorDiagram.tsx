import type { CalculationRecord } from '../types'
import { formatNumber } from '../lib/prismMath'

interface Props {
  record: CalculationRecord
  decimals: number
}

export function VectorDiagram({ record, decimals }: Props) {
  const { vectors, resultMagnitude, resultAngle, eye } = record
  const maxMagnitude = Math.max(vectors[0].magnitude, vectors[1].magnitude, resultMagnitude, 1)
  const scale = 112 / maxMagnitude
  const center = 160
  const points = [
    { x: center + vectors[0].x * scale, y: center - vectors[0].y * scale, color: '#2563eb', marker: 'blue', label: `P1 ${formatNumber(vectors[0].magnitude, decimals)}△` },
    { x: center + vectors[1].x * scale, y: center - vectors[1].y * scale, color: '#16a34a', marker: 'green', label: `P2 ${formatNumber(vectors[1].magnitude, decimals)}△` },
    { x: center + record.totalX * scale, y: center - record.totalY * scale, color: '#dc2626', marker: 'red', label: `合成 ${formatNumber(resultMagnitude, decimals)}△` },
  ]
  const rightLabel = eye === 'right' ? 'Out' : 'In'
  const leftLabel = eye === 'right' ? 'In' : 'Out'

  return (
    <div className="vector-wrap">
      <svg className="vector-diagram" viewBox="0 0 320 320" role="img" aria-label="プリズムのベクトル図">
        <defs>
          {points.map((point) => (
            <marker key={point.marker} id={`arrow-${point.marker}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={point.color} />
            </marker>
          ))}
        </defs>
        <circle cx={center} cy={center} r="112" fill="#f8fbff" stroke="#b9c4d4" strokeDasharray="4 4" />
        <line x1="28" y1={center} x2="292" y2={center} stroke="#8b98aa" />
        <line x1={center} y1="28" x2={center} y2="292" stroke="#8b98aa" />
        <text x="160" y="18" textAnchor="middle">Up（90°）</text>
        <text x="160" y="314" textAnchor="middle">Down（270°）</text>
        <text x="299" y="153" textAnchor="middle">{rightLabel}</text>
        <text x="299" y="170" textAnchor="middle">（0°）</text>
        <text x="21" y="153" textAnchor="middle">{leftLabel}</text>
        <text x="21" y="170" textAnchor="middle">（180°）</text>
        {points.map((point) => (
          <g key={point.marker}>
            <line
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke={point.color}
              strokeWidth={point.marker === 'red' ? 4 : 3}
              markerEnd={`url(#arrow-${point.marker})`}
            />
            <text x={point.x + (point.x >= center ? 8 : -8)} y={point.y - 8} textAnchor={point.x >= center ? 'start' : 'end'} fill={point.color} fontWeight="700">
              {point.label}
            </text>
          </g>
        ))}
        {resultAngle !== null && <text x="12" y="28" fill="#dc2626" fontWeight="700">{formatNumber(resultAngle, decimals)}°</text>}
      </svg>
      <div className="vector-legend">
        <span><i className="dot dot--blue" />プリズム①</span>
        <span><i className="dot dot--green" />プリズム②</span>
        <span><i className="dot dot--red" />合成プリズム</span>
      </div>
    </div>
  )
}
