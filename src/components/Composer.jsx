import React, { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

var MOODS = [
  { emoji: '🌿', label: '治愈' },
  { emoji: '☀️', label: '喜悦' },
  { emoji: '😊', label: '平静' },
  { emoji: '🌧️', label: '忧郁' },
  { emoji: '🔥', label: '热烈' },
  { emoji: '🌙', label: '沉思' },
]

function todayStr() {
  var d = new Date()
  var p = function (n) { return String(n).padStart(2, '0') }
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())
}

export default function Composer({ initial, onSave, onCancel }) {
  var _a = useState(todayStr()), date = _a[0], setDate = _a[1]
  var _b = useState(''), title = _b[0], setTitle = _b[1]
  var _c = useState(''), content = _c[0], setContent = _c[1]
  var _d = useState(''), mood = _d[0], setMood = _d[1]
  var _e = useState(''), hint = _e[0], setHint = _e[1]

  // 恢复草稿
  useEffect(function () {
    var saved = localStorage.getItem('jiangnan_draft')
    if (saved && !initial) {
      try {
        var d = JSON.parse(saved)
        if (d.title) setTitle(d.title)
        if (d.content) setContent(d.content)
        if (d.mood) setMood(d.mood)
        if (d.date) setDate(d.date)
      } catch (e) {}
    }
    if (initial) {
      setDate(initial.date || todayStr())
      setTitle(initial.title || '')
      setContent(initial.content || '')
      setMood(initial.mood || '')
    }
  }, [initial])

  // 自动保存草稿（2s 防抖）
  useEffect(function () {
    if (initial) return
    if (!title.trim() && !content.trim()) return
    var t = setTimeout(function () {
      localStorage.setItem('jiangnan_draft', JSON.stringify({ title: title, content: content, mood: mood, date: date, ts: Date.now() }))
    }, 2000)
    return function () { clearTimeout(t) }
  }, [title, content, mood, date, initial])

  var flash = function (msg, isErr) {
    setHint(msg)
    setTimeout(function () { setHint('') }, 2600)
  }

  var submit = function () {
    var t = title.trim(), c = content.trim()
    if (!t && !c) { flash('标题与正文都空着呢，写点什么吧。', true); return }
    onSave({ date: date, title: t, content: c, mood: mood })
    localStorage.removeItem('jiangnan_draft')
    if (!initial) flash('已落笔 ✓')
  }

  var clear = function () {
    setTitle(''); setContent(''); setMood('')
    localStorage.removeItem('jiangnan_draft')
  }

  return (
    <section className="card p-6 mb-7">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl tracking-wide text-green-deep font-semibold">{initial ? '编辑日记' : '写一页新日记'}</h2>
        {initial && (
          <Button variant="ghost" size="sm" onClick={onCancel}>取消编辑</Button>
        )}
      </div>

      <div className="flex gap-4 flex-wrap">
        <label className="block flex-1 min-w-[200px] mb-4">
          <span className="block text-[13px] text-ink-soft mb-1.5 tracking-subtitle">日期</span>
          <Input id="entryDate" type="date" value={date} onChange={function (e) { setDate(e.target.value) }} />
        </label>
        <div className="flex-1 min-w-[200px] mb-4">
          <span className="block text-[13px] text-ink-soft mb-1.5 tracking-subtitle">心情</span>
          <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="选择心情">
            {MOODS.map(function (m) {
              return (
                <button
                  type="button" key={m.emoji}
                  className={'w-[42px] h-[42px] text-xl border border-ink/10 bg-white rounded-mood cursor-pointer transition-all duration-150 hover:-translate-y-0.5' + (mood === m.emoji ? ' !border-green !bg-green-pale shadow-focus' : '')}
                  title={m.label}
                  aria-label={m.label}
                  aria-pressed={mood === m.emoji}
                  onClick={function () { setMood(mood === m.emoji ? '' : m.emoji) }}
                  data-mood={m.emoji}
                >
                  {m.emoji}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <label className="block mb-4">
        <span className="block text-[13px] text-ink-soft mb-1.5 tracking-subtitle">标题</span>
        <Input id="entryTitle" type="text" maxLength={60} placeholder="今日小记……" value={title} onChange={function (e) { setTitle(e.target.value) }} />
      </label>

      <label className="block mb-4">
        <span className="block text-[13px] text-ink-soft mb-1.5 tracking-subtitle">正文</span>
        <Textarea id="entryContent" rows={6} placeholder="提笔写点什么吧，此刻的天气、心情或偶遇。" value={content} onChange={function (e) { setContent(e.target.value) }} />
      </label>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[13px] text-green-deep min-h-[18px]">{hint}</span>
        <div className="flex gap-2.5">
          <Button variant="ghost" type="button" onClick={clear}>清空</Button>
          <Button type="button" onClick={submit}>{initial ? '保存修改' : '落笔保存'}</Button>
        </div>
      </div>
    </section>
  )
}
