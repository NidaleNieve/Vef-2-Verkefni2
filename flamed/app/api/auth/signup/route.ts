import { NextResponse } from 'next/server'
import { serverClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const { email, password, full_name } = await req.json()
  const supa = await serverClient()
  const { error, data } = await supa.auth.signUp({
    email, password, options: { data: { full_name }, emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` }
  })
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 })
  return NextResponse.json({ ok:true, userId: data.user?.id ?? null })
}
