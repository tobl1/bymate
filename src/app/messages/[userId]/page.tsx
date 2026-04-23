import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Message, Profile } from '@/lib/types'
import MessageComposer from './composer'

export const dynamic = 'force-dynamic'

type Search = { listing?: string }

export default async function ConversationPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>
  searchParams: Promise<Search>
}) {
  const { userId } = await params
  const { listing } = await searchParams
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')
  if (user.id === userId) redirect('/messages')

  const { data: partnerData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (!partnerData) notFound()
  const partner = partnerData as Profile

  const { data: msgData } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user.id})`
    )
    .order('created_at', { ascending: true })

  const messages = (msgData ?? []) as Message[]

  // Mark inbound as read
  const unreadIds = messages.filter(m => m.recipient_id === user.id && !m.read_at).map(m => m.id)
  if (unreadIds.length > 0) {
    await supabase.from('messages').update({ read_at: new Date().toISOString() }).in('id', unreadIds)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 max-w-3xl mx-auto w-full">
        <Link
          href="/messages"
          className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition"
        >
          ← Inbox
        </Link>
        <div className="text-right">
          <div className="font-medium">{partner.full_name}</div>
          {partner.headline && (
            <div className="text-xs text-white/40 max-w-[240px] truncate">{partner.headline}</div>
          )}
        </div>
      </nav>

      <section className="flex-1 max-w-3xl w-full mx-auto px-6 pt-4 pb-8">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/50">
            Noch keine Nachrichten. Schreib den ersten Gruß.
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(m => {
              const mine = m.sender_id === user.id
              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                      mine
                        ? 'bg-white text-black'
                        : 'bg-white/5 border border-white/10 text-white/90'
                    }`}
                  >
                    {m.body}
                    <div className={`text-[10px] mt-1 ${mine ? 'text-black/40' : 'text-white/30'}`}>
                      {new Date(m.created_at).toLocaleString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <MessageComposer
            recipientId={partner.id}
            listingId={listing ?? null}
            senderId={user.id}
          />
        </div>
      </div>
    </main>
  )
}
