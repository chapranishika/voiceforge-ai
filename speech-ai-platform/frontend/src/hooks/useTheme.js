import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('voiceforge-theme') || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (th) => {
      let resolved
      if (th === 'system') {
        resolved = mediaQuery.matches ? 'dark' : 'light'
      } else {
        resolved = th
      }
      setResolvedTheme(resolved)
      document.documentElement.setAttribute('data-theme', resolved)
    }

    applyTheme(theme)

    const handleChange = () => {
      if (theme === 'system') applyTheme('system')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setAndSaveTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('voiceforge-theme', newTheme)
  }

  return { theme, resolvedTheme, setTheme: setAndSaveTheme }
}
