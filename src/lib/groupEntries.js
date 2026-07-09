import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function groupByDate(entries) {
  var groups = new Map()

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i]
    var date = parseISO(entry.date)
    var key

    if (isToday(date)) {
      key = '今天'
    } else if (isYesterday(date)) {
      key = '昨天'
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      key = '本周'
    } else if (isThisMonth(date)) {
      key = format(date, 'M月')
    } else if (isThisYear(date)) {
      key = format(date, 'M月', { locale: zhCN })
    } else {
      key = format(date, 'yyyy年M月', { locale: zhCN })
    }

    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(entry)
  }

  return Array.from(groups.entries()).map(function (_a) {
    var label = _a[0], items = _a[1]
    return { label: label, items: items.sort(function (a, b) { return b.date.localeCompare(a.date) }) }
  })
}
