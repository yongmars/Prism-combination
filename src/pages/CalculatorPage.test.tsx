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
    const amounts = screen.getAllByPlaceholderText('例：3.0')
    await user.type(amounts[0], '3')
    await user.type(amounts[1], '4')
    await user.click(screen.getAllByRole('button', { name: /BO/ })[0])
    await user.click(screen.getAllByRole('button', { name: /BU/ })[1])
    await user.click(screen.getByRole('button', { name: '計算する' }))
    expect(await screen.findByText('5.0', { exact: true })).toBeInTheDocument()
    expect(screen.getByText('126.9°')).toBeInTheDocument()
  })

  it('左右分割モードで10△・300°を50:50に分割する', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('tab', { name: '左右分割' }))
    await user.type(screen.getByRole('spinbutton', { name: '分割するプリズム量' }), '10')
    await user.type(screen.getByRole('spinbutton', { name: '分割する角度' }), '300')
    await user.click(screen.getByRole('button', { name: '左右眼に分割する' }))
    expect(screen.getByText('300.0°')).toBeInTheDocument()
    expect(screen.getByText('120.0°')).toBeInTheDocument()
    expect(screen.getAllByText('5.0△')).toHaveLength(2)
    expect(screen.getAllByText('2.5△ BI（鼻側）')).toHaveLength(2)
    expect(screen.getByText('4.3△ BD（下方）')).toBeInTheDocument()
    expect(screen.getByText('4.3△ BU（上方）')).toBeInTheDocument()
  })

  it('左右分割結果を保存して履歴から確認できる', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('tab', { name: '左右分割' }))
    await user.type(screen.getByRole('spinbutton', { name: '分割するプリズム量' }), '10')
    await user.type(screen.getByRole('spinbutton', { name: '分割する角度' }), '300')
    await user.click(screen.getByRole('button', { name: '左右眼に分割する' }))
    await user.click(screen.getByRole('button', { name: '保存する' }))
    await user.click(screen.getByRole('link', { name: '履歴' }))
    expect(screen.getByText('右眼 10.0△ 300.0°を分割')).toBeInTheDocument()
    expect(screen.getByText('右 5.0△・左 5.0△')).toBeInTheDocument()
  })

  it('左右分割の詳細に右眼と左眼のベクトル図を表示する', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('tab', { name: '左右分割' }))
    await user.type(screen.getByRole('spinbutton', { name: '分割するプリズム量' }), '10')
    await user.type(screen.getByRole('spinbutton', { name: '分割する角度' }), '300')
    await user.click(screen.getByRole('button', { name: '左右眼に分割する' }))
    await user.click(screen.getByRole('button', { name: '詳細を見る' }))
    expect(screen.getByRole('img', { name: '右眼の分割プリズムベクトル図' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '左眼の分割プリズムベクトル図' })).toBeInTheDocument()
  })
  it('3つの計算モードを合成・成分分解・左右分割の順に表示する', () => {
    renderApp()
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual(['合成', '成分分解', '左右分割'])
  })

  it('成分分解で10△・300°を水平BIと垂直BDに分けて保存できる', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('tab', { name: '成分分解' }))
    const inputs = screen.getAllByRole('spinbutton')
    await user.type(inputs[0], '10')
    await user.type(inputs[1], '300')
    await user.click(screen.getByRole('button', { name: '成分分解する' }))

    expect(screen.getByText('5.0△ BI')).toBeInTheDocument()
    expect(screen.getByText('（鼻側）')).toBeInTheDocument()
    expect(screen.getByText('8.7△ BD')).toBeInTheDocument()
    expect(screen.getByText('（下方）')).toBeInTheDocument()
    expect(screen.getAllByText('+5.0').length).toBeGreaterThan(0)
    expect(screen.getAllByText('-8.7').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /保存/ }))
    await user.click(screen.getByRole('link', { name: /履歴/ }))
    expect(screen.getByText('右眼 10.0△ 300.0°を成分分解')).toBeInTheDocument()
    expect(screen.getByText('水平 5.0△ BI・垂直 8.7△ BD')).toBeInTheDocument()
  })

  it('成分分解の詳細でベクトル図と計算過程を表示する', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('tab', { name: '成分分解' }))
    const inputs = screen.getAllByRole('spinbutton')
    await user.type(inputs[0], '10')
    await user.type(inputs[1], '300')
    await user.click(screen.getByRole('button', { name: '成分分解する' }))
    await user.click(screen.getByRole('button', { name: /詳細/ }))

    expect(screen.getByRole('img', { name: '成分分解プリズムのベクトル図' })).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: /成分/ }))
    expect(screen.getByText('水平成分（x）')).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: /計算/ }))
    expect(screen.getByText('成分分解の計算過程')).toBeInTheDocument()
    expect(screen.getByText(/x = 10.0 × cos\(300.0°\)/)).toBeInTheDocument()
  })
})
