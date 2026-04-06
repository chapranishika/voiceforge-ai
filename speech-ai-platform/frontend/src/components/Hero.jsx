import React from 'react'
import { Mic, Zap, Globe, Sparkles, ArrowDown } from 'lucide-react'

const FEATURES = [
  { icon: Mic,      color: 'var(--accent-primary)',   label: 'Speech-to-Text',    desc: 'AssemblyAI powered' },
  { icon: Globe,    color: 'var(--accent-warm)',       label: '20+ Languages',     desc: 'Multilingual output' },
  { icon: Sparkles, color: 'var(--accent-secondary)',  label: 'AI Enhancement',    desc: 'Gemini powered' },
  { icon: Zap,      color: 'var(--warning)',           label: 'Real-time Speed',   desc: 'Instant results' },
]

export default function Hero() {
  return (
    <section className="hero" id="features">
      <div className="container">
        <div className="hero-content animate-fadeUp">
          {/* Eyebrow */}
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            <span>Built by Nishika · Powered by AssemblyAI & Gemini</span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            Transform Speech into
            <span className="hero-gradient-text"> Intelligent Text</span>
          </h1>

          <p className="hero-desc">
            Enterprise-grade AI transcription with real-time waveform visualization, 
            speaker diarization, multilingual translation, and smart summarization — 
            all in one seamless platform.
          </p>

          {/* Feature pills */}
          <div className="feature-pills">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.label} className="feature-pill">
                  <div className="pill-icon" style={{ background: `${f.color}18` }}>
                    <Icon size={14} color={f.color} />
                  </div>
                  <div>
                    <div className="pill-label">{f.label}</div>
                    <div className="pill-desc">{f.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="hero-cta">
            <a href="#recorder" className="btn btn-primary btn-lg">
              <Mic size={18} />
              Start Transcribing
            </a>
            <a href="#upload" className="btn btn-secondary btn-lg">
              Upload File
            </a>
          </div>

          {/* Scroll hint */}
          <div className="scroll-hint">
            <ArrowDown size={16} />
            <span>Scroll to begin</span>
          </div>
        </div>

        {/* Abstract visual */}
        <div className="hero-visual animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="visual-card">
            <div className="visual-header">
              <div className="visual-dots">
                <span /><span /><span />
              </div>
              <span className="visual-title">Live Transcription</span>
            </div>
            <div className="visual-waveform">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="wave-bar"
                  style={{
                    height: `${Math.sin(i * 0.5) * 40 + 50}%`,
                    animationDelay: `${i * 0.06}s`,
                  }}
                />
              ))}
            </div>
            <div className="visual-text">
              <span className="visual-speaker-tag">Speaker A</span>
              <p className="visual-transcript">
                "The quarterly results exceeded all expectations, 
                reaching a <mark>42% growth</mark> in revenue..."
              </p>
              <div className="visual-chips">
                <span className="v-chip positive">😊 Positive</span>
                <span className="v-chip">English → Hindi</span>
                <span className="v-chip">96% confidence</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero {
          padding: 64px 0 48px;
          position: relative;
        }

        .hero .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        .hero-content { }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(124, 92, 252, 0.08);
          border: 1px solid rgba(124, 92, 252, 0.2);
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;
          color: var(--accent-primary);
          letter-spacing: 0.02em;
          margin-bottom: 24px;
        }

        .eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-primary);
          animation: pulse 2s ease-in-out infinite;
        }

        .hero-headline {
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 800;
          line-height: 1.05;
          margin-bottom: 20px;
          letter-spacing: -0.04em;
        }

        .hero-gradient-text {
          display: block;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: 16px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 32px;
          max-width: 480px;
        }

        .feature-pills {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 32px;
        }

        .feature-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          transition: all var(--transition-normal);
        }

        .feature-pill:hover {
          border-color: var(--border-secondary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .pill-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pill-label {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .pill-desc {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 1px;
        }

        .hero-cta {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .scroll-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          font-size: 13px;
          animation: fadeUp 1s ease 0.8s both;
        }

        .scroll-hint svg { animation: bounce 2s ease-in-out infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }

        /* Hero Visual */
        .hero-visual {
          position: relative;
        }

        .visual-card {
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }

        .visual-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-primary);
        }

        .visual-dots {
          display: flex;
          gap: 5px;
        }

        .visual-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--border-secondary);
        }

        .visual-dots span:nth-child(1) { background: #ff5f57; }
        .visual-dots span:nth-child(2) { background: #ffbd2e; }
        .visual-dots span:nth-child(3) { background: #28c840; }

        .visual-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .visual-waveform {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 20px 18px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-primary);
          height: 80px;
        }

        .wave-bar {
          flex: 1;
          background: var(--accent-gradient);
          border-radius: 2px;
          animation: waveAnim 1.4s ease-in-out infinite alternate;
          opacity: 0.8;
        }

        @keyframes waveAnim {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }

        .visual-text {
          padding: 18px;
        }

        .visual-speaker-tag {
          display: inline-block;
          padding: 3px 10px;
          background: rgba(124, 92, 252, 0.1);
          color: var(--accent-primary);
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-bottom: 10px;
        }

        .visual-transcript {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-primary) !important;
          margin-bottom: 14px;
        }

        .visual-transcript mark {
          background: rgba(124, 92, 252, 0.15);
          color: var(--accent-primary);
          padding: 1px 4px;
          border-radius: 3px;
        }

        .visual-chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .v-chip {
          padding: 3px 10px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-full);
          font-size: 11px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .v-chip.positive {
          background: rgba(0,200,150,0.1);
          border-color: rgba(0,200,150,0.2);
          color: var(--success);
        }

        @media (max-width: 900px) {
          .hero .container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .hero-visual { display: none; }
          .hero { padding: 40px 0 32px; }
        }
      `}</style>
    </section>
  )
}
