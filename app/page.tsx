import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Stadium OW Comp Builder
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Build the perfect Overwatch composition
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/editor"
            className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-900/50 transition-all text-lg"
          >
            New Editor (Search-Based)
          </Link>
          <Link
            href="/stadium/editor"
            className="px-8 py-4 rounded-xl font-semibold border-2 border-white/20 text-white hover:bg-white/5 transition text-lg"
          >
            Classic Editor
          </Link>
        </div>
      </div>
    </div>
  )
}
