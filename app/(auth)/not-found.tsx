import Link from "next/link"

export default function AuthNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100 p-6">
      <div className="max-w-md rounded-md border border-neutral-800 bg-neutral-950/60 p-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold">Page not found</h1>
        <p className="mb-4 text-sm text-neutral-300">The requested authentication page could not be found.</p>
        <Link href="/" className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Go home
        </Link>
      </div>
    </div>
  )
}
