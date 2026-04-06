import React, { useEffect, useRef, useState } from 'react'
import { Mic, Square, Pause, Play, RotateCcw, Upload } from 'lucide-react'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
export default function AudioRecorder({ onAudioReady }) {
  const {
    isRecording,
    isPaused,
    duration,
    formattedDuration,
    audioBlob,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useAudioRecorder()

  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const analyserRef = useRef(null)
  const audioCtxRef = useRef(null)
  const sourceRef = useRef(null)
  const streamRef = useRef(null)
  const [visualizerReady, setVisualizerReady] = useState(false)

  // Start audio visualizer when recording begins
  useEffect(() => {
    if (isRecording && !isPaused) {
      startVisualizer()
    } else {
      stopVisualizer()
    }
    return stopVisualizer
  }, [isRecording, isPaused])

  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      const source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)
      audioCtxRef.current = ctx
      analyserRef.current = analyser
      sourceRef.current = source
      setVisualizerReady(true)
      drawWaveform()
    } catch (e) {
      // microphone access already granted from recorder
    }
  }

  const stopVisualizer = () => {
    cancelAnimationFrame(animFrameRef.current)
    setVisualizerReady(false)
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  const drawWaveform = () => {
    const canvas = canvasRef.current
    if (!canvas || !analyserRef.current) return

    const ctx = canvas.getContext('2d')
    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const barWidth = (W / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barH = (dataArray[i] / 255) * H * 0.85

        // Gradient bars
        const gradient = ctx.createLinearGradient(0, H - barH, 0, H)
        gradient.addColorStop(0, 'rgba(124, 92, 252, 0.9)')
        gradient.addColorStop(1, 'rgba(0, 212, 170, 0.6)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(x, H - barH, barWidth - 1, barH, [2, 2, 0, 0])
        ctx.fill()

        x += barWidth + 1
      }
    }

    draw()
  }

  // Idle waveform animation
  const drawIdleWave = () => {
    const canvas = canvasRef.current
    if (!canvas || isRecording) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    let t = 0

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate)
      ctx.clearRect(0, 0, W, H)

      ctx.strokeStyle = 'rgba(124, 92, 252, 0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()

      for (let x = 0; x < W; x++) {
        const y = H / 2 + Math.sin((x * 0.02) + t) * 8 + Math.sin((x * 0.05) + t * 1.5) * 4
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      t += 0.03
    }

    animate()
  }

  useEffect(() => {
    if (!isRecording) {
      setTimeout(drawIdleWave, 100)
    }
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [isRecording, audioBlob])

  const handleUseRecording = () => {
    if (audioBlob) {
      const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: audioBlob.type })
      onAudioReady(file, audioUrl)
    }
  }

  return (
    <div className="recorder-card card animate-fadeUp">
      <div className="card-header">
        <div className="card-title">
          <div className="card-icon" style={{ background: 'rgba(124, 92, 252, 0.12)' }}>
            <Mic size={18} color="var(--accent-primary)" />
          </div>
          <span>Live Recording</span>
        </div>
        {isRecording && (
          <div className="recording-badge">
            <span className="rec-dot" />
            REC {formattedDuration}
          </div>
        )}
        {!isRecording && audioBlob && (
          <span className="badge badge-success">Ready</span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rec-error">
          <span>{error}</span>
        </div>
      )}

      {/* Waveform Canvas */}
      <div className="waveform-container">
        <canvas
          ref={canvasRef}
          className="waveform-canvas"
          width={600}
          height={80}
        />
        {!isRecording && !audioBlob && (
          <div className="waveform-placeholder">
            <Mic size={20} color="var(--text-muted)" />
            <span>Click Record to start</span>
          </div>
        )}
      </div>

      {/* Timer */}
      <div className="rec-timer">
        <span className="timer-display" style={{ color: isRecording ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
          {formattedDuration}
        </span>
        {isRecording && <span className="timer-label">{isPaused ? 'Paused' : 'Recording…'}</span>}
      </div>

      {/* Controls */}
      <div className="rec-controls">
        {!isRecording && !audioBlob && (
          <button className="btn btn-primary btn-lg rec-main-btn" onClick={startRecording}>
            <Mic size={20} />
            Start Recording
          </button>
        )}

        {isRecording && (
          <>
            <button
              className="btn btn-secondary btn-icon-round"
              onClick={isPaused ? resumeRecording : pauseRecording}
              data-tooltip={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play size={18} /> : <Pause size={18} />}
            </button>
            <button
              className="btn btn-danger rec-stop-btn"
              onClick={stopRecording}
            >
              <Square size={16} fill="currentColor" />
              Stop
            </button>
          </>
        )}

        {!isRecording && audioBlob && (
          <>
            <button className="btn btn-secondary" onClick={resetRecording}>
              <RotateCcw size={16} />
              Re-record
            </button>
            <audio controls src={audioUrl} className="rec-playback" />
            <button className="btn btn-primary" onClick={handleUseRecording}>
              <Upload size={16} />
              Transcribe This
            </button>
          </>
        )}
      </div>

      <style>{`
        .recorder-card {
          margin-bottom: 24px;
        }

        .recording-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 12px;
          background: rgba(255, 71, 87, 0.1);
          color: var(--error);
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          border: 1px solid rgba(255, 71, 87, 0.2);
        }

        .rec-dot {
          width: 7px;
          height: 7px;
          background: var(--error);
          border-radius: 50%;
          animation: pulse 1.2s ease-in-out infinite;
        }

        .rec-error {
          padding: 12px 16px;
          background: rgba(255, 71, 87, 0.08);
          border: 1px solid rgba(255, 71, 87, 0.2);
          border-radius: var(--radius-md);
          color: var(--error);
          font-size: 13px;
          margin-bottom: 16px;
        }

        .waveform-container {
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          border: 1px solid var(--border-primary);
          margin-bottom: 12px;
        }

        .waveform-canvas {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .waveform-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 13px;
          pointer-events: none;
        }

        .rec-timer {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 20px;
        }

        .timer-display {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          transition: color var(--transition-normal);
        }

        .timer-label {
          font-size: 13px;
          color: var(--text-muted);
        }

        .rec-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .rec-main-btn {
          width: 100%;
          padding: 16px;
          font-size: 15px;
        }

        .rec-stop-btn {
          flex: 1;
          padding: 12px 24px;
        }

        .rec-playback {
          flex: 1;
          height: 36px;
          min-width: 0;
          border-radius: var(--radius-full);
          outline: none;
          accent-color: var(--accent-primary);
        }
      `}</style>
    </div>
  )
}
