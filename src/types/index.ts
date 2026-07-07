export type EyeSide = 'right' | 'left'
export type BaseDirection = 'BO' | 'BU' | 'BI' | 'BD'
export type DirectionMode = BaseDirection | 'angle'
export type DecimalPlaces = 1 | 2

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
  kind: 'combine'
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

export interface PrismComponentPart {
  magnitude: number
  direction: BaseDirection | null
}

export interface DecomposeCalculationRecord {
  kind: 'decompose'
  id: string
  eye: EyeSide
  input: PrismInput
  vector: PrismVector
  horizontal: PrismComponentPart
  vertical: PrismComponentPart
  createdAt: string
  saved: boolean
}

export interface SplitEyePrescription {
  eye: EyeSide
  magnitude: number
  angle: number | null
  vector: PrismVector
  horizontal: PrismComponentPart
  vertical: PrismComponentPart
}

export interface PrismSplitResult {
  sourceEye: EyeSide
  sourceShare: number
  fellowShare: number
  right: SplitEyePrescription
  left: SplitEyePrescription
}

export interface SplitCalculationRecord extends PrismSplitResult {
  kind: 'split'
  id: string
  originalMagnitude: number
  originalAngle: number
  createdAt: string
  saved: boolean
}

export type AppCalculationRecord = CalculationRecord | DecomposeCalculationRecord | SplitCalculationRecord
