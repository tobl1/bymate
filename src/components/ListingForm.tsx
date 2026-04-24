'use client'

import { useState } from 'react'
import {
  INDUSTRIES,
  MAX_ROLES,
  ROLE_SUGGESTIONS,
  STAGE_LABELS,
  type Stage,
} from '@/lib/types'
import ImageUpload from './ImageUpload'

export type ListingFormValues = {
  stealth: boolean
  startup_name: string
  teaser: string
  industry: string
  stage: Stage
  gmbh_founded: boolean
  location: string
  remote: boolean
  description: string
  team_description: string
  story: string
  current_team: string
  why_us: string
  roles_needed: string[]
  logo_url: string | null
  linkedin_company_url: string
  linkedin_person_url: string
  website_url: string
}

export const DEFAULT_LISTING_VALUES: ListingFormValues = {
  stealth: false,
  startup_name: '',
  teaser: '',
  industry: INDUSTRIES[0],
  stage: 'idea',
  gmbh_founded: false,
  location: '',
  remote: false,
  description: '',
  team_description: '',
  story: '',
  current_team: '',
  why_us: '',
  roles_needed: [],
  logo_url: null,
  linkedin_company_url: '',
  linkedin_person_url: '',
  website_url: '',
}

type Props = {
  ownerId: string
  values: ListingFormValues
  onChange: (patch: Partial<ListingFormValues>) => void
  onSubmit: () => void
  submitLabel: string
  loading: boolean
  error: string
}

export default function ListingForm({
  ownerId,
  values,
  onChange,
  onSubmit,
  submitLabel,
  loading,
  error,
}: Props) {
  const [customRole, setCustomRole] = useState('')

  function toggleRole(r: string) {
    const has = values.roles_needed.includes(r)
    if (has) {
      onChange({ roles_needed: values.roles_needed.filter(x => x !== r) })
    } else if (values.roles_needed.length < MAX_ROLES) {
      onChange({ roles_needed: [...values.roles_needed, r] })
    }
  }

  function addCustomRole() {
    const r = customRole.trim()
    if (!r) return
    if (values.roles_needed.includes(r)) return
    if (values.roles_needed.length >= MAX_ROLES) return
    onChange({ roles_needed: [...values.roles_needed, r] })
    setCustomRole('')
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/50 leading-relaxed">
        BYmate-Anzeigen sind <strong className="text-white/80">Equity-only</strong> und auf <strong className="text-white/80">Vollzeit-Basis</strong>.
        Bitte nur Team-Gesuche schalten, die genau das bieten.
      </div>

      <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 cursor-pointer">
        <input
          type="checkbox"
          checked={values.stealth}
          onChange={e => onChange({ stealth: e.target.checked })}
          className="mt-1"
        />
        <div>
          <div className="font-medium">Stealth Mode</div>
          <div className="text-sm text-white/50">
            Euer Teamname und Logo bleiben privat. Öffentlich sichtbar sind nur Branche, Stage und Beschreibung.
          </div>
        </div>
      </label>

      {!values.stealth && (
        <>
          <Field label="Teamname">
            <input
              value={values.startup_name}
              onChange={e => onChange({ startup_name: e.target.value })}
              placeholder="z.B. Acme GmbH"
              className="field"
            />
          </Field>

          <ImageUpload
            bucket="logos"
            userId={ownerId}
            value={values.logo_url}
            onChange={url => onChange({ logo_url: url })}
            label="Logo"
            shape="square"
          />
        </>
      )}

      <Field label="Teaser-Satz *">
        <input
          required
          maxLength={180}
          value={values.teaser}
          onChange={e => onChange({ teaser: e.target.value })}
          placeholder="Ein Satz, der Talente neugierig macht (max. 180 Zeichen)"
          className="field"
        />
        <p className="text-xs text-white/40 mt-1">{values.teaser.length}/180</p>
      </Field>

      <Field label="Branche *">
        <select
          value={values.industry}
          onChange={e => onChange({ industry: e.target.value })}
          className="field"
        >
          {INDUSTRIES.map(i => (
            <option key={i} value={i} className="bg-[#0a0a0a]">
              {i}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Traction Status *">
        <select
          value={values.stage}
          onChange={e => onChange({ stage: e.target.value as Stage })}
          className="field"
        >
          {Object.entries(STAGE_LABELS).map(([k, v]) => (
            <option key={k} value={k} className="bg-[#0a0a0a]">
              {v}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 cursor-pointer">
        <input
          type="checkbox"
          checked={values.gmbh_founded}
          onChange={e => onChange({ gmbh_founded: e.target.checked })}
        />
        <div className="text-sm">GmbH ist bereits gegründet</div>
      </label>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <Field label="Standort *">
          <input
            required
            value={values.location}
            onChange={e => onChange({ location: e.target.value })}
            placeholder="z.B. München"
            className="field"
          />
        </Field>
        <label className="flex items-center gap-2 p-4 rounded-2xl border border-white/10 bg-white/5 cursor-pointer">
          <input
            type="checkbox"
            checked={values.remote}
            onChange={e => onChange({ remote: e.target.checked })}
          />
          <span className="text-sm">Remote möglich</span>
        </label>
      </div>

      <Field label="Beschreibung *">
        <textarea
          required
          value={values.description}
          onChange={e => onChange({ description: e.target.value })}
          rows={5}
          placeholder="Was baut ihr? Warum ist es spannend? Was bringt ihr schon mit?"
          className="field"
        />
      </Field>

      <Field label="Teambeschreibung">
        <textarea
          maxLength={1200}
          value={values.team_description}
          onChange={e => onChange({ team_description: e.target.value })}
          rows={4}
          placeholder="Wie arbeitet ihr, wie seid ihr aufgestellt? (ca. 1.000 Zeichen)"
          className="field"
        />
      </Field>

      <Field label="Unsere Story">
        <textarea
          value={values.story}
          onChange={e => onChange({ story: e.target.value })}
          rows={4}
          placeholder="Ziel, Vision, warum ihr das macht."
          className="field"
        />
      </Field>

      <Field label="Aktuelles Team">
        <textarea
          value={values.current_team}
          onChange={e => onChange({ current_team: e.target.value })}
          rows={3}
          placeholder="Wer ist schon dabei? (Namen, Rollen, Hintergrund)"
          className="field"
        />
      </Field>

      <Field label="Why us">
        <textarea
          value={values.why_us}
          onChange={e => onChange({ why_us: e.target.value })}
          rows={3}
          placeholder="Warum sollte jemand gerade bei euch einsteigen? (ruhig kreativ)"
          className="field"
        />
      </Field>

      <Field label={`Gesuchte Rollen (max. ${MAX_ROLES})`}>
        <div className="flex flex-wrap gap-2 mb-3">
          {ROLE_SUGGESTIONS.map(r => {
            const picked = values.roles_needed.includes(r)
            const atMax = values.roles_needed.length >= MAX_ROLES && !picked
            return (
              <button
                key={r}
                type="button"
                disabled={atMax}
                onClick={() => toggleRole(r)}
                className={`text-xs rounded-full px-3 py-1 border transition ${
                  picked
                    ? 'bg-white text-black border-white'
                    : atMax
                    ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed'
                    : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
                }`}
              >
                {r}
              </button>
            )
          })}
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
            disabled={values.roles_needed.length >= MAX_ROLES}
          />
          <button
            type="button"
            onClick={addCustomRole}
            disabled={values.roles_needed.length >= MAX_ROLES}
            className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 disabled:opacity-40 transition"
          >
            +
          </button>
        </div>
        {values.roles_needed.filter(r => !ROLE_SUGGESTIONS.includes(r as never)).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {values.roles_needed
              .filter(r => !ROLE_SUGGESTIONS.includes(r as never))
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
        <p className="text-xs text-white/40 mt-2">
          {values.roles_needed.length} / {MAX_ROLES} gewählt
        </p>
      </Field>

      <Field label="Website">
        <input
          type="url"
          value={values.website_url}
          onChange={e => onChange({ website_url: e.target.value })}
          placeholder="https://..."
          className="field"
        />
      </Field>

      <Field label="LinkedIn Unternehmen">
        <input
          type="url"
          value={values.linkedin_company_url}
          onChange={e => onChange({ linkedin_company_url: e.target.value })}
          placeholder="https://linkedin.com/company/..."
          className="field"
        />
      </Field>

      <Field label="LinkedIn Person">
        <input
          type="url"
          value={values.linkedin_person_url}
          onChange={e => onChange({ linkedin_person_url: e.target.value })}
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
        disabled={loading}
        className="px-6 py-3 rounded-full bg-white text-black font-medium hover:opacity-85 disabled:opacity-40 transition"
      >
        {loading ? 'Speichere...' : submitLabel}
      </button>

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
    </form>
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

export function toListingPayload(v: ListingFormValues) {
  return {
    stealth: v.stealth,
    startup_name: v.stealth ? null : v.startup_name.trim() || null,
    teaser: v.teaser.trim(),
    industry: v.industry,
    stage: v.stage,
    gmbh_founded: v.gmbh_founded,
    location: v.location.trim(),
    remote: v.remote,
    description: v.description.trim(),
    team_description: v.team_description.trim() || null,
    story: v.story.trim() || null,
    current_team: v.current_team.trim() || null,
    why_us: v.why_us.trim() || null,
    roles_needed: v.roles_needed,
    logo_url: v.stealth ? null : v.logo_url,
    linkedin_company_url: v.linkedin_company_url.trim() || null,
    linkedin_person_url: v.linkedin_person_url.trim() || null,
    website_url: v.website_url.trim() || null,
  }
}
