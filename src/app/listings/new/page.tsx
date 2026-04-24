'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ListingForm, {
  DEFAULT_LISTING_VALUES,
  toListingPayload,
  type ListingFormValues,
} from '@/components/ListingForm'

export default function NewListingPage() {
  const router = useRouter()

  const [ready, setReady] = useState(false)
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [values, setValues] = useState<ListingFormValues>(DEFAULT_LISTING_VALUES)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/auth')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, location')
        .eq('id', session.user.id)
        .maybeSingle()
      if (!profile) {
        router.push('/onboarding')
        return
      }
      if (profile.role !== 'founder') {
        setError('Nur Gründer-Accounts können Anzeigen schalten. Wechsle deinen Account-Typ im Profil.')
        setReady(true)
        return
      }
      setOwnerId(session.user.id)
      if (profile.location) setValues(v => ({ ...v, location: profile.location as string }))
      setReady(true)
    })
  }, [])

  async function handleSubmit() {
    if (!ownerId) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase
      .from('listings')
      .insert({ owner_id: ownerId, ...toListingPayload(values) })
      .select('id')
      .single()

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push(`/listings/${data.id}`)
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-white/40">Lade...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <Link href="/" className="text-xl" style={{ fontFamily: "'DM Serif Display', serif" }}>
          BYmate
        </Link>
        <Link
          href="/listings"
          className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
        >
          Zurück
        </Link>
      </nav>

      <section className="max-w-2xl mx-auto px-6 pt-4 pb-24">
        <h1 className="text-4xl mb-2" style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}>
          Neue Anzeige
        </h1>
        <p className="text-white/40 mb-10">Erzähl, woran ihr baut und wen ihr sucht.</p>

        {ownerId ? (
          <ListingForm
            ownerId={ownerId}
            values={values}
            onChange={patch => setValues(v => ({ ...v, ...patch }))}
            onSubmit={handleSubmit}
            submitLabel="Anzeige veröffentlichen"
            loading={loading}
            error={error}
          />
        ) : (
          error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )
        )}
      </section>
    </main>
  )
}
