import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { STAGE_LABELS, type Listing, type Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (!profileData) redirect('/onboarding')
  const profile = profileData as Profile

  const { data: ownListings } = await supabase
    .from('listings')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const own = (ownListings ?? []) as Listing[]
  const isFounder = profile.role === 'founder'

  const { count: unreadCount } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('recipient_id', user.id)
    .is('read_at', null)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <Link href="/" className="text-xl" style={{ fontFamily: "'DM Serif Display', serif" }}>
          BYmate
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/50">{profile.full_name}</span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
            >
              Logout
            </button>
          </form>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-4 pb-16">
        <h1
          className="text-4xl md:text-5xl mb-2"
          style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}
        >
          Servus, {profile.full_name.split(' ')[0]} 👋
        </h1>
        <p className="text-white/40 mb-12">
          {isFounder
            ? 'Verwalte deine Anzeigen oder schau, wer noch in Bayern unterwegs ist.'
            : 'Schau, welche Gründer aktuell ein Team aufbauen.'}
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Link
            href="/listings"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/25 transition"
          >
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="text-lg font-medium mb-1">Anzeigen durchsuchen</h3>
            <p className="text-sm text-white/50">Aktive Gesuche in Bayern.</p>
          </Link>

          <Link
            href="/talents"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/25 transition"
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="text-lg font-medium mb-1">Talente entdecken</h3>
            <p className="text-sm text-white/50">Menschen, die mitbauen wollen.</p>
          </Link>

          <Link
            href="/messages"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/25 transition relative"
          >
            <div className="text-2xl mb-2">💬</div>
            <h3 className="text-lg font-medium mb-1">Nachrichten</h3>
            <p className="text-sm text-white/50">
              {unreadCount ? `${unreadCount} ungelesen` : 'Inbox öffnen'}
            </p>
            {!!unreadCount && (
              <span className="absolute top-5 right-5 text-[10px] bg-emerald-500 text-black rounded-full px-2 py-0.5 font-medium">
                {unreadCount}
              </span>
            )}
          </Link>

          {isFounder && (
            <Link
              href="/listings/new"
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/25 transition md:col-span-3"
            >
              <div className="text-2xl mb-2">➕</div>
              <h3 className="text-lg font-medium mb-1">Neue Anzeige schalten</h3>
              <p className="text-sm text-white/50">Beschreib dein Startup und wen du suchst.</p>
            </Link>
          )}
        </div>

        {isFounder && (
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4">Deine Anzeigen</h2>
            {own.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
                Noch keine Anzeigen.{' '}
                <Link href="/listings/new" className="underline">
                  Jetzt eine schalten
                </Link>
                .
              </div>
            ) : (
              <div className="grid gap-3">
                {own.map(l => (
                  <Link
                    key={l.id}
                    href={`/listings/${l.id}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/25 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs uppercase tracking-wider text-white/40 mb-1">
                        {STAGE_LABELS[l.stage]} · {l.location} · {l.status}
                      </div>
                      <div className="text-lg" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        {l.stealth || !l.startup_name ? l.industry : l.startup_name}
                      </div>
                    </div>
                    {l.stealth && (
                      <span className="text-[10px] uppercase tracking-widest text-white/70 bg-white/10 rounded-full px-2 py-1">
                        Stealth
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
