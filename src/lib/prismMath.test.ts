import { describe, expect, it } from 'vitest'
import { angleForEye, calculatePrisms, DEFAULT_ANGLES, normalizeAngle, toVector } from './prismMath'

describe('prismMath', () => {
  it('検者視点の右眼で3△ BO + 4△ BUを5△・126.87°に合成する', () => {
    const result = calculatePrisms(
      [{ magnitude: 3, direction: 'BO' }, { magnitude: 4, direction: 'BU' }],
      'right',
      DEFAULT_ANGLES,
      'sample-1',
    )
    expect(result.totalX).toBeCloseTo(-3)
    expect(result.totalY).toBeCloseTo(4)
    expect(result.resultMagnitude).toBeCloseTo(5)
    expect(result.resultAngle).toBeCloseTo(126.8699)
  })

  it('検者視点の右眼で5△ BU + 3△ BIを約5.83△・59.04°に合成する', () => {
    const result = calculatePrisms(
      [{ magnitude: 5, direction: 'BU' }, { magnitude: 3, direction: 'BI' }],
      'right',
      DEFAULT_ANGLES,
      'sample-2',
    )
    expect(result.totalX).toBeCloseTo(3)
    expect(result.totalY).toBeCloseTo(5)
    expect(result.resultMagnitude).toBeCloseTo(Math.sqrt(34))
    expect(result.resultAngle).toBeCloseTo(59.0363)
  })

  it('角度を0〜360°に正規化する', () => {
    expect(normalizeAngle(360)).toBe(0)
    expect(normalizeAngle(-1)).toBe(359)
    expect(normalizeAngle(721)).toBe(1)
  })

  it('atan2で各象限の角度を保つ', () => {
    expect(toVector(1, 45).x).toBeGreaterThan(0)
    expect(toVector(1, 135).x).toBeLessThan(0)
    expect(toVector(1, 225).y).toBeLessThan(0)
    expect(toVector(1, 315).x).toBeGreaterThan(0)
  })

  it('逆向き同量では合成角度を定義しない', () => {
    const result = calculatePrisms(
      [{ magnitude: 3, direction: 'BO' }, { magnitude: 3, direction: 'BI' }],
      'right',
      DEFAULT_ANGLES,
      'zero',
    )
    expect(result.resultMagnitude).toBe(0)
    expect(result.resultAngle).toBeNull()
  })

  it('左眼ではBIとBOを左右反転する', () => {
    expect(angleForEye('BO', 'right', DEFAULT_ANGLES)).toBe(180)
    expect(angleForEye('BO', 'left', DEFAULT_ANGLES)).toBe(0)
    expect(angleForEye('BI', 'right', DEFAULT_ANGLES)).toBe(0)
    expect(angleForEye('BI', 'left', DEFAULT_ANGLES)).toBe(180)
    expect(angleForEye('BU', 'left', DEFAULT_ANGLES)).toBe(90)
  })

  it('変更した角度設定も左眼へ反映する', () => {
    expect(angleForEye('BO', 'left', { ...DEFAULT_ANGLES, BO: 165 })).toBe(15)
  })
})
