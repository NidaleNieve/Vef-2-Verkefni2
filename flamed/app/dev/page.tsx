// app/dev/page.tsx
'use client'
import { useState } from 'react'
import { supabaseBrowser } from '@/utils/supabase/browser'

export default function Dev() {
  const supa = supabaseBrowser()
  const [email, setEmail] = useState('user1@example.com')
  const [password, setPassword] = useState('Password123!')
  const [groupId, setGroupId] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [content, setContent] = useState('')
  const [log, setLog] = useState<string[]>([])
  const [fullName, setFullName] = useState('Dev User')
  const logit = (x: any) => setLog(l => [`> ${JSON.stringify(x)}`, ...l])

  return (
    <div className="p-4 space-y-3 max-w-lg">
      <h1 className="font-semibold text-lg">Dev Console</h1>

      <div className="space-y-2">
        <input className="border p-2 w-full" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 w-full" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
    <input className="border p-2 w-full" placeholder="full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
    <div className="flex gap-2">
          <button className="border px-3 py-2" onClick={async()=>{
      const r = await fetch('/api/auth/signup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password, full_name: fullName})})
            logit(await r.json())
          }}>Sign up</button>
          <button className="border px-3 py-2" onClick={async()=>{
            const r = await fetch('/api/auth/signin',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})})
            logit(await r.json())
          }}>Sign in</button>
          <button className="border px-3 py-2" onClick={async()=>{
            const r = await fetch('/api/auth/signout',{method:'POST'})
            logit(await r.json())
          }}>Sign out</button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <button className="border px-3 py-2" onClick={async()=>{
            const r = await fetch('/api/groups',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'My Group'})})
            const j = await r.json(); logit(j); if (j.group_id) setGroupId(j.group_id)
          }}>Create group</button>

          <button className="border px-3 py-2" disabled={!groupId} onClick={async()=>{
            const r = await fetch(`/api/groups/${groupId}/invites`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({max_uses:5})})
            const j = await r.json(); logit(j); if (j.code) setInviteCode(j.code)
          }}>Create invite</button>
        </div>

        <input className="border p-2 w-full" placeholder="invite code" value={inviteCode} onChange={e=>setInviteCode(e.target.value)} />
        <div className="flex gap-2">
          <button className="border px-3 py-2" onClick={async()=>{
            const r = await fetch('/api/groups/redeem',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code:inviteCode})})
            logit(await r.json())
          }}>Redeem invite</button>
        </div>

        <input className="border p-2 w-full" placeholder="message content" value={content} onChange={e=>setContent(e.target.value)} />
        <div className="flex gap-2">
          <button className="border px-3 py-2" disabled={!groupId} onClick={async()=>{
            const r = await fetch(`/api/groups/${groupId}/messages`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({content})})
            logit(await r.json())
          }}>Send message</button>
          <button className="border px-3 py-2" disabled={!groupId} onClick={async()=>{
            const r = await fetch(`/api/groups/${groupId}/messages`)
            logit(await r.json())
          }}>List messages</button>
        </div>
      </div>

      <pre className="text-xs whitespace-pre-wrap border p-2 max-h-80 overflow-auto">{log.join('\n')}</pre>
    </div>
  )
}
