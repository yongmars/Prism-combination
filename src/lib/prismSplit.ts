import type {
  AngleSettings,
  BaseDirection,
  EyeSide,
  PrismComponentPart,
  PrismSplitResult,
  SplitEyePrescription,
} from '../types'
import { angleForEye, circularDistance, normalizeAngle, toVector } from './prismMath'

const EPSILON = 1e-10

function closestDirection(
  componentAngle: number,
  candidates: [BaseDirection, BaseDirection],
  eye: EyeSide,
  settings: AngleSettings,
): BaseDirection {
  return candidates.reduce((best, direction) =>
    circularDistance(componentAngle, angleForEye(direction, eye, settings)) <
    circularDistance(componentAngle, angleForEye(best, eye, settings))
      ? direction
      : best,
  )
}

function component(
  value: number,
  positiveAngle: number,
  negativeAngle: number,
  candidates: [BaseDirection, BaseDirection],
  eye: EyeSide,
  settings: AngleSettings,
): PrismComponentPart {
  if (Math.abs(value) < EPSILON) return { magnitude: 0, direction: null }
  return {
    magnitude: Math.abs(value),
    direction: closestDirection(value > 0 ? positiveAngle : negativeAngle, candidates, eye, settings),
  }
}

function makePrescription(
  eye: EyeSide,
  magnitude: number,
  angle: number,
  settings: AngleSettings,
): SplitEyePrescription {
  const normalizedMagnitude = magnitude < EPSILON ? 0 : magnitude
  const normalizedAngle = normalizeAngle(angle)
  const vector = toVector(normalizedMagnitude, normalizedAngle)
  return {
    eye,
    magnitude: normalizedMagnitude,
    angle: normalizedMagnitude === 0 ? null : normalizedAngle,
    vector,
    horizontal: component(vector.x, 0, 180, ['BO', 'BI'], eye, settings),
    vertical: component(vector.y, 90, 270, ['BU', 'BD'], eye, settings),
  }
}

/**
 * 片眼のプリズムを元の眼と反対眼へ割合分割します。
 *
 * 反対眼へ移すベクトルは、水平成分ではBI/BOが左右反転し、垂直成分では
 * BU/BDが反転するため、検者座標上では元の角度へ180°を加えた向きになります。
 * 例：右眼300°の半分を左眼へ移すと、左眼では120°です。
 */
export function splitPrismPrescription(
  sourceEye: EyeSide,
  magnitude: number,
  angle: number,
  sourceShare: number,
  settings: AngleSettings,
): PrismSplitResult {
  if (!Number.isFinite(magnitude) || magnitude < 0) throw new Error('プリズム量は0以上で指定してください。')
  if (!Number.isFinite(angle) || angle < 0 || angle > 360) throw new Error('角度は0〜360°で指定してください。')
  if (!Number.isFinite(sourceShare) || sourceShare < 0 || sourceShare > 1) throw new Error('分割割合は0〜100%で指定してください。')

  const fellowEye: EyeSide = sourceEye === 'right' ? 'left' : 'right'
  const fellowShare = 1 - sourceShare
  const sourcePrescription = makePrescription(sourceEye, magnitude * sourceShare, angle, settings)
  const fellowPrescription = makePrescription(fellowEye, magnitude * fellowShare, angle + 180, settings)

  return {
    sourceEye,
    sourceShare,
    fellowShare,
    right: sourceEye === 'right' ? sourcePrescription : fellowPrescription,
    left: sourceEye === 'left' ? sourcePrescription : fellowPrescription,
  }
}
