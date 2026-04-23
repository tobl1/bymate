import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { STAGE_LABELS, type Listing, type Stage } from '@/lib/types'

export const dynamic = 'force-dynamic'

type SearchParams = {
  location?: string
  stage?: Stage
  industry?: string
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (params.location) query = query.ilike('location', `%${params.location}%`)
  if (params.stage) query = query.eq('stage', params.stage)
  if (params.industry) query = query.ilike('industry', `%${params.industry}%`)

  const { data: listings, error } = await query
  const rows = (listings ?? []) as Listing[]

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <Link href="/" className="text-xl" style={{ fontFamily: "'DM Serif Display', serif" }}>
          BYmate
        </Link>
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/listings/new"
            className="px-4 py-2 rounded-full bg-white text-black text-sm hover:opacity-85 transition"
          >
            Anzeige aufgeben
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-8 pb-12">
        <h1 className="text-4xl md:text-5xl mb-2" style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}>
          Offene Teamplätze
        </h1>
        <p className="text-white/40 mb-10">Gründer in Bayern, die gerade ein Team aufbauen.</p>

        <form className="flex flex-wrap gap-3 mb-10" method="get">
          <input
            name="location"
            defaultValue={params.location ?? ''}
            placeholder="Ort (z.B. München)"
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30"
          />
          <input
            name="industry"
            defaultValue={params.industry ?? ''}
            placeholder="Branche"
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30"
          />
          <select
            name="stage"
            defaultValue={params.stage ?? ''}
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-white/30"
          >
            <option value="">Alle Stages</option>
            {Object.entries(STAGE_LABELS).map(([k, v]) => (
              <option key={k} value={k} className="bg-[#0a0a0a]">
                {v}
              </option>
            ))}
          </select>
          <button className="px-5 py-2 rounded-full bg-white text-black text-sm hover:opacity-85 transition">
            Filtern
          </button>
        </form>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            Fehler beim Laden: {error.message}
          </div>
        )}

        {!error && rows.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/50">
            Noch keine passenden Anzeigen. Sei der Erste und{' '}
            <Link href="/listings/new" className="underline">
              schalte eine Anzeige
            </Link>
            .
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {rows.map(l => (
            <Link
              key={l.id}
              href={`/listings/${l.id}`}
              className="block rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/25 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-white/40">
                  {STAGE_LABELS[l.stage]} · {l.location}
                </span>
                {l.stealth && (
                  <span className="text-[10px] uppercase tracking-widest text-white/60 bg-white/10 rounded-full px-2 py-1">
                    Stealth
                  </span>
                )}
              </div>
              <h3 className="text-xl mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {l.stealth || !l.startup_name ? l.industry : l.startup_name}
              </h3>
              {!l.stealth && l.startup_name && (
                <p className="text-sm text-white/40 mb-3">{l.industry}</p>
              )}
              <p className="text-sm text-white/60 line-clamp-3">{l.description}</p>
              {l.roles_needed.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {l.roles_needed.map(r => (
                    <span
                      key={r}
                      className="text-xs text-white/70 bg-white/5 border border-white/10 rounded-full px-3 py-1"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
