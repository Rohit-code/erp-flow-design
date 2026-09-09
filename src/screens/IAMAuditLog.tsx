import { useState } from 'react'
import { Screen } from '../types'
import { cls, C } from '../components/ui'

const ALL_ROWS = [
  { ts: '2026-09-08 13:43:26', actor: 'bonirohit@gmail.com', action: 'READ',   resource: 'dashboard',    detail: 'API R:0 · ERP_API_READ' },
  { ts: '2026-09-08 13:43:02', actor: 'bonirohit@gmail.com', action: 'READ',   resource: 'bookings',     detail: 'API R:0 · ERP_API_READ' },
  { ts: '2026-09-08 13:43:02', actor: 'bonirohit@gmail.com', action: 'READ',   resource: 'inquiries',    detail: 'API R:0 · ERP_API_READ' },
  { ts: '2026-09-08 13:43:02', actor: 'bonirohit@gmail.com', action: 'READ',   resource: 'kyc-tasks',    detail: 'API R:0 · ERP_API_READ' },
  { ts: '2026-09-08 13:43:02', actor: 'bonirohit@gmail.com', action: 'READ',   resource: 'customers',    detail: 'API R:0 · ERP_API_READ' },
  { ts: '2026-09-08 13:43:02', actor: 'bonirohit@gmail.com', action: 'READ',   resource: 'subscription', detail: 'API R:0 · ERP_API_READ' },
  { ts: '2026-09-08 09:52:14', actor: 'rohit.kumar@apexlogistics.in', action: 'WRITE', resource: 'inquiry:INQ-2024-0391', detail: 'Updated → Sent to Trade' },
  { ts: '2026-09-08 09:41:00', actor: 'rohit.kumar@apexlogistics.in', action: 'CREATE', resource: 'inquiry:INQ-2024-0391', detail: 'New inquiry from nisha@stellarexports.in' },
  { ts: '2026-09-07 15:04:11', actor: 'system@regnus.io',  action: 'CONFIRM', resource: 'booking:BKG-2024-00142', detail: 'Auto-confirmed — all prerequisites met' },
  { ts: '2026-09-07 15:02:45', actor: 'sunita.r@apexlogistics.in', action: 'APPROVE', resource: 'kyc:KYC-2024-0214', detail: 'KYC approved for Stellar Exports Pvt Ltd' },
  { ts: '2026-09-07 14:38:22', actor: 'nisha@stellarexports.in', action: 'ACCEPT', resource: 'quotation:QT-2024-0217', detail: 'Quote accepted — USD 562 / TEU' },
  { ts: '2026-09-07 14:05:03', actor: 'priya.singh@apexlogistics.in', action: 'COUNTER', resource: 'quotation:QT-2024-0217', detail: 'Counter-offer USD 562 / TEU' },
]

const actionColors: Record<string, { bg: string; color: string }> = {
  READ:    { bg: '#0d1d35', color: '#93c5fd' },
  WRITE:   { bg: '#231a06', color: '#fbbf24' },
  CREATE:  { bg: '#0d2818', color: '#4ade80' },
  APPROVE: { bg: '#0d2818', color: '#4ade80' },
  ACCEPT:  { bg: '#0d2818', color: '#4ade80' },
  CONFIRM: { bg: '#0d2818', color: '#4ade80' },
  COUNTER: { bg: '#231a06', color: '#fbbf24' },
  DELETE:  { bg: '#220d0d', color: '#f87171' },
}

export default function IAMAuditLog({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [actorFilter, setActorFilter] = useState('')

  const rows = ALL_ROWS.filter(r =>
    !actorFilter || r.actor.toLowerCase().includes(actorFilter.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 4 }}>Audit Log</h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>Reverse-chronological security and access events</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className={cls.input}
            placeholder="Filter by actor…"
            value={actorFilter}
            onChange={e => setActorFilter(e.target.value)}
            style={{ width: 200 }}
          />
          <input className={cls.input} type="date" defaultValue="2026-09-08" style={{ width: 150 }} />
        </div>
      </div>

      <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #252830' }}>
              {['Timestamp', 'Actor', 'Action', 'Resource', 'Detail'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6174' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const ac = actionColors[r.action] || { bg: '#1a1d24', color: '#9ca3af' }
              return (
                <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid #1a1d24' : 'none' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <span className="font-mono" style={{ fontSize: 11.5, color: '#5a6174' }}>{r.ts}</span>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: C.textSubtle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.actor}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ background: ac.bg, color: ac.color, borderRadius: 3, fontSize: 10, fontWeight: 700, padding: '2px 7px', letterSpacing: '0.06em' }}>{r.action}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <span className="font-mono" style={{ fontSize: 12, color: C.accentDim }}>{r.resource}</span>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: C.textMuted }}>{r.detail}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div style={{ padding: '28px', textAlign: 'center', fontSize: 13, color: '#3d4456' }}>No events match the filter.</div>
        )}
      </div>
    </div>
  )
}
