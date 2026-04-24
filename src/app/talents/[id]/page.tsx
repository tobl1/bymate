import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { SEEKER_TYPE_LABELS, STAGE_LABELS, type Profile } from '@/lib/types'

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
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-xs uppercase tracking-wider text-white/40">
            {talent.location || 'Bayern'}
          </span>
          {talent.seeker_type && (
            <span className="text-[10px] uppercase tracking-widest text-white/70 bg-white/10 rounded-full px-2 py-1">
              {SEEKER_TYPE_LABELS[talent.seeker_type]}
            </span>
          )}
          {talent.desired_stage && (
            <span className="text-[10px] uppercase tracking-widest text-white/70 bg-white/10 rounded-full px-2 py-1">
              Sucht: {STAGE_LABELS[talent.desired_stage]}
            </span>
          )}
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

        <div className="flex items-start gap-5 mb-8">
          <div className="w-24 h-24 rounded-full border border-white/10 bg-white/5 overflow-hidden shrink-0">
            {talent.photo_url ? (
              <Image
                src={talent.photo_url}
                alt=""
                width={96}
                height={96}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30 text-2xl">
                {talent.full_name.slice(0, 1)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1
              className="text-4xl md:text-5xl mb-2"
              style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}
            >
              {talent.full_name}
            </h1>
            {talent.headline && <p className="text-white/60 text-lg">{talent.headline}</p>}
          </div>
        </div>

        {talent.bio && <Section label="Über mich" body={talent.bio} />}
        {talent.contribution && <Section label="Was ich mitbringe" body={talent.contribution} />}

        {talent.skills.length > 0 && (
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Skills / Rollen</p>
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

        {(talent.linkedin_url || talent.portfolio_url) && (
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Links</p>
            <div className="flex flex-wrap gap-2">
              {talent.linkedin_url && <LinkPill href={talent.linkedin_url} label="LinkedIn" />}
              {talent.portfolio_url && <LinkPill href={talent.portfolio_url} label="Portfolio" />}
            </div>
          </div>
        )}

        <p className="text-xs text-white/30 mb-10">
          Sucht Equity-only auf Vollzeit-Basis.
        </p>

        {isSelf && (
          <Link
            href="/profile/edit"
            className="inline-block px-5 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition mb-4"
          >
            Profil bearbeiten
          </Link>
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

function Section({ label, body }: { label: string; body: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs uppercase tracking-widest text-white/40 mb-3">{label}</p>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 whitespace-pre-wrap text-white/80 leading-relaxed">
        {body}
      </div>
    </div>
  )
}

function LinkPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-white/80 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 hover:border-white/30 transition"
    >
      {label} ↗
    </a>
  )
}
