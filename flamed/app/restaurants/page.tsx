// app/restaurants/page.tsx (or any component with "use client")
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Restaurant = {
  id: string
  name: string
  price_tag: string | null
  is_active: boolean | null
}

export default function RestaurantsPage() {
  const [data, setData] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id,name,price_tag,is_active')
        .eq('is_active', true)
        .limit(50)

      if (error) setError(error.message)
      else setData(data || [])
      setLoading(false)
    }

    load()
  }, [])

  if (loading) return <p>Loading…</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <ul className="space-y-2">
      {data.map(r => (
        <li key={r.id}>
          <strong>{r.name}</strong> {r.price_tag ? `· ${r.price_tag}` : ''}
        </li>
      ))}
    </ul>
  )
}