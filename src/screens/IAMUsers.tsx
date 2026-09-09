import { useState } from 'react'
import { Screen } from '../types'
import { cls, C, Badge } from '../components/ui'

type User = {
  id: string; initials: string; avatarColor: string
  email: string; name: string
  tier: 'Admin' | 'Standard' | 'Read-Only'
  scope: string; active: boolean; lastLogin: string
}

const USERS: User[] = [
  { id: '1', initials: 'B', avatarColor: '#1e3a5f', email: 'bonirohit@gmail.com', name: 'Boni Rohit', tier: 'Admin', scope: 'Workspace-wide access level', active: true, lastLogin: '08 Nov 2024, 13:43' },
  { id: '2', initials: 'N', avatarColor: '#14532d', email: 'nisha@stellarexports.in', name: 'Nisha Patel', tier: 'Standard', scope: 'Works across a regional office', active: true, lastLogin: '07 Nov 2024, 11:20' },
  { id: '3', initials: 'R', avatarColor: '#3b1f6b', email: 'rohit.kumar@maxicon.in', name: 'Rohit Kumar', tier: 'Standard', scope: 'Workspace-wide access level', active: true, lastLogin: '08 Nov 2024, 09:52' },
  { id: '4', initials: 'S', avatarColor: '#14532d', email: 'sunita.r@maxicon.in', name: 'Sunita R.', tier: 'Standard', scope: 'Assigned to an operational unit', active: true, lastLogin: '08 Nov 2024, 14:30' },
  { id: '5', initials: 'P', avatarColor: '#78350f', email: 'priya.singh@maxicon.in', name: 'Priya Singh', tier: 'Standard', scope: 'Workspace-wide access level', active: false, lastLogin: '02 Nov 2024, 08:14' },
  { id: '6', initials: 'A', avatarColor: '#1e3a5f', email: 'arjun.mehta@mehta-containers.in', name: 'Arjun Mehta', tier: 'Read-Only', scope: 'Works across a regional office', active: false, lastLogin: '05 Nov 2024, 16:45' },
]

const tierColors: Record<string, { bg: string; text: string }> = {
  Admin: { bg: '#1a1f35', text: '#818cf8' },
  Standard: { bg: '#0d2818', text: '#4ade80' },
  'Read-Only': { bg: '#1a1d24', text: '#9ca3af' },
}

type ModalProps = { onClose: () => void }

function InviteModal({ onClose }: ModalProps) {
  const [level, setLevel] = useState('Workspace')
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 10, width: 480, padding: 24, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Invite User</span>
          <button onClick={onClose} style={{ color: C.textMuted, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, display: 'block', marginBottom: 6 }}>Email Address</label>
          <input className={cls.input} type="email" placeholder="name@company.com" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, display: 'block', marginBottom: 6 }}>Role Group</label>
          <select className={cls.input} style={{ appearance: 'none' }}>
            <option>Administrators</option>
            <option>Sales Team</option>
            <option>Trade Team</option>
            <option>KYC Officers</option>
            <option>Operations</option>
          </select>
        </div>

        <div style={{ background: '#1c1e26', border: '1px solid #252830', borderRadius: 7, padding: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 4 }}>Belongs To</div>
          <p style={{ fontSize: 11.5, color: '#5a6174', marginBottom: 12 }}>Select the user level, then assign their region and branch.</p>

          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMuted, display: 'block', marginBottom: 5 }}>Level</label>
            <select className={cls.input} value={level} onChange={e => setLevel(e.target.value)} style={{ appearance: 'none' }}>
              <option>Workspace</option>
              <option>Region</option>
              <option>Branch</option>
            </select>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMuted, display: 'block', marginBottom: 5 }}>Region</label>
            <select className={cls.input} disabled={level === 'Workspace'} style={{ appearance: 'none', opacity: level === 'Workspace' ? 0.4 : 1 }}>
              <option>India Head Office — HO-IN</option>
              <option>Singapore HO — HO-SG</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMuted, display: 'block', marginBottom: 5 }}>Operational Unit</label>
            <select className={cls.input} disabled={level !== 'Branch'} style={{ appearance: 'none', opacity: level !== 'Branch' ? 0.4 : 1 }}>
              <option>India Branch 1 — IN-OU1 · Chennai</option>
              <option>India Branch 2 — IN-OU2 · Pipavav</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} className={cls.btnSecondary}>Cancel</button>
          <button onClick={onClose} className={cls.btnPrimary}>Send Invite</button>
        </div>
      </div>
    </div>
  )
}

type MenuPos = { id: string; x: number; y: number }

export default function IAMUsers({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [users, setUsers] = useState<User[]>(USERS)
  const [showInvite, setShowInvite] = useState(false)
  const [menu, setMenu] = useState<MenuPos | null>(null)

  const toggleActive = (id: string) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u))

  return (
    <div style={{ maxWidth: 1100 }}>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      {menu && (
        <div
          style={{ position: 'fixed', top: menu.y, left: menu.x, background: '#1c1e26', border: '1px solid #252830', borderRadius: 7, padding: '4px', zIndex: 40, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', minWidth: 160 }}
          onMouseLeave={() => setMenu(null)}
        >
          {['Edit scope…', 'Resend invite email', 'Deactivate user…'].map(action => (
            <button key={action} onClick={() => setMenu(null)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 12px', fontSize: 13, color: action.includes('Deactivate') ? '#f87171' : C.textSubtle, background: 'none', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
              {action}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 4 }}>Users</h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>{users.filter(u => u.active).length} active · {users.filter(u => !u.active).length} inactive</p>
        </div>
        <button onClick={() => setShowInvite(true)} className={cls.btnPrimary}>Invite</button>
      </div>

      <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #252830' }}>
              {['User', 'Tier', 'Scope', 'Status', 'Last Login', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '11px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6174' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const tc = tierColors[u.tier]
              return (
                <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #1a1d24' : 'none' }}>
                  {/* User */}
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 6, background: u.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', flexShrink: 0 }}>{u.initials}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{u.name}</div>
                        <div style={{ fontSize: 11.5, color: C.textMuted }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  {/* Tier */}
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ background: tc.bg, color: tc.text, borderRadius: 4, fontSize: 11, fontWeight: 600, padding: '2px 8px', letterSpacing: '0.04em' }}>{u.tier}</span>
                  </td>
                  {/* Scope */}
                  <td style={{ padding: '13px 16px', fontSize: 12.5, color: C.textMuted }}>{u.scope}</td>
                  {/* Toggle */}
                  <td style={{ padding: '13px 16px' }}>
                    <button
                      onClick={() => toggleActive(u.id)}
                      style={{
                        width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', position: 'relative',
                        background: u.active ? C.accent : '#374151', transition: 'background 0.2s',
                      }}
                    >
                      <div style={{ position: 'absolute', top: 3, left: u.active ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                    </button>
                  </td>
                  {/* Last login */}
                  <td style={{ padding: '13px 16px' }}>
                    <span className="font-mono" style={{ fontSize: 11.5, color: C.textMuted }}>{u.lastLogin}</span>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '13px 16px' }}>
                    <button
                      onClick={e => { e.stopPropagation(); setMenu({ id: u.id, x: e.clientX - 160, y: e.clientY }) }}
                      style={{ width: 28, height: 28, borderRadius: 5, border: '1px solid #252830', background: 'transparent', cursor: 'pointer', color: C.textMuted, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '0.1em' }}
                    >
                      ⋯
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
