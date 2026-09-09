import { Screen, Role } from '../types'
import { ROLE_SCREENS } from '../auth'
import { C } from '../components/ui'

// ─── Service card icons ───────────────────────────────────────────────────────
const si = {
  grid:    <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="1.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.1"/><rect x="7.5" y="1.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.1"/><rect x="1.5" y="7.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.1"/><rect x="7.5" y="7.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.1"/></svg>,
  users:   <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><circle cx="5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M1 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M9 3.5c.8.4 1.5 1.2 1.5 2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M9.5 8c1.5.5 2.5 2 2.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  seat:    <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="5" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M2 12c0-2.5 2-4.5 4.5-4.5S11 9.5 11 12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M4 1l2.5 2L9 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  group:   <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><circle cx="4" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.1"/><circle cx="9" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.1"/><path d="M0.5 11.5c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M9 8c1.9 0 3.5 1.6 3.5 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  shield:  <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L11.5 3v4c0 2.5-2.5 5-5 5s-5-2.5-5-5V3L6.5 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  lock:    <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><rect x="2.5" y="5.5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M4.5 5.5V4a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><circle cx="6.5" cy="8.5" r="1" fill="currentColor"/></svg>,
  clipboard: <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M4.5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H8.5" stroke="currentColor" strokeWidth="1.1"/><rect x="4.5" y="1" width="4" height="2" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><path d="M4 6h5M4 8.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  card:    <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><rect x="1" y="3" width="11" height="7" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M1 6h11" stroke="currentColor" strokeWidth="1.1"/></svg>,
  scale:   <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M3 12h7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M6.5 1L1 3.5l1.5 3.5H5L6.5 4 8 7h2.5L12 3.5 6.5 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  file:    <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M3 1.5h5l3 3V11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.1"/><path d="M8 1.5v3h3" stroke="currentColor" strokeWidth="1.1"/></svg>,
  sparkle: <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2M3 3l1.5 1.5M8.5 8.5 10 10M3 10l1.5-1.5M8.5 4.5 10 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  doc:     <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M3 1.5h5l3 3V11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.1"/><path d="M4 6h5M4 8h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  tag:     <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M1.5 1.5h5l5 5-5 5-5-5v-5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><circle cx="4.5" cy="4.5" r="1" fill="currentColor"/></svg>,
  ship:    <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M2.5 9l1.5-5h5l1.5 5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M1 10.5c1.2 1 5.5 1 11 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M6.5 1v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  truck:   <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><rect x="1" y="3.5" width="8" height="6" rx="0.8" stroke="currentColor" strokeWidth="1.1"/><path d="M9 5.5h1.5l2 2v2H9" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><circle cx="3.5" cy="9.5" r="1" stroke="currentColor" strokeWidth="1.1"/><circle cx="9.5" cy="9.5" r="1" stroke="currentColor" strokeWidth="1.1"/></svg>,
  anchor:  <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M6.5 5v6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M3 12c0-2 1.5-3.5 3.5-3.5S10 10 10 12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><path d="M4.5 6H2M10.5 6H8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  globe:   <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.1"/><path d="M6.5 1.5c-2 2-2 7 0 9M6.5 1.5c2 2 2 7 0 9M1.5 6.5h10" stroke="currentColor" strokeWidth="1.1"/></svg>,
  box:     <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L11.5 3.5v6L6.5 12 1.5 9.5v-6L6.5 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M1.5 3.5l5 3 5-3M6.5 6.5V12" stroke="currentColor" strokeWidth="1.1"/></svg>,
  receipt: <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M2 1h9v11l-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5-1.5-1.5L2 12V1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M4 4.5h5M4 6.5h5M4 8.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  coins:   <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><circle cx="5" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="8.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.1" fill="#0c0d10"/><path d="M8 4.5l.5.5 1-1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  hierarchy: <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><rect x="4.5" y="1" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><rect x="1" y="8.5" width="3.5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><rect x="8.5" y="8.5" width="3.5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><path d="M6.5 4v2M6.5 6H2.75M6.5 6h3.75M2.75 6v2.5M10.25 6v2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  building: <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M2 12V3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v9" stroke="currentColor" strokeWidth="1.1"/><path d="M1 12h11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><rect x="4.5" y="6" width="4" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  upload:  <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M6.5 8V2M4 4.5l2.5-2.5 2.5 2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 10v1a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  mail:    <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><rect x="1" y="3" width="11" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M1 4l5.5 4L12 4" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  clock:   <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.1"/><path d="M6.5 4v3l2 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  star:    <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5l1.5 3.5h3.5l-3 2 1 3.5-3-2-3 2 1-3.5-3-2H5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>,
  hash:    <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M3 2.5l-1 8M11 2.5l-1 8M1.5 5h10M1 8.5h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  flow:    <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><circle cx="2.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="10.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="2.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M4 2.5h3a1 1 0 0 1 1 1V5M4 10.5h3a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  pct:     <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><circle cx="3.5" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="9.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M2 11L11 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
  pin:     <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M6.5 1C4.6 1 3 2.6 3 4.5c0 2.8 3.5 7.5 3.5 7.5S10 7.3 10 4.5C10 2.6 8.4 1 6.5 1z" stroke="currentColor" strokeWidth="1.1"/><circle cx="6.5" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/></svg>,
  chart:   <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M1 10.5l3-4 3 2 3-5 2.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 12h11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
}

// ─── Data ─────────────────────────────────────────────────────────────────────
type ServiceItem = { title: string; desc: string; screen?: Screen; icon?: React.ReactNode }
type ServiceSection = { label: string; items: ServiceItem[] }

const SECTIONS: ServiceSection[] = [
  {
    label: 'IAM',
    items: [
      { title: 'Dashboard',     desc: 'Open service',                                  screen: 'iam-dashboard', icon: si.grid },
      { title: 'Users',         desc: 'Open service',                                  screen: 'iam-users',     icon: si.users },
      { title: 'Service Seats', desc: 'Open service',                                                           icon: si.seat },
      { title: 'Groups',        desc: 'Open service',                                  screen: 'iam-groups',    icon: si.group },
      { title: 'Policies',      desc: 'Open service',                                  screen: 'iam-policies',  icon: si.shield },
      { title: 'Permissions',   desc: 'Open service',                                  screen: 'iam-permissions', icon: si.lock },
      { title: 'Audit Log',     desc: 'Open service',                                  screen: 'iam-audit',     icon: si.clipboard },
    ],
  },
  {
    label: 'WORKSPACE',
    items: [
      { title: 'Subscription',          desc: 'Open service',                          icon: si.card },
      { title: 'Statement of Account',  desc: 'Open service',                          icon: si.scale },
      { title: 'Agreements',            desc: 'Open service',                          icon: si.file },
      { title: 'Dashboard',             desc: 'Role-based operating dashboard',        icon: si.chart },
      { title: 'AI Assistant',          desc: 'AI copilot for inquiries & recommendations', icon: si.sparkle },
    ],
  },
  {
    label: 'BOOKING PIPELINE',
    items: [
      { title: 'Inquiries',       desc: 'Rate requests, AI parsing, sales & trade review', screen: 'inquiry-list',     icon: si.file },
      { title: 'Trade Queue',     desc: 'Below-floor rates: decline, negotiate, accept',   screen: 'trade-queue',      icon: si.scale },
      { title: 'Quotations',      desc: 'Quotes, negotiation, MRG approval & acceptance',  screen: 'quotation-list',   icon: si.tag },
      { title: 'Depot Pre-Check', desc: 'Container availability across candidate depots',  screen: 'ops-depot-select', icon: si.truck },
      { title: 'KYC',             desc: 'Customer compliance verification & onboarding',   screen: 'kyc-queue',        icon: si.shield },
      { title: 'Pre-Bookings',    desc: 'Provisional holds awaiting confirmation',                                     icon: si.doc },
      { title: 'Bookings',        desc: 'Confirmed shipment bookings & job files',         screen: 'booking-list',     icon: si.doc },
      { title: 'Customers',       desc: 'Shippers, consignees, agents & credit',                                       icon: si.users },
    ],
  },
  {
    label: 'OPERATIONS & DOCUMENTS',
    items: [
      { title: 'CRO',                  desc: 'Container release order — depot & customer copy', screen: 'cro-release',        icon: si.doc },
      { title: 'CDO',                  desc: 'Container delivery orders & depot release',        icon: si.truck },
      { title: 'Shipping Instructions', desc: 'Consignee, notify party, container details',      screen: 'shipping-instructions', icon: si.file },
      { title: 'Gate In',              desc: 'Terminal cutoff tracking',                          screen: 'gate-in',            icon: si.anchor },
      { title: 'Bills of Lading',      desc: 'Draft, confirm, issue, surrender',                 screen: 'bl-draft',           icon: si.doc },
      { title: 'Invoice',              desc: 'Freight invoice & payment',                        screen: 'invoice',            icon: si.receipt },
      { title: 'MBL',                  desc: 'Master bill release — surrender or original',      screen: 'mbl-release',         icon: si.doc },
      { title: 'Master BL',            desc: 'Master bills of lading & consolidation',           icon: si.doc },
      { title: 'Container Tracking',   desc: 'Container milestones, gate & depot events',         icon: si.box },
    ],
  },
  {
    label: 'SAILING & EQUIPMENT',
    items: [
      { title: 'Sailing Schedules', desc: 'Voyages, vessels, slot allocation & cutoffs', icon: si.anchor },
      { title: 'Container Fleet',   desc: 'Owned, leased & SOC',                         icon: si.box },
    ],
  },
  {
    label: 'RATES & TARIFFS',
    items: [
      { title: 'Tariff Codes',      desc: 'Open service', icon: si.hash },
      { title: 'Exchange Rates',    desc: 'Open service', icon: si.pct },
      { title: 'Detention',         desc: 'Open service', icon: si.clock },
      { title: 'Ground Rent',       desc: 'Open service', icon: si.pin },
      { title: 'Dead Freight',      desc: 'Open service', icon: si.ship },
      { title: 'Margin Floor Rules', desc: 'Open service', icon: si.scale },
    ],
  },
  {
    label: 'BILLING & FINANCE',
    items: [
      { title: 'Invoices',          desc: 'Open service',                              icon: si.receipt },
      { title: 'Supplier Invoices', desc: 'Open service',                              icon: si.receipt },
      { title: 'Intercompany',      desc: 'Open service',                              icon: si.coins },
      { title: 'Additional Charges', desc: 'Open service',                             icon: si.tag },
      { title: 'Waivers',           desc: 'Detention waiver approvals',                icon: si.scale },
      { title: 'Claims',            desc: 'Cargo damage disputes & settlement',        icon: si.file },
      { title: 'AR / AP Operations', desc: 'Open service',                             icon: si.coins },
      { title: 'E-Invoice / IRN',   desc: 'Open service',                              icon: si.doc },
      { title: 'Fixed Assets',      desc: 'Open service',                              icon: si.building },
      { title: 'Location Onboarding', desc: 'Open service',                            icon: si.pin },
    ],
  },
  {
    label: 'MASTER DATA',
    items: [
      { title: 'Ports',          desc: 'Ports, ICDs & seaports',           icon: si.globe },
      { title: 'Vessels',        desc: 'Vessels, IMO & fleet',             icon: si.ship },
      { title: 'Depots',         desc: 'Container yards & storage',        icon: si.box },
      { title: 'Terminals',      desc: 'Berths & port facilities',         icon: si.anchor },
      { title: 'Commodities',    desc: 'Cargo goods, HS codes & hazardous', icon: si.tag },
      { title: 'Slot Operators', desc: 'Carriers, services & commitments', icon: si.group },
      { title: 'Codes',          desc: 'Code master, lookups & dropdowns', icon: si.hash },
      { title: 'Tax Configuration', desc: 'Open service',                  icon: si.pct },
      { title: 'Account Ledgers', desc: 'Open service',                    icon: si.receipt },
      { title: 'Tax Posting Map', desc: 'Open service',                    icon: si.doc },
      { title: 'Suppliers',      desc: 'Open service',                     icon: si.truck },
    ],
  },
  {
    label: 'ORGANIZATION',
    items: [
      { title: 'Org Hierarchy',        desc: 'Corporate head offices & OU hierarchy', screen: 'org-hierarchy', icon: si.hierarchy },
      { title: 'Corporate Groups',     desc: 'Open service',                          icon: si.group },
      { title: 'Companies',            desc: 'Open service',                          icon: si.building },
      { title: 'Regions / Head Offices', desc: 'Head offices, regions & currency',   icon: si.building },
      { title: 'Branches / OUs',       desc: 'Operational units, branches & offices', icon: si.building },
      { title: 'Departments',          desc: 'Open service',                          icon: si.group },
      { title: 'Org Readiness',        desc: 'Open service',                          icon: si.star },
      { title: 'Letterhead',           desc: 'Open service',                          icon: si.doc },
      { title: 'Document Numbering',   desc: 'Open service',                          icon: si.hash },
      { title: 'Booking Flow',         desc: 'Open service',                          icon: si.flow },
    ],
  },
  {
    label: 'TOOLS',
    items: [
      { title: 'Uploads',             desc: 'Bulk import jobs — rate sheets & MRG',  icon: si.upload },
      { title: 'Mailbox Integration', desc: 'Gmail / Outlook inquiry capture',        icon: si.mail },
      { title: 'Activity Timeline',   desc: 'Activity trail across the workspace',    icon: si.clock },
    ],
  },
]

const STATS = [
  { label: 'BOOKINGS',   value: '0',   color: C.text,          icon: si.doc },
  { label: 'INQUIRIES',  value: '0',   color: C.text,          icon: si.file },
  { label: 'CUSTOMERS',  value: '0',   color: '#4ade80',       icon: si.users },
  { label: 'KYC TASKS',  value: '0',   color: '#fbbf24',       icon: si.shield },
]

// Which of the sections above a given role sees at all. Within a visible
// section, individual cards further disappear if their screen isn't in
// ROLE_SCREENS[role] (stub cards with no screen always stay, as before).
const ROLE_SECTIONS: Record<Role, string[]> = {
  sales:      ['WORKSPACE', 'BOOKING PIPELINE'],
  trade:      ['WORKSPACE', 'BOOKING PIPELINE'],
  ops:        ['WORKSPACE', 'BOOKING PIPELINE', 'OPERATIONS & DOCUMENTS', 'SAILING & EQUIPMENT'],
  depot:      [],
  'ou-admin': ['IAM'],
  'ho-admin': ['IAM', 'ORGANIZATION'],
  customer:   [],
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home({ role, onNavigate }: { role: Role; onNavigate: (s: Screen) => void }) {
  const visibleSections = SECTIONS
    .filter(section => ROLE_SECTIONS[role].includes(section.label))
    .map(section => ({
      ...section,
      items: section.items.filter(item => !item.screen || ROLE_SCREENS[role].includes(item.screen)),
    }))

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#5a6174', marginBottom: 10 }}>
                {s.label}
              </div>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: '#1c1e26', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6174' }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Service sections */}
      {visibleSections.map(section => (
        <div key={section.label} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#5a6174', marginBottom: 10 }}>
            {section.label}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {section.items.map(item => (
              <ServiceCard
                key={item.title}
                title={item.title}
                desc={item.desc}
                icon={item.icon ?? si.doc}
                onClick={item.screen ? () => onNavigate(item.screen!) : undefined}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ServiceCard({
  title, desc, icon, onClick
}: {
  title: string
  desc: string
  icon: React.ReactNode
  onClick?: () => void
}) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: 'left', border: `1px solid ${hovered && onClick ? '#3d4456' : '#252830'}`,
        borderRadius: 7, padding: '12px 14px', background: '#15171d',
        cursor: onClick ? 'pointer' : 'default', transition: 'border-color 0.12s',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ width: 28, height: 28, borderRadius: 5, background: '#1c1e26', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', flexShrink: 0 }}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#dde1ea', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: '#5a6174', lineHeight: 1.4 }}>{desc}</div>
      </div>
    </button>
  )
}

// Need React import for useState in ServiceCard
import React from 'react'
