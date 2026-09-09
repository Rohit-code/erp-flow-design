import { useState } from 'react'
import { Screen } from '../types'
import { cls, C, Badge } from '../components/ui'

type Group = {
  id: string; name: string; system: boolean
  members: number; policies: number
  description: string
}

const GROUPS: Group[] = [
  { id: 'g1', name: 'Administrators', system: true,  members: 1, policies: 3, description: 'Full workspace access — all resources' },
  { id: 'g2', name: 'Sales Team',     system: false, members: 1, policies: 2, description: 'Inquiry, quotation and customer management' },
  { id: 'g3', name: 'Trade Team',     system: false, members: 0, policies: 2, description: 'Trade lane, rate and margin management' },
  { id: 'g4', name: 'KYC Officers',   system: false, members: 1, policies: 1, description: 'KYC review and document verification' },
  { id: 'g5', name: 'Operations',     system: false, members: 0, policies: 2, description: 'CRO, BL, sailing and depot operations' },
  { id: 'g6', name: 'Customer Portal', system: true, members: 0, policies: 1, description: 'External customer portal access' },
]

const MEMBERS: Record<string, { name: string; email: string; initials: string; color: string }[]> = {
  g1: [{ name: 'Boni Rohit', email: 'bonirohit@gmail.com', initials: 'B', color: '#1e3a5f' }],
  g2: [{ name: 'Rohit Kumar', email: 'rohit.kumar@apexlogistics.in', initials: 'R', color: '#3b1f6b' }],
  g4: [{ name: 'Sunita R.', email: 'sunita.r@apexlogistics.in', initials: 'S', color: '#14532d' }],
  g3: [], g5: [], g6: [],
}

const ATTACHED_POLICIES: Record<string, string[]> = {
  g1: ['FullAccess', 'BillingAdmin', 'IAMAdmin'],
  g2: ['InquiryReadWrite', 'QuotationReadWrite'],
  g3: ['RateReadWrite', 'MarginFloorRead'],
  g4: ['KYCReadWrite'],
  g5: ['OperationsReadWrite', 'CROWrite'],
  g6: ['PortalRead'],
}

export default function IAMGroups({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const group = selected ? GROUPS.find(g => g.id === selected) : null

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 4 }}>Groups</h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>{GROUPS.length} groups · {GROUPS.filter(g => g.system).length} system-managed</p>
        </div>
        <button className={cls.btnPrimary}>New Group</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 16, alignItems: 'start' }}>
        {/* Table */}
        <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #252830' }}>
                {['Group Name', 'Type', 'Members', 'Policies', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '11px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6174' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((g, i) => (
                <tr
                  key={g.id}
                  onClick={() => setSelected(selected === g.id ? null : g.id)}
                  style={{ borderBottom: i < GROUPS.length - 1 ? '1px solid #1a1d24' : 'none', cursor: 'pointer', background: selected === g.id ? '#0d1d35' : 'transparent' }}
                  onMouseEnter={e => { if (selected !== g.id) e.currentTarget.style.background = '#161820' }}
                  onMouseLeave={e => { if (selected !== g.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: selected === g.id ? C.accentDim : C.text }}>{g.name}</div>
                    <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 2 }}>{g.description}</div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    {g.system
                      ? <span style={{ background: '#0d1d35', color: '#93c5fd', border: '1px solid #1e3a5f', borderRadius: 4, fontSize: 10, fontWeight: 700, padding: '2px 7px', letterSpacing: '0.06em' }}>SYSTEM</span>
                      : <span style={{ background: '#1a1d24', color: '#9ca3af', borderRadius: 4, fontSize: 10, fontWeight: 600, padding: '2px 7px' }}>Custom</span>
                    }
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: C.text }}>{g.members}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: C.text }}>{g.policies}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: C.textMuted }}><path d="M4.5 2.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {group && (
          <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, overflow: 'hidden', position: 'sticky', top: 0 }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #252830', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{group.name}</span>
              <button onClick={() => setSelected(null)} style={{ color: C.textMuted, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>

            {/* Members */}
            <div style={{ padding: 16, borderBottom: '1px solid #252830' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6174' }}>Members</span>
                <button style={{ fontSize: 12, color: C.accentDim, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add</button>
              </div>
              {(MEMBERS[group.id] || []).length === 0 ? (
                <div style={{ fontSize: 12, color: '#3d4456', padding: '8px 0' }}>No members</div>
              ) : (MEMBERS[group.id] || []).map(m => (
                <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 5, background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.85)', flexShrink: 0 }}>{m.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: C.text }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>
                  </div>
                  <button style={{ fontSize: 11, color: '#5a6174', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
            </div>

            {/* Policies */}
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6174' }}>Attached Policies</span>
                <button style={{ fontSize: 12, color: C.accentDim, background: 'none', border: 'none', cursor: 'pointer' }}>Attach</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(ATTACHED_POLICIES[group.id] || []).map(p => (
                  <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#1c1e26', border: '1px solid #252830', borderRadius: 5, padding: '4px 8px', fontSize: 11.5, color: C.textSubtle }}>
                    {p}
                    <span style={{ color: '#3d4456', cursor: 'pointer', fontSize: 13 }}>×</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
