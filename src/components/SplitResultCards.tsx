import { DIRECTION_NAMES, formatNumber } from '../lib/prismMath'
import type { PrismSplitResult, SplitEyePrescription } from '../types'

export function SplitResultCards({ result, decimals }: { result: PrismSplitResult; decimals: number }) {
  return (
    <div className="eye-result-grid">
      <EyeResultCard prescription={result.right} decimals={decimals} isSource={result.sourceEye === 'right'} />
      <EyeResultCard prescription={result.left} decimals={decimals} isSource={result.sourceEye === 'left'} />
    </div>
  )
}

function EyeResultCard({ prescription, decimals, isSource }: { prescription: SplitEyePrescription; decimals: number; isSource: boolean }) {
  const componentText = (part: SplitEyePrescription['horizontal']) => part.direction
    ? `${formatNumber(part.magnitude, decimals)}△ ${part.direction}（${DIRECTION_NAMES[part.direction].ja}）`
    : '0△'
  return (
    <article className={`card eye-result-card eye-result-card--${prescription.eye}`}>
      <div className="eye-result-title"><h3>{prescription.eye === 'right' ? '右眼' : '左眼'}</h3><span>{isSource ? '元の眼' : '反対眼'}</span></div>
      <div className="eye-prescription"><strong>{formatNumber(prescription.magnitude, decimals)}△</strong><b>{prescription.angle === null ? '方向なし' : `${formatNumber(prescription.angle, decimals)}°`}</b></div>
      <dl className="component-breakdown">
        <div><dt>水平成分</dt><dd>{componentText(prescription.horizontal)}</dd></div>
        <div><dt>垂直成分</dt><dd>{componentText(prescription.vertical)}</dd></div>
      </dl>
    </article>
  )
}
