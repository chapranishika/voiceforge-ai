import React, { useState } from 'react'
import { BrainCircuit, CheckSquare, HelpCircle, Tag, TrendingUp, Globe } from 'lucide-react'
import { analyzeText } from '../api/speechApi'

const SENTIMENT_STYLES = {
  positive: { bg: 'rgba(0,200,150,0.1)', color: 'var(--success)', emoji: '😊' },
  negative: { bg: 'rgba(255,71,87,0.1)', color: 'var(--error)', emoji: '😔' },
  neutral: { bg: 'rgba(106,102,122,0.1)', color: 'var(--text-muted)', emoji: '😐' },
  mixed: { bg: 'rgba(255,184,48,0.1)', color: 'var(--warning)', emoji: '🤔' },
}

const ENTITY_COLORS = {
  person: 'var(--accent-primary)',
  organization: 'var(--accent-secondary)',
  location: 'var(--accent-warm)',
  date: 'var(--info)',
  default: 'var(--text-muted)',
}

export default function AnalysisPanel({ sourceText }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!sourceText?.trim()) return
    setLoading(true)
    setError('')
    try {
      const data = await analyzeText(sourceText)
      setResult(data)
    } catch (e) {
      setError(e.response?.data?.error || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sentimentStyle = result ? (SENTIMENT_STYLES[result.sentiment] || SENTIMENT_STYLES.neutral) : null

  return (
    <div className="card animate-fadeUp" style={{ animationDelay: '0.4s' }}>
      <div className="card-header">
        <div className="card-title">
          <div className="card-icon" style={{ background: 'rgba(41, 121, 255, 0.12)' }}>
            <BrainCircuit size={18} color="var(--info)" />
          </div>
          <span>Deep Analysis</span>
        </div>
        {result && <span className="badge badge-info">Complete</span>}
      </div>

      {!sourceText ? (
        <div className="panel-empty">
          <BrainCircuit size={28} color="var(--text-muted)" />
          <p>Transcribe audio first to run deep analysis</p>
        </div>
      ) : (
        <>
          <button
            className="btn btn-primary w-full"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ marginBottom: 16 }}
          >
            {loading
              ? <><span className="spinner" /> Analyzing…</>
              : <><BrainCircuit size={16} /> Run Deep Analysis</>
            }
          </button>

          {error && <div className="panel-error">{error}</div>}

          {loading && (
            <div className="analysis-skeleton">
              {['40%', '70%', '55%', '80%', '45%'].map((w, i) => (
                <div key={i} className="skeleton" style={{ height: 14, width: w, marginBottom: 10, borderRadius: 4 }} />
              ))}
            </div>
          )}

          {result && !loading && (
            <div className="analysis-grid animate-scaleIn">

              {/* Sentiment */}
              {result.sentiment && (
                <div className="analysis-section" style={{ background: sentimentStyle.bg }}>
                  <div className="analysis-section-label">Sentiment</div>
                  <div className="sentiment-display">
                    <span className="sentiment-emoji">{sentimentStyle.emoji}</span>
                    <div>
                      <div className="sentiment-name" style={{ color: sentimentStyle.color }}>
                        {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                      </div>
                      {result.sentiment_score !== undefined && (
                        <div className="sentiment-score">
                          Score: {result.sentiment_score > 0 ? '+' : ''}{result.sentiment_score?.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Language & Style */}
              <div className="analysis-section">
                <div className="analysis-section-label">Language & Style</div>
                <div className="lang-style-row">
                  {result.language_detected && (
                    <div className="info-chip">
                      <Globe size={13} />
                      {result.language_detected}
                    </div>
                  )}
                  {result.speaking_style && (
                    <div className="info-chip">
                      <TrendingUp size={13} />
                      {result.speaking_style.charAt(0).toUpperCase() + result.speaking_style.slice(1)}
                    </div>
                  )}
                  {result.readability_score && (
                    <div className="info-chip">
                      📖 {result.readability_score.charAt(0).toUpperCase() + result.readability_score.slice(1)}
                    </div>
                  )}
                </div>
              </div>

              {/* Topics */}
              {result.key_topics?.length > 0 && (
                <div className="analysis-section">
                  <div className="analysis-section-label"><Tag size={13} /> Key Topics</div>
                  <div className="chips-row">
                    {result.key_topics.map((t, i) => (
                      <span key={i} className="topic-chip-sm">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Items */}
              {result.action_items?.length > 0 && (
                <div className="analysis-section">
                  <div className="analysis-section-label"><CheckSquare size={13} /> Action Items</div>
                  <ul className="action-list">
                    {result.action_items.map((item, i) => (
                      <li key={i} className="action-item">
                        <span className="action-dot" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questions */}
              {result.questions_raised?.length > 0 && (
                <div className="analysis-section">
                  <div className="analysis-section-label"><HelpCircle size={13} /> Questions Raised</div>
                  <ul className="action-list">
                    {result.questions_raised.map((q, i) => (
                      <li key={i} className="action-item">
                        <span className="question-dot">?</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Entities */}
              {result.key_entities?.length > 0 && (
                <div className="analysis-section">
                  <div className="analysis-section-label">Detected Entities</div>
                  <div className="entities-list">
                    {result.key_entities.map((e, i) => {
                      const color = ENTITY_COLORS[e.type?.toLowerCase()] || ENTITY_COLORS.default
                      return (
                        <div key={i} className="entity-chip" style={{ borderColor: color, color }}>
                          <span className="entity-text">{e.text}</span>
                          <span className="entity-type">{e.type}</span>
                        </div>
                      )
                    })}
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
        .analysis-skeleton {
          padding: 16px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
        }

        .analysis-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .analysis-section {
          padding: 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
        }

        .analysis-section-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .sentiment-display {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sentiment-emoji { font-size: 28px; }
        .sentiment-name { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; }
        .sentiment-score { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

        .lang-style-row, .chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .info-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .topic-chip-sm {
          padding: 3px 10px;
          background: rgba(124,92,252,0.08);
          border: 1px solid rgba(124,92,252,0.18);
          border-radius: var(--radius-full);
          font-size: 12px;
          color: var(--accent-primary);
          font-weight: 500;
        }

        .action-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          list-style: none;
        }

        .action-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .action-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--success);
          margin-top: 5px;
          flex-shrink: 0;
        }

        .question-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(41,121,255,0.15);
          color: var(--info);
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .entities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .entity-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border: 1px solid;
          border-radius: var(--radius-full);
          font-size: 12px;
          background: var(--bg-secondary);
        }

        .entity-text { font-weight: 600; }
        .entity-type {
          font-size: 10px;
          opacity: 0.7;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  )
}
