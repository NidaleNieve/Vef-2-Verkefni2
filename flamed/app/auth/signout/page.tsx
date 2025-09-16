// app/auth/signout/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function SignoutPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const onClick = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/auth/signout', { method: 'POST' })
      const json = await res.json()
      setResult(json)
    } catch (err: any) {
      setResult({ ok: false, error: err?.message || 'Request failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Sign out</h1>
      <button disabled={loading} onClick={onClick} className="border px-3 py-2 w-full">
        {loading ? 'Signing out…' : 'Sign out'}
      </button>
      <div className="text-sm">
        <Link className="underline" href="/auth/signin">Back to sign in</Link>
      </div>
      {result && (
        <pre className="text-xs whitespace-pre-wrap border p-2 bg-white/40">
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
