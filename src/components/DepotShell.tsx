import React from 'react'
import { Screen, Session } from '../types'
import { C } from './ui'

const DEPOT_LINKS: { id: Screen; label: string }[] = [
  { id: 'depot-requirement', label: 'Requirement Inbox' },
  { id: 'depot-handover', label: 'Container Handover' },
  { id: 'container-tracking', label: 'Tracking' },
  { id: 'depot-queue', label: 'Case Queue' },
]

export default function DepotShell({
  screen, session, onNavigate, onLogout, children
}: {
  screen: Screen
  session: Session
  onNavigate: (s: Screen) => void
  onLogout: () => void
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full" style={{ background: '#0c0e12' }}>
      {/* Top nav */}
      <header
        style={{ borderBottom: `1px solid ${C.border}`, height: 56, flexShrink: 0 }}
        className="flex items-center px-6 gap-6"
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
            Depot Portal
          </span>
        </div>

        {DEPOT_LINKS.map(link => {
          const active = screen === link.id || (link.id === 'depot-queue' && screen === 'depot-case-detail')
          return (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="text-[13px] transition-colors"
              style={{
                color: active ? C.accentDim : C.textMuted,
                fontWeight: active ? 500 : 400,
                borderBottom: active ? `2px solid ${C.accent}` : '2px solid transparent',
                paddingBottom: 2,
              }}
            >
              {link.label}
            </button>
          )
        })}

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <div
            style={{ width: 30, height: 30, borderRadius: 6, background: '#1c1e26', border: `1px solid ${C.border}` }}
            className="flex items-center justify-center text-[11px] font-semibold text-[#9ba3af]"
          >
            DD
          </div>
          <div>
            <div className="text-[12px] font-medium text-[#dde1ea]">{session.name}</div>
            <div className="text-[10px] text-[#5a6174]">{session.org}</div>
          </div>
        </div>

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
