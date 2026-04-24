'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ImageUpload from '@/components/ImageUpload'
import {
  MAX_ROLES,
  ROLE_SUGGESTIONS,
  SEEKER_TYPE_LABELS,
  STAGE_LABELS,
  type Profile,
  type SeekerType,
  type Stage,
} from '@/lib/types'

export default function ProfileEditPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'founder' | 'seeker'>('founder')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [headline, setHeadline] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [seekerType, setSeekerType] = useState<SeekerType>('cofounder')
  const [desiredStage, setDesiredStage] = useState<Stage>('idea')
  const [contribution, setContribution] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()
      if (!data) {
        router.push('/onboarding')
        return
      }
      const p = data as Profile
      setUserId(p.id)
      setFullName(p.full_name)
      setRole(p.role)
      setBio(p.bio ?? '')
      setLocation(p.location ?? '')
      setHeadline(p.headline ?? '')
      setSkills(p.skills ?? [])
      setPhotoUrl(p.photo_url ?? null)
      setSeekerType(p.seeker_type ?? 'cofounder')
      setDesiredStage(p.desired_stage ?? 'idea')
      setContribution(p.contribution ?? '')
      setLinkedinUrl(p.linkedin_url ?? '')
      setPortfolioUrl(p.portfolio_url ?? '')
      setAvailable(p.available)
      setReady(true)
    })()
  }, [])

  function toggleSkill(s: string) {
    setSkills(prev => {
      if (prev.includes(s)) return prev.filter(x => x !== s)
      if (prev.length >= MAX_ROLES) return prev
      return [...prev, s]
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    if (role === 'seeker' && !photoUrl) {
      setError('Foto ist Pflicht für Talent-Profile.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        bio,
        location,
        headline: role === 'seeker' ? headline : null,
        skills: role === 'seeker' ? skills : [],
        photo_url: role === 'seeker' ? photoUrl : null,
        seeker_type: role === 'seeker' ? seekerType : null,
        desired_stage: role === 'seeker' ? desiredStage : null,
        contribution: role === 'seeker' ? contribution : null,
        linkedin_url: linkedinUrl.trim() || null,
        portfolio_url: role === 'seeker' ? portfolioUrl.trim() || null : null,
        available,
      })
      .eq('id', userId)
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
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
          href="/dashboard"
          className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
        >
          Abbrechen
        </Link>
      </nav>

      <section className="max-w-2xl mx-auto px-6 pt-4 pb-24">
        <h1 className="text-4xl mb-2" style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}>
          Profil bearbeiten
        </h1>
        <p className="text-white/40 mb-10">Änderungen sind sofort live.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Name *">
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="field"
              required
            />
          </Field>

          {role === 'seeker' && userId && (
            <ImageUpload
              bucket="avatars"
              userId={userId}
              value={photoUrl}
              onChange={setPhotoUrl}
              label="Foto"
              shape="circle"
              required
            />
          )}

          {role === 'seeker' && (
            <Field label="Headline">
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                className="field"
              />
            </Field>
          )}

          <Field label="Über mich">
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              className="field"
            />
          </Field>

          <Field label="Standort">
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="field"
            />
          </Field>

          {role === 'seeker' && (
            <>
              <Field label="Ich suche als">
                <div className="flex gap-3">
                  {(Object.keys(SEEKER_TYPE_LABELS) as SeekerType[]).map(k => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setSeekerType(k)}
                      className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition ${
                        seekerType === k
                          ? 'bg-white text-black border-white'
                          : 'bg-white/5 text-white border-white/10 hover:border-white/30'
                      }`}
                    >
                      {SEEKER_TYPE_LABELS[k]}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Gewünschte Team-Stage">
                <select
                  value={desiredStage}
                  onChange={e => setDesiredStage(e.target.value as Stage)}
                  className="field"
                >
                  {Object.entries(STAGE_LABELS).map(([k, v]) => (
                    <option key={k} value={k} className="bg-[#0a0a0a]">
                      {v}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={`Skills / Rollen (max. ${MAX_ROLES})`}>
                <div className="flex flex-wrap gap-2">
                  {ROLE_SUGGESTIONS.map(s => {
                    const picked = skills.includes(s)
                    const atMax = skills.length >= MAX_ROLES && !picked
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={atMax}
                        onClick={() => toggleSkill(s)}
                        className={`text-xs rounded-full px-3 py-1 border transition ${
                          picked
                            ? 'bg-white text-black border-white'
                            : atMax
                            ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed'
                            : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-white/40 mt-2">{skills.length} / {MAX_ROLES} gewählt</p>
              </Field>

              <Field label="Was ich mitbringe">
                <textarea
                  value={contribution}
                  onChange={e => setContribution(e.target.value)}
                  rows={3}
                  className="field"
                />
              </Field>

              <Field label="Portfolio / GitHub / Dribbble">
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                  placeholder="https://..."
                  className="field"
                />
              </Field>

              <label className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={e => setAvailable(e.target.checked)}
                />
                <span className="text-sm">Aktuell verfügbar für Matches</span>
              </label>
            </>
          )}

          <Field label="LinkedIn">
            <input
              type="url"
              value={linkedinUrl}
              onChange={e => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="field"
            />
          </Field>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !fullName}
            className="px-6 py-3 rounded-full bg-white text-black font-medium hover:opacity-85 disabled:opacity-40 transition"
          >
            {loading ? 'Speichere...' : 'Änderungen speichern'}
          </button>
        </form>
      </section>

      <style>{`
        .field {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 12px 16px;
          color: #fff;
          font-size: 15px;
          outline: none;
          transition: border-color 0.15s;
        }
        .field::placeholder { color: rgba(255,255,255,0.3); }
        .field:focus { border-color: rgba(255,255,255,0.3); }
      `}</style>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-white/80">{label}</label>
      {children}
    </div>
  )
}
