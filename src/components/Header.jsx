import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useSession } from '../context/SessionContext'
import { useTheme } from '../hooks/useTheme'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

export default function Header() {
  var _a = useSession(), session = _a.session, signOut = _a.signOut
  var _b = useTheme(), isDark = _b.isDark, toggle = _b.toggle
  var isLocal = Boolean(session && session.local)

  return (
    <React.Fragment>
      <header className="relative z-10 text-center pt-12 pb-6 px-5">
        <h1 className="text-h1-size font-semibold tracking-heading text-green-deep">江南 · 日记</h1>
        <p className="mt-2.5 text-[15px] text-ink-soft tracking-subtitle">烟柳画桥，风帘翠幕，记取流年点滴</p>
      </header>

      <div className="relative z-10 max-w-[760px] mx-auto px-5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {isLocal ? (
            <Badge variant="local">本地模式 · 数据仅存本机浏览器</Badge>
          ) : (
            <Badge variant="cloud">Supabase · {session && session.user.email}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}>
            {isDark ? React.createElement(Sun, { className: 'w-4 h-4' }) : React.createElement(Moon, { className: 'w-4 h-4' })}
          </Button>
          {!isLocal && (
            <Button variant="ghost" size="sm" onClick={signOut}>登出</Button>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}
