import { useState } from 'react'
import { Screen } from '../types'
import { cls, C } from '../components/ui'

type Policy = { id: string; name: string; scope: 'Tenant-wide' | 'Regional' | 'Unit-level'; managed: boolean }

const POLICIES: Policy[] = [
  { id: 'p1', name: 'FullAccess',           scope: 'Tenant-wide', managed: true },
  { id: 'p2', name: 'IAMAdmin',             scope: 'Tenant-wide', managed: true },
  { id: 'p3', name: 'BillingAdmin',         scope: 'Tenant-wide', managed: true },
  { id: 'p4', name: 'InquiryReadWrite',     scope: 'Tenant-wide', managed: false },
  { id: 'p5', name: 'QuotationReadWrite',   scope: 'Regional',    managed: false },
  { id: 'p6', name: 'KYCReadWrite',         scope: 'Unit-level',  managed: false },
  { id: 'p7', name: 'RateReadWrite',        scope: 'Tenant-wide', managed: false },
  { id: 'p8', name: 'MarginFloorRead',      scope: 'Tenant-wide', managed: true },
  { id: 'p9', name: 'OperationsReadWrite',  scope: 'Regional',    managed: false },
  { id: 'p10', name: 'CROWrite',            scope: 'Unit-level',  managed: false },
  { id: 'p11', name: 'PortalRead',          scope: 'Tenant-wide', managed: true },
]

type PermRow = { resource: string; action: string; effect: 'Allow' | 'Deny' }

const PERMS: Record<string, PermRow[]> = {
  'Booking': [
    { resource: 'booking:*', action: 'read', effect: 'Allow' },
    { resource: 'booking:*', action: 'write', effect: 'Allow' },
    { resource: 'booking:*', action: 'delete', effect: 'Allow' },
  ],
  'Quotation': [
    { resource: 'quotation:*', action: 'read', effect: 'Allow' },
    { resource: 'quotation:*', action: 'write', effect: 'Allow' },
  ],
  'KYC': [
    { resource: 'kyc:submission', action: 'read', effect: 'Allow' },
    { resource: 'kyc:submission', action: 'approve', effect: 'Allow' },
    { resource: 'kyc:submission', action: 'reject', effect: 'Allow' },
  ],
  'Finance': [
    { resource: 'invoice:*', action: 'read', effect: 'Allow' },
    { resource: 'invoice:*', action: 'write', effect: 'Deny' },
  ],
}

const scopeColors: Record<string, { bg: string; color: string }> = {
  'Tenant-wide': { bg: '#0d1d35', color: '#93c5fd' },
  'Regional':    { bg: '#231a06', color: '#fbbf24' },
  'Unit-level':  { bg: '#1a1d24', color: '#9ca3af' },
}

export default function IAMPolicies({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const policy = selected ? POLICIES.find(p => p.id === selected) : null

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 4 }}>Policies</h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>{POLICIES.length} policies · {POLICIES.filter(p => p.managed).length} managed</p>
        </div>
        <button className={cls.btnPrimary}>New Custom Policy</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 440px' : '1fr', gap: 16, alignItems: 'start' }}>
        {/* Policy list */}
        <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, overflow: 'hidden' }}>
          {POLICIES.map((p, i) => {
            const sc = scopeColors[p.scope]
            return (
              <div
                key={p.id}
                onClick={() => setSelected(selected === p.id ? null : p.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
                  borderBottom: i < POLICIES.length - 1 ? '1px solid #1a1d24' : 'none',
                  cursor: 'pointer', background: selected === p.id ? '#0d1d35' : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (selected !== p.id) e.currentTarget.style.background = '#161820' }}
                onMouseLeave={e => { if (selected !== p.id) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ width: 30, height: 30, borderRadius: 6, background: '#1c1e26', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: '#6b7280' }}><path d="M6.5 1L11.5 3v4c0 2.5-2.5 5-5 5s-5-2.5-5-5V3L6.5 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <span className="font-mono" style={{ fontSize: 13, color: selected === p.id ? C.accentDim : C.text }}>{p.name}</span>
                  {p.managed && <span style={{ marginLeft: 8, background: '#0d1d35', color: '#93c5fd', fontSize: 9.5, fontWeight: 700, borderRadius: 3, padding: '1px 5px', letterSpacing: '0.06em' }}>MANAGED</span>}
                </div>
                <span style={{ background: sc.bg, color: sc.color, fontSize: 10.5, fontWeight: 600, borderRadius: 4, padding: '2px 8px' }}>{p.scope}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: C.textMuted, flexShrink: 0 }}><path d="M4.5 2.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )
          })}
        </div>

        {/* Detail panel */}
        {policy && (
          <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, overflow: 'hidden', position: 'sticky', top: 0 }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #252830', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="font-mono" style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{policy.name}</span>
              <button onClick={() => setSelected(null)} style={{ color: C.textMuted, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>

            {Object.entries(PERMS).map(([category, rows]) => (
              <div key={category} style={{ borderBottom: '1px solid #1a1d24' }}>
                <div style={{ padding: '10px 16px', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3d4456' }}>{category}</div>
                {rows.map((r, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={r.effect === 'Allow'} style={{ width: 13, height: 13, accentColor: C.accent }} />
                    <span className="font-mono" style={{ fontSize: 11.5, color: C.textMuted, flex: 1 }}>{r.resource}</span>
                    <span style={{ fontSize: 11.5, color: '#6b7280', minWidth: 40 }}>{r.action}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: r.effect === 'Allow' ? '#4ade80' : '#f87171', minWidth: 30 }}>{r.effect}</span>
                  </label>
                ))}
              </div>
            ))}

            <div style={{ padding: '12px 16px' }}>
              {!policy.managed && <button className={cls.btnPrimary} style={{ fontSize: 12 }}>Save Changes</button>}
              {policy.managed && <div style={{ fontSize: 12, color: '#5a6174' }}>Managed policy — read-only</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
