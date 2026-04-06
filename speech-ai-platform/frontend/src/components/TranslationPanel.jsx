import React, { useState, useEffect } from 'react'
import { Languages, Copy, Check, ChevronDown, Loader } from 'lucide-react'
import { translateText, getLanguages } from '../api/speechApi'

export default function TranslationPanel({ sourceText }) {
  const [languages, setLanguages] = useState([])
  const [targetLang, setTargetLang] = useState('English')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getLanguages().then(d => setLanguages(d.languages)).catch(() => {})
  }, [])

  // Reset when source changes
  useEffect(() => { setResult(null); setError('') }, [sourceText])

  const handleTranslate = async () => {
    if (!sourceText?.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await translateText(sourceText, targetLang)
      setResult(data)
    } catch (e) {
      setError(e.response?.data?.error || 'Translation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyTranslation = async () => {
    if (!result?.translated_text) return
    await navigator.clipboard.writeText(result.translated_text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card animate-fadeUp" style={{ animationDelay: '0.1s' }}>
      <div className="card-header">
        <div className="card-title">
          <div className="card-icon" style={{ background: 'rgba(255, 107, 53, 0.12)' }}>
            <Languages size={18} color="var(--accent-warm)" />
          </div>
          <span>Translation</span>
        </div>
        {result && (
          <span className="badge badge-success">
            <Check size={12} /> Translated
          </span>
        )}
      </div>

      {!sourceText ? (
        <div className="panel-empty">
          <Languages size={28} color="var(--text-muted)" />
          <p>Transcribe audio first to enable translation</p>
        </div>
      ) : (
        <>
          <div className="translate-controls">
            <div className="lang-select-row">
              <div className="lang-badge detected">
                <span className="lang-label">From</span>
                <span className="lang-value">
                  {result?.detected_source_language || 'Auto-detect'}
                </span>
              </div>

              <div className="lang-arrow">→</div>

              <div className="select-wrapper" style={{ flex: 1 }}>
                <select
                  className="select-native"
                  value={targetLang}
                  onChange={e => setTargetLang(e.target.value)}
                  disabled={loading}
                >
                  {languages.length > 0
                    ? languages.map(l => (
                        <option key={l.code} value={l.name}>
                          {l.native} — {l.name}
                        </option>
                      ))
                    : (
                      ['English','Hindi', 'Spanish', 'French', 'German', 'Chinese (Simplified)',
                       'Japanese', 'Arabic', 'Portuguese', 'Russian'].map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))
                    )
                  }
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>

            <button
              className="btn btn-primary w-full"
              onClick={handleTranslate}
              disabled={loading || !sourceText}
              style={{ marginTop: 12 }}
            >
              {loading
                ? <><span className="spinner" /> Translating…</>
                : <><Languages size={16} /> Translate to {targetLang}</>
              }
            </button>
          </div>

          {error && (
            <div className="panel-error">{error}</div>
          )}

          {loading && (
            <div className="panel-loading">
              <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, width: '75%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, width: '82%' }} />
            </div>
          )}

          {result && !loading && (
            <div className="translation-result animate-scaleIn">
              <div className="result-header">
                <span className="result-lang-tag">{targetLang}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {result.confidence && (
                    <span className="text-xs text-muted">
                      {(result.confidence * 100).toFixed(0)}% confidence
                    </span>
                  )}
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={copyTranslation}
                    style={{ padding: '4px 10px' }}
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="translation-text">
                {result.translated_text}
              </div>
              {result.notes && (
                <p className="translation-notes">
                  <strong>Note:</strong> {result.notes}
                </p>
              )}
            </div>
          )}
        </>
      )}

      <style>{`
        .panel-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 36px 0;
          color: var(--text-muted);
          font-size: 14px;
          text-align: center;
        }

        .panel-error {
          padding: 12px 16px;
          background: rgba(255,71,87,0.08);
          border: 1px solid rgba(255,71,87,0.2);
          border-radius: var(--radius-md);
          color: var(--error);
          font-size: 13px;
          margin-top: 12px;
        }

        .panel-loading {
          margin-top: 16px;
          padding: 16px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
        }

        .translate-controls { }

        .lang-select-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .lang-badge {
          display: flex;
          flex-direction: column;
          padding: 8px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          flex-shrink: 0;
          min-width: 90px;
        }

        .lang-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 2px;
        }

        .lang-value {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .lang-arrow {
          color: var(--text-muted);
          font-size: 18px;
          flex-shrink: 0;
        }

        .translation-result {
          margin-top: 16px;
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-primary);
        }

        .result-lang-tag {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--accent-warm);
        }

        .translation-text {
          padding: 16px;
          font-size: 14px;
          line-height: 1.8;
          color: var(--text-primary);
          max-height: 220px;
          overflow-y: auto;
          white-space: pre-wrap;
          background: var(--bg-secondary);
        }

        .translation-notes {
          padding: 10px 14px;
          font-size: 12px;
          color: var(--text-muted);
          background: var(--bg-tertiary);
          border-top: 1px solid var(--border-primary);
        }
      `}</style>
    </div>
  )
}
