import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HashRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppContext'
import App from '../App'

function renderApp() {
  return render(<HashRouter><AppProvider><App /></AppProvider></HashRouter>)
}

describe('CalculatorPage', () => {
  it('左右眼の選択でBO表示が反転する', async () => {
    const user = userEvent.setup()
    renderApp()
    expect(screen.getAllByText('180°').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: '左眼' }))
    expect(screen.getAllByText('0°').length).toBeGreaterThan(0)
    expect(screen.getByText(/現在の基底方向：Base Out（0°）/)).toBeInTheDocument()
  })

  it('必須入力を検証する', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: '計算する' }))
    expect(screen.getAllByText('プリズム量を入力してください。')).toHaveLength(2)
  })

  it('サンプルを計算して結果へ遷移する', async () => {
    const user = userEvent.setup()
    renderApp()
    const amounts = screen.getAllByPlaceholderText('例：5.0')
    await user.type(amounts[0], '3')
    await user.type(amounts[1], '4')
    await user.click(screen.getAllByRole('button', { name: /BO/ })[0])
    await user.click(screen.getAllByRole('button', { name: /BU/ })[1])
    await user.click(screen.getByRole('button', { name: '計算する' }))
    expect(await screen.findByText('5.00', { exact: true })).toBeInTheDocument()
    expect(screen.getByText('126.87°')).toBeInTheDocument()
  })

  it('左右分割モードで10△・300°を50:50に分割する', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('tab', { name: '左右分割' }))
    await user.click(screen.getByRole('button', { name: '左右眼に分割する' }))
    expect(screen.getByText('300.00°')).toBeInTheDocument()
    expect(screen.getByText('120.00°')).toBeInTheDocument()
    expect(screen.getAllByText('5.00△')).toHaveLength(2)
    expect(screen.getAllByText('2.50△ BI（鼻側）')).toHaveLength(2)
    expect(screen.getByText('4.33△ BD（下方）')).toBeInTheDocument()
    expect(screen.getByText('4.33△ BU（上方）')).toBeInTheDocument()
  })
})
