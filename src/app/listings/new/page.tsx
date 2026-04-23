'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ROLE_SUGGESTIONS, STAGE_LABELS, type Stage } from '@/lib/types'

export default function NewListingPage() {
  const router = useRouter()

  const [ready, setReady] = useState(false)
  const [ownerId, setOwnerId] = useState<string | null>(null)

  const [stealth, setStealth] = useState(false)
  const [startupName, setStartupName] = useState('')
  const [industry, setIndustry] = useState('')
  const [stage, setStage] = useState<Stage>('idea')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [customRole, setCustomRole] = useState('')

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
      if (profile.location) setLocation(profile.location)
      setReady(true)
    })
  }, [])

  function toggleRole(r: string) {
    setRoles(prev => (prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]))
  }

  function addCustomRole() {
    const r = customRole.trim()
    if (!r) return
    if (!roles.includes(r)) setRoles(prev => [...prev, r])
    setCustomRole('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ownerId) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase
      .from('listings')
      .insert({
        owner_id: ownerId,
        stealth,
        startup_name: stealth ? null : startupName.trim() || null,
        industry: industry.trim(),
        stage,
        location: location.trim(),
        description: description.trim(),
        roles_needed: roles,
      })
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
        <p className="text-white/40 mb-10">Beschreibe dein Startup und wen du suchst.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={stealth}
              onChange={e => setStealth(e.target.checked)}
              className="mt-1"
            />
            <div>
              <div className="font-medium">Stealth Mode</div>
              <div className="text-sm text-white/50">
                Dein Startup-Name bleibt privat. Öffentlich sichtbar sind nur Branche, Stage und Beschreibung.
              </div>
            </div>
          </label>

          {!stealth && (
            <Field label="Startup Name">
              <input
                value={startupName}
                onChange={e => setStartupName(e.target.value)}
                placeholder="z.B. Acme GmbH"
                className="field"
              />
            </Field>
          )}

          <Field label="Branche *">
            <input
              required
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              placeholder="z.B. SaaS B2B, Fintech, Deeptech"
              className="field"
            />
          </Field>

          <Field label="Stage *">
            <select
              value={stage}
              onChange={e => setStage(e.target.value as Stage)}
              className="field"
            >
              {Object.entries(STAGE_LABELS).map(([k, v]) => (
                <option key={k} value={k} className="bg-[#0a0a0a]">
                  {v}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Standort *">
            <input
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="z.B. München"
              className="field"
            />
          </Field>

          <Field label="Beschreibung *">
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              placeholder="Was baut ihr? Warum ist es spannend? Was bringt ihr schon mit?"
              className="field"
            />
          </Field>

          <Field label="Gesuchte Rollen">
            <div className="flex flex-wrap gap-2 mb-3">
              {ROLE_SUGGESTIONS.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRole(r)}
                  className={`text-xs rounded-full px-3 py-1 border transition ${
                    roles.includes(r)
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={customRole}
                onChange={e => setCustomRole(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCustomRole()
                  }
                }}
                placeholder="Eigene Rolle hinzufügen"
                className="field flex-1"
              />
              <button
                type="button"
                onClick={addCustomRole}
                className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
              >
                +
              </button>
            </div>
            {roles.filter(r => !ROLE_SUGGESTIONS.includes(r)).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {roles
                  .filter(r => !ROLE_SUGGESTIONS.includes(r))
                  .map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => toggleRole(r)}
                      className="text-xs rounded-full px-3 py-1 bg-white text-black border border-white"
                    >
                      {r} ×
                    </button>
                  ))}
              </div>
            )}
          </Field>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !ownerId}
            className="px-6 py-3 rounded-full bg-white text-black font-medium hover:opacity-85 disabled:opacity-40 transition"
          >
            {loading ? 'Speichere...' : 'Anzeige veröffentlichen'}
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
