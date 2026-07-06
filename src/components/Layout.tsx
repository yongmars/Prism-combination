import { Calculator, History, Settings } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { APP_NAME } from '../constants/app'

const titles: Record<string, string> = {
  '/': APP_NAME,
  '/result': '計算結果',
  '/details': '詳細結果',
  '/history': '履歴一覧',
  '/settings': '設定',
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="brand-mark" aria-hidden="true"><img src="/icons/icon192.png" alt="" /></span>
        <h1>{titles[pathname] ?? APP_NAME}</h1>
        <span className="header-spacer" />
      </header>
      <main className="main-content">{children}</main>
      <nav className="bottom-nav" aria-label="メインナビゲーション">
        <NavLink to="/" end><Calculator /><span>計算</span></NavLink>
        <NavLink to="/history"><History /><span>履歴</span></NavLink>
        <NavLink to="/settings"><Settings /><span>設定</span></NavLink>
      </nav>
    </div>
  )
}
