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
    expect(screen.getAllByText('0°').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: '左眼' }))
    expect(screen.getAllByText('180°').length).toBeGreaterThan(0)
    expect(screen.getByText(/現在の基底方向：Base Out（180°）/)).toBeInTheDocument()
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
    expect(screen.getByText('53.13°')).toBeInTheDocument()
  })
})
