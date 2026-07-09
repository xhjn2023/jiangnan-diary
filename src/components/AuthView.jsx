import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useSession } from '../context/SessionContext'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function AuthView() {
  var _a = useSession(), signIn = _a.signIn, signUp = _a.signUp, error = _a.error
  var _b = useState('signin'), mode = _b[0], setMode = _b[1]
  var _c = useState(''), email = _c[0], setEmail = _c[1]
  var _d = useState(''), password = _d[0], setPassword = _d[1]
  var _e = useState(false), busy = _e[0], setBusy = _e[1]
  var _f = useState(''), msg = _f[0], setMsg = _f[1]

  var submit = async function (e) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    var ok = mode === 'signin' ? await signIn(email, password) : await signUp(email, password)
    setBusy(false)
    if (!ok && mode === 'signup') setMsg('注册成功！如开启了邮箱确认，请先查收验证邮件再登录。')
  }

  var toggleMode = function () {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setMsg('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="relative z-10 min-h-[72vh] flex items-center justify-center p-5">
      <div className="w-full max-w-[380px] card p-7">
        <h1 className="mb-1.5 text-[26px] tracking-title text-green-deep text-center font-semibold">江南 · 日记</h1>
        <p className="text-center text-sm text-ink-soft mb-5">登录后，日记安全保存在 Supabase 云端，多端同步</p>
        <form onSubmit={submit}>
          <label className="block mb-4">
            <span className="block text-[13px] text-ink-soft mb-1.5 tracking-subtitle">邮箱</span>
            <Input type="email" required value={email} onChange={function (e) { setEmail(e.target.value) }} placeholder="you@example.com" />
          </label>
          <label className="block mb-4">
            <span className="block text-[13px] text-ink-soft mb-1.5 tracking-subtitle">密码</span>
            <Input type="password" required minLength={6} value={password} onChange={function (e) { setPassword(e.target.value) }} placeholder="至少 6 位" />
          </label>
          {error && <p className="text-accent text-[13px] mb-3">{error}</p>}
          {msg && <p className="text-green-deep text-[13px] mb-3">{msg}</p>}
          <Button type="submit" className="w-full mt-2" disabled={busy}>
            {busy ? React.createElement(React.Fragment, null, React.createElement(Loader2, { className: 'mr-2 h-4 w-4 animate-spin' }), '处理中…') : (mode === 'signin' ? '登录' : '注册')}
          </Button>
        </form>
        <p className="text-center text-[13px] text-ink-soft mt-4">
          {mode === 'signin' ? '还没有账号？' : '已有账号？'}
          <button type="button" className="text-green-deep underline text-[13px] ml-1 hover:text-green" onClick={toggleMode}>
            {mode === 'signin' ? '立即注册' : '去登录'}
          </button>
        </p>
      </div>
    </div>
  )
}
