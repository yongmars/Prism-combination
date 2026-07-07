import { ChevronRight, History, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { DIRECTION_NAMES, formatNumber } from '../lib/prismMath'
import type { AppCalculationRecord, PrismComponentPart } from '../types'

export function HistoryPage() {
  const { history, settings, openHistoryItem, deleteHistoryItem, clearHistory } = useApp()
  const navigate = useNavigate()
  const clearAll = () => { if (window.confirm('保存した履歴をすべて削除しますか？')) clearHistory() }
  const d = settings.decimals

  return <div className="page history-page">
    {history.length > 0 && <button type="button" className="clear-history" onClick={clearAll}><Trash2 />すべて削除</button>}
    {history.length === 0 ? <div className="empty-state card"><History /><h2>保存した計算はありません</h2><p>計算結果の「保存する」を押すと、ここからいつでも見返せます。</p><button className="primary-button" onClick={() => navigate('/')}>計算を始める</button></div>
      : <div className="history-list">{history.map((record) => <HistoryItem key={record.id} record={record} decimals={d} open={() => { openHistoryItem(record); navigate('/result') }} remove={() => deleteHistoryItem(record.id)} />)}</div>}
    {history.length > 0 && <p className="history-help">方向記号：{Object.entries(DIRECTION_NAMES).map(([key, value]) => `${key}=${value.en}`).join('、')}</p>}
  </div>
}

function HistoryItem({ record, decimals, open, remove }: { record: AppCalculationRecord; decimals: number; open: () => void; remove: () => void }) {
  const componentText = (part: PrismComponentPart) => part.direction ? `${formatNumber(part.magnitude, decimals)}△ ${part.direction}` : `${formatNumber(0, decimals)}△`
  const label = record.kind === 'split'
    ? `${record.sourceEye === 'right' ? '右眼' : '左眼'} ${formatNumber(record.originalMagnitude, decimals)}△ ${formatNumber(record.originalAngle, decimals)}°を分割`
    : record.kind === 'decompose'
      ? `${record.eye === 'right' ? '右眼' : '左眼'} ${formatNumber(record.input.magnitude, decimals)}△ ${formatNumber(record.vector.angle, decimals)}°を成分分解`
      : record.inputs.map((input) => `${formatNumber(input.magnitude, decimals)}△ ${input.direction === 'angle' ? `${formatNumber(input.customAngle ?? 0, decimals)}°` : input.direction}`).join(' + ')
  const result = record.kind === 'split'
    ? `右 ${formatNumber(record.right.magnitude, decimals)}△・左 ${formatNumber(record.left.magnitude, decimals)}△`
    : record.kind === 'decompose'
      ? `水平 ${componentText(record.horizontal)}・垂直 ${componentText(record.vertical)}`
      : `${formatNumber(record.resultMagnitude, decimals)}△ @${record.resultAngle === null ? '方向なし' : `${formatNumber(record.resultAngle, decimals)}°`}`
  const kindLabel = record.kind === 'split' ? '左右分割' : record.kind === 'decompose' ? '成分分解' : '合成'

  return <article className="history-item card">
    <button type="button" className="history-open" onClick={open} aria-label={`${label}の結果を開く`}>
      <span className="history-main"><strong>{label}</strong><small><i className={`history-kind history-kind--${record.kind}`}>{kindLabel}</i> {new Intl.DateTimeFormat('ja-JP', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(record.createdAt))}</small></span>
      <span className="history-result">{result}</span><ChevronRight />
    </button>
    <button type="button" className="delete-item" aria-label={`${label}を削除`} onClick={remove}><Trash2 /></button>
  </article>
}
