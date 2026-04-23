'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ROLE_SUGGESTIONS, type UserRole } from '@/lib/types'

export default function OnboardingPage() {
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<UserRole>('founder')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [headline, setHeadline] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [customSkill, setCustomSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/auth')
        return
      }
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle()
      if (existing) {
        router.push('/dashboard')
        return
      }
      setUserId(session.user.id)
      setUserEmail(session.user.email ?? null)
    })
  }, [])

  function toggleSkill(s: string) {
    setSkills(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]))
  }

  function addCustomSkill() {
    const s = customSkill.trim()
    if (!s) return
    if (!skills.includes(s)) setSkills(prev => [...prev, s])
    setCustomSkill('')
  }

  async function handleSubmit() {
    if (!userId || !userEmail) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      email: userEmail,
      full_name: fullName,
      role,
      bio,
      location,
      headline: role === 'seeker' ? headline : null,
      skills: role === 'seeker' ? skills : [],
    })

    if (error) setError(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <h1
          className="text-4xl mb-2"
          style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}
        >
          Profil anlegen
        </h1>
        <p className="text-white/40 mb-10">Nur einmal, dauert 1 Minute.</p>

        <div className="space-y-6">
          <Field label="Name *">
            <input
              type="text"
              placeholder="Dein Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="field"
            />
          </Field>

          <Field label="Ich bin...">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole('founder')}
                className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition ${
                  role === 'founder'
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 text-white border-white/10 hover:border-white/30'
                }`}
              >
                Gründer mit freiem Platz
              </button>
              <button
                type="button"
                onClick={() => setRole('seeker')}
                className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition ${
                  role === 'seeker'
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 text-white border-white/10 hover:border-white/30'
                }`}
              >
                Auf Teamsuche
              </button>
            </div>
          </Field>

          {role === 'seeker' && (
            <Field label="Headline">
              <input
                type="text"
                placeholder="z.B. Fullstack-Entwickler sucht ambitioniertes Founding-Team"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                className="field"
              />
            </Field>
          )}

          <Field label="Über mich">
            <textarea
              placeholder={
                role === 'founder'
                  ? 'Wer bist du, woran arbeitest du?'
                  : 'Was machst du, was suchst du?'
              }
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              className="field"
            />
          </Field>

          <Field label="Standort">
            <input
              type="text"
              placeholder="z.B. München"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="field"
            />
          </Field>

          {role === 'seeker' && (
            <Field label="Skills">
              <div className="flex flex-wrap gap-2 mb-3">
                {ROLE_SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkill(s)}
                    className={`text-xs rounded-full px-3 py-1 border transition ${
                      skills.includes(s)
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={customSkill}
                  onChange={e => setCustomSkill(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomSkill()
                    }
                  }}
                  placeholder="Eigenen Skill hinzufügen"
                  className="field flex-1"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
                >
                  +
                </button>
              </div>
              {skills.filter(s => !ROLE_SUGGESTIONS.includes(s)).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills
                    .filter(s => !ROLE_SUGGESTIONS.includes(s))
                    .map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSkill(s)}
                        className="text-xs rounded-full px-3 py-1 bg-white text-black border border-white"
                      >
                        {s} ×
                      </button>
                    ))}
                </div>
              )}
            </Field>
          )}

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !fullName}
            className="w-full px-6 py-3 rounded-full bg-white text-black font-medium hover:opacity-85 disabled:opacity-40 transition"
          >
            {loading ? 'Speichere...' : 'Weiter'}
          </button>
        </div>
      </div>

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
