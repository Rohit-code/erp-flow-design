import React from 'react'
import { Screen, Role, Session } from '../types'
import { ROLE_SCREENS, ROLE_LABEL } from '../auth'
import { C } from './ui'

// ─── Icon set (must be declared before nav groups that reference it) ──────────
const I = {
  creditCard: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="3" width="11" height="7" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M1 6h11" stroke="currentColor" strokeWidth="1.1"/></svg>,
  file: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 1.5h5l3 3V11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.1"/><path d="M8 1.5v3h3" stroke="currentColor" strokeWidth="1.1"/></svg>,
  handshake: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 5l3.5 3.5 2-1.5 2 1.5L12 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  grid: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="1.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.1"/><rect x="7.5" y="1.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.1"/><rect x="1.5" y="7.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.1"/><rect x="7.5" y="7.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.1"/></svg>,
  sparkle: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2M3 3l1.5 1.5M8.5 8.5 10 10M3 10l1.5-1.5M8.5 4.5 10 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  users: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M1 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M9 3.5c.8.4 1.5 1.2 1.5 2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M9.5 8c1.5.5 2.5 2 2.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  seat: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="5" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M2 12c0-2.5 2-4.5 4.5-4.5S11 9.5 11 12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M4 1l2.5 2L9 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  group: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="4" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.1"/><circle cx="9" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.1"/><path d="M0.5 11.5c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M9 8c1.9 0 3.5 1.6 3.5 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  shield: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L11.5 3v4c0 2.5-2.5 5-5 5s-5-2.5-5-5V3L6.5 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  lock: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2.5" y="5.5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M4.5 5.5V4a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><circle cx="6.5" cy="8.5" r="1" fill="currentColor"/></svg>,
  clipboard: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M4.5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H8.5" stroke="currentColor" strokeWidth="1.1"/><rect x="4.5" y="1" width="4" height="2" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><path d="M4 6h5M4 8.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  inquiry: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="9" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M4 5h5M4 7.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  tag: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 1.5h5l5 5-5 5-5-5v-5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><circle cx="4.5" cy="4.5" r="1" fill="currentColor"/></svg>,
  calendar: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="2.5" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M4 1.5v2M9 1.5v2M1.5 5.5h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  doc: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 1.5h5l3 3V11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.1"/><path d="M4 6h5M4 8h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  timeline: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="2.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/><circle cx="6.5" cy="6.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/><circle cx="6.5" cy="10.5" r="1.2" stroke="currentColor" strokeWidth="1.1"/><path d="M6.5 3.7v1.6M6.5 7.7v1.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  hierarchy: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4.5" y="1" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><rect x="1" y="8.5" width="3.5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><rect x="8.5" y="8.5" width="3.5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><path d="M6.5 4v2M6.5 6H2.75M6.5 6h3.75M2.75 6v2.5M10.25 6v2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  building: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 12V3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v9" stroke="currentColor" strokeWidth="1.1"/><path d="M1 12h11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><rect x="4.5" y="6" width="4" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><path d="M4 4h1.5M7.5 4H9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  bank: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 5.5L6.5 2l5 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M2 5.5v5.5h9V5.5" stroke="currentColor" strokeWidth="1.1"/><path d="M1 11h11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M4 7.5v3M6.5 7.5v3M9 7.5v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  list: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 3h10M1.5 6.5h10M1.5 10h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  check2: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.1"/><path d="M4 6.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  hash: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 2.5l-1 8M11 2.5l-1 8M1.5 5h10M1 8.5h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  flow: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="2.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="10.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="2.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M4 2.5h3a1 1 0 0 1 1 1V5M4 10.5h3a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  home: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5L6.5 2l5 4.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M3 5.5V11h3V8.5h1V11h3V5.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  search: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  help: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 5.5a1.5 1.5 0 0 1 3 0c0 1-1.5 1.5-1.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="10" r="0.7" fill="currentColor"/></svg>,
  gridView: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="1.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1.5" y="8" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="8" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>,
  sun: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.8 2.8l1 1M10.2 10.2l1 1M11.2 2.8l-1 1M3.8 10.2l-1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  bell: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5a4 4 0 0 1 4 4v2.5l1 1.5H2L3 8V5.5a4 4 0 0 1 4-4z" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 11a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.2"/></svg>,
}

// ─── Nav definitions ──────────────────────────────────────────────────────────
// One master list per screen; each role's sidebar is just this list filtered
// down to the screens ROLE_SCREENS grants that role (see src/auth.ts) — so the
// nav can never drift out of sync with what's actually reachable.

type NavItem = { label: string; screen: Screen; icon: React.ReactNode }
type NavGroup = { label: string; items: NavItem[] }

const BOOKING_ITEMS: NavItem[] = [
  { label: 'Inquiries',       screen: 'inquiry-list',      icon: <I.file /> },
  { label: 'Trade Queue',     screen: 'trade-queue',       icon: <I.handshake /> },
  { label: 'Quotations',      screen: 'quotation-list',    icon: <I.tag /> },
  { label: 'Depot Pre-Check', screen: 'ops-depot-select',  icon: <I.building /> },
  { label: 'KYC',             screen: 'kyc-queue',         icon: <I.shield /> },
  { label: 'Bookings',        screen: 'booking-list',      icon: <I.calendar /> },
  { label: 'CRO',             screen: 'cro-release',       icon: <I.doc /> },
  { label: 'Gate In',         screen: 'gate-in',           icon: <I.hash /> },
  { label: 'BL Draft',        screen: 'bl-draft',          icon: <I.doc /> },
  { label: 'Invoice',         screen: 'invoice',           icon: <I.creditCard /> },
  { label: 'MBL',             screen: 'mbl-release',       icon: <I.doc /> },
  { label: 'Order Timeline',  screen: 'order-list',        icon: <I.timeline /> },
]

const IAM_ITEMS: NavItem[] = [
  { label: 'Dashboard',     screen: 'iam-dashboard',   icon: <I.grid /> },
  { label: 'Users',         screen: 'iam-users',       icon: <I.users /> },
  { label: 'Groups',        screen: 'iam-groups',      icon: <I.group /> },
  { label: 'Policies',      screen: 'iam-policies',    icon: <I.shield /> },
  { label: 'Permissions',   screen: 'iam-permissions', icon: <I.lock /> },
  { label: 'Audit Log',     screen: 'iam-audit',       icon: <I.clipboard /> },
]

const ORG_ITEMS: NavItem[] = [
  { label: 'Org Hierarchy', screen: 'org-hierarchy', icon: <I.hierarchy /> },
]

function navGroupsForRole(role: Role): NavGroup[] {
  const allowed = ROLE_SCREENS[role]
  const groups: NavGroup[] = []
  const booking = BOOKING_ITEMS.filter(i => allowed.includes(i.screen))
  if (booking.length) groups.push({ label: 'BOOKING PIPELINE', items: booking })
  const iam = IAM_ITEMS.filter(i => allowed.includes(i.screen))
  if (iam.length) groups.push({ label: 'IAM', items: iam })
  const org = ORG_ITEMS.filter(i => allowed.includes(i.screen))
  if (org.length) groups.push({ label: 'ORGANIZATION', items: org })
  return groups
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function ERPShell({
  screen, role, session, onNavigate, onLogout, children,
}: {
  screen: Screen
  role: Role
  session: Session
  onNavigate: (s: Screen) => void
  onLogout: () => void
  children: React.ReactNode
}) {
  const navGroups = navGroupsForRole(role)
  const initials = session.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex h-full" style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside
        style={{ width: 188, flexShrink: 0, background: '#0c0d10', borderRight: `1px solid #1e2028`, display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        {/* Logo */}
        <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #1a1d24' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 9.5l2.5-7 2.5 4.5 2-3L11 9.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#dde1ea', lineHeight: 1.2 }}>Regnus</div>
              <div style={{ fontSize: 9.5, color: '#5a6174', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>ERP</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
          {/* Home */}
          <NavLink label="Home" icon={<I.home />} active={screen === 'home'} onClick={() => onNavigate('home')} />

          {navGroups.map(group => (
            <React.Fragment key={group.label}>
              <div style={{ height: 8 }} />
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3d4456', padding: '6px 8px 4px' }}>
                {group.label}
              </div>
              {group.items.map(item => (
                <NavLink
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  active={screen === item.screen}
                  onClick={() => onNavigate(item.screen)}
                />
              ))}
            </React.Fragment>
          ))}
        </nav>

        {/* Workspace footer */}
        <div style={{ padding: '10px', borderTop: '1px solid #1a1d24' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 7, background: '#141619', cursor: 'pointer' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#9ca3af', flexShrink: 0 }}>
              N
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#dde1ea', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Maxicon Container Line</div>
              <div style={{ fontSize: 10, color: '#5a6174' }}>Shipping ERP</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{ height: 50, borderBottom: '1px solid #1a1d24', background: '#0c0d10', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, flexShrink: 0 }}>

          {/* Tenant pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, border: '1px solid #252830', borderRadius: 6, padding: '4px 10px 4px 6px', background: '#141619', cursor: 'pointer' }}>
              <div style={{ width: 22, height: 22, borderRadius: 4, background: '#0d4a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 800, color: '#2dd4bf', flexShrink: 0, letterSpacing: '0.02em' }}>MC</div>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: '#dde1ea' }}>Maxicon Container Line</span>
            </div>
            <button style={{ width: 28, height: 28, border: '1px solid #252830', borderRadius: 6, background: '#141619', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', fontSize: 16, lineHeight: 1 }}>+</button>
          </div>

          {/* Search — centered */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 360, height: 32, border: '1px solid #252830', borderRadius: 6, background: '#141619', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 7, cursor: 'text' }}>
              <span style={{ color: '#3d4456' }}><I.search /></span>
              <span style={{ fontSize: 12.5, color: '#3d4456', flex: 1 }}>Search pages, bookings, customers…</span>
              <span style={{ fontSize: 10, color: '#3d4456', border: '1px solid #2a2d38', borderRadius: 4, padding: '1px 5px', fontFamily: 'monospace' }}>⌘K</span>
            </div>
          </div>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            {[<I.help />, <I.gridView />, <I.sun />].map((icon, i) => (
              <button key={i} style={{ width: 30, height: 30, border: '1px solid #1e2028', borderRadius: 6, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280' }}>{icon}</button>
            ))}

            {/* Bell with dot */}
            <button style={{ width: 30, height: 30, border: '1px solid #1e2028', borderRadius: 6, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', position: 'relative' }}>
              <I.bell />
              <div style={{ position: 'absolute', top: 7, right: 7, width: 5, height: 5, borderRadius: '50%', background: '#ef4444' }} />
            </button>

            {/* User — click to log out */}
            <button
              onClick={onLogout}
              title="Log out"
              style={{ display: 'flex', alignItems: 'center', gap: 7, border: '1px solid #1e2028', borderRadius: 6, background: 'transparent', padding: '0 10px 0 5px', height: 30, cursor: 'pointer' }}
            >
              <div style={{ width: 22, height: 22, borderRadius: 4, background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#93c5fd' }}>{initials}</div>
              <span style={{ fontSize: 12, color: '#dde1ea', fontWeight: 500 }}>{session.name}</span>
              <span style={{ fontSize: 10, color: '#5a6174', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{ROLE_LABEL[role]}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 4l2.5 3 2.5-3" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

// ─── NavLink ──────────────────────────────────────────────────────────────────
function NavLink({ label, icon, active, onClick, muted }: {
  label: string
  icon: React.ReactNode
  active: boolean
  onClick?: () => void
  muted?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', textAlign: 'left', padding: '6px 8px',
        borderRadius: 5, border: 'none', cursor: muted ? 'default' : 'pointer',
        background: active ? '#1a1e2a' : 'transparent',
        color: active ? '#dde1ea' : muted ? '#3d4456' : '#8a95a8',
        fontSize: 12.5, fontWeight: active ? 500 : 400,
        transition: 'background 0.12s, color 0.12s',
        marginBottom: 1,
      }}
      onMouseEnter={e => { if (!active && !muted) { e.currentTarget.style.background = '#161820'; e.currentTarget.style.color = '#c4cad6' } }}
      onMouseLeave={e => { if (!active && !muted) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8a95a8' } }}
    >
      <span style={{ opacity: active ? 1 : 0.7, flexShrink: 0 }}>{icon}</span>
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
    </button>
  )
}
