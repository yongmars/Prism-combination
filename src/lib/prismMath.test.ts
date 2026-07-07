import { describe, expect, it } from 'vitest'
import { angleForEye, calculatePrisms, createDecomposeCalculation, DEFAULT_ANGLES, decomposePrism, normalizeAngle, toVector } from './prismMath'

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
  it('右眼10△ 300°を水平BI・垂直BDへ成分分解する', () => {
    const result = createDecomposeCalculation({ magnitude: 10, direction: 'angle', customAngle: 300 }, 'right', DEFAULT_ANGLES, 'decompose-1')
    expect(result.vector.x).toBeCloseTo(5)
    expect(result.vector.y).toBeCloseTo(-8.6602)
    expect(result.horizontal.magnitude).toBeCloseTo(5)
    expect(result.horizontal.direction).toBe('BI')
    expect(result.vertical.magnitude).toBeCloseTo(8.6602)
    expect(result.vertical.direction).toBe('BD')
  })

  it('左眼では水平成分のBI/BO表示が既存設定どおり反転する', () => {
    const result = createDecomposeCalculation({ magnitude: 10, direction: 'angle', customAngle: 0 }, 'left', DEFAULT_ANGLES, 'decompose-left')
    expect(result.vector.x).toBeCloseTo(10)
    expect(result.horizontal.direction).toBe('BO')
  })

  it('方向ボタン入力でも角度指定と同じ成分になる', () => {
    const fromButton = decomposePrism({ magnitude: 4, direction: 'BU' }, 'right', DEFAULT_ANGLES)
    const fromAngle = decomposePrism({ magnitude: 4, direction: 'angle', customAngle: 90 }, 'right', DEFAULT_ANGLES)
    expect(fromButton.vector.x).toBeCloseTo(fromAngle.vector.x)
    expect(fromButton.vector.y).toBeCloseTo(fromAngle.vector.y)
    expect(fromButton.vertical.direction).toBe('BU')
  })
})
