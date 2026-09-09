import React from 'react'
import { Screen, Session } from '../types'
import { C } from './ui'

const PORTAL_LINKS: { id: Screen; label: string }[] = [
  { id: 'booking-form', label: 'Booking' },
  { id: 'quotation', label: 'Negotiation' },
  { id: 'kyc-form', label: 'KYC' },
  { id: 'address-select', label: 'My Addresses' },
  { id: 'select-sailing', label: 'Sailing' },
  { id: 'shipping-instructions', label: 'Shipping Instructions' },
  { id: 'cro-release', label: 'CRO' },
  { id: 'bl-draft', label: 'BL Draft' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'mbl-release', label: 'MBL' },
  { id: 'order-timeline', label: 'Timeline' },
]

const PUBLIC_SCREENS: Screen[] = ['booking-form']

export default function PortalShell({
  screen, session, onNavigate, onLogout, children
}: {
  screen: Screen
  session: Session
  onNavigate: (s: Screen) => void
  onLogout: () => void
  children: React.ReactNode
}) {
  const isPublic = PUBLIC_SCREENS.includes(screen)

  return (
    <div className="flex flex-col h-full" style={{ background: '#0c0e12' }}>
      {/* Top nav */}
      <header
        style={{ borderBottom: `1px solid ${C.border}`, minHeight: 56, flexShrink: 0, flexWrap: 'wrap', rowGap: 8 }}
        className="flex items-center px-6 gap-4 py-2"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mr-4">
          <div
            style={{ background: C.accent, width: 26, height: 26, borderRadius: 5 }}
            className="flex items-center justify-center flex-shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M2 9l2.5-6 2.5 4 2-2.5L11 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-[#dde1ea]">Regnus</span>
          <span
            style={{ background: '#1a1f35', color: C.accentDim, borderRadius: 4, padding: '1px 6px', fontSize: 9, fontWeight: 600, letterSpacing: '0.08em' }}
            className="uppercase"
          >
            Customer Portal
          </span>
        </div>

        {!isPublic && (
          <>
            {PORTAL_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="text-[13px] transition-colors"
                style={{
                  color: screen === link.id ? C.accentDim : C.textMuted,
                  fontWeight: screen === link.id ? 500 : 400,
                  borderBottom: screen === link.id ? `2px solid ${C.accent}` : '2px solid transparent',
                  paddingBottom: 2,
                }}
              >
                {link.label}
              </button>
            ))}
          </>
        )}

        <div className="flex-1" />

        {isPublic ? (
          <div
            style={{ background: '#231a06', border: '1px solid #854d0e', borderRadius: 5, padding: '4px 10px' }}
            className="flex items-center gap-2"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#fbbf24" strokeWidth="1.2"/><path d="M6 4v3M6 8.5v.5" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <span className="text-[11px] font-medium" style={{ color: '#fbbf24' }}>Secure link · expires in 23h 48m</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div
              style={{ width: 30, height: 30, borderRadius: 6, background: '#1c1e26', border: `1px solid ${C.border}` }}
              className="flex items-center justify-center text-[11px] font-semibold text-[#9ba3af]"
            >
              {session.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-[12px] font-medium text-[#dde1ea]">{session.name}</div>
              <div className="text-[10px] text-[#5a6174]">{session.org}</div>
            </div>
          </div>
        )}

        {/* Log out */}
        <button
          onClick={onLogout}
          className="text-[11px] px-3 py-1.5 rounded transition-colors"
          style={{ background: '#1a1d24', color: C.textMuted, border: `1px solid ${C.border}` }}
        >
          Log out
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto py-8 px-6">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
