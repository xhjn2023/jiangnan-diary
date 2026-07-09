function downloadBlob(content, mimeType, filename) {
  var blob = new Blob([content], { type: mimeType })
  var url = URL.createObjectURL(blob)
  var a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportAsJSON(entries) {
  var data = JSON.stringify(entries, null, 2)
  var date = new Date().toISOString().slice(0, 10)
  downloadBlob(data, 'application/json', 'jiangnan-diary-' + date + '.json')
}

export function exportAsMarkdown(entries) {
  var md = entries.map(function (e) {
    return '# ' + e.date + '  ' + (e.mood || '') + '\n\n## ' + e.title + '\n\n' + e.content + '\n\n---\n'
  }).join('\n')
  var date = new Date().toISOString().slice(0, 10)
  downloadBlob(md, 'text/markdown', 'jiangnan-diary-' + date + '.md')
}
