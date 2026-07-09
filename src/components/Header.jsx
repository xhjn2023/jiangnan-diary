import { useSession } from '../context/SessionContext'

export default function Header() {
  const { session, signOut } = useSession()
  const isLocal = Boolean(session && session.local)
  return (
    <>
      <header className="site-header">
        <h1>江南 · 日记</h1>
        <p className="subtitle">烟柳画桥，风帘翠幕，记取流年点滴</p>
      </header>
      <div className="topbar">
        {isLocal ? (
          <span className="mode-badge local">本地模式 · 未连接 Supabase（数据仅存本机浏览器）</span>
        ) : (
          <span className="mode-badge cloud">已连接 Supabase · {session && session.user.email}</span>
        )}
        {!isLocal && (
          <button type="button" className="btn-ghost" onClick={signOut}>登出</button>
        )}
      </div>
    </>
  )
}
