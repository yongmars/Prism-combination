import type { DecomposeCalculationRecord } from '../types'
import { formatNumber } from '../lib/prismMath'

interface Props {
  record: DecomposeCalculationRecord
  decimals: number
}

export function DecomposeVectorDiagram({ record, decimals }: Props) {
  const maxMagnitude = Math.max(record.vector.magnitude, record.horizontal.magnitude, record.vertical.magnitude, 1)
  const scale = 112 / maxMagnitude
  const center = 160
  const horizontalX = center + record.vector.x * scale
  const verticalY = center - record.vector.y * scale
  const points = [
    { x: horizontalX, y: center, color: '#2563eb', marker: 'blue', label: `水平 ${formatNumber(record.horizontal.magnitude, decimals)}△` },
    { x: center, y: verticalY, color: '#16a34a', marker: 'green', label: `垂直 ${formatNumber(record.vertical.magnitude, decimals)}△` },
    { x: center + record.vector.x * scale, y: center - record.vector.y * scale, color: '#dc2626', marker: 'red', label: `入力 ${formatNumber(record.vector.magnitude, decimals)}△` },
  ]
  const rightLabel = record.eye === 'right' ? 'In' : 'Out'
  const leftLabel = record.eye === 'right' ? 'Out' : 'In'

  return (
    <div className="vector-wrap">
      <svg className="vector-diagram" viewBox="0 0 320 320" role="img" aria-label="成分分解プリズムのベクトル図">
        <defs>
          {points.map((point) => (
            <marker key={point.marker} id={`decompose-arrow-${point.marker}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
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
              markerEnd={`url(#decompose-arrow-${point.marker})`}
            />
            <text x={point.x + (point.x >= center ? 8 : -8)} y={point.y - 8} textAnchor={point.x >= center ? 'start' : 'end'} fill={point.color} fontWeight="700">
              {point.label}
            </text>
          </g>
        ))}
        <text x="12" y="28" fill="#dc2626" fontWeight="700">{formatNumber(record.vector.angle, decimals)}°</text>
      </svg>
      <div className="vector-legend">
        <span><i className="dot dot--blue" />水平成分</span>
        <span><i className="dot dot--green" />垂直成分</span>
        <span><i className="dot dot--red" />入力された合成プリズム</span>
      </div>
    </div>
  )
}
