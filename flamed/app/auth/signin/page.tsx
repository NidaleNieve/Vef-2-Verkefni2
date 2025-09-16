// app/auth/signin/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function SigninPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
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
      <h1 className="text-xl font-semibold">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
        />
        <button disabled={loading} className="border px-3 py-2 w-full">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="text-sm">
        No account? <Link className="underline" href="/auth/signup">Sign up</Link>
      </div>

      {result && (
        <pre className="text-xs whitespace-pre-wrap border p-2 bg-white/40">
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
