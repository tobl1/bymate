'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Props = {
  bucket: 'logos' | 'avatars'
  userId: string
  value: string | null
  onChange: (url: string | null) => void
  label: string
  shape?: 'square' | 'circle'
  required?: boolean
}

export default function ImageUpload({
  bucket,
  userId,
  value,
  onChange,
  label,
  shape = 'square',
  required = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setError('Datei zu groß (max 5 MB).')
      return
    }
    setError('')
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${userId}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (upErr) {
      setError(upErr.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  const rounded = shape === 'circle' ? 'rounded-full' : 'rounded-2xl'

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-white/80">
        {label}
        {required && ' *'}
      </label>
      <div className="flex items-center gap-4">
        <div
          className={`w-24 h-24 ${rounded} border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center`}
        >
          {value ? (
            <Image
              src={value}
              alt=""
              width={96}
              height={96}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-xs text-white/30">Kein Bild</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 disabled:opacity-40 transition"
          >
            {uploading ? 'Lade hoch...' : value ? 'Ändern' : 'Bild wählen'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs text-white/50 hover:text-white/80 text-left"
            >
              Entfernen
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-300 mt-2">{error}</p>}
    </div>
  )
}
