import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { SEEKER_TYPE_LABELS, STAGE_LABELS, type Profile, type SeekerType, type Stage } from '@/lib/types'

export const dynamic = 'force-dynamic'

type SearchParams = {
  location?: string
  skill?: string
  seeker_type?: SeekerType
  desired_stage?: Stage
}

export default async function TalentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth?next=/talents')

  let query = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'seeker')
    .eq('available', true)
    .order('created_at', { ascending: false })

  if (params.location) query = query.ilike('location', `%${params.location}%`)
  if (params.skill) query = query.contains('skills', [params.skill])
  if (params.seeker_type) query = query.eq('seeker_type', params.seeker_type)
  if (params.desired_stage) query = query.eq('desired_stage', params.desired_stage)

  const { data, error } = await query
  const talents = (data ?? []) as Profile[]

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <Link href="/" className="text-xl" style={{ fontFamily: "'DM Serif Display', serif" }}>
          BYmate
        </Link>
        <div className="flex gap-3">
          <Link
            href="/listings"
            className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
          >
            Anzeigen
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-8 pb-12">
        <h1
          className="text-4xl md:text-5xl mb-2"
          style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}
        >
          Talente in Bayern
        </h1>
        <p className="text-white/40 mb-2">
          Menschen, die bei einem Startup mitbauen wollen.
        </p>
        <p className="text-xs text-white/30 mb-10">Alle Talente suchen Equity-only und Vollzeit.</p>

        <form className="flex flex-wrap gap-3 mb-10" method="get">
          <input
            name="location"
            defaultValue={params.location ?? ''}
            placeholder="Ort (z.B. München)"
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30"
          />
          <input
            name="skill"
            defaultValue={params.skill ?? ''}
            placeholder="Skill (z.B. Fullstack)"
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30"
          />
          <select
            name="seeker_type"
            defaultValue={params.seeker_type ?? ''}
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-white/30"
          >
            <option value="">Alle Typen</option>
            {(Object.keys(SEEKER_TYPE_LABELS) as SeekerType[]).map(k => (
              <option key={k} value={k} className="bg-[#0a0a0a]">
                {SEEKER_TYPE_LABELS[k]}
              </option>
            ))}
          </select>
          <select
            name="desired_stage"
            defaultValue={params.desired_stage ?? ''}
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

        {!error && talents.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/50">
            Noch keine Talente. Sei der Erste und leg ein Seeker-Profil an.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {talents.map(t => (
            <Link
              key={t.id}
              href={`/talents/${t.id}`}
              className="block rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/25 transition"
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 overflow-hidden shrink-0">
                  {t.photo_url ? (
                    <Image
                      src={t.photo_url}
                      alt=""
                      width={56}
                      height={56}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                      {t.full_name.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {t.full_name}
                  </h3>
                  <div className="text-xs text-white/40 mt-1">
                    {t.location || 'Bayern'}
                    {t.seeker_type && ` · ${SEEKER_TYPE_LABELS[t.seeker_type]}`}
                  </div>
                </div>
              </div>
              {t.headline && <p className="text-sm text-white/70 mb-3">{t.headline}</p>}
              {t.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {t.skills.map(s => (
                    <span
                      key={s}
                      className="text-xs text-white/70 bg-white/5 border border-white/10 rounded-full px-3 py-1"
                    >
                      {s}
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
