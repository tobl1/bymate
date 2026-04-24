'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { INDUSTRIES, type Listing } from '@/lib/types'
import ListingForm, {
  DEFAULT_LISTING_VALUES,
  toListingPayload,
  type ListingFormValues,
} from '@/components/ListingForm'

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [ready, setReady] = useState(false)
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [values, setValues] = useState<ListingFormValues>(DEFAULT_LISTING_VALUES)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error || !data) {
        setError('Anzeige nicht gefunden.')
        setReady(true)
        return
      }
      const l = data as Listing
      if (l.owner_id !== session.user.id) {
        setError('Diese Anzeige gehört dir nicht.')
        setReady(true)
        return
      }
      setOwnerId(session.user.id)
      setValues({
        stealth: l.stealth,
        startup_name: l.startup_name ?? '',
        teaser: l.teaser ?? '',
        industry: INDUSTRIES.includes(l.industry as never) ? l.industry : INDUSTRIES[INDUSTRIES.length - 1],
        stage: l.stage,
        gmbh_founded: l.gmbh_founded ?? false,
        location: l.location,
        remote: l.remote ?? false,
        description: l.description,
        team_description: l.team_description ?? '',
        story: l.story ?? '',
        current_team: l.current_team ?? '',
        why_us: l.why_us ?? '',
        roles_needed: l.roles_needed,
        logo_url: l.logo_url ?? null,
        linkedin_company_url: l.linkedin_company_url ?? '',
        linkedin_person_url: l.linkedin_person_url ?? '',
        website_url: l.website_url ?? '',
      })
      setReady(true)
    })()
  }, [id])

  async function handleSubmit() {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase
      .from('listings')
      .update(toListingPayload(values))
      .eq('id', id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push(`/listings/${id}`)
    router.refresh()
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-white/40">Lade...</p>
      </main>
    )
  }

  if (error && !ownerId) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300 max-w-md text-center">
          {error}
          <div className="mt-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
            >
              Zum Dashboard
            </Link>
          </div>
        </div>
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
          href={`/listings/${id}`}
          className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
        >
          Abbrechen
        </Link>
      </nav>

      <section className="max-w-2xl mx-auto px-6 pt-4 pb-24">
        <h1 className="text-4xl mb-2" style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}>
          Anzeige bearbeiten
        </h1>
        <p className="text-white/40 mb-10">Änderungen sind sofort live.</p>

        {ownerId && (
          <ListingForm
            ownerId={ownerId}
            values={values}
            onChange={patch => setValues(v => ({ ...v, ...patch }))}
            onSubmit={handleSubmit}
            submitLabel="Änderungen speichern"
            loading={loading}
            error={error}
          />
        )}
      </section>
    </main>
  )
}
