import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AppCalculationRecord, AppSettings } from '../types'
import { DEFAULT_SETTINGS, storage } from '../lib/storage'

interface AppContextValue {
  settings: AppSettings
  current: AppCalculationRecord | null
  history: AppCalculationRecord[]
  setCurrent: (record: AppCalculationRecord | null) => void
  saveCurrent: () => void
  openHistoryItem: (record: AppCalculationRecord) => void
  deleteHistoryItem: (id: string) => void
  clearHistory: () => void
  updateSettings: (settings: AppSettings) => void
  resetSettings: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(storage.loadSettings)
  const [current, setCurrentState] = useState(storage.loadCurrent)
  const [history, setHistory] = useState(storage.loadHistory)

  const setCurrent = (record: AppCalculationRecord | null) => {
    setCurrentState(record)
    storage.saveCurrent(record)
  }

  const saveCurrent = () => {
    if (!current || current.saved) return
    const saved = { ...current, saved: true }
    const next = [saved, ...history.filter((item) => item.id !== saved.id)]
    setCurrentState(saved)
    setHistory(next)
    storage.saveCurrent(saved)
    storage.saveHistory(next)
  }

  const openHistoryItem = (record: AppCalculationRecord) => setCurrent(record)

  const deleteHistoryItem = (id: string) => {
    const next = history.filter((item) => item.id !== id)
    setHistory(next)
    storage.saveHistory(next)
  }

  const clearHistory = () => {
    setHistory([])
    storage.saveHistory([])
  }

  const updateSettings = (next: AppSettings) => {
    setSettings(next)
    storage.saveSettings(next)
  }

  const resetSettings = () => updateSettings(DEFAULT_SETTINGS)

  const value = useMemo(
    () => ({
      settings,
      current,
      history,
      setCurrent,
      saveCurrent,
      openHistoryItem,
      deleteHistoryItem,
      clearHistory,
      updateSettings,
      resetSettings,
    }),
    [settings, current, history],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
