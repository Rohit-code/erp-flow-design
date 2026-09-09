import { Screen, Role } from '../types'
import { PageHeader, SectionCard, cls, C, Badge, MonoRef, Icon } from '../components/ui'

const CONTAINERS = [
  { number: 'MSCU3841290', type: '40ft HC', seal: 'ML-449021', tare: '3,900 kg' },
  { number: 'MSCU4012876', type: '40ft HC', seal: 'ML-449022', tare: '3,900 kg' },
]

export default function CRORelease({ role, onNavigate }: { role: Role; onNavigate: (s: Screen) => void }) {
  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb="CRO / CRO-2024-0089"
        title="Container Release Order"
        subtitle="BKG-2024-00142 · Stellar Exports Pvt Ltd · INNSA → CNSHA"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="active" label="Released" />
            <button className={cls.btnPrimary}>
              <Icon.download /> Download PDF
            </button>
          </div>
        }
      />

      {/* Depot pre-check lead-in — which depot this CRO resolved to, and how */}
      <div
        style={{ background: '#0d1d35', border: '1px solid #1e3a5f', borderRadius: 6 }}
        className="flex items-center gap-3 px-4 py-3 mb-5"
      >
        <Icon.check />
        <div className="text-[12px]" style={{ color: '#93c5fd' }}>
          <strong>Depot resolved before CRO issue</strong> — 2 of 3 candidate depots near JNPT confirmed availability
          (JNPT CFS Gate 3, JNPT CFS Gate 1); Ops manually selected <strong>JNPT CFS Gate 3</strong>.
        </div>
      </div>

      {/* Mail status */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div style={{ background: C.green.bg, border: '1px solid #166534', borderRadius: 6 }} className="flex items-center gap-3 px-4 py-3">
          <Icon.mail />
          <div>
            <div className="text-[12px] font-semibold" style={{ color: '#4ade80' }}>Mailed to depot</div>
            <div className="font-mono text-[11px]" style={{ color: '#4ade8099' }}>15 Nov 2024 · 07:22 IST</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 'auto' }}>
            <path d="M2.5 7l3 3 6-6" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ background: C.green.bg, border: '1px solid #166534', borderRadius: 6 }} className="flex items-center gap-3 px-4 py-3">
          <Icon.mail />
          <div>
            <div className="text-[12px] font-semibold" style={{ color: '#4ade80' }}>Mailed to customer</div>
            <div className="font-mono text-[11px]" style={{ color: '#4ade8099' }}>15 Nov 2024 · 07:22 IST</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 'auto' }}>
            <path d="M2.5 7l3 3 6-6" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* CRO document preview */}
      <div
        style={{
          background: '#15171d', border: `2px solid ${C.border}`,
          borderRadius: 10, overflow: 'hidden', marginBottom: 20,
        }}
      >
        {/* Document header */}
        <div style={{ background: '#0b0c0f', borderBottom: `1px solid ${C.border}`, padding: '18px 24px' }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div style={{ width: 40, height: 40, borderRadius: 8, background: C.accent }} className="flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M2 9l2.5-6 2.5 4 2-2.5L11 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#dde1ea]">Apex Logistics Private Limited</div>
                <div className="text-[11px]" style={{ color: C.textMuted }}>NVOCC · IEC AAACL1234M · Mumbai</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-widest font-bold" style={{ color: C.textMuted }}>Container Release Order</div>
              <div className="font-mono text-[16px] font-bold mt-0.5" style={{ color: C.accentDim }}>CRO-2024-0089</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Booking info grid */}
          <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-6">
            {[
              { label: 'Booking Ref', value: 'BKG-2024-00142', mono: true },
              { label: 'Issue Date', value: '15 Nov 2024', mono: false },
              { label: 'Validity', value: '20 Nov 2024 (5 days)', mono: false },
              { label: 'Shipper', value: 'Stellar Exports Pvt Ltd', mono: false },
              { label: 'Port of Load', value: 'INNSA — Nhava Sheva', mono: false },
              { label: 'Port of Discharge', value: 'CNSHA — Shanghai', mono: false },
              { label: 'Vessel / Voyage', value: 'MSC Gulsun / 2411E', mono: false },
              { label: 'ETD', value: '22 Nov 2024', mono: false },
              { label: 'SI Cutoff', value: '20 Nov 2024, 18:00', mono: false },
            ].map(f => (
              <div key={f.label}>
                <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>{f.label}</div>
                {f.mono
                  ? <MonoRef>{f.value}</MonoRef>
                  : <span className="text-[13px]" style={{ color: C.text }}>{f.value}</span>
                }
              </div>
            ))}
          </div>

          {/* Depot */}
          <div style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }} className="p-4 mb-6">
            <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: C.textMuted }}>Pickup Depot</div>
            <div className="font-medium mb-0.5" style={{ color: C.text }}>JNPT Container Freight Station — Gate 3</div>
            <div className="text-[12px]" style={{ color: C.textMuted }}>Plot C-28, Uran Road, JNPT, Navi Mumbai, Maharashtra – 400 707</div>
            <div className="flex items-center gap-6 mt-3 text-[12px]" style={{ color: C.textMuted }}>
              <span>Hours: <strong style={{ color: C.textSubtle }}>Mon–Sat 06:00–22:00</strong></span>
              <span>Contact: <span className="font-mono">+91 22 6738 9900</span></span>
              <span>Depot Ref: <MonoRef>JNPT-DEP-CFS3</MonoRef></span>
            </div>
          </div>

          {/* Container list */}
          <div style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }} className="overflow-hidden mb-5">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Container No.', 'Type', 'Seal No.', 'Tare Weight', 'Status'].map(h => (
                    <th key={h} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CONTAINERS.map((c, i) => (
                  <tr key={c.number} style={{ borderBottom: i < CONTAINERS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <td className={cls.tableCell}><MonoRef>{c.number}</MonoRef></td>
                    <td className={cls.tableCell}>{c.type}</td>
                    <td className={cls.tableCell}><MonoRef>{c.seal}</MonoRef></td>
                    <td className={cls.tableCell} style={{ color: C.textMuted }}>{c.tare}</td>
                    <td className={cls.tableCell}><Badge variant="active" label="Available" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Instructions */}
          <div style={{ background: '#0d1d35', border: '1px solid #1e3a5f', borderRadius: 6 }} className="p-4">
            <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#5a7ca0' }}>Pickup Instructions</div>
            <ul className="space-y-1.5">
              {[
                'Present this CRO (original or digital) at the depot gate.',
                'Driver must carry valid government photo ID and transport vehicle registration.',
                'Containers to be picked up within validity period. Demurrage applies after expiry.',
                'VGM declaration mandatory before gate-in. Use depot\'s VGM service or shipper\'s own scale.',
                'Container condition report to be signed at pickup — any pre-existing damage noted.',
              ].map((inst, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: '#7a9fc0' }}>
                  <span style={{ color: '#3d5a8a', marginTop: 2, flexShrink: 0 }}>·</span>
                  {inst}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Actions — Ops can re-send either copy; Customer only ever downloads their own */}
      <div className="flex gap-2">
        <button className={cls.btnPrimary}><Icon.download /> Download PDF</button>
        {role === 'ops' && (
          <>
            <button className={cls.btnSecondary}><Icon.mail /> Re-send to Depot</button>
            <button className={cls.btnSecondary}><Icon.mail /> Re-send to Customer</button>
          </>
        )}
        <div className="flex-1" />
        <button onClick={() => onNavigate('order-timeline')} className={cls.btnSecondary}><Icon.timeline /> Timeline</button>
      </div>
    </div>
  )
}
