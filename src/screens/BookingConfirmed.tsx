import { Screen } from '../types'
import { PageHeader, cls, C, Badge, MonoRef, Icon } from '../components/ui'

const PREREQS = [
  { label: 'KYC — Stellar Exports Pvt Ltd', done: true, note: 'Approved by Sunita R. · 14 Nov 2024, 14:30' },
  { label: 'Billing Address — Plot 14, SEEPZ SEZ, Mumbai', done: true, note: 'Confirmed by customer · 14 Nov 2024, 15:02' },
  { label: 'Sailing — Awaiting customer selection', done: false, note: null },
]

export default function BookingConfirmed({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb="Bookings / BKG-2024-00142"
        title="Booking Confirmed"
        subtitle="Stellar Exports Pvt Ltd · INNSA → CNSHA · 2 × 40ft HC"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="confirmed" label="Confirmed" />
            <button onClick={() => onNavigate('order-timeline')} className={cls.btnSecondary} style={{ fontSize: 12, padding: '5px 10px' }}>
              Order Timeline
            </button>
          </div>
        }
      />

      {/* System auto-confirm banner */}
      <div
        style={{ background: '#0d2818', border: '1px solid #166534', borderRadius: 8 }}
        className="p-5 mb-5"
      >
        <div className="flex items-start gap-3">
          <div
            style={{ width: 38, height: 38, borderRadius: 8, background: '#14532d', flexShrink: 0 }}
            className="flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9l4 4 8-8" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-semibold mb-1" style={{ color: '#4ade80' }}>
              Confirmed automatically — all prerequisites met
            </div>
            <div className="text-[12px] mb-3" style={{ color: '#86efac' }}>
              The booking was confirmed by the system at <span className="font-mono">14 Nov 2024, 15:04 IST</span> with no further customer consent required.
              A confirmation email was dispatched to the customer and the assigned depot.
            </div>

            <div className="space-y-2">
              {PREREQS.map(p => (
                <div key={p.label} className="flex items-start gap-2.5">
                  <div
                    style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                      background: p.done ? '#14532d' : '#231a06',
                      border: `1.5px solid ${p.done ? '#4ade80' : '#fbbf24'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {p.done
                      ? <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2.5 2.5 3.5-4" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fbbf24' }} />
                    }
                  </div>
                  <div>
                    <span className="text-[12px] font-medium" style={{ color: p.done ? '#86efac' : '#fde68a' }}>
                      {p.label}
                    </span>
                    {p.note && (
                      <div className="text-[11px]" style={{ color: p.done ? '#4ade8099' : '#fbbf2499' }}>{p.note}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking details */}
      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 8 }} className="mb-5">
        <div style={{ borderBottom: `1px solid ${C.border}` }} className="px-5 py-4 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: C.textMuted }}>Booking Details</span>
          <MonoRef>BKG-2024-00142</MonoRef>
        </div>
        <div className="px-5 py-4 grid grid-cols-3 gap-x-8 gap-y-4">
          {[
            { label: 'Shipper', value: 'Stellar Exports Pvt Ltd' },
            { label: 'Port of Load', value: 'INNSA — Nhava Sheva' },
            { label: 'Port of Discharge', value: 'CNSHA — Shanghai' },
            { label: 'Equipment', value: '2 × 40ft High Cube' },
            { label: 'Freight Rate', value: 'USD 562 / TEU' },
            { label: 'Gross Freight', value: 'USD 1,124' },
            { label: 'Quotation Ref', value: 'QT-2024-0217' },
            { label: 'Assigned Sales', value: 'Rohit Kumar' },
            { label: 'Assigned KYC', value: 'Sunita R.' },
          ].map(f => (
            <div key={f.label}>
              <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>{f.label}</div>
              <div className="text-[13px]" style={{ color: C.text }}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Next step: sailing */}
      <div style={{ background: '#0d1d35', border: '1px solid #1e3a5f', borderRadius: 8 }} className="flex items-center justify-between px-5 py-4 mb-5">
        <div>
          <div className="text-sm font-medium mb-0.5" style={{ color: '#93c5fd' }}>Next: Customer selects sailing</div>
          <div className="text-[12px]" style={{ color: '#5a7ca0' }}>
            Customer has been notified to select a voyage. Awaiting their selection.
          </div>
        </div>
        <button onClick={() => onNavigate('select-sailing')} className={cls.btnPrimary} style={{ flexShrink: 0 }}>
          Preview Sailing Selection →
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={() => onNavigate('cro-release')} className={cls.btnSecondary}>
          <Icon.cro /> View CRO
        </button>
        <button onClick={() => onNavigate('order-timeline')} className={cls.btnSecondary}>
          <Icon.timeline /> Order Timeline
        </button>
      </div>
    </div>
  )
}
