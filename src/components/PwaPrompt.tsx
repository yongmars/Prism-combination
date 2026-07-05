import { RefreshCw, X } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function PwaPrompt() {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW()
  if (!needRefresh) return null
  return (
    <div className="update-banner" role="status">
      <span>新しいバージョンを利用できます</span>
      <button type="button" onClick={() => updateServiceWorker(true)}><RefreshCw size={17} />更新</button>
      <button type="button" className="icon-button" aria-label="閉じる" onClick={() => setNeedRefresh(false)}><X size={18} /></button>
    </div>
  )
}
