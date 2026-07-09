import { useEffect, useState } from 'react'
import { SessionProvider, useSession } from './context/SessionContext'
import AuthView from './components/AuthView'
import Header from './components/Header'
import Composer from './components/Composer'
import DiaryList from './components/DiaryList'
import { fetchDiaries, createDiary, updateDiary, deleteDiary } from './lib/diaryStore'

function DiaryApp() {
  const { session } = useSession()
  const userId = session.user.id
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [editing, setEditing] = useState(null)

  const reload = async function () {
    setLoading(true)
    try {
      const data = await fetchDiaries(userId)
      setEntries(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(function () { reload() }, [userId])

  const handleSave = async function (entry) {
    if (editing) {
      await updateDiary(userId, editing.id, entry)
      setEditing(null)
    } else {
      await createDiary(userId, entry)
    }
    await reload()
  }

  const handleEdit = function (entry) {
    setEditing(entry)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async function (id) {
    if (!window.confirm('确定要删除这篇日记吗？此操作不可撤销。')) return
    await deleteDiary(userId, id)
    if (editing && editing.id === id) setEditing(null)
    await reload()
  }

  const kw = keyword.trim().toLowerCase()
  const visible = entries.filter(function (e) {
    if (!kw) return true
    return (e.title || '').toLowerCase().indexOf(kw) >= 0 ||
           (e.content || '').toLowerCase().indexOf(kw) >= 0
  })

  return (
    <>
      <Header />
      <main className="container">
        <Composer
          key={editing ? editing.id : 'new'}
          initial={editing}
          onSave={handleSave}
          onCancel={function () { setEditing(null) }}
        />
        <section className="journal">
          <div className="toolbar">
            <div className="stats">
              {kw ? '共 ' + entries.length + ' 篇，匹配 ' + visible.length + ' 篇' : '共 ' + entries.length + ' 篇日记'}
            </div>
            <div className="toolbar-actions">
              <input type="search" placeholder="搜索标题或正文…" value={keyword} onChange={function (e) { setKeyword(e.target.value) }} />
            </div>
          </div>
          {loading
            ? <p className="empty-state">载入中…</p>
            : <DiaryList entries={visible} onEdit={handleEdit} onDelete={handleDelete} />}
        </section>
      </main>
    </>
  )
}

function Shell() {
  const { session, loading } = useSession()
  if (loading) return <div className="boot">载入中…</div>
  if (!session) return <AuthView />
  return <DiaryApp />
}

export default function App() {
  return (
    <SessionProvider>
      <Shell />
    </SessionProvider>
  )
}
