export default function DiaryList({ entries, onEdit, onDelete }) {
  if (!entries.length) {
    return <p className="empty-state">尚无日记。提笔写下第一页，江南的时光便从今日开启。</p>
  }
  return (
    <ul className="diary-list">
      {entries.map(function (e) {
        return (
          <li className="entry" key={e.id}>
            <div className="entry-main">
              <div className="entry-meta">
                <span className="entry-mood">{e.mood || '·'}</span>
                <span className="entry-date">{e.date}</span>
              </div>
              <h3 className="entry-title">{e.title || '（无题）'}</h3>
              <p className="entry-content">{e.content}</p>
            </div>
            <div className="entry-actions">
              <button type="button" className="btn-mini" onClick={function () { onEdit(e) }}>编辑</button>
              <button type="button" className="btn-mini danger" onClick={function () { onDelete(e.id) }}>删除</button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
