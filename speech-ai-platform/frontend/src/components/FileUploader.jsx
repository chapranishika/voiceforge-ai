import React, { useCallback, useState } from 'react'
import { Upload, FileAudio, Link, X, CheckCircle, AlertCircle } from 'lucide-react'

export default function FileUploader({ onFileReady, isProcessing }) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [urlMode, setUrlMode] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [urlError, setUrlError] = useState('')

  const ACCEPTED = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/ogg',
    'audio/flac', 'audio/webm', 'audio/aac', 'video/mp4', 'video/webm']
  const MAX_SIZE = 500 * 1024 * 1024 // 500MB

  const handleFile = useCallback((file) => {
    if (!file) return
    if (file.size > MAX_SIZE) {
      alert('File too large. Maximum size is 500MB.')
      return
    }
    setSelectedFile(file)
    onFileReady(file, null, 'file')
  }, [onFileReady])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragActive(true) }
  const onDragLeave = () => setDragActive(false)

  const onInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const handleUrlSubmit = () => {
    setUrlError('')
    if (!urlInput.trim()) { setUrlError('Please enter a URL'); return }
    try {
      new URL(urlInput)
    } catch {
      setUrlError('Please enter a valid URL')
      return
    }
    onFileReady(null, urlInput, 'url')
  }

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const clearFile = () => {
    setSelectedFile(null)
    setUrlInput('')
  }

  return (
    <div className="uploader-card card animate-fadeUp" style={{ animationDelay: '0.1s' }}>
      <div className="card-header">
        <div className="card-title">
          <div className="card-icon" style={{ background: 'rgba(0, 212, 170, 0.12)' }}>
            <Upload size={18} color="var(--accent-secondary)" />
          </div>
          <span>Upload Audio / Video</span>
        </div>

        {/* Mode Tabs */}
        <div className="tabs" style={{ fontSize: '12px' }}>
          <button
            className={`tab-btn ${!urlMode ? 'active' : ''}`}
            onClick={() => { setUrlMode(false); clearFile() }}
          >
            File
          </button>
          <button
            className={`tab-btn ${urlMode ? 'active' : ''}`}
            onClick={() => { setUrlMode(true); clearFile() }}
          >
            URL
          </button>
        </div>
      </div>

      {!urlMode ? (
        <>
          {!selectedFile ? (
            <label
              className={`drop-zone ${dragActive ? 'active' : ''}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
            >
              <input
                type="file"
                accept="audio/*,video/mp4,video/webm"
                onChange={onInputChange}
                style={{ display: 'none' }}
                disabled={isProcessing}
              />
              <div className="drop-icon-wrap">
                <FileAudio size={32} color="var(--accent-secondary)" />
              </div>
              <p className="drop-title">Drop your audio or video file here</p>
              <p className="drop-subtitle">or click to browse</p>
              <div className="drop-formats">
                <span>MP3</span><span>WAV</span><span>M4A</span><span>OGG</span>
                <span>FLAC</span><span>MP4</span><span>WEBM</span>
              </div>
              <p className="drop-limit">Maximum file size: 500MB</p>
            </label>
          ) : (
            <div className="file-selected">
              <div className="file-icon">
                <FileAudio size={28} color="var(--accent-secondary)" />
              </div>
              <div className="file-info">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-meta">
                  {formatSize(selectedFile.size)} · {selectedFile.type || 'audio'}
                </p>
              </div>
              <CheckCircle size={20} color="var(--success)" />
              <button className="btn btn-ghost btn-icon" onClick={clearFile}>
                <X size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="url-input-section">
          <p className="text-sm text-muted" style={{ marginBottom: 12 }}>
            Paste a direct link to an audio or video file (MP3, WAV, MP4, etc.)
          </p>
          <div className="url-input-row">
            <div className="url-input-wrap">
              <Link size={16} className="url-icon" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => { setUrlInput(e.target.value); setUrlError('') }}
                placeholder="https://example.com/audio.mp3"
                className="url-input"
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                disabled={isProcessing}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim() || isProcessing}
            >
              Load
            </button>
          </div>
          {urlError && (
            <p className="url-error">
              <AlertCircle size={14} /> {urlError}
            </p>
          )}
        </div>
      )}

      <style>{`
        .uploader-card { margin-bottom: 24px; }

        .drop-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px 24px;
          border: 2px dashed var(--border-secondary);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-normal);
          text-align: center;
          background: var(--bg-tertiary);
        }

        .drop-zone:hover, .drop-zone.active {
          border-color: var(--accent-secondary);
          background: rgba(0, 212, 170, 0.04);
        }

        .drop-zone.active {
          transform: scale(1.01);
        }

        .drop-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          background: rgba(0, 212, 170, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .drop-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary) !important;
        }

        .drop-subtitle {
          font-size: 13px;
          color: var(--text-muted) !important;
          margin-top: -2px;
        }

        .drop-formats {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 8px;
        }

        .drop-formats span {
          padding: 3px 10px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .drop-limit {
          font-size: 12px;
          color: var(--text-muted) !important;
          margin-top: 4px;
        }

        .file-selected {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(0, 200, 150, 0.06);
          border: 1px solid rgba(0, 200, 150, 0.2);
          border-radius: var(--radius-lg);
        }

        .file-icon {
          width: 48px;
          height: 48px;
          background: rgba(0, 212, 170, 0.1);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .file-info { flex: 1; min-width: 0; }
        .file-name {
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
        }
        .file-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

        .url-input-section { }
        .url-input-row { display: flex; gap: 10px; }
        .url-input-wrap {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        .url-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
          flex-shrink: 0;
        }
        .url-input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 14px;
          outline: none;
          transition: border-color var(--transition-fast);
        }
        .url-input:focus { border-color: var(--accent-primary); }
        .url-input::placeholder { color: var(--text-muted); }
        .url-error {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          color: var(--error);
          font-size: 13px;
        }
      `}</style>
    </div>
  )
}
