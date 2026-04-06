import React, { useState } from 'react'
import { FileText, Copy, Download, Check, ChevronDown, ChevronUp, Users, Clock, BarChart2 } from 'lucide-react'

export default function TranscriptionPanel({ result, isLoading }) {
  const [copied, setCopied] = useState(false)
  const [showUtterances, setShowUtterances] = useState(true)
  const [showWords, setShowWords] = useState(false)

  const copyText = async () => {
    if (!result?.text) return
    await navigator.clipboard.writeText(result.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadTxt = () => {
    if (!result?.text) return
    const blob = new Blob([result.text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcription-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatMs = (ms) => {
    const totalSec = Math.floor(ms / 1000)
    const m = Math.floor(totalSec / 60)
    const s = totalSec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const speakerColors = [
    'var(--accent-primary)',
    'var(--accent-secondary)',
    'var(--accent-warm)',
    '#2979ff',
    '#ff4757',
    '#ffa502',
  ]

  const getSpeakerColor = (speaker) => {
    const idx = (speaker?.charCodeAt(speaker.length - 1) || 0) % speakerColors.length
    return speakerColors[idx]
  }

  if (isLoading) {
    return (
      <div className="card animate-scaleIn">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon" style={{ background: 'rgba(41, 121, 255, 0.12)' }}>
              <FileText size={18} color="var(--info)" />
            </div>
            <span>Transcription</span>
          </div>
          <span className="badge badge-info">
            <span className="spinner" style={{ width: 12, height: 12 }} />
            Processing…
          </span>
        </div>
        <div className="progress-bar" style={{ marginBottom: 16 }}>
          <div className="progress-fill progress-indeterminate" style={{ width: '40%' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 0.7, 0.85, 0.5].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: 16, width: `${w * 100}%`, borderRadius: 4 }} />
          ))}
        </div>
        <p className="text-sm text-muted" style={{ marginTop: 20, textAlign: 'center' }}>
          AssemblyAI is transcribing your audio. This may take a moment…
        </p>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="card animate-scaleIn">
      <div className="card-header">
        <div className="card-title">
          <div className="card-icon" style={{ background: 'rgba(41, 121, 255, 0.12)' }}>
            <FileText size={18} color="var(--info)" />
          </div>
          <span>Transcription</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-success">
            <Check size={12} /> Complete
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={copyText}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={downloadTxt}
          >
            <Download size={14} />
            .TXT
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="transcript-stats">
        {result.confidence && (
          <div className="stat-chip">
            <BarChart2 size={13} />
            <span>{(result.confidence * 100).toFixed(0)}% confidence</span>
          </div>
        )}
        {result.audio_duration && (
          <div className="stat-chip">
            <Clock size={13} />
            <span>{formatMs(result.audio_duration * 1000)} duration</span>
          </div>
        )}
        {result.utterances?.length > 0 && (
          <div className="stat-chip">
            <Users size={13} />
            <span>
              {new Set(result.utterances.map(u => u.speaker)).size} speaker
              {new Set(result.utterances.map(u => u.speaker)).size > 1 ? 's' : ''}
            </span>
          </div>
        )}
        {result.text && (
          <div className="stat-chip">
            <FileText size={13} />
            <span>{result.text.split(' ').length} words</span>
          </div>
        )}
      </div>

      {/* Speaker Utterances */}
      {result.utterances?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <button
            className="section-toggle"
            onClick={() => setShowUtterances(!showUtterances)}
          >
            <Users size={15} />
            Speaker Transcript
            {showUtterances ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showUtterances && (
            <div className="utterances-list">
              {result.utterances.map((u, idx) => (
                <div key={idx} className="utterance">
                  <div className="utterance-speaker">
                    <div
                      className="speaker-avatar"
                      style={{ background: getSpeakerColor(u.speaker) }}
                    >
                      {u.speaker}
                    </div>
                    <span className="utterance-time">{formatMs(u.start)}</span>
                  </div>
                  <div className="utterance-text">{u.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Plain Text */}
      <div>
        <p className="section-label">Full Transcript</p>
        <div className="transcript-text">
          {result.text || 'No transcription available.'}
        </div>
      </div>

      {/* Chapters */}
      {result.chapters?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <p className="section-label">Chapters</p>
          <div className="chapters-list">
            {result.chapters.map((ch, idx) => (
              <div key={idx} className="chapter-item">
                <div className="chapter-time">{formatMs(ch.start)} — {formatMs(ch.end)}</div>
                <div className="chapter-headline">{ch.headline}</div>
                <div className="chapter-summary">{ch.summary}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .transcript-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .stat-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-full);
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .section-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 0;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          text-align: left;
          border-bottom: 1px solid var(--border-primary);
          margin-bottom: 12px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .section-toggle:hover { color: var(--text-primary); }
        .section-toggle svg:last-child { margin-left: auto; }

        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .utterances-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .utterance {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .utterance-speaker {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .speaker-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: 700;
          font-family: var(--font-display);
        }

        .utterance-time {
          font-size: 10px;
          color: var(--text-muted);
          font-variant-numeric: tabular-nums;
        }

        .utterance-text {
          flex: 1;
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-primary);
          padding: 8px 14px;
          background: var(--bg-tertiary);
          border-radius: 0 var(--radius-md) var(--radius-md) var(--radius-md);
          border: 1px solid var(--border-primary);
        }

        .transcript-text {
          font-size: 14px;
          line-height: 1.8;
          color: var(--text-primary);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          padding: 18px;
          max-height: 280px;
          overflow-y: auto;
          white-space: pre-wrap;
        }

        .chapters-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chapter-item {
          padding: 14px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-primary);
        }

        .chapter-time {
          font-size: 11px;
          color: var(--accent-primary);
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          margin-bottom: 4px;
        }

        .chapter-headline {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .chapter-summary {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
        }
      `}</style>
    </div>
  )
}
