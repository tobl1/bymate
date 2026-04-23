'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'founder' | 'seeker'>('founder')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
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
    })

    if (error) setError(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Profil anlegen</h1>
        <p className="text-gray-500 text-sm mb-6">Nur einmal, dauert 1 Minute.</p>

        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          placeholder="Dein Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-sm font-medium mb-1">Ich bin...</label>
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setRole('founder')}
            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
              role === 'founder' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'
            }`}
          >
            Gründer mit freiem Platz
          </button>
          <button
            onClick={() => setRole('seeker')}
            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
              role === 'seeker' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'
            }`}
          >
            Auf Teamsuche
          </button>
        </div>

        <label className="block text-sm font-medium mb-1">Über mich</label>
        <textarea
          placeholder="Was machst du, was suchst du?"
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-sm font-medium mb-1">Standort</label>
        <input
          type="text"
          placeholder="z.B. München"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !fullName}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Speichern...' : 'Weiter'}
        </button>
      </div>
    </div>
  )
}