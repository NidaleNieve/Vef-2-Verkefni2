import { NextResponse } from 'next/server'
import { serverClient } from '@/utils/supabase/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supa = await serverClient()
  const { data, error } = await supa
    .from('group_messages')
    .select('id,user_id,content,created_at')
    .eq('group_id', params.id)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ items: data })
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { content } = await req.json()
  const supa = await serverClient()
  const { data: { user } } = await supa.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { error } = await supa.from('group_messages').insert({
    group_id: params.id, user_id: user.id, content
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}