import React from 'react'
import { Mic, Github, Heart, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <Mic size={16} strokeWidth={2.5} />
              </div>
              <span className="footer-logo-name">VoiceForge AI</span>
            </div>
            <p className="footer-tagline">
              Enterprise AI speech processing platform. Transcribe, translate, and enhance audio content with state-of-the-art AI.
            </p>
            <div className="footer-stack">
              <span className="stack-chip">AssemblyAI</span>
              <span className="stack-chip">Google Gemini</span>
              <span className="stack-chip">Flask</span>
              <span className="stack-chip">React</span>
            </div>
          </div>

          {/* Links */}
          <div className="footer-links-section">
            <div className="footer-col">
              <h4 className="footer-col-title">Features</h4>
              <ul className="footer-list">
                <li><a href="#recorder">Live Recording</a></li>
                <li><a href="#upload">File Upload</a></li>
                <li><a href="#">Translation</a></li>
                <li><a href="#">Summarization</a></li>
                <li><a href="#">Enhancement</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Tech Stack</h4>
              <ul className="footer-list">
                <li>
                  <a href="https://www.assemblyai.com" target="_blank" rel="noopener noreferrer">
                    AssemblyAI API <ExternalLink size={11} />
                  </a>
                </li>
                <li>
                  <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer">
                    Gemini API <ExternalLink size={11} />
                  </a>
                </li>
                <li>
                  <a href="https://flask.palletsprojects.com" target="_blank" rel="noopener noreferrer">
                    Flask <ExternalLink size={11} />
                  </a>
                </li>
                <li>
                  <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                    React <ExternalLink size={11} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-credit">
            Built with <Heart size={13} fill="var(--error)" color="var(--error)" /> by <strong>Nishika</strong> · AI Speech Platform
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
            style={{ gap: 6 }}
          >
            <Github size={16} />
            View on GitHub
          </a>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-primary);
          padding: 48px 0 24px;
          margin-top: auto;
        }

        .footer-inner {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 48px;
          margin-bottom: 40px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .footer-logo-icon {
          width: 34px;
          height: 34px;
          background: var(--accent-gradient);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .footer-logo-name {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .footer-tagline {
          font-size: 13px;
          line-height: 1.7;
          color: var(--text-muted) !important;
          max-width: 320px;
          margin-bottom: 16px;
        }

        .footer-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .stack-chip {
          padding: 3px 10px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.03em;
        }

        .footer-links-section {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .footer-col-title {
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 14px;
        }

        .footer-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-list a {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .footer-list a:hover {
          color: var(--accent-primary);
          opacity: 1;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid var(--border-primary);
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-credit {
          font-size: 13px;
          color: var(--text-muted) !important;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .footer-credit strong { color: var(--text-secondary); }

        @media (max-width: 768px) {
          .footer-inner { grid-template-columns: 1fr; gap: 32px; }
          .footer-links-section { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </footer>
  )
}
