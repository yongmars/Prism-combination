import { ChevronRight, History, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { DIRECTION_NAMES, formatNumber } from '../lib/prismMath'

export function HistoryPage() {
  const { history, settings, openHistoryItem, deleteHistoryItem, clearHistory } = useApp()
  const navigate = useNavigate()

  const clearAll = () => {
    if (window.confirm('保存した履歴をすべて削除しますか？')) clearHistory()
  }

  return (
    <div className="page history-page">
      {history.length > 0 && <button type="button" className="clear-history" onClick={clearAll}><Trash2 />すべて削除</button>}
      {history.length === 0 ? (
        <div className="empty-state card">
          <History />
          <h2>保存した計算はありません</h2>
          <p>計算結果の「保存する」を押すと、ここからいつでも見直せます。</p>
          <button className="primary-button" onClick={() => navigate('/')}>計算を始める</button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((record) => {
            const label = record.inputs.map((input) => `${formatNumber(input.magnitude, settings.decimals)}△ ${input.direction === 'angle' ? `${formatNumber(input.customAngle ?? 0, settings.decimals)}°` : input.direction}`).join(' + ')
            return (
              <article key={record.id} className="history-item card">
                <button
                  type="button"
                  className="history-open"
                  onClick={() => { openHistoryItem(record); navigate('/result') }}
                  aria-label={`${label}の結果を開く`}
                >
                  <span className="history-main">
                    <strong>{label}</strong>
                    <small>{record.eye === 'right' ? '右眼' : '左眼'} ・ {new Intl.DateTimeFormat('ja-JP', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(record.createdAt))}</small>
                  </span>
                  <span className="history-result">{formatNumber(record.resultMagnitude, settings.decimals)}△ <small>@{record.resultAngle === null ? '方向なし' : `${formatNumber(record.resultAngle, settings.decimals)}°`}</small></span>
                  <ChevronRight />
                </button>
                <button type="button" className="delete-item" aria-label={`${label}を削除`} onClick={() => deleteHistoryItem(record.id)}><Trash2 /></button>
              </article>
            )
          })}
        </div>
      )}
      {history.length > 0 && <p className="history-help">方向略号：{Object.entries(DIRECTION_NAMES).map(([key, value]) => `${key}=${value.en}`).join('、')}</p>}
    </div>
  )
}
