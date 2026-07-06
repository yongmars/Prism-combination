import type { AppCalculationRecord, AppSettings, CalculationRecord } from '../types'
import { DEFAULT_ANGLES } from './prismMath'

// v2で座標系を「検者が患者を正面から見た向き」に統一しました。
// 旧版の逆向きBI/BO設定を誤って引き継がないよう、保存キーを更新します。
const SETTINGS_KEY = 'prism-combination:settings:v2'
const HISTORY_KEY = 'prism-combination:history:v1'
const CURRENT_KEY = 'prism-combination:current:v1'

export const DEFAULT_SETTINGS: AppSettings = { angles: DEFAULT_ANGLES, decimals: 1 }

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

function normalizeRecord(value: unknown): AppCalculationRecord | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  if (record.kind === 'split') return value as AppCalculationRecord
  // v1の合成履歴にはkindがないため、読み込み時に後方互換変換します。
  if (Array.isArray(record.inputs) && Array.isArray(record.vectors)) {
    return { ...(value as CalculationRecord), kind: 'combine' }
  }
  return null
}

function loadHistory(): AppCalculationRecord[] {
  const values = readJson<unknown[]>(HISTORY_KEY, [])
  return Array.isArray(values) ? values.map(normalizeRecord).filter((value): value is AppCalculationRecord => value !== null) : []
}

function loadCurrent(): AppCalculationRecord | null {
  return normalizeRecord(readJson<unknown | null>(CURRENT_KEY, null))
}

function loadSettings(): AppSettings {
  const saved = readJson<Partial<AppSettings> | null>(SETTINGS_KEY, null)
  if (!saved) return DEFAULT_SETTINGS
  return {
    angles: saved.angles ?? DEFAULT_ANGLES,
    // 旧版の3桁設定は、現在の最大表示桁数である2桁へ移行します。
    decimals: saved.decimals === 1 ? 1 : 2,
  }
}

export const storage = {
  loadSettings,
  saveSettings: (value: AppSettings) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(value)),
  loadHistory,
  saveHistory: (value: AppCalculationRecord[]) => localStorage.setItem(HISTORY_KEY, JSON.stringify(value)),
  loadCurrent,
  saveCurrent: (value: AppCalculationRecord | null) => {
    if (value) localStorage.setItem(CURRENT_KEY, JSON.stringify(value))
    else localStorage.removeItem(CURRENT_KEY)
  },
}
