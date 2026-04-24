'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { ListingStatus } from '@/lib/types'

const STATUS_LABELS: Record<ListingStatus, string> = {
  active: 'Aktiv',
  paused: 'Pausiert',
  closed: 'Geschlossen',
}

export default function OwnerActions({
  listingId,
  status,
}: {
  listingId: string
  status: ListingStatus
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<'pause' | 'close' | null>(null)
  const [error, setError] = useState('')

  async function setStatus(next: ListingStatus, action: 'pause' | 'close') {
    setLoading(action)
    setError('')
    const supabase = createClient()
    const { error } = await supabase
      .from('listings')
      .update({ status: next })
      .eq('id', listingId)
    if (error) {
      setError(error.message)
      setLoading(null)
      return
    }
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Status</div>
          <div className="text-lg">{STATUS_LABELS[status]}</div>
        </div>
        <Link
          href={`/listings/${listingId}/edit`}
          className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
        >
          Bearbeiten
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {status === 'active' && (
          <button
            onClick={() => setStatus('paused', 'pause')}
            disabled={!!loading}
            className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 disabled:opacity-40 transition"
          >
            {loading === 'pause' ? '...' : 'Pausieren'}
          </button>
        )}
        {status === 'paused' && (
          <button
            onClick={() => setStatus('active', 'pause')}
            disabled={!!loading}
            className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 disabled:opacity-40 transition"
          >
            {loading === 'pause' ? '...' : 'Reaktivieren'}
          </button>
        )}
        {status !== 'closed' && (
          <button
            onClick={() => {
              if (confirm('Anzeige endgültig schließen? Sie wird nicht mehr öffentlich angezeigt.')) {
                setStatus('closed', 'close')
              }
            }}
            disabled={!!loading}
            className="px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-300 text-sm hover:border-red-500/60 disabled:opacity-40 transition"
          >
            {loading === 'close' ? '...' : 'Schließen'}
          </button>
        )}
        {status === 'closed' && (
          <button
            onClick={() => setStatus('active', 'pause')}
            disabled={!!loading}
            className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 disabled:opacity-40 transition"
          >
            {loading === 'pause' ? '...' : 'Wieder öffnen'}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-300 mt-3">{error}</p>
      )}
    </div>
  )
}
