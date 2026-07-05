import { describe, expect, it } from 'vitest'
import { DEFAULT_ANGLES } from './prismMath'
import { splitPrismPrescription } from './prismSplit'

describe('splitPrismPrescription', () => {
  it('右眼10△ 300°を50:50で右眼300°・左眼120°へ分割する', () => {
    const result = splitPrismPrescription('right', 10, 300, 0.5, DEFAULT_ANGLES)
    expect(result.right.magnitude).toBeCloseTo(5)
    expect(result.right.angle).toBeCloseTo(300)
    expect(result.left.magnitude).toBeCloseTo(5)
    expect(result.left.angle).toBeCloseTo(120)
  })

  it('既存の検者視点で水平・垂直成分を表示する', () => {
    const result = splitPrismPrescription('right', 10, 300, 0.5, DEFAULT_ANGLES)
    expect(result.right.horizontal.magnitude).toBeCloseTo(2.5)
    expect(result.right.horizontal.direction).toBe('BI')
    expect(result.right.vertical.magnitude).toBeCloseTo(4.3301)
    expect(result.right.vertical.direction).toBe('BD')
    expect(result.left.horizontal.direction).toBe('BI')
    expect(result.left.vertical.direction).toBe('BU')
  })

  it('60:40の割合で量を分ける', () => {
    const result = splitPrismPrescription('right', 10, 300, 0.6, DEFAULT_ANGLES)
    expect(result.right.magnitude).toBeCloseTo(6)
    expect(result.left.magnitude).toBeCloseTo(4)
  })

  it('左眼を元の眼にした場合も反対眼を180°反転する', () => {
    const result = splitPrismPrescription('left', 8, 45, 0.7, DEFAULT_ANGLES)
    expect(result.left.magnitude).toBeCloseTo(5.6)
    expect(result.left.angle).toBeCloseTo(45)
    expect(result.right.magnitude).toBeCloseTo(2.4)
    expect(result.right.angle).toBeCloseTo(225)
  })

  it('片側0%では量0・方向なしを返す', () => {
    const result = splitPrismPrescription('right', 10, 90, 0, DEFAULT_ANGLES)
    expect(result.right.magnitude).toBe(0)
    expect(result.right.angle).toBeNull()
    expect(result.left.magnitude).toBe(10)
    expect(result.left.angle).toBe(270)
  })
})
