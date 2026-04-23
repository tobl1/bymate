import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Message, Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Conversation = {
  partner: Profile
  lastMessage: Message
  unread: number
}

export default async function InboxPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: msgs } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  const messages = (msgs ?? []) as Message[]

  // Group by partner
  const byPartner = new Map<string, Conversation>()
  for (const m of messages) {
    const partnerId = m.sender_id === user.id ? m.recipient_id : m.sender_id
    if (!byPartner.has(partnerId)) {
      byPartner.set(partnerId, { partner: {} as Profile, lastMessage: m, unread: 0 })
    }
    const conv = byPartner.get(partnerId)!
    if (m.recipient_id === user.id && !m.read_at) conv.unread += 1
  }

  const partnerIds = Array.from(byPartner.keys())
  if (partnerIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', partnerIds)
    for (const p of (profiles ?? []) as Profile[]) {
      const conv = byPartner.get(p.id)
      if (conv) conv.partner = p
    }
  }

  const conversations = Array.from(byPartner.values())
    .filter(c => c.partner.id)
    .sort(
      (a, b) =>
        new Date(b.lastMessage.created_at).getTime() -
        new Date(a.lastMessage.created_at).getTime()
    )

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
          Dashboard
        </Link>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-4 pb-24">
        <h1
          className="text-4xl md:text-5xl mb-10"
          style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}
        >
          Nachrichten
        </h1>

        {conversations.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/50">
            Noch keine Nachrichten. Schreib jemanden über{' '}
            <Link href="/listings" className="underline">
              Anzeigen
            </Link>{' '}
            oder{' '}
            <Link href="/talents" className="underline">
              Talente
            </Link>{' '}
            an.
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map(c => (
              <Link
                key={c.partner.id}
                href={`/messages/${c.partner.id}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/25 transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{c.partner.full_name}</span>
                    {c.unread > 0 && (
                      <span className="text-[10px] bg-emerald-500 text-black rounded-full px-2 py-0.5 font-medium">
                        {c.unread} neu
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/50 truncate">
                    {c.lastMessage.sender_id === user.id ? 'Du: ' : ''}
                    {c.lastMessage.body}
                  </p>
                </div>
                <span className="text-xs text-white/30 ml-4 whitespace-nowrap">
                  {formatDate(c.lastMessage.created_at)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffH = (now.getTime() - d.getTime()) / 3600000
  if (diffH < 24) return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  if (diffH < 24 * 7) return d.toLocaleDateString('de-DE', { weekday: 'short' })
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
}
