import { useRouter } from 'next/router'

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
        <p className="text-gray-500 mb-6">Page not found</p>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-700 transition"
        >
          Back to notices
        </button>
      </div>
    </div>
  )
}
