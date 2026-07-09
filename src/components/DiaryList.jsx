import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { groupByDate } from '../lib/groupEntries'
import { Button } from './ui/button'
import { DiarySkeleton } from './ui/skeleton'

function EntryContent(_a) {
  var content = _a.content
  var _b = useState(false), expanded = _b[0], setExpanded = _b[1]
  var shouldTruncate = content && content.length > 200

  return React.createElement('div', null,
    React.createElement('p', {
      className: 'text-[15px] text-ink-soft whitespace-pre-wrap break-words' + (!expanded && shouldTruncate ? ' line-clamp-4' : '')
    }, content),
    shouldTruncate && React.createElement('button', {
      type: 'button',
      className: 'text-green-deep text-xs mt-1 hover:underline',
      onClick: function () { setExpanded(!expanded) }
    }, expanded ? '收起' : '展开全文')
  )
}

export default function DiaryList(_a) {
  var entries = _a.entries, loading = _a.loading, onEdit = _a.onEdit, onDelete = _a.onDelete

  if (loading) return React.createElement(DiarySkeleton, null)

  if (!entries || !entries.length) {
    return React.createElement('p', { className: 'text-center text-ink-soft py-10 px-5 text-[15px] tracking-subtitle' },
      '尚无日记。提笔写下第一页，江南的时光便从今日开启。')
  }

  var groups = groupByDate(entries)

  return React.createElement('div', { className: 'flex flex-col gap-8' },
    groups.map(function (group) {
      return React.createElement('div', { key: group.label },
        React.createElement('div', { className: 'flex items-center gap-3 mb-3' },
          React.createElement('h3', { className: 'text-[13px] text-ink-soft tracking-subtitle font-semibold uppercase' }, group.label),
          React.createElement('span', { className: 'text-[11px] text-ink-soft/60 bg-ink/5 rounded-full px-2 py-0.5' }, group.items.length)
        ),
        React.createElement('ul', { className: 'flex flex-col gap-3.5' },
          React.createElement(AnimatePresence, null,
            group.items.map(function (e) {
              return React.createElement(motion.li, {
                key: e.id,
                layout: true,
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, scale: 0.95 },
                transition: { duration: 0.25 },
                className: 'entry card rounded-entry p-4 border-l-4 border-l-green'
              },
                React.createElement('div', { className: 'flex items-start justify-between gap-3' },
                  React.createElement('div', { className: 'entry-main min-w-0 flex-1' },
                    React.createElement('div', { className: 'entry-meta flex items-center gap-2.5 text-[13px] text-ink-soft mb-1.5' },
                      React.createElement('span', { className: 'entry-mood text-lg' }, e.mood || '·'),
                      React.createElement('span', { className: 'entry-date tracking-subtitle' }, e.date)
                    ),
                    React.createElement('h4', { className: 'entry-title mb-1.5 text-lg text-ink font-semibold tracking-title break-words' }, e.title || '（无题）'),
                    React.createElement(EntryContent, { content: e.content })
                  ),
                  React.createElement('div', { className: 'flex flex-col gap-2 flex-shrink-0' },
                    React.createElement(Button, { variant: 'mini', size: 'sm', onClick: function () { onEdit(e) } }, '编辑'),
                    React.createElement(Button, { variant: 'mini-danger', size: 'sm', onClick: function () { onDelete(e.id) } }, '删除')
                  )
                )
              )
            })
          )
        )
      )
    })
  )
}
