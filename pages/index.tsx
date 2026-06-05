import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

type Notice = {
  id: number
  title: string
  body: string
  category: string
  priority: string
  publishDate: string
  imageUrl: string | null
  createdAt: string
}

const CATEGORY_STYLES: Record<string, string> = {
  Exam: 'bg-violet-100 text-violet-700',
  Event: 'bg-emerald-100 text-emerald-700',
  General: 'bg-gray-100 text-gray-600',
}

export default function Home() {
  const router = useRouter()
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/notices')
      .then(r => r.json())
      .then(data => { setNotices(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"?\n\nThis action cannot be undone.`)) return
    setDeletingId(id)
    await fetch(`/api/notices/${id}`, { method: 'DELETE' })
    setNotices(n => n.filter(x => x.id !== id))
    setDeletingId(null)
  }

  const urgentCount = notices.filter(n => n.priority === 'Urgent').length

  return (
    <>
      <Head>
        <title>Notice Board</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#f5f4f0]">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-sm tracking-tight">Notice Board</span>
            </div>
            <button
              onClick={() => router.push('/add')}
              className="bg-gray-900 text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-1.5"
            >
              <span className="text-base leading-none">+</span> New notice
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {/* Summary row */}
          {!loading && notices.length > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{notices.length}</span> notice{notices.length !== 1 ? 's' : ''}
              </p>
              {urgentCount > 0 && (
                <span className="text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
                  {urgentCount} urgent
                </span>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
                  <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && notices.length === 0 && (
            <div className="text-center py-20">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm mb-4">No notices yet</p>
              <button
                onClick={() => router.push('/add')}
                className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-700 transition"
              >
                Add the first notice
              </button>
            </div>
          )}

          {/* Notice grid */}
          {!loading && notices.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notices.map(notice => (
                <div
                  key={notice.id}
                  className={`bg-white rounded-2xl border overflow-hidden flex flex-col transition-shadow hover:shadow-md ${
                    notice.priority === 'Urgent' ? 'border-red-200' : 'border-gray-200'
                  }`}
                >
                  {/* Image */}
                  {notice.imageUrl && (
                    <div className="h-36 overflow-hidden">
                      <img
                        src={notice.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {notice.priority === 'Urgent' && (
                        <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Urgent
                        </span>
                      )}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_STYLES[notice.category] ?? CATEGORY_STYLES.General}`}>
                        {notice.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-bold text-gray-900 text-[15px] leading-snug mb-2">
                      {notice.title}
                    </h2>

                    {/* Body */}
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1 mb-4">
                      {notice.body}
                    </p>

                    {/* Date */}
                    <p className="text-xs text-gray-400 mb-4">
                      {new Date(notice.publishDate).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => router.push(`/edit/${notice.id}`)}
                        className="flex-1 text-xs font-medium border border-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id, notice.title)}
                        disabled={deletingId === notice.id}
                        className="flex-1 text-xs font-medium border border-red-100 text-red-600 py-2 rounded-xl hover:bg-red-50 disabled:opacity-50 transition"
                      >
                        {deletingId === notice.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
