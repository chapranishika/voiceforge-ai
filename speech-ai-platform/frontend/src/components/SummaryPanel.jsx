import React, { useState } from 'react'
import { Sparkles, Copy, Check, RefreshCw, Tag } from 'lucide-react'
import { summarizeText } from '../api/speechApi'

const STYLES = [
  { value: 'concise',       label: 'Concise',       desc: '2–3 sentences' },
  { value: 'detailed',      label: 'Detailed',      desc: 'Full paragraph' },
  { value: 'bullet_points', label: 'Bullet Points', desc: 'Key takeaways' },
  { value: 'executive',     label: 'Executive',     desc: 'Business format' },
]

const SENTIMENT_COLOR = {
  positive: 'var(--success)',
  negative: 'var(--error)',
  neutral: 'var(--text-muted)',
  mixed: 'var(--warning)',
}

export default function SummaryPanel({ sourceText }) {
  const [style, setStyle] = useState('concise')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSummarize = async () => {
    if (!sourceText?.trim()) return
    setLoading(true)
    setError('')
    try {
      const data = await summarizeText(sourceText, style)
      setResult(data)
    } catch (e) {
      setError(e.response?.data?.error || 'Summarization failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copySummary = async () => {
    if (!result?.summary) return
    await navigator.clipboard.writeText(result.summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sentimentEmoji = { positive: '😊', negative: '😔', neutral: '😐', mixed: '🤔' }

  return (
    <div className="card animate-fadeUp" style={{ animationDelay: '0.2s' }}>
      <div className="card-header">
        <div className="card-title">
          <div className="card-icon" style={{ background: 'rgba(124, 92, 252, 0.12)' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
          </div>
          <span>AI Summary</span>
        </div>
        {result && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleSummarize}
              disabled={loading}
              data-tooltip="Regenerate"
            >
              <RefreshCw size={13} />
            </button>
            <button className="btn btn-ghost btn-sm" onClick={copySummary}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>

      {!sourceText ? (
        <div className="panel-empty">
          <Sparkles size={28} color="var(--text-muted)" />
          <p>Transcribe audio first to generate a summary</p>
        </div>
      ) : (
        <>
          {/* Style picker */}
          <div className="style-grid">
            {STYLES.map(s => (
              <button
                key={s.value}
                className={`style-btn ${style === s.value ? 'active' : ''}`}
                onClick={() => setStyle(s.value)}
                disabled={loading}
              >
                <span className="style-name">{s.label}</span>
                <span className="style-desc">{s.desc}</span>
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={handleSummarize}
            disabled={loading}
            style={{ marginBottom: 16 }}
          >
            {loading
              ? <><span className="spinner" /> Summarizing…</>
              : <><Sparkles size={16} /> Generate {STYLES.find(s => s.value === style)?.label} Summary</>
            }
          </button>

          {error && <div className="panel-error">{error}</div>}

          {loading && (
            <div className="panel-loading">
              {[1, 0.8, 0.9, 0.6].map((w, i) => (
                <div key={i} className="skeleton" style={{ height: 14, width: `${w * 100}%`, marginBottom: 8, borderRadius: 4 }} />
              ))}
            </div>
          )}

          {result && !loading && (
            <div className="summary-result animate-scaleIn">
              {/* Meta chips */}
              {(result.sentiment || result.topics?.length > 0) && (
                <div className="summary-meta">
                  {result.sentiment && (
                    <div className="meta-chip">
                      <span>{sentimentEmoji[result.sentiment]}</span>
                      <span style={{ color: SENTIMENT_COLOR[result.sentiment], fontWeight: 600 }}>
                        {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                      </span>
                    </div>
                  )}
                  {result.word_count && (
                    <div className="meta-chip">
                      <span>{result.word_count} words</span>
                    </div>
                  )}
                </div>
              )}

              {/* Summary text */}
              <div className="summary-text">{result.summary}</div>

              {/* Topics */}
              {result.topics?.length > 0 && (
                <div className="topics-section">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Tag size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Key Topics
                    </span>
                  </div>
                  <div className="topics-list">
                    {result.topics.map((topic, i) => (
                      <span key={i} className="topic-chip">{topic}</span>
                    ))}
                  </div>
                </div>
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
          margin-bottom: 12px;
        }
        .panel-loading {
          padding: 16px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
        }

        .style-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 14px;
        }

        .style-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 10px 14px;
          background: var(--bg-tertiary);
          border: 1.5px solid var(--border-primary);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
          gap: 2px;
        }

        .style-btn:hover:not(:disabled) {
          border-color: var(--accent-primary);
          background: rgba(124, 92, 252, 0.04);
        }

        .style-btn.active {
          border-color: var(--accent-primary);
          background: rgba(124, 92, 252, 0.08);
        }

        .style-name {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .style-btn.active .style-name {
          color: var(--accent-primary);
        }

        .style-desc {
          font-size: 11px;
          color: var(--text-muted);
        }

        .summary-result {
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .summary-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding: 10px 14px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-primary);
        }

        .meta-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .summary-text {
          padding: 16px;
          font-size: 14px;
          line-height: 1.8;
          color: var(--text-primary);
          background: var(--bg-secondary);
          white-space: pre-wrap;
        }

        .topics-section {
          padding: 12px 14px;
          background: var(--bg-tertiary);
          border-top: 1px solid var(--border-primary);
        }

        .topics-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .topic-chip {
          padding: 4px 12px;
          background: rgba(124, 92, 252, 0.1);
          border: 1px solid rgba(124, 92, 252, 0.2);
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 500;
          color: var(--accent-primary);
        }
      `}</style>
    </div>
  )
}
