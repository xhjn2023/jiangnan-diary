import { supabase, isSupabaseConfigured } from './supabase'

const LS_KEY = 'jiangnan_diaries_v1'

// ---------- 工具 ----------
function pad2(n) { n = String(n); return n.length < 2 ? '0' + n : n }
function todayStr() {
  const d = new Date()
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8) }
function isArray(a) { return Object.prototype.toString.call(a) === '[object Array]' }

// Supabase 行 -> 前端条目
function rowToEntry(r) {
  return {
    id: r.id,
    date: r.date,
    title: r.title || '',
    content: r.content || '',
    mood: r.mood || '',
    createdAt: r.created_at ? new Date(r.created_at).getTime() : 0,
    updatedAt: r.updated_at ? new Date(r.updated_at).getTime() : 0
  }
}

function sortEntries(arr) {
  return arr.slice().sort(function (a, b) {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return (b.updatedAt || 0) - (a.updatedAt || 0)
  })
}

// ---------- localStorage 回退 ----------
function lsLoad() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    const a = raw ? JSON.parse(raw) : []
    return isArray(a) ? a : []
  } catch (e) { return [] }
}
function lsSave(arr) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(arr)) } catch (e) { /* 忽略 */ }
}

// ---------- 对外 API（按是否配置 Supabase 自动切换） ----------
export async function fetchDiaries(userId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('updated_at', { ascending: false })
    if (error) throw error
    return (data || []).map(rowToEntry)
  }
  return sortEntries(lsLoad().filter(function (e) { return !e.user_id || e.user_id === userId }))
}

export async function createDiary(userId, entry) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('diaries')
      .insert({
        user_id: userId,
        date: entry.date,
        title: entry.title,
        content: entry.content,
        mood: entry.mood
      })
      .select()
      .single()
    if (error) throw error
    return rowToEntry(data)
  }
  const item = {
    id: uid(),
    user_id: userId,
    date: entry.date || todayStr(),
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  const arr = lsLoad()
  arr.push(item)
  lsSave(arr)
  return item
}

export async function updateDiary(userId, id, entry) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('diaries')
      .update({
        date: entry.date,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) throw error
    return rowToEntry(data)
  }
  const next = lsLoad().map(function (e) {
    if (e.id !== id) return e
    return {
      ...e,
      date: entry.date,
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      updatedAt: Date.now()
    }
  })
  lsSave(next)
  return next.find(function (e) { return e.id === id })
}

export async function deleteDiary(userId, id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('diaries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw error
    return
  }
  const next = lsLoad().filter(function (e) { return e.id !== id })
  lsSave(next)
}
