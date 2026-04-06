import React, { useState, useCallback } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import AudioRecorder from './components/AudioRecorder'
import FileUploader from './components/FileUploader'
import TranscriptionPanel from './components/TranscriptionPanel'
import TranslationPanel from './components/TranslationPanel'
import SummaryPanel from './components/SummaryPanel'
import EnhancementPanel from './components/EnhancementPanel'
import AnalysisPanel from './components/AnalysisPanel'
import Footer from './components/Footer'
import { useTheme } from './hooks/useTheme'
import { uploadAudio, transcribeUrl } from './api/speechApi'
import { Mic, Upload, ChevronDown, AlertCircle, Settings, ToggleLeft, ToggleRight } from 'lucide-react'

const TABS = [
  { id: 'translate',   label: 'Translate',   emoji: '🌍' },
  { id: 'summarize',   label: 'Summarize',   emoji: '✨' },
  { id: 'enhance',     label: 'Enhance',     emoji: '🪄' },
  { id: 'analyze',     label: 'Analyze',     emoji: '🧠' },
]

export default function App() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  // Audio state
  const [audioFile, setAudioFile] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [inputType, setInputType] = useState(null) // 'file' | 'url' | 'recording'

  // Transcription state
  const [transcriptionResult, setTranscriptionResult] = useState(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcribeError, setTranscribeError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  // Options
  const [options, setOptions] = useState({
    speakerLabels: true,
    autoChapters: false,
    sentimentAnalysis: false,
    entityDetection: false,
  })
  const [showOptions, setShowOptions] = useState(false)

  // Results tab
  const [activeTab, setActiveTab] = useState('translate')

  // Handlers
  const handleAudioReady = useCallback((file, url, type) => {
    setAudioFile(file)
    setAudioUrl(url)
    setInputType(type)
    setTranscriptionResult(null)
    setTranscribeError('')
  }, [])

  const handleRecordingReady = useCallback((file, url) => {
    setAudioFile(file)
    setAudioUrl(url)
    setInputType('recording')
    setTranscriptionResult(null)
    setTranscribeError('')
  }, [])

  const handleTranscribe = async () => {
    if (!audioFile && !audioUrl) return
    setIsTranscribing(true)
    setTranscribeError('')
    setUploadProgress(0)

    try {
      let result
      if (inputType === 'url' && audioUrl) {
        result = await transcribeUrl(audioUrl, options)
      } else if (audioFile) {
        result = await uploadAudio(audioFile, options, setUploadProgress)
      }
      setTranscriptionResult(result)
    } catch (err) {
      setTranscribeError(
        err.response?.data?.error ||
        err.message ||
        'Transcription failed. Please check your API key and try again.'
      )
    } finally {
      setIsTranscribing(false)
      setUploadProgress(0)
    }
  }

  const hasAudio = !!(audioFile || (inputType === 'url' && audioUrl))
  const sourceText = transcriptionResult?.text || ''

  return (
    <div className="app-layout">
      <div className="bg-decoration" />

      <Header theme={theme} setTheme={setTheme} resolvedTheme={resolvedTheme} />

      <main className="main-content">
        {/* Hero */}
        <Hero />

        <div className="container">
          {/* ── INPUT SECTION ── */}
          <section className="input-section" id="recorder">
            <div className="section-label-row">
              <div className="section-badge">
                <Mic size={14} />
                <span>Step 1 — Input Audio</span>
              </div>
            </div>

            <div className="input-grid">
              {/* Recorder */}
              <div id="recorder-anchor">
                <AudioRecorder onAudioReady={handleRecordingReady} />
              </div>

              {/* Uploader */}
              <div id="upload">
                <FileUploader
                  onFileReady={handleAudioReady}
                  isProcessing={isTranscribing}
                />
              </div>
            </div>

            {/* Options & Transcribe */}
            {hasAudio && (
              <div className="transcribe-section card animate-scaleIn">
                <div className="transcribe-header">
                  <div style={{ flex: 1 }}>
                    <p className="ready-label">Audio Ready</p>
                    <p className="ready-filename text-muted text-sm">
                      {audioFile?.name || audioUrl || 'Recorded audio'}
                    </p>
                  </div>

                  <button
                    className="btn btn-ghost btn-sm options-toggle"
                    onClick={() => setShowOptions(!showOptions)}
                  >
                    <Settings size={14} />
                    Options
                    <ChevronDown size={13} style={{ transform: showOptions ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                </div>

                {/* Advanced Options */}
                {showOptions && (
                  <div className="options-grid animate-fadeUp">
                    {[
                      { key: 'speakerLabels', label: 'Speaker Diarization', desc: 'Identify different speakers' },
                      { key: 'autoChapters', label: 'Auto Chapters', desc: 'Segment into topic chapters' },
                      { key: 'sentimentAnalysis', label: 'Sentiment Analysis', desc: 'Per-sentence sentiment' },
                      { key: 'entityDetection', label: 'Entity Detection', desc: 'Detect names, places, orgs' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        className={`option-toggle-btn ${options[opt.key] ? 'active' : ''}`}
                        onClick={() => setOptions(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                      >
                        <div className="opt-info">
                          <span className="opt-label">{opt.label}</span>
                          <span className="opt-desc">{opt.desc}</span>
                        </div>
                        {options[opt.key]
                          ? <ToggleRight size={22} color="var(--accent-primary)" />
                          : <ToggleLeft size={22} color="var(--text-muted)" />
                        }
                      </button>
                    ))}
                  </div>
                )}

                {/* Progress bar */}
                {isTranscribing && uploadProgress > 0 && uploadProgress < 100 && (
                  <div style={{ margin: '12px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className="text-sm text-muted">Uploading…</span>
                      <span className="text-sm text-muted">{uploadProgress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Error */}
                {transcribeError && (
                  <div className="transcribe-error">
                    <AlertCircle size={15} />
                    <span>{transcribeError}</span>
                  </div>
                )}

                <button
                  className="btn btn-primary btn-lg transcribe-btn"
                  onClick={handleTranscribe}
                  disabled={isTranscribing}
                >
                  {isTranscribing ? (
                    <><span className="spinner" /> Transcribing with AssemblyAI…</>
                  ) : (
                    <><Mic size={18} /> Transcribe Now</>
                  )}
                </button>
              </div>
            )}
          </section>

          {/* ── RESULTS SECTION ── */}
          {(isTranscribing || transcriptionResult) && (
            <section className="results-section" id="results">
              <div className="section-label-row">
                <div className="section-badge" style={{ background: 'rgba(0,212,170,0.08)', borderColor: 'rgba(0,212,170,0.2)', color: 'var(--accent-secondary)' }}>
                  <Upload size={14} />
                  <span>Step 2 — Results</span>
                </div>
              </div>

              <div className="results-layout">
                {/* Left: Transcription */}
                <div className="results-left">
                  <TranscriptionPanel
                    result={transcriptionResult}
                    isLoading={isTranscribing}
                  />
                </div>

                {/* Right: AI Tools */}
                {transcriptionResult && (
                  <div className="results-right">
                    <div className="ai-tools-header">
                      <div className="section-badge" style={{ background: 'rgba(124,92,252,0.08)', borderColor: 'rgba(124,92,252,0.2)', color: 'var(--accent-primary)' }}>
                        ✨ AI Tools
                      </div>
                      <div className="tabs ai-tabs">
                        {TABS.map(tab => (
                          <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                          >
                            {tab.emoji} {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {activeTab === 'translate' && <TranslationPanel sourceText={sourceText} />}
                    {activeTab === 'summarize' && <SummaryPanel sourceText={sourceText} />}
                    {activeTab === 'enhance' && <EnhancementPanel sourceText={sourceText} />}
                    {activeTab === 'analyze' && <AnalysisPanel sourceText={sourceText} />}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        .input-section {
          margin-bottom: 48px;
        }

        .results-section {
          margin-bottom: 48px;
        }

        .section-label-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          background: rgba(124, 92, 252, 0.08);
          border: 1px solid rgba(124, 92, 252, 0.2);
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-primary);
          letter-spacing: 0.03em;
        }

        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 20px;
        }

        .transcribe-section {
          border: 1.5px solid rgba(124, 92, 252, 0.25);
          background: rgba(124, 92, 252, 0.03);
        }

        .transcribe-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .ready-label {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary) !important;
          margin-bottom: 2px;
        }

        .ready-filename {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 300px;
        }

        .options-toggle { flex-shrink: 0; }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }

        .option-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 12px 14px;
          background: var(--bg-secondary);
          border: 1.5px solid var(--border-primary);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .option-toggle-btn:hover { border-color: var(--accent-primary); }
        .option-toggle-btn.active { border-color: var(--accent-primary); background: rgba(124,92,252,0.05); }

        .opt-info { display: flex; flex-direction: column; gap: 2px; }
        .opt-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .opt-desc { font-size: 11px; color: var(--text-muted); }

        .transcribe-error {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px 14px;
          background: rgba(255,71,87,0.08);
          border: 1px solid rgba(255,71,87,0.2);
          border-radius: var(--radius-md);
          color: var(--error);
          font-size: 13px;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .transcribe-btn {
          width: 100%;
          padding: 16px;
          font-size: 15px;
          font-weight: 600;
        }

        .results-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: flex-start;
        }

        .results-left, .results-right { }

        .ai-tools-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .ai-tabs {
          flex-wrap: wrap;
        }

        @media (max-width: 900px) {
          .input-grid { grid-template-columns: 1fr; }
          .results-layout { grid-template-columns: 1fr; }
          .options-grid { grid-template-columns: 1fr; }
          .ai-tools-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  )
}
