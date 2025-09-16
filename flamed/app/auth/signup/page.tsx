// app/auth/signup/page.tsx
'use client'
import { useState } from 'react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName })
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
      <h1 className="text-xl font-semibold">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={e=>setFullName(e.target.value)}
          required
        />
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
          {loading ? 'Creating…' : 'Sign up'}
        </button>
      </form>

      {result && (
        <pre className="text-xs whitespace-pre-wrap border p-2 bg-white/40">
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
