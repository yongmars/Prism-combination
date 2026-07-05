export type EyeSide = 'right' | 'left'
export type BaseDirection = 'BO' | 'BU' | 'BI' | 'BD'
export type DirectionMode = BaseDirection | 'angle'
export type DecimalPlaces = 1 | 2 | 3

export interface PrismInput {
  magnitude: number
  direction: DirectionMode
  customAngle?: number
}

export interface PrismVector {
  magnitude: number
  angle: number
  x: number
  y: number
}

export interface AngleSettings {
  BO: number
  BU: number
  BI: number
  BD: number
}

export interface AppSettings {
  angles: AngleSettings
  decimals: DecimalPlaces
}

export interface CalculationRecord {
  id: string
  eye: EyeSide
  inputs: [PrismInput, PrismInput]
  vectors: [PrismVector, PrismVector]
  totalX: number
  totalY: number
  resultMagnitude: number
  resultAngle: number | null
  createdAt: string
  saved: boolean
}

export interface DraftPrismInput {
  magnitude: string
  direction: DirectionMode
  customAngle: string
}
