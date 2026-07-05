import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PwaPrompt } from './components/PwaPrompt'
import { CalculatorPage } from './pages/CalculatorPage'
import { DetailsPage } from './pages/DetailsPage'
import { HistoryPage } from './pages/HistoryPage'
import { ResultPage } from './pages/ResultPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<CalculatorPage />} />
      </Routes>
      <PwaPrompt />
    </Layout>
  )
}
