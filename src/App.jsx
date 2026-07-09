import React, { useEffect, useState } from 'react'
import { SessionProvider, useSession } from './context/SessionContext'
import { ToastProvider } from './hooks/ToastContext'
import { useToast } from './hooks/useToast'
import { useToastCtx } from './hooks/ToastContext'
import AuthView from './components/AuthView'
import Header from './components/Header'
import Composer from './components/Composer'
import DiaryList from './components/DiaryList'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Badge } from './components/ui/badge'
import { AlertCircle, Download } from 'lucide-react'
import { fetchDiaries, createDiary, updateDiary, deleteDiary } from './lib/diaryStore'
import { exportAsJSON, exportAsMarkdown } from './lib/exportEntries'

var MOODS = [
  { emoji: '🌿', label: '治愈' },
  { emoji: '☀️', label: '喜悦' },
  { emoji: '😊', label: '平静' },
  { emoji: '🌧️', label: '忧郁' },
  { emoji: '🔥', label: '热烈' },
  { emoji: '🌙', label: '沉思' },
]

function DiaryApp() {
  var _a = useSession(), session = _a.session
  var toast = useToastCtx()
  var userId = session.user.id

  var _b = useState([]), entries = _b[0], setEntries = _b[1]
  var _c = useState(true), loading = _c[0], setLoading = _c[1]
  var _d = useState(''), keyword = _d[0], setKeyword = _d[1]
  var _e = useState(''), moodFilter = _e[0], setMoodFilter = _e[1]
  var _f = useState(null), editing = _f[0], setEditing = _f[1]
  var _g = useState(null), error = _g[0], setError = _g[1]
  var _h = useState(null), deleteTarget = _h[0], setDeleteTarget = _h[1]

  var reload = async function () {
    setLoading(true)
    setError(null)
    try {
      var data = await fetchDiaries(userId)
      setEntries(data)
    } catch (e) {
      console.error(e)
      setError(e.message || '加载日记失败')
      toast.error('加载日记失败，请检查网络连接')
    }
    setLoading(false)
  }

  useEffect(function () { reload() }, [userId])

  var handleSave = async function (entry) {
    try {
      if (editing) { await updateDiary(userId, editing.id, entry); setEditing(null) }
      else { await createDiary(userId, entry) }
      await reload()
      toast.success(editing ? '日记已更新' : '日记已保存')
    } catch (e) {
      toast.error('保存失败：' + (e.message || '请重试'))
    }
  }

  var handleEdit = function (entry) {
    setEditing(entry)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  var handleDelete = async function () {
    if (!deleteTarget) return
    try {
      await deleteDiary(userId, deleteTarget.id)
      if (editing && editing.id === deleteTarget.id) setEditing(null)
      setDeleteTarget(null)
      await reload()
      toast.success('日记已删除')
    } catch (e) {
      toast.error('删除失败：' + (e.message || '请重试'))
    }
  }

  var handleExport = function (format) {
    if (!entries.length) { toast.info('暂无日记可导出'); return }
    if (format === 'json') exportAsJSON(entries)
    else exportAsMarkdown(entries)
    toast.success('已导出 ' + entries.length + ' 篇日记')
  }

  var kw = keyword.trim().toLowerCase()
  var visible = entries.filter(function (e) {
    var matchSearch = !kw || (e.title || '').toLowerCase().indexOf(kw) >= 0 || (e.content || '').toLowerCase().indexOf(kw) >= 0
    var matchMood = !moodFilter || e.mood === moodFilter
    return matchSearch && matchMood
  })

  return React.createElement(React.Fragment, null,
    React.createElement(Header, null),
    React.createElement('main', { className: 'relative z-10 max-w-[760px] mx-auto px-5 pb-15' },
      // 错误卡片
      error && React.createElement('div', { className: 'card rounded-entry p-4 border-l-4 border-l-accent mb-4 flex items-center gap-3' },
        React.createElement(AlertCircle, { className: 'w-5 h-5 text-accent flex-shrink-0' }),
        React.createElement('div', { className: 'flex-1 text-sm text-ink-soft' }, error),
        React.createElement(Button, { variant: 'ghost', size: 'sm', onClick: reload }, '重试')
      ),

      // 写作区
      React.createElement(Composer, {
        key: editing ? editing.id : 'new',
        initial: editing,
        onSave: handleSave,
        onCancel: function () { setEditing(null) }
      }),

      // 列表区
      React.createElement('section', { className: 'journal' },
        // 工具栏
        React.createElement('div', { className: 'flex items-center justify-between gap-3 mb-4 flex-wrap' },
          React.createElement('div', { className: 'text-sm text-ink-soft tracking-subtitle' },
            kw || moodFilter
              ? '共 ' + entries.length + ' 篇，匹配 ' + visible.length + ' 篇'
              : '共 ' + entries.length + ' 篇日记'
          ),
          React.createElement('div', { className: 'flex items-center gap-2 flex-wrap' },
            // 心情筛选
            React.createElement('div', { className: 'flex gap-1' },
              MOODS.map(function (m) {
                return React.createElement('button', {
                  key: m.emoji, type: 'button',
                  className: 'w-8 h-8 rounded-mood text-sm border border-ink/10 bg-white transition-all hover:-translate-y-0.5' + (moodFilter === m.emoji ? ' !border-green !bg-green-pale' : ''),
                  title: m.label,
                  onClick: function () { setMoodFilter(moodFilter === m.emoji ? '' : m.emoji) }
                }, m.emoji)
              })
            ),
            // 搜索
            React.createElement(Input, {
              type: 'search', placeholder: '搜索标题或正文…',
              value: keyword, className: 'w-[160px]',
              onChange: function (e) { setKeyword(e.target.value) },
              'aria-label': '搜索日记'
            }),
            // 导出
            React.createElement('div', { className: 'flex gap-1' },
              React.createElement(Button, { variant: 'ghost', size: 'sm', onClick: function () { handleExport('md') }, title: '导出 Markdown' },
                React.createElement(Download, { className: 'w-4 h-4 mr-1' }), 'MD'
              ),
              React.createElement(Button, { variant: 'ghost', size: 'sm', onClick: function () { handleExport('json') }, title: '导出 JSON' }, 'JSON')
            )
          )
        ),

        // 日记列表
        React.createElement(DiaryList, {
          entries: visible, loading: loading,
          onEdit: handleEdit,
          onDelete: function (id) {
            var e = entries.find(function (x) { return x.id === id })
            if (e) setDeleteTarget(e)
          }
        })
      ),

      // 删除确认 Dialog
      React.createElement(Dialog, { open: Boolean(deleteTarget), onOpenChange: function (v) { if (!v) setDeleteTarget(null) } },
        React.createElement(DialogContent, null,
          React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null, '确认删除'),
            React.createElement(DialogDescription, null,
              '确定要删除「' + (deleteTarget && deleteTarget.title || '这篇日记') + '」吗？此操作不可撤销。')
          ),
          React.createElement('div', { className: 'flex justify-end gap-3 mt-4' },
            React.createElement(Button, { variant: 'ghost', onClick: function () { setDeleteTarget(null) } }, '取消'),
            React.createElement(Button, { variant: 'primary', onClick: handleDelete, className: '!bg-accent hover:!bg-accent/90' }, '确认删除')
          )
        )
      )
    )
  )
}

// Shell: 会话加载 → 登录 or 主界面
function Shell() {
  var _a = useSession(), session = _a.session, loading = _a.loading
  if (loading) return React.createElement('div', { className: 'text-center py-20 text-ink-soft' }, '载入中…')
  if (!session) return React.createElement(AuthView, null)
  return React.createElement(DiaryApp, null)
}

// 顶层：ToastProvider 包裹
function ToastShell() {
  var hookResult = useToast()
  return React.createElement(ToastProvider, { useToastHook: function () { return hookResult } },
    React.createElement(SessionProvider, null, React.createElement(Shell, null))
  )
}

export default ToastShell
