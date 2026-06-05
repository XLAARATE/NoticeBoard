import { useState } from 'react'
import { useRouter } from 'next/router'

export type NoticeFormValues = {
  title: string
  body: string
  category: string
  priority: string
  publishDate: string
  imageUrl: string
}

type Props = {
  initialValues?: Partial<NoticeFormValues>
  onSubmit: (values: NoticeFormValues) => Promise<{ error?: string }>
  submitLabel: string
  heading: string
}

const defaultValues: NoticeFormValues = {
  title: '',
  body: '',
  category: 'General',
  priority: 'Normal',
  publishDate: '',
  imageUrl: '',
}

export default function NoticeForm({ initialValues, onSubmit, submitLabel, heading }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<NoticeFormValues>({ ...defaultValues, ...initialValues })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: keyof NoticeFormValues, v: string) =>
    setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await onSubmit(form)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f4f0] py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-4 transition-colors"
          >
            ← Back to notices
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Notice title"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Body <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                placeholder="Notice details..."
                rows={5}
                value={form.body}
                onChange={e => set('body', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
              />
            </div>

            {/* Category + Priority side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                >
                  <option value="General">General</option>
                  <option value="Exam">Exam</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={e => set('priority', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Publish date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.publishDate}
                onChange={e => set('publishDate', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>

            {/* Image URL (bonus) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Image URL <span className="text-gray-400 font-normal normal-case">(optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={e => set('imageUrl', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition"
              >
                {loading ? 'Saving…' : submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
