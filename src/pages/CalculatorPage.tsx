import { ArrowRightLeft, Calculator, CornerUpRight, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DecomposeCalculator } from '../components/DecomposeCalculator'
import { PrismInputCard } from '../components/PrismInputCard'
import { SplitCalculator } from '../components/SplitCalculator'
import { useApp } from '../context/AppContext'
import { calculatePrisms } from '../lib/prismMath'
import type { DraftPrismInput, EyeSide, PrismInput } from '../types'

type CalculatorMode = 'combine' | 'decompose' | 'split'

const initialInputs: [DraftPrismInput, DraftPrismInput] = [
  { magnitude: '', direction: 'BO', customAngle: '' },
  { magnitude: '', direction: 'BU', customAngle: '' },
]

function validateDraft(draft: DraftPrismInput): string | undefined {
  if (draft.magnitude.trim() === '') return 'プリズム量を入力してください。'
  const magnitude = Number(draft.magnitude)
  if (!Number.isFinite(magnitude)) return 'プリズム量を数値で入力してください。'
  if (magnitude < 0) return 'プリズム量は0以上で入力してください。'
  if (draft.direction === 'angle') {
    if (draft.customAngle.trim() === '') return '角度を入力してください。'
    const angle = Number(draft.customAngle)
    if (!Number.isFinite(angle) || angle < 0 || angle > 360) return '角度は0〜360°で入力してください。'
  }
  return undefined
}

export function CalculatorPage() {
  const { settings, setCurrent } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState<CalculatorMode>('combine')
  const [eye, setEye] = useState<EyeSide>('right')
  const [inputs, setInputs] = useState<[DraftPrismInput, DraftPrismInput]>(initialInputs)
  const [errors, setErrors] = useState<Array<string | undefined>>([])

  const calculate = () => {
    const nextErrors = inputs.map(validateDraft)
    setErrors(nextErrors)
    if (nextErrors.some(Boolean)) return
    const parsed = inputs.map((input): PrismInput => ({
      magnitude: Number(input.magnitude),
      direction: input.direction,
      customAngle: input.direction === 'angle' ? Number(input.customAngle) : undefined,
    })) as [PrismInput, PrismInput]
    setCurrent(calculatePrisms(parsed, eye, settings.angles))
    navigate('/result')
  }

  const clear = () => {
    setInputs(initialInputs.map((item) => ({ ...item })) as [DraftPrismInput, DraftPrismInput])
    setErrors([])
  }

  return (
    <div className="page calculator-page">
      <div className="calculator-mode-switch" role="tablist" aria-label="計算モード">
        <button type="button" role="tab" aria-selected={mode === 'combine'} className={mode === 'combine' ? 'active' : ''} onClick={() => setMode('combine')}><Calculator />合成</button>
        <button type="button" role="tab" aria-selected={mode === 'decompose'} className={mode === 'decompose' ? 'active' : ''} onClick={() => setMode('decompose')}><CornerUpRight />成分分解</button>
        <button type="button" role="tab" aria-selected={mode === 'split'} className={mode === 'split' ? 'active' : ''} onClick={() => setMode('split')}><ArrowRightLeft />左右分割</button>
      </div>

      {mode === 'split' ? <SplitCalculator /> : mode === 'decompose' ? <DecomposeCalculator /> : <>
        <section className="eye-selector card" aria-labelledby="eye-title">
          <div><h2 id="eye-title">計算する眼</h2><p>左右眼でBI・BOの角度と表示が切り替わります</p></div>
          <div className="segmented" role="group" aria-label="計算する眼">
            <button type="button" className={eye === 'right' ? 'active' : ''} aria-pressed={eye === 'right'} onClick={() => setEye('right')}>右眼</button>
            <button type="button" className={eye === 'left' ? 'active' : ''} aria-pressed={eye === 'left'} onClick={() => setEye('left')}>左眼</button>
          </div>
        </section>
        {inputs.map((input, index) => <PrismInputCard key={index} index={(index + 1) as 1 | 2} value={input} eye={eye} angles={settings.angles} error={errors[index]} onChange={(value) => {
          const next = [...inputs] as [DraftPrismInput, DraftPrismInput]
          next[index] = value
          setInputs(next)
          if (errors[index]) setErrors(errors.map((item, errorIndex) => errorIndex === index ? undefined : item))
        }} />)}
        <div className="action-card card">
          <button type="button" className="primary-button" onClick={calculate}>計算する</button>
          <button type="button" className="secondary-button" onClick={clear}><RotateCcw size={18} />クリア</button>
        </div>
        <p className="medical-note">本アプリは入力値の数学的な合成を行う計算補助ツールです。</p>
      </>}
    </div>
  )
}
