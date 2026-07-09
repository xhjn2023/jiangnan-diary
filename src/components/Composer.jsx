import { useState, useEffect } from 'react'

const MOODS = [
  { emoji: '🌿', label: '治愈' },
  { emoji: '☀️', label: '喜悦' },
  { emoji: '😊', label: '平静' },
  { emoji: '🌧️', label: '忧郁' },
  { emoji: '🔥', label: '热烈' },
  { emoji: '🌙', label: '沉思' }
]

function todayStr() {
  const d = new Date()
  const p = function (n) { return String(n).padStart(2, '0') }
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())
}

export default function Composer({ initial, onSave, onCancel }) {
  const [date, setDate] = useState(todayStr())
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [hint, setHint] = useState('')

  useEffect(function () {
    if (initial) {
      setDate(initial.date || todayStr())
      setTitle(initial.title || '')
      setContent(initial.content || '')
      setMood(initial.mood || '')
    } else {
      setDate(todayStr())
      setTitle('')
      setContent('')
      setMood('')
    }
  }, [initial])

  const flash = function (msg, isErr) {
    setHint(msg)
    setTimeout(function () { setHint('') }, 2600)
  }

  const submit = function () {
    const t = title.trim()
    const c = content.trim()
    if (!t && !c) { flash('标题与正文都空着呢，写点什么吧。', true); return }
    onSave({ date: date, title: t, content: c, mood: mood })
    if (!initial) flash('已落笔 ✓')
  }

  const clear = function () { setTitle(''); setContent(''); setMood('') }

  return (
    <section className="composer card">
      <div className="composer-head">
        <h2>{initial ? '编辑日记' : '写一页新日记'}</h2>
        {initial && (
          <button type="button" className="btn-ghost" onClick={onCancel}>取消编辑</button>
        )}
      </div>

      <div className="field-row">
        <label className="field">
          <span>日期</span>
          <input id="entryDate" type="date" value={date} onChange={function (e) { setDate(e.target.value) }} />
        </label>
        <div className="field">
          <span>心情</span>
          <div className="mood-group">
            {MOODS.map(function (m) {
              return (
                <button
                  type="button"
                  key={m.emoji}
                  className={'mood' + (mood === m.emoji ? ' active' : '')}
                  title={m.label}
                  onClick={function () { setMood(mood === m.emoji ? '' : m.emoji) }}
                >
                  {m.emoji}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <label className="field">
        <span>标题</span>
        <input id="entryTitle" type="text" maxLength={60} placeholder="今日小记……" value={title} onChange={function (e) { setTitle(e.target.value) }} />
      </label>

      <label className="field">
        <span>正文</span>
        <textarea id="entryContent" rows={6} placeholder="提笔写点什么吧，此刻的天气、心情或偶遇。" value={content} onChange={function (e) { setContent(e.target.value) }}></textarea>
      </label>

      <div className="composer-actions">
        <span className="hint">{hint}</span>
        <div>
          <button type="button" className="btn-ghost" onClick={clear}>清空</button>
          <button type="button" className="btn-primary" onClick={submit}>{initial ? '保存修改' : '落笔保存'}</button>
        </div>
      </div>
    </section>
  )
}
