export type Stage = 'idea' | 'prototype' | 'early_users' | 'revenue' | 'funded'
export type ListingStatus = 'active' | 'paused' | 'closed'
export type UserRole = 'founder' | 'seeker'
export type SeekerType = 'cofounder' | 'employee'

export type Listing = {
  id: string
  owner_id: string
  created_at: string
  updated_at: string
  expires_at: string
  stealth: boolean
  startup_name: string | null
  teaser: string | null
  industry: string
  stage: Stage
  gmbh_founded: boolean
  location: string
  remote: boolean
  description: string
  team_description: string | null
  story: string | null
  current_team: string | null
  why_us: string | null
  roles_needed: string[]
  logo_url: string | null
  linkedin_company_url: string | null
  linkedin_person_url: string | null
  website_url: string | null
  status: ListingStatus
}

export type Profile = {
  id: string
  email: string
  full_name: string
  role: UserRole
  bio: string | null
  location: string | null
  headline: string | null
  skills: string[]
  available: boolean
  photo_url: string | null
  seeker_type: SeekerType | null
  desired_stage: Stage | null
  contribution: string | null
  linkedin_url: string | null
  portfolio_url: string | null
  created_at: string
}

export type Message = {
  id: string
  sender_id: string
  recipient_id: string
  listing_id: string | null
  body: string
  created_at: string
  read_at: string | null
}

export const STAGE_LABELS: Record<Stage, string> = {
  idea: 'Idee',
  prototype: 'Prototyp',
  early_users: 'Erste Nutzer',
  revenue: 'Revenue',
  funded: 'Funded',
}

export const SEEKER_TYPE_LABELS: Record<SeekerType, string> = {
  cofounder: 'Co-Founder',
  employee: 'Früher Employee',
}

export const INDUSTRIES = [
  'SaaS B2B',
  'Consumer / B2C',
  'Fintech',
  'Healthtech',
  'Deeptech',
  'AI / ML',
  'Climate / Energy',
  'Industrial / Manufacturing',
  'Mobility',
  'Marketplace',
  'Dev Tools / Infrastructure',
  'E-Commerce',
  'Education',
  'Crypto / Web3',
  'Sonstiges',
] as const

export const COFOUNDER_ROLES = ['CTO', 'CPO', 'CMO', 'COO', 'CFO'] as const

export const FUNCTIONAL_ROLES = [
  'Fullstack',
  'Frontend',
  'Backend',
  'AI/ML',
  'Data',
  'Product Manager',
  'UX/UI Design',
  'Sales',
  'Growth',
  'Finance',
  'Operations',
] as const

export const ROLE_SUGGESTIONS = [...COFOUNDER_ROLES, ...FUNCTIONAL_ROLES] as const

export const MAX_ROLES = 3
