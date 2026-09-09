import { Screen } from '../types'
import { cls, C } from '../components/ui'

const AUDIT_ROWS = [
  { ts: '2026-09-08 13:43:26', level: 'INFO', api: 'API R:0', action: 'ERP_API_READ', resource: 'dashboard' },
  { ts: '2026-09-08 13:43:02', level: 'INFO', api: 'API R:0', action: 'ERP_API_READ', resource: 'bookings' },
  { ts: '2026-09-08 13:43:02', level: 'INFO', api: 'API R:0', action: 'ERP_API_READ', resource: 'inquiries' },
  { ts: '2026-09-08 13:43:02', level: 'INFO', api: 'API R:0', action: 'ERP_API_READ', resource: 'kyc-tasks' },
  { ts: '2026-09-08 13:43:02', level: 'INFO', api: 'API R:0', action: 'ERP_API_READ', resource: 'customers' },
  { ts: '2026-09-08 13:43:02', level: 'INFO', api: 'API R:0', action: 'ERP_API_READ', resource: 'subscription' },
  { ts: '2026-09-08 13:43:02', level: 'INFO', api: 'API R:0', action: 'ERP_API_READ', resource: 'inquiries' },
  { ts: '2026-09-08 13:43:02', level: 'INFO', api: 'API R:0', action: 'ERP_API_READ', resource: 'bookings' },
]

// Line chart data — logins over 7 days
const DATES = ['09-02','09-03','09-04','09-05','09-06','09-07','09-08']
const VALUES = [0, 0, 0, 0, 1, 0, 2]

function LoginChart() {
  const W = 460, H = 120, PAD = { t: 12, r: 8, b: 28, l: 4 }
  const plotW = W - PAD.l - PAD.r
  const plotH = H - PAD.t - PAD.b
  const maxV = Math.max(...VALUES, 1)
  const xs = VALUES.map((_, i) => PAD.l + (i / (VALUES.length - 1)) * plotW)
  const ys = VALUES.map(v => PAD.t + plotH - (v / maxV) * plotH * 0.85)
  const pts = xs.map((x, i) => `${x},${ys[i]}`).join(' ')
  const area = `${xs[0]},${H - PAD.b} ` + pts + ` ${xs[xs.length - 1]},${H - PAD.b}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 120 }}>
      {/* Grid lines */}
      {[0,1,2,3].map(i => (
        <line key={i} x1={PAD.l} x2={W - PAD.r} y1={PAD.t + (plotH / 3) * i} y2={PAD.t + (plotH / 3) * i}
          stroke="#252830" strokeWidth="0.5" strokeDasharray="4 3" />
      ))}
      {/* Area fill */}
      <polygon points={area} fill={C.accent + '18'} />
      {/* Line */}
      <polyline points={pts} fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Dots */}
      {xs.map((x, i) => VALUES[i] > 0 && (
        <circle key={i} cx={x} cy={ys[i]} r="3" fill={C.accent} />
      ))}
      {/* X labels */}
      {DATES.map((d, i) => (
        <text key={d} x={xs[i]} y={H - 8} textAnchor="middle" fontSize="9" fill="#5a6174">{d}</text>
      ))}
    </svg>
  )
}

const GROUPS = [
  { name: 'Administrators', count: 1, max: 2 },
  { name: 'Sales Team', count: 1, max: 2 },
  { name: 'Customer Por…', count: 0, max: 2 },
]

function GroupsChart() {
  return (
    <div style={{ padding: '8px 0' }}>
      {GROUPS.map(g => (
        <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 100, fontSize: 12, color: '#9ba3af', textAlign: 'right', flexShrink: 0 }}>{g.name}</div>
          <div style={{ flex: 1, height: 8, background: '#1c1e26', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: g.count > 0 ? '70%' : '0%', height: '100%', background: '#374151', borderRadius: 2 }} />
          </div>
          <div style={{ width: 14, fontSize: 12, color: '#9ba3af', flexShrink: 0 }}>{g.count}</div>
        </div>
      ))}
    </div>
  )
}

export default function IAMDashboard({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 4 }}>IAM overview</h1>
        <p style={{ fontSize: 13, color: C.textMuted }}>Monitor workspace access, active sessions, invitations, and recent security activity.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'ACTIVE USERS',       value: '2', sub: null },
          { label: 'ACTIVE SESSIONS',    value: '2', sub: 'Live' },
          { label: 'LOGIN FAILURES (24H)', value: '0', sub: null },
          { label: 'PENDING INVITES',    value: '0', sub: null },
        ].map(s => (
          <div key={s.label} style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, padding: '18px 20px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#5a6174', marginBottom: 12 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 600, color: C.text, lineHeight: 1 }}>{s.value}</div>
            {s.sub && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ fontSize: 12, color: '#4ade80' }}>{s.sub}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, padding: '18px 20px' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 12 }}>Logins (7 days)</div>
          <LoginChart />
        </div>
        <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, padding: '18px 20px' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 16 }}>Top groups by members</div>
          <GroupsChart />
        </div>
      </div>

      {/* Audit events */}
      <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #252830' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>Recent audit events</span>
        </div>
        <div>
          {AUDIT_ROWS.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '11px 20px',
                borderBottom: i < AUDIT_ROWS.length - 1 ? '1px solid #1a1d24' : 'none',
              }}
            >
              <span className="font-mono" style={{ fontSize: 11.5, color: '#5a6174', flexShrink: 0 }}>{row.ts}</span>
              <span style={{ background: '#0d1d35', color: '#93c5fd', border: '1px solid #1e3a5f', borderRadius: 3, fontSize: 10, fontWeight: 700, padding: '1px 6px', letterSpacing: '0.06em', flexShrink: 0 }}>
                {row.level}
              </span>
              <span className="font-mono" style={{ fontSize: 11.5, color: '#5a6174', flexShrink: 0 }}>{row.api}</span>
              <span className="font-mono" style={{ fontSize: 11.5, color: '#6b7280', flexShrink: 0 }}>{row.action}</span>
              <span className="font-mono" style={{ fontSize: 11.5, color: C.accentDim }}>{row.resource}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
