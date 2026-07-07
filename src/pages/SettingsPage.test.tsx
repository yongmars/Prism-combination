import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('アップデート履歴を最新順のモーダルで表示して閉じられる', async () => {
    const user = userEvent.setup()
    window.location.hash = '#/settings'
    render(<HashRouter><AppProvider><App /></AppProvider></HashRouter>)

    expect(screen.getByRole('button', { name: /アップデート情報\s+Ver\. 1\.1\.0/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /アップデート情報/ }))

    expect(screen.getByRole('dialog', { name: 'アップデート履歴' })).toBeInTheDocument()
    const version110 = screen.getByText('■ Ver. 1.1.0（2026年7月7日）')
    const version101 = screen.getByText('■ Ver. 1.0.1（2026年7月6日）')
    expect(version110.compareDocumentPosition(version101) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByText('成分分解機能を追加しました。')).toBeInTheDocument()
    expect(screen.getByText('アプリアイコンを変更しました。')).toBeInTheDocument()
    expect(screen.getByText('プリズム合成機能を公開しました。')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '閉じる' }))

    expect(screen.queryByRole('dialog', { name: 'アップデート履歴' })).not.toBeInTheDocument()
  })
})
