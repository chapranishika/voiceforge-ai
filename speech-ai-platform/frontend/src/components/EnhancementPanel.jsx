import React, { useState } from 'react'
import { Wand2, Copy, Check, ArrowRight } from 'lucide-react'
import { enhanceText } from '../api/speechApi'

const TYPES = [
  { value: 'grammar',   label: 'Grammar Fix',  icon: '✏️', desc: 'Fix errors, improve structure' },
  { value: 'formal',    label: 'Formal',        icon: '💼', desc: 'Professional, business tone' },
  { value: 'casual',    label: 'Casual',        icon: '💬', desc: 'Friendly, conversational tone' },
  { value: 'technical', label: 'Technical',     icon: '⚙️', desc: 'Precise technical language' },
]

export default function EnhancementPanel({ sourceText }) {
  const [enhType, setEnhType] = useState('grammar')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedOrig, setCopiedOrig] = useState(false)
  const [copiedEnh, setCopiedEnh] = useState(false)

  const handleEnhance = async () => {
    if (!sourceText?.trim()) return
    setLoading(true)
    setError('')
    try {
      const data = await enhanceText(sourceText, enhType)
      setResult(data)
    } catch (e) {
      setError(e.response?.data?.error || 'Enhancement failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copy = async (text, which) => {
    await navigator.clipboard.writeText(text)
    if (which === 'orig') { setCopiedOrig(true); setTimeout(() => setCopiedOrig(false), 2000) }
    else { setCopiedEnh(true); setTimeout(() => setCopiedEnh(false), 2000) }
  }

  const downloadEnhanced = () => {
    if (!result?.enhanced_text) return
    const blob = new Blob([result.enhanced_text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `enhanced-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card animate-fadeUp" style={{ animationDelay: '0.3s' }}>
      <div className="card-header">
        <div className="card-title">
          <div className="card-icon" style={{ background: 'rgba(0, 212, 170, 0.12)' }}>
            <Wand2 size={18} color="var(--accent-secondary)" />
          </div>
          <span>AI Enhancement</span>
        </div>
        {result && (
          <span className="badge badge-success">
            <Check size={12} /> Enhanced
          </span>
        )}
      </div>

      {!sourceText ? (
        <div className="panel-empty">
          <Wand2 size={28} color="var(--text-muted)" />
          <p>Transcribe audio first to enhance the text</p>
        </div>
      ) : (
        <>
          {/* Type buttons */}
          <div className="enh-type-grid">
            {TYPES.map(t => (
              <button
                key={t.value}
                className={`enh-type-btn ${enhType === t.value ? 'active' : ''}`}
                onClick={() => setEnhType(t.value)}
                disabled={loading}
              >
                <span className="enh-icon">{t.icon}</span>
                <div className="enh-info">
                  <span className="enh-name">{t.label}</span>
                  <span className="enh-desc">{t.desc}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={handleEnhance}
            disabled={loading}
            style={{ marginBottom: 16 }}
          >
            {loading
              ? <><span className="spinner" /> Enhancing…</>
              : <><Wand2 size={16} /> Enhance with {TYPES.find(t => t.value === enhType)?.label}</>
            }
          </button>

          {error && <div className="panel-error">{error}</div>}

          {loading && (
            <div className="panel-loading">
              {[0.95, 0.8, 0.88, 0.7, 0.92].map((w, i) => (
                <div key={i} className="skeleton" style={{ height: 13, width: `${w * 100}%`, marginBottom: 8, borderRadius: 4 }} />
              ))}
            </div>
          )}

          {result && !loading && (
            <div className="enh-result animate-scaleIn">
              {/* Stats */}
              {result.changes_made && (
                <div className="enh-stats">
                  <span className="enh-stat-item">
                    <strong>{result.change_count || '~'}</strong> corrections
                  </span>
                  <span className="enh-stat-divider">·</span>
                  <span className="enh-stat-desc">{result.changes_made}</span>
                </div>
              )}

              {/* Side-by-side */}
              <div className="enh-comparison">
                <div className="enh-col">
                  <div className="enh-col-header">
                    <span>Original</span>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }} onClick={() => copy(sourceText, 'orig')}>
                      {copiedOrig ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div className="enh-text original-text">{sourceText}</div>
                </div>

                <div className="enh-arrow">
                  <ArrowRight size={18} color="var(--accent-secondary)" />
                </div>

                <div className="enh-col">
                  <div className="enh-col-header">
                    <span style={{ color: 'var(--accent-secondary)' }}>Enhanced</span>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px' }} onClick={() => copy(result.enhanced_text, 'enh')}>
                      {copiedEnh ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div className="enh-text enhanced-text">{result.enhanced_text}</div>
                </div>
              </div>

              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary btn-sm" onClick={downloadEnhanced}>
                  Download Enhanced .TXT
                </button>
              </div>
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
          margin-bottom: 12px;
        }
        .panel-loading {
          padding: 16px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
        }

        .enh-type-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 14px;
        }

        .enh-type-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: var(--bg-tertiary);
          border: 1.5px solid var(--border-primary);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .enh-type-btn:hover:not(:disabled) {
          border-color: var(--accent-secondary);
          background: rgba(0, 212, 170, 0.04);
        }

        .enh-type-btn.active {
          border-color: var(--accent-secondary);
          background: rgba(0, 212, 170, 0.08);
        }

        .enh-icon { font-size: 18px; flex-shrink: 0; }
        .enh-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .enh-name {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
        }
        .enh-type-btn.active .enh-name { color: var(--accent-secondary); }
        .enh-desc { font-size: 11px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .enh-result {
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .enh-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(0, 212, 170, 0.06);
          border-bottom: 1px solid var(--border-primary);
          font-size: 12px;
          color: var(--text-secondary);
        }

        .enh-stat-item strong { color: var(--accent-secondary); }
        .enh-stat-divider { color: var(--border-secondary); }
        .enh-stat-desc { color: var(--text-muted); flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .enh-comparison {
          display: flex;
          gap: 0;
        }

        .enh-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .enh-col-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-primary);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .enh-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
          background: var(--bg-tertiary);
          border-left: 1px solid var(--border-primary);
          border-right: 1px solid var(--border-primary);
          align-self: stretch;
        }

        .enh-text {
          padding: 14px;
          font-size: 13px;
          line-height: 1.75;
          height: 180px;
          overflow-y: auto;
          white-space: pre-wrap;
        }

        .original-text {
          color: var(--text-secondary);
          background: var(--bg-secondary);
        }

        .enhanced-text {
          color: var(--text-primary);
          background: var(--bg-secondary);
        }

        @media (max-width: 600px) {
          .enh-comparison { flex-direction: column; }
          .enh-arrow { padding: 8px; border: none; border-top: 1px solid var(--border-primary); border-bottom: 1px solid var(--border-primary); }
          .enh-arrow svg { transform: rotate(90deg); }
          .enh-text { height: 120px; }
        }
      `}</style>
    </div>
  )
}
