import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { STAGE_LABELS, type Listing } from '@/lib/types'
import OwnerActions from './owner-actions'

export const dynamic = 'force-dynamic'

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) notFound()
  const listing = data as Listing

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isOwner = user?.id === listing.owner_id

  const displayName = listing.stealth || !listing.startup_name
    ? `${listing.industry} · ${STAGE_LABELS[listing.stage]}`
    : listing.startup_name

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
          Alle Anzeigen
        </Link>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-4 pb-24">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs uppercase tracking-wider text-white/40">
            {listing.location} · {STAGE_LABELS[listing.stage]}
          </span>
          {listing.stealth && (
            <span className="text-[10px] uppercase tracking-widest text-white/70 bg-white/10 rounded-full px-2 py-1">
              Stealth
            </span>
          )}
          {isOwner && (
            <span className="text-[10px] uppercase tracking-widest text-emerald-300 bg-emerald-500/15 rounded-full px-2 py-1">
              Deine Anzeige
            </span>
          )}
          {listing.status !== 'active' && (
            <span className="text-[10px] uppercase tracking-widest text-amber-300 bg-amber-500/15 rounded-full px-2 py-1">
              {listing.status === 'paused' ? 'Pausiert' : 'Geschlossen'}
            </span>
          )}
        </div>

        <h1
          className="text-4xl md:text-5xl mb-3"
          style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}
        >
          {displayName}
        </h1>
        {!listing.stealth && listing.startup_name && (
          <p className="text-white/50 mb-8">{listing.industry}</p>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8 whitespace-pre-wrap text-white/80 leading-relaxed">
          {listing.description}
        </div>

        {listing.roles_needed.length > 0 && (
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Gesuchte Rollen</p>
            <div className="flex flex-wrap gap-2">
              {listing.roles_needed.map(r => (
                <span
                  key={r}
                  className="text-sm text-white/80 bg-white/5 border border-white/10 rounded-full px-4 py-1.5"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {isOwner && (
          <OwnerActions listingId={listing.id} status={listing.status} />
        )}

        {!isOwner && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
            {user ? (
              <>
                <p className="text-white/50 text-sm mb-3">Interesse? Schreib den Gründer direkt an.</p>
                <Link
                  href={`/messages/${listing.owner_id}?listing=${listing.id}`}
                  className="inline-block px-5 py-2 rounded-full bg-white text-black text-sm hover:opacity-85 transition"
                >
                  Nachricht schreiben
                </Link>
              </>
            ) : (
              <>
                <p className="text-white/50 text-sm mb-3">Log dich ein, um Kontakt aufzunehmen.</p>
                <Link
                  href="/auth"
                  className="inline-block px-5 py-2 rounded-full bg-white text-black text-sm hover:opacity-85 transition"
                >
                  Account erstellen
                </Link>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
