import React from 'react'
import { Role } from '../types'
import { DEMO_USERS, ROLE_LABEL, ROLE_DESCRIPTION } from '../auth'
import { C } from '../components/ui'

const ROLE_ORDER: Role[] = ['sales', 'trade', 'ops', 'depot', 'ou-admin', 'ho-admin', 'customer']

const ROLE_ICON: Record<Role, React.ReactNode> = {
  sales: <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M1.5 1.5h5l5 5-5 5-5-5v-5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="4.5" cy="4.5" r="1" fill="currentColor"/></svg>,
  trade: <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M1 5.5l3.5 3.5 2-1.5 2 1.5L13 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ops: <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M7 1.5v2M7 10.5v2M1.5 7h2M10.5 7h2M3 3l1.5 1.5M9.5 9.5 11 11M3 11l1.5-1.5M9.5 4.5 11 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  depot: <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M7 1L12.5 3.5v6L7 12.5 1.5 9.5v-6L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M1.5 3.5l5.5 3 5.5-3M7 6.5V12.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  'ou-admin': <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M2 13V3.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V13" stroke="currentColor" strokeWidth="1.2"/><path d="M1 13h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><rect x="5" y="7" width="4" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  'ho-admin': <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M1.5 6L7 2l5.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M2 6v6.5h10V6" stroke="currentColor" strokeWidth="1.2"/><path d="M1 12.5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M4.5 8.5v3.5M7 8.5v3.5M9.5 8.5v3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  customer: <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.2" stroke="currentColor" strokeWidth="1.2"/><path d="M2 12.5c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
}

export default function Login({ onLogin }: { onLogin: (role: Role) => void }) {
  return (
    <div
      className="flex items-center justify-center h-full"
      style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}
    >
      <div style={{ width: 720 }}>
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div
            style={{ width: 44, height: 44, borderRadius: 9, background: C.accent }}
            className="flex items-center justify-center mb-3"
          >
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
              <path d="M2 9.5l2.5-7 2.5 4.5 2-3L11 9.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="text-lg font-semibold" style={{ color: C.text }}>Regnus ERP</div>
          <div className="text-[12.5px] mt-1" style={{ color: C.textMuted }}>
            Sign in to Maxicon Container Line — choose how you're accessing the system today
          </div>
        </div>

        {/* Role tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {ROLE_ORDER.map(role => (
            <RoleTile key={role} role={role} onClick={() => onLogin(role)} />
          ))}
        </div>

        <div className="text-center mt-6 text-[11px]" style={{ color: '#3d4456' }}>
          Prototype login — click a role tile to sign in. No password required.
        </div>
      </div>
    </div>
  )
}

function RoleTile({ role, onClick }: { role: Role; onClick: () => void }) {
  const [hovered, setHovered] = React.useState(false)
  const user = DEMO_USERS[role]
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: 'left',
        border: `1px solid ${hovered ? C.accent : C.border}`,
        borderRadius: 8,
        padding: '16px 16px',
        background: hovered ? C.surfaceHover : C.surface,
        cursor: 'pointer',
        transition: 'border-color 0.12s, background 0.12s',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div
        style={{
          width: 34, height: 34, borderRadius: 7,
          background: hovered ? C.accent : '#1c1e26',
          color: hovered ? 'white' : C.textMuted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.12s, color 0.12s',
        }}
      >
        {ROLE_ICON[role]}
      </div>
      <div>
        <div className="text-[13.5px] font-semibold" style={{ color: C.text }}>{ROLE_LABEL[role]}</div>
        <div className="text-[11.5px] mt-1" style={{ color: C.textMuted, lineHeight: 1.4 }}>{ROLE_DESCRIPTION[role]}</div>
      </div>
      <div className="text-[10.5px] pt-2" style={{ color: '#4a5164', borderTop: `1px solid ${C.border}` }}>
        {user.name} · {user.org}
      </div>
    </button>
  )
}
