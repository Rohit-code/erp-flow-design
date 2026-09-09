import React from 'react'

// ─── Color palette ────────────────────────────────────────────────────────────
export const C = {
  bg: '#0e0f11',
  surface: '#15171d',
  surfaceHover: '#1c1e26',
  border: '#252830',
  borderFocus: '#5b73f5',
  text: '#dde1ea',
  textMuted: '#6b7280',
  textSubtle: '#9ba3af',
  accent: '#5b73f5',
  accentHover: '#4a62e4',
  accentDim: '#818cf8',
  green: { bg: '#0d2818', text: '#4ade80', border: '#166534' },
  amber: { bg: '#231a06', text: '#fbbf24', border: '#854d0e' },
  red: { bg: '#220d0d', text: '#f87171', border: '#7f1d1d' },
  blue: { bg: '#0d1d35', text: '#93c5fd', border: '#1e3a5f' },
  gray: { bg: '#1a1d24', text: '#9ca3af', border: '#2a2d38' },
}

// ─── Shared class strings ─────────────────────────────────────────────────────
export const cls = {
  label: 'block text-[10px] font-semibold uppercase tracking-widest mb-1.5',
  input: 'w-full bg-[#1c1e26] border border-[#252830] rounded px-3 py-2 text-sm text-[#dde1ea] placeholder-[#3d4456] focus:outline-none focus:border-[#5b73f5] focus:ring-1 focus:ring-[#5b73f5] transition-colors',
  card: 'bg-[#15171d] border border-[#252830] rounded-md',
  cardPadded: 'bg-[#15171d] border border-[#252830] rounded-md p-5',
  btnPrimary: 'inline-flex items-center gap-2 px-4 py-2 bg-[#5b73f5] hover:bg-[#4a62e4] text-white text-sm font-medium rounded transition-colors',
  btnSecondary: 'inline-flex items-center gap-2 px-4 py-2 bg-[#1c1e26] hover:bg-[#252830] text-[#9ba3af] hover:text-[#dde1ea] text-sm font-medium rounded border border-[#252830] transition-colors',
  btnDanger: 'inline-flex items-center gap-2 px-4 py-2 bg-[#220d0d] hover:bg-[#2d1010] text-[#f87171] text-sm font-medium rounded border border-[#7f1d1d] transition-colors',
  btnAmber: 'inline-flex items-center gap-2 px-4 py-2 bg-[#231a06] hover:bg-[#2d2108] text-[#fbbf24] text-sm font-medium rounded border border-[#854d0e] transition-colors',
  sectionTitle: 'text-[11px] font-semibold uppercase tracking-widest text-[#5a6174] mb-3',
  mono: 'font-mono text-[#818cf8]',
  divider: 'border-t border-[#1e2028] my-5',
  tableHeader: 'text-[10px] font-semibold uppercase tracking-widest text-[#5a6174] px-4 py-3',
  tableCell: 'px-4 py-3.5 text-sm text-[#dde1ea]',
  tableRow: 'border-b border-[#1e2028] hover:bg-[#151820] transition-colors cursor-pointer',
}

// ─── Badge component ──────────────────────────────────────────────────────────
export type BadgeVariant =
  | 'approved' | 'active' | 'paid' | 'confirmed' | 'accepted' | 'within-authority'
  | 'pending' | 'awaiting' | 'countered' | 'in-progress' | 'requires-trade' | 'sent'
  | 'rejected' | 'lost' | 'denied'
  | 'draft' | 'cancelled' | 'inactive'

const badgeStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  approved:           { bg: '#0d2818', text: '#4ade80', dot: '#4ade80' },
  active:             { bg: '#0d2818', text: '#4ade80', dot: '#4ade80' },
  paid:               { bg: '#0d2818', text: '#4ade80', dot: '#4ade80' },
  confirmed:          { bg: '#0d2818', text: '#4ade80', dot: '#4ade80' },
  accepted:           { bg: '#0d2818', text: '#4ade80', dot: '#4ade80' },
  'within-authority': { bg: '#0d2818', text: '#4ade80', dot: '#4ade80' },
  pending:            { bg: '#231a06', text: '#fbbf24', dot: '#fbbf24' },
  awaiting:           { bg: '#231a06', text: '#fbbf24', dot: '#fbbf24' },
  countered:          { bg: '#231a06', text: '#fbbf24', dot: '#fbbf24' },
  'in-progress':      { bg: '#231a06', text: '#fbbf24', dot: '#fbbf24' },
  'requires-trade':   { bg: '#231a06', text: '#fbbf24', dot: '#fbbf24' },
  sent:               { bg: '#0d1d35', text: '#93c5fd', dot: '#93c5fd' },
  rejected:           { bg: '#220d0d', text: '#f87171', dot: '#f87171' },
  lost:               { bg: '#220d0d', text: '#f87171', dot: '#f87171' },
  denied:             { bg: '#220d0d', text: '#f87171', dot: '#f87171' },
  draft:              { bg: '#1a1d24', text: '#9ca3af', dot: '#6b7280' },
  cancelled:          { bg: '#1a1d24', text: '#9ca3af', dot: '#6b7280' },
  inactive:           { bg: '#1a1d24', text: '#9ca3af', dot: '#6b7280' },
}

export function Badge({ variant, label }: { variant: BadgeVariant; label?: string }) {
  const s = badgeStyles[variant]
  const text = label ?? variant.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border"
      style={{ background: s.bg, color: s.text, borderColor: s.text + '33' }}
    >
      <span style={{ background: s.dot }} className="w-1.5 h-1.5 rounded-full flex-shrink-0" />
      {text}
    </span>
  )
}

// ─── FormField ────────────────────────────────────────────────────────────────
export function Field({
  label, children, className = ''
}: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className={cls.label} style={{ color: C.textMuted }}>{label}</label>
      {children}
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }) {
  const { mono, className = '', ...rest } = props
  return (
    <input
      className={`${cls.input} ${mono ? 'font-mono tracking-wider' : ''} ${className}`}
      {...rest}
    />
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', ...rest } = props
  return (
    <select
      className={`${cls.input} ${className}`}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px', appearance: 'none' }}
      {...rest}
    />
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props
  return (
    <textarea
      className={`${cls.input} resize-none ${className}`}
      rows={3}
      {...rest}
    />
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────
export function SectionCard({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className={cls.card + ' p-5 mb-4'}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <span className={cls.sectionTitle}>{title}</span>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

// ─── Mono ref ─────────────────────────────────────────────────────────────────
export function MonoRef({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[#818cf8] text-[13px]">{children}</span>
}

// ─── Page header ──────────────────────────────────────────────────────────────
export function PageHeader({
  title, subtitle, actions, breadcrumb
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  breadcrumb?: string
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {breadcrumb && <div className="text-[11px] text-[#5a6174] uppercase tracking-widest mb-1">{breadcrumb}</div>}
        <h1 className="text-lg font-semibold text-[#dde1ea]">{title}</h1>
        {subtitle && <p className="text-sm text-[#6b7280] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}

// ─── Icons (minimal inline SVG) ───────────────────────────────────────────────
export const Icon = {
  inquiry: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 5h6M4 7.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  quote: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1L8.5 5h4l-3.5 2.5L10 12 7 9.5 4 12l1-4.5L1.5 5h4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  kyc: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1L12 3.5v4C12 10 9.5 12.5 7 13c-2.5-.5-5-3-5-5.5v-4L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  booking: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4.5 1v3M9.5 1v3M1.5 6h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  cro: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 1.5h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 5h6M4 7.5h6M4 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  timeline: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M7 4.5v1M7 8.5v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  plus: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  trash: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 3.5h9M5 3.5V2h3v1.5M4 3.5l.5 7h4l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  download: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1v8M3.5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.5 10.5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  upload: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 13V5M7 8l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 14v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  mail: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="3" width="11" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M1 4l5.5 4L12 4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  search: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  chevronRight: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 2.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  warning: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1L13 12H1L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M7 5.5v3M7 10v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
}
