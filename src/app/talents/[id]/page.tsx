import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function TalentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('role', 'seeker')
    .maybeSingle()

  if (error || !data) notFound()
  const talent = data as Profile

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isSelf = user?.id === talent.id

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <Link href="/" className="text-xl" style={{ fontFamily: "'DM Serif Display', serif" }}>
          BYmate
        </Link>
        <Link
          href="/talents"
          className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
        >
          Alle Talente
        </Link>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-4 pb-24">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs uppercase tracking-wider text-white/40">
            {talent.location || 'Bayern'}
          </span>
          {!talent.available && (
            <span className="text-[10px] uppercase tracking-widest text-white/60 bg-white/10 rounded-full px-2 py-1">
              Nicht verfügbar
            </span>
          )}
          {isSelf && (
            <span className="text-[10px] uppercase tracking-widest text-emerald-300 bg-emerald-500/15 rounded-full px-2 py-1">
              Dein Profil
            </span>
          )}
        </div>

        <h1
          className="text-4xl md:text-5xl mb-2"
          style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}
        >
          {talent.full_name}
        </h1>
        {talent.headline && <p className="text-white/60 text-lg mb-8">{talent.headline}</p>}

        {talent.bio && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8 whitespace-pre-wrap text-white/80 leading-relaxed">
            {talent.bio}
          </div>
        )}

        {talent.skills.length > 0 && (
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Skills</p>
            <div className="flex flex-wrap gap-2">
              {talent.skills.map(s => (
                <span
                  key={s}
                  className="text-sm text-white/80 bg-white/5 border border-white/10 rounded-full px-4 py-1.5"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {!isSelf && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
            {user ? (
              <Link
                href={`/messages/${talent.id}`}
                className="inline-block px-5 py-2 rounded-full bg-white text-black text-sm hover:opacity-85 transition"
              >
                Nachricht schreiben
              </Link>
            ) : (
              <>
                <p className="text-white/50 text-sm mb-3">Log dich ein, um eine Nachricht zu schreiben.</p>
                <Link
                  href="/auth"
                  className="inline-block px-5 py-2 rounded-full bg-white text-black text-sm hover:opacity-85 transition"
                >
                  Einloggen
                </Link>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
