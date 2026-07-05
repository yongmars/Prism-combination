import type {
  AngleSettings,
  BaseDirection,
  CalculationRecord,
  EyeSide,
  PrismInput,
  PrismVector,
} from '../types'

export const DEFAULT_ANGLES: AngleSettings = { BO: 0, BU: 90, BI: 180, BD: 270 }
const ZERO_EPSILON = 1e-10

/** 角度を0度以上360度未満にそろえます。360度は0度として扱います。 */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360
}

/**
 * 右眼を基準に保存した方向を、選択眼の患者基準角度へ変換します。
 * 左眼は垂直軸を中心に鏡映するため 180° - θ となり、BU/BDは変わらず
 * BO/BIの左右だけが入れ替わります。
 */
export function angleForEye(
  direction: BaseDirection,
  eye: EyeSide,
  settings: AngleSettings,
): number {
  const rightEyeAngle = normalizeAngle(settings[direction])
  return eye === 'right' ? rightEyeAngle : normalizeAngle(180 - rightEyeAngle)
}

export function resolveInputAngle(
  input: PrismInput,
  eye: EyeSide,
  settings: AngleSettings,
): number {
  return input.direction === 'angle'
    ? normalizeAngle(input.customAngle ?? 0)
    : angleForEye(input.direction, eye, settings)
}

/**
 * 0°を画面右、90°を上とする直交座標へ変換します。
 * JavaScriptの三角関数はラジアンを使うため、入力角度をπ/180倍します。
 */
export function toVector(magnitude: number, angle: number): PrismVector {
  const normalized = normalizeAngle(angle)
  const radians = (normalized * Math.PI) / 180
  return {
    magnitude,
    angle: normalized,
    x: magnitude * Math.cos(radians),
    y: magnitude * Math.sin(radians),
  }
}

/**
 * 2本のプリズムを成分ごとに加算して合成します。
 * 角度は tan^-1(y/x) ではなく Math.atan2(y, x) を使うことで、
 * xやyの符号を含めた正しい象限を取得します。
 */
export function calculatePrisms(
  inputs: [PrismInput, PrismInput],
  eye: EyeSide,
  settings: AngleSettings,
  id: string = crypto.randomUUID(),
): CalculationRecord {
  const vectors = inputs.map((input) =>
    toVector(input.magnitude, resolveInputAngle(input, eye, settings)),
  ) as [PrismVector, PrismVector]
  const totalX = vectors[0].x + vectors[1].x
  const totalY = vectors[0].y + vectors[1].y
  const resultMagnitude = Math.hypot(totalX, totalY)

  // 互いに打ち消して合成量が0になる場合、方向は数学的に定義できません。
  const resultAngle =
    resultMagnitude < ZERO_EPSILON
      ? null
      : normalizeAngle((Math.atan2(totalY, totalX) * 180) / Math.PI)

  return {
    id,
    eye,
    inputs,
    vectors,
    totalX,
    totalY,
    resultMagnitude: resultMagnitude < ZERO_EPSILON ? 0 : resultMagnitude,
    resultAngle,
    createdAt: new Date().toISOString(),
    saved: false,
  }
}

export function circularDistance(a: number, b: number): number {
  const delta = Math.abs(normalizeAngle(a) - normalizeAngle(b))
  return Math.min(delta, 360 - delta)
}

export const DIRECTION_NAMES: Record<BaseDirection, { en: string; ja: string }> = {
  BU: { en: 'Base Up', ja: '上方' },
  BD: { en: 'Base Down', ja: '下方' },
  BI: { en: 'Base In', ja: '鼻側' },
  BO: { en: 'Base Out', ja: '耳側' },
}

export function describeAngle(
  angle: number | null,
  eye: EyeSide,
  settings: AngleSettings,
): string {
  if (angle === null) return '合成量が0のため方向なし'
  const directions = (Object.keys(settings) as BaseDirection[]).map((direction) => ({
    direction,
    angle: angleForEye(direction, eye, settings),
  }))
  const exact = directions.find((item) => circularDistance(item.angle, angle) < 0.005)
  if (exact) {
    const label = DIRECTION_NAMES[exact.direction]
    return `${label.en}（${label.ja}）`
  }

  const nearest = directions.reduce((best, item) =>
    circularDistance(item.angle, angle) < circularDistance(best.angle, angle) ? item : best,
  )
  const toward = directions
    .filter((item) => item.direction !== nearest.direction)
    .reduce((best, item) => {
      const arcError = Math.abs(
        circularDistance(nearest.angle, item.angle) -
          circularDistance(nearest.angle, angle) -
          circularDistance(angle, item.angle),
      )
      return arcError < best.error ? { item, error: arcError } : best
    }, { item: directions[0], error: Number.POSITIVE_INFINITY }).item
  const base = DIRECTION_NAMES[nearest.direction]
  const target = DIRECTION_NAMES[toward.direction]
  return `${base.en}から約${Math.round(circularDistance(nearest.angle, angle))}° ${target.en}（${target.ja}）方向`
}

export function formatNumber(value: number, decimals: number, signed = false): string {
  const rounded = Math.abs(value) < 10 ** -(decimals + 1) ? 0 : value
  const text = rounded.toFixed(decimals)
  return signed && rounded > 0 ? `+${text}` : text
}
