import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const SessionContext = createContext(null)

function mapSession(s) {
  if (!s || !s.user) return null
  return { user: { id: s.user.id, email: s.user.email || '' }, local: false }
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(function () {
    if (!isSupabaseConfigured) {
      // 未配置 Supabase：进入本地回退模式，视为已登录的匿名用户
      setSession({ user: { id: 'local', email: '本地模式' }, local: true })
      setLoading(false)
      return
    }
    let active = true
    supabase.auth.getSession().then(function (res) {
      if (!active) return
      setSession(mapSession(res.data.session))
      setLoading(false)
    }).catch(function () {
      if (active) { setSession(null); setLoading(false) }
    })

    const sub = supabase.auth.onAuthStateChange(function (_event, s) {
      setSession(mapSession(s))
      setLoading(false)
    })
    return function () {
      active = false
      if (sub && sub.subscription) sub.subscription.unsubscribe()
    }
  }, [])

  const signUp = useCallback(async function (email, password) {
    setError('')
    const { data, error: err } = await supabase.auth.signUp({ email: email, password: password })
    if (err) { setError(err.message); return false }
    if (data.session) { setSession(mapSession(data.session)); return true }
    return false // 需要邮箱确认
  }, [])

  const signIn = useCallback(async function (email, password) {
    setError('')
    const { data, error: err } = await supabase.auth.signInWithPassword({ email: email, password: password })
    if (err) { setError(err.message); return false }
    setSession(mapSession(data.session))
    return true
  }, [])

  const signOut = useCallback(async function () {
    if (isSupabaseConfigured) { await supabase.auth.signOut() }
    setSession(null)
  }, [])

  const value = { session, loading, error, signIn, signUp, signOut, isSupabaseConfigured }
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession 必须在 SessionProvider 内使用')
  return ctx
}
