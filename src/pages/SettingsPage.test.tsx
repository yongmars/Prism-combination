import { render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import App from '../App'
import { AppProvider } from '../context/AppContext'
import { CREATOR_URL } from '../constants/app'

describe('SettingsPage', () => {
  it('作成者リンクと免責事項を表示する', () => {
    window.location.hash = '#/settings'
    render(<HashRouter><AppProvider><App /></AppProvider></HashRouter>)
    const creator = screen.getByRole('link', { name: /視能訓練士 ゆうまるす/ })
    expect(creator).toHaveAttribute('href', CREATOR_URL)
    expect(creator).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('heading', { name: '【免責事項】' })).toBeInTheDocument()
    expect(screen.getByText(/医療機器ではありません/)).toBeInTheDocument()
    expect(screen.getByText(/必ず専門職が確認してください/)).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '1桁 5.8' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.queryByRole('radio', { name: '3桁 5.830' })).not.toBeInTheDocument()
  })
})
