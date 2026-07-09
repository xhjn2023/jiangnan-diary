import { useState } from 'react'
import { useSession } from '../context/SessionContext'

export default function AuthView() {
  const { signIn, signUp, error } = useSession()
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const submit = async function (e) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    const ok = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password)
    setBusy(false)
    if (!ok && mode === 'signup') {
      setMsg('注册成功！如开启了邮箱确认，请先查收验证邮件再登录。')
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card card">
        <h1 className="auth-title">江南 · 日记</h1>
        <p className="subtitle">登录后，日记将安全保存在你的 Supabase 云端，多端同步。</p>
        <form onSubmit={submit}>
          <label className="field">
            <span>邮箱</span>
            <input type="email" required value={email} onChange={function (e) { setEmail(e.target.value) }} placeholder="you@example.com" />
          </label>
          <label className="field">
            <span>密码</span>
            <input type="password" required minLength={6} value={password} onChange={function (e) { setPassword(e.target.value) }} placeholder="至少 6 位" />
          </label>
          {error && <p className="auth-error">{error}</p>}
          {msg && <p className="auth-msg">{msg}</p>}
          <button type="submit" className="btn-primary auth-submit" disabled={busy}>
            {busy ? '处理中…' : (mode === 'signin' ? '登录' : '注册')}
          </button>
        </form>
        <p className="auth-switch">
          {mode === 'signin' ? '还没有账号？' : '已有账号？'}
          <button type="button" className="link-btn" onClick={function () { setMode(mode === 'signin' ? 'signup' : 'signin'); setMsg('') }}>
            {mode === 'signin' ? '立即注册' : '去登录'}
          </button>
        </p>
      </div>
    </div>
  )
}
