import { useState, useEffect, useCallback } from 'react'

export function useTheme() {
  var _a = useState(function () {
    if (typeof window === 'undefined') return false
    var stored = localStorage.getItem('jiangnan-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }), isDark = _a[0], setIsDark = _a[1]

  useEffect(function () {
    var root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('jiangnan-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  var toggle = useCallback(function () { setIsDark(function (prev) { return !prev }) }, [])

  return { isDark: isDark, toggle: toggle }
}
