export type Stage = 'idea' | 'prototype' | 'mvp' | 'revenue' | 'funded'
export type ListingStatus = 'active' | 'paused' | 'closed'
export type UserRole = 'founder' | 'seeker'

export type Listing = {
  id: string
  owner_id: string
  created_at: string
  updated_at: string
  stealth: boolean
  startup_name: string | null
  industry: string
  stage: Stage
  location: string
  description: string
  roles_needed: string[]
  status: ListingStatus
}

export type Profile = {
  id: string
  email: string
  full_name: string
  role: UserRole
  bio: string | null
  location: string | null
  created_at: string
}

export const STAGE_LABELS: Record<Stage, string> = {
  idea: 'Idee',
  prototype: 'Prototyp',
  mvp: 'MVP',
  revenue: 'Erste Umsätze',
  funded: 'Finanziert',
}

export const ROLE_SUGGESTIONS = [
  'CTO',
  'CPO',
  'CMO',
  'COO',
  'Tech Lead',
  'Fullstack',
  'Frontend',
  'Backend',
  'AI/ML',
  'Sales',
  'Growth',
  'Design',
  'Finance',
  'Ops',
]
