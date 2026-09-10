import { Role, Screen, Session } from './types'

// ─── Demo identities ──────────────────────────────────────────────────────────
// One mock signed-in user per role. Role-picker login (no password) — click a
// tile on the Login screen and this is who you become.
export const DEMO_USERS: Record<Role, Session> = {
  sales:     { role: 'sales',     name: 'Rohit Kumar',   org: 'Maxicon Container Line · Mumbai OU' },
  trade:     { role: 'trade',     name: 'Priya Singh',   org: 'Maxicon Container Line · Trade Desk' },
  ops:       { role: 'ops',       name: 'Arjun Mehta',   org: 'Maxicon Container Line · Export Ops' },
  depot:     { role: 'depot',     name: 'Depot Desk',    org: 'JNPT Container Freight Station · Gate 3' },
  'ou-admin': { role: 'ou-admin', name: 'Kavita Rao',    org: 'Mumbai OU' },
  'ho-admin': { role: 'ho-admin', name: 'Vikram Nair',   org: 'West India Head Office' },
  customer:  { role: 'customer',  name: 'Nisha Patel',   org: 'Stellar Exports Pvt Ltd' },
}

export const ROLE_LABEL: Record<Role, string> = {
  sales: 'Sales',
  trade: 'Trade',
  ops: 'Ops',
  depot: 'Depot',
  'ou-admin': 'OU Admin',
  'ho-admin': 'HO Admin',
  customer: 'Customer',
}

export const ROLE_DESCRIPTION: Record<Role, string> = {
  sales: 'Review inquiries, quote, and negotiate within margin authority.',
  trade: 'Resolve below-floor rates: decline, negotiate, or accept.',
  ops: 'Depot pre-check, booking acceptance, CRO, gate-in through MBL.',
  depot: 'Confirm container availability and hand over containers.',
  'ou-admin': 'Manage users and access within a single operating unit.',
  'ho-admin': 'Manage users, access, and org structure across a region.',
  customer: 'Book, negotiate, complete KYC, and track your shipment.',
}

// Landing screen right after login.
export const ROLE_LANDING: Record<Role, Screen> = {
  sales: 'home',
  trade: 'home',
  ops: 'home',
  depot: 'depot-requirement',
  'ou-admin': 'home',
  'ho-admin': 'home',
  customer: 'register',
}

// Which screens each role may navigate to. App.tsx and the shells consult this
// so a role never lands on — or links to — a screen outside its own journey.
export const ROLE_SCREENS: Record<Role, Screen[]> = {
  sales: ['home', 'new-inquiry', 'inquiry-list', 'inquiry-detail', 'quotation-list', 'quotation', 'kyc-queue', 'booking-list', 'booking-confirmed', 'order-list', 'order-timeline'],
  trade: ['home', 'trade-queue', 'inquiry-list', 'inquiry-detail', 'quotation', 'order-list', 'order-timeline'],
  ops: [
    'home', 'inquiry-list', 'inquiry-detail', 'ops-depot-select', 'kyc-queue', 'booking-list', 'ops-accept', 'booking-confirmed',
    'cro-release', 'container-tracking', 'gate-in', 'load-vessel', 'bl-draft', 'invoice', 'mbl-release', 'order-list', 'order-timeline',
  ],
  depot: ['depot-requirement', 'depot-handover', 'container-tracking', 'depot-queue', 'depot-case-detail'],
  'ou-admin': ['home', 'iam-dashboard', 'iam-users', 'iam-groups', 'iam-policies', 'iam-permissions', 'iam-audit'],
  'ho-admin': ['home', 'iam-dashboard', 'iam-users', 'iam-groups', 'iam-policies', 'iam-permissions', 'iam-audit', 'org-hierarchy'],
  customer: [
    'register', 'kyc-form', 'address-select', 'select-sailing', 'quotation',
    'shipping-instructions', 'cro-release', 'container-tracking', 'bl-draft', 'invoice', 'mbl-release',
    'order-list', 'order-timeline',
  ],
}

export function isScreenAllowed(role: Role, screen: Screen): boolean {
  return ROLE_SCREENS[role].includes(screen)
}
