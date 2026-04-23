'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function MessageComposer({
  recipientId,
  listingId,
  senderId,
}: {
  recipientId: string
  listingId: string | null
  senderId: string
}) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function send() {
    const trimmed = body.trim()
    if (!trimmed) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.from('messages').insert({
      sender_id: senderId,
      recipient_id: recipientId,
      listing_id: listingId,
      body: trimmed,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setBody('')
    setLoading(false)
    router.refresh()
  }

  return (
    <div>
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300 mb-2">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="Schreib eine Nachricht... (⌘+Enter zum Senden)"
          rows={2}
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none text-white"
        />
        <button
          onClick={send}
          disabled={loading || !body.trim()}
          className="px-5 py-2 rounded-full bg-white text-black font-medium text-sm hover:opacity-85 disabled:opacity-40 transition self-end"
        >
          {loading ? '...' : 'Senden'}
        </button>
      </div>
    </div>
  )
}
