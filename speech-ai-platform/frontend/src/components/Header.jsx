import React, { useState } from 'react'
import { Mic, Sun, Moon, Monitor, Menu, X, Zap } from 'lucide-react'

export default function Header({ theme, setTheme, resolvedTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  const ThemeIcon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">

          {/* Logo */}
          <a href="/" className="logo">
            <div className="logo-icon">
              <Mic size={18} />
            </div>
            <div className="logo-text">
              <span className="logo-name">VoiceForge</span>
              <span className="logo-ai">AI</span>
            </div>
          </a>

          {/* Nav Links */}
          <div className="nav-links">
            <a href="#recorder" className="nav-link">Record</a>
            <a href="#upload" className="nav-link">Upload</a>
            <a href="#features" className="nav-link">Features</a>
          </div>

          {/* Actions */}
          <div className="nav-actions">

            {/* Theme */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              >
                <ThemeIcon size={18} />
              </button>

              {themeMenuOpen && (
                <div className="theme-menu">
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon
                    return (
                      <button
                        key={opt.value}
                        className="theme-option"
                        onClick={() => {
                          setTheme(opt.value)
                          setThemeMenuOpen(false)
                        }}
                      >
                        <Icon size={15} />
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Made by */}
            <div className="made-by-tag">
              <Zap size={13} />
              <span>By Nishika Chapra</span>
            </div>

            {/* Mobile */}
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </nav>

        {menuOpen && (
          <div className="mobile-nav">
            <a href="#recorder">Record</a>
            <a href="#upload">Upload</a>
            <a href="#features">Features</a>
          </div>
        )}
      </div>
    </header>
  )
}