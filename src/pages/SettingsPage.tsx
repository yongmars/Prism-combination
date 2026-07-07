import { ExternalLink, Info, RotateCcw, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { CREATOR_URL } from '../constants/app'
import { UPDATE_HISTORY } from '../constants/updateHistory'
import { angleForEye, normalizeAngle } from '../lib/prismMath'
import type { BaseDirection, DecimalPlaces } from '../types'

const directions: BaseDirection[] = ['BO', 'BU', 'BI', 'BD']
const latestUpdate = UPDATE_HISTORY[0]

export function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useApp()
  const [angles, setAngles] = useState<Record<BaseDirection, string>>(() => Object.fromEntries(directions.map((key) => [key, String(settings.angles[key])])) as Record<BaseDirection, string>)
  const [decimals, setDecimals] = useState<DecimalPlaces>(settings.decimals)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  useEffect(() => {
    setAngles(Object.fromEntries(directions.map((key) => [key, String(settings.angles[key])])) as Record<BaseDirection, string>)
    setDecimals(settings.decimals)
  }, [settings])

  const parsed = Object.fromEntries(directions.map((key) => [key, normalizeAngle(Number(angles[key]))])) as Record<BaseDirection, number>

  const save = () => {
    setMessage('')
    const values = directions.map((key) => Number(angles[key]))
    if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 360)) {
      setError('各角度は0〜360°で入力してください。')
      return
    }
    const normalized = values.map(normalizeAngle)
    if (new Set(normalized).size !== normalized.length) {
      setError('同じ角度に複数の方向を設定することはできません。')
      return
    }
    updateSettings({ angles: parsed, decimals })
    setError('')
    setMessage('設定を保存しました。')
  }

  const reset = () => {
    if (window.confirm('角度対応と表示桁数を既定値に戻しますか？')) {
      resetSettings()
      setError('')
      setMessage('既定値に戻しました。')
    }
  }

  return (
    <div className="page settings-page">
      <div className="coordinate-notice" role="note">
        <strong>検者が患者を正面から見た座標系を使用しています</strong>
        <span>0°＝検者の右、90°＝上、180°＝検者の左、270°＝下</span>
      </div>
      <section className="card settings-section">
        <h2>基底方向の角度対応</h2>
        <p>右眼を基準に設定します。左眼は左右反転して自動計算されます。</p>
        <div className="angle-settings-grid">
          <span className="grid-head">方向</span><span className="grid-head">右眼</span><span className="grid-head">左眼</span>
          {directions.map((direction) => (
            <div className="settings-row" key={direction}>
              <strong>{direction}</strong>
              <label><span className="sr-only">右眼の{direction}</span><input type="number" min="0" max="360" value={angles[direction]} onChange={(event) => setAngles({ ...angles, [direction]: event.target.value })} /><span>°</span></label>
              <output>{Number.isFinite(Number(angles[direction])) ? angleForEye(direction, 'left', parsed) : '—'}°</output>
            </div>
          ))}
        </div>
        <div className="mapping-note">
          <strong>検者基準の座標</strong>
          <span>0°：検者の右　90°：上　180°：検者の左　270°：下</span>
        </div>
      </section>

      <section className="card settings-section">
        <h2>小数点表示桁数</h2>
        <div className="decimal-options" role="radiogroup" aria-label="小数点表示桁数">
          {([1, 2] as DecimalPlaces[]).map((value) => (
            <button type="button" role="radio" aria-checked={decimals === value} className={decimals === value ? 'active' : ''} key={value} onClick={() => setDecimals(value)}>{value}桁<br /><small>{(5.83).toFixed(value)}</small></button>
          ))}
        </div>
      </section>

      {error && <p className="settings-feedback error" role="alert">{error}</p>}
      {message && <p className="settings-feedback success" role="status">{message}</p>}
      <div className="two-actions">
        <button type="button" className="secondary-button" onClick={reset}><RotateCcw size={18} />既定値に戻す</button>
        <button type="button" className="primary-button" onClick={save}><Save size={18} />保存する</button>
      </div>
      <footer className="settings-about">
        <button type="button" className="settings-link-row update-history-button" onClick={() => setIsUpdateModalOpen(true)}>
          <span className="settings-link-label"><Info aria-hidden="true" />アップデート情報</span>
          <span className="settings-link-value">Ver. {latestUpdate.version}</span>
        </button>
        <div className="creator-line">
          <span>作った人：</span>
          <a href={CREATOR_URL} target="_blank" rel="noreferrer">視能訓練士 ゆうまるす <ExternalLink aria-hidden="true" /></a>
        </div>
        <section className="disclaimer" aria-labelledby="disclaimer-title">
          <h2 id="disclaimer-title">【免責事項】</h2>
          <ul>
            <li>本アプリはプリズム計算をサポートする補助ツールであり、<br />医療機器ではありません。</li>
            <li>表示される計算結果は参考値です。<br />実際の検査・処方では、必ず専門職が確認してください。</li>
            <li>左右眼の基底方向の扱いは、設定内容と臨床状況を確認して使用してください。</li>
            <li>本アプリの利用によって生じたトラブルについて、<br />開発者は一切の責任を負いかねます。</li>
          </ul>
        </section>
      </footer>
      {isUpdateModalOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsUpdateModalOpen(false)}>
          <section className="update-history-modal" role="dialog" aria-modal="true" aria-labelledby="update-history-title" onClick={(event) => event.stopPropagation()}>
            <header className="update-history-header">
              <h2 id="update-history-title">アップデート履歴</h2>
              <button type="button" className="modal-close-button" aria-label="アップデート履歴を閉じる" onClick={() => setIsUpdateModalOpen(false)}>
                <X aria-hidden="true" />
              </button>
            </header>
            <div className="update-history-list">
              {UPDATE_HISTORY.map((entry) => (
                <article className="update-history-entry" key={entry.version}>
                  <h3>■ Ver. {entry.version}（{entry.date}）</h3>
                  <ul>
                    {entry.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <footer className="update-history-actions">
              <button type="button" className="primary-button" onClick={() => setIsUpdateModalOpen(false)}>閉じる</button>
            </footer>
          </section>
        </div>
      )}
    </div>
  )
}
