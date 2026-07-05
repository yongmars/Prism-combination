import type { AppSettings, CalculationRecord } from '../types'
import { DEFAULT_ANGLES } from './prismMath'

// v2で座標系を「検者が患者を正面から見た向き」に統一しました。
// 旧版の逆向きBI/BO設定を誤って引き継がないよう、保存キーを更新します。
const SETTINGS_KEY = 'prism-combination:settings:v2'
const HISTORY_KEY = 'prism-combination:history:v1'
const CURRENT_KEY = 'prism-combination:current:v1'

export const DEFAULT_SETTINGS: AppSettings = { angles: DEFAULT_ANGLES, decimals: 2 }

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export const storage = {
  loadSettings: () => readJson<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS),
  saveSettings: (value: AppSettings) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(value)),
  loadHistory: () => readJson<CalculationRecord[]>(HISTORY_KEY, []),
  saveHistory: (value: CalculationRecord[]) => localStorage.setItem(HISTORY_KEY, JSON.stringify(value)),
  loadCurrent: () => readJson<CalculationRecord | null>(CURRENT_KEY, null),
  saveCurrent: (value: CalculationRecord | null) => {
    if (value) localStorage.setItem(CURRENT_KEY, JSON.stringify(value))
    else localStorage.removeItem(CURRENT_KEY)
  },
}
