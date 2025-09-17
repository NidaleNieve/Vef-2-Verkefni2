// app/dev/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/utils/supabase/browser'

export default function Dev() {
  const supa = supabaseBrowser()
  const [email, setEmail] = useState('user1@example.com')
  const [password, setPassword] = useState('Password123!')
  const [fullName, setFullName] = useState('Dev User')

  const [groupId, setGroupId] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  const [log, setLog] = useState<string[]>([])
  const logit = (x: any) => setLog(l => [`> ${JSON.stringify(x)}`, ...l])

  // show who we are (useful in incognito vs normal window)
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supa.auth.getUser()
      setUserId(user?.id ?? null)
    })()
  }, [supa])

  const fetchJSON = async (url: string, init?: RequestInit) => {
    const r = await fetch(url, { credentials: 'include', ...init })
    const body = await r.json().catch(() => ({}))
    const payload = { status: r.status, ...body }
    logit(payload)
    return { r, body: payload }
  }

  return (
    <div className="p-4 space-y-4 max-w-lg">
      <h1 className="font-semibold text-lg">Dev Console</h1>

      <p className="text-xs opacity-70">
        userId: {userId || '(not signed in)'}<br />
        groupId: {groupId || '(none)'}
      </p>

      {/* Auth */}
      <div className="space-y-2">
        <input className="border p-2 w-full" placeholder="email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 w-full" placeholder="password" type="password"
               value={password} onChange={e=>setPassword(e.target.value)} />
        <input className="border p-2 w-full" placeholder="full name"
               value={fullName} onChange={e=>setFullName(e.target.value)} />

        <div className="flex gap-2 flex-wrap">
          <button className="border px-3 py-2" onClick={async()=>{
            const { body } = await fetchJSON('/api/auth/signup', {
              method:'POST',
              headers:{'content-type':'application/json'},
              body: JSON.stringify({ email, password, full_name: fullName })
            })
            if (body?.ok) {
              const u = await supa.auth.getUser()
              setUserId(u.data.user?.id ?? null)
            }
          }}>Sign up</button>

          <button className="border px-3 py-2" onClick={async()=>{
            const { body } = await fetchJSON('/api/auth/signin', {
              method:'POST',
              headers:{'content-type':'application/json'},
              body: JSON.stringify({ email, password })
            })
            if (body?.ok) {
              const u = await supa.auth.getUser()
              setUserId(u.data.user?.id ?? null)
            }
          }}>Sign in</button>

          <button className="border px-3 py-2" onClick={async()=>{
            await fetchJSON('/api/auth/signout', { method:'POST' })
            setUserId(null)
          }}>Sign out</button>
        </div>
      </div>

      {/* Groups & Invites */}
      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          <button className="border px-3 py-2" onClick={async()=>{
            const { body } = await fetchJSON('/api/groups', {
              method:'POST',
              headers:{'content-type':'application/json'},
              body: JSON.stringify({ name: 'My Group' })
            })
            if (body?.group_id) setGroupId(body.group_id)
          }}>Create group</button>

          <button className="border px-3 py-2" disabled={!groupId} onClick={async()=>{
            const { body } = await fetchJSON(`/api/groups/${groupId}/invites`, {
              method:'POST',
              headers:{'content-type':'application/json'},
              body: JSON.stringify({ max_uses: 5 })
            })
            if (body?.code) setInviteCode(body.code)
          }}>Create invite</button>
        </div>

        <input className="border p-2 w-full" placeholder="invite code"
               value={inviteCode} onChange={e=>setInviteCode(e.target.value)} />

        <div className="flex gap-2">
          <button className="border px-3 py-2" onClick={async()=>{
            const { body } = await fetchJSON('/api/groups/redeem', {
              method:'POST',
              headers:{'content-type':'application/json'},
              body: JSON.stringify({ code: inviteCode })
            })
            // IMPORTANT: set groupId from redeem response so buttons work in incognito
            if (body?.group_id) setGroupId(body.group_id)
          }}>Redeem invite</button>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-2">
        <input className="border p-2 w-full" placeholder="message content"
               value={content} onChange={e=>setContent(e.target.value)} />

        <div className="flex gap-2 flex-wrap">
          <button className="border px-3 py-2"
                  disabled={!groupId || !content.trim()}
                  onClick={async()=>{
                    if (!groupId) { logit({ error:'No groupId set' }); return }
                    await fetchJSON(`/api/groups/${groupId}/messages`, {
                      method:'POST',
                      headers:{'content-type':'application/json'},
                      body: JSON.stringify({ content })
                    })
                    setContent('')
                  }}>
            Send message
          </button>

          <button className="border px-3 py-2"
                  disabled={!groupId}
                  onClick={async()=>{
                    if (!groupId) { logit({ error:'No groupId set' }); return }
                    await fetchJSON(`/api/groups/${groupId}/messages`)
                  }}>
            List messages
          </button>
        </div>
      </div>

      <pre className="text-xs whitespace-pre-wrap border p-2 max-h-80 overflow-auto">
        {log.join('\n')}
      </pre>
    </div>
  )
}