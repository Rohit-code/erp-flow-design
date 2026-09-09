import { Screen } from '../types'
import { PageHeader, cls, C, Badge, MonoRef, Icon } from '../components/ui'
import { BOOKING, BOOKING_GROSS } from '../data/booking'
import { useBooking } from '../state/BookingContext'
import { getDepot } from '../data/depots'
import { rateLabel, money } from '../data/pricing'


export default function BookingConfirmed({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { booking, prereqs } = useBooking()
  const depot = booking.depotId ? getDepot(booking.depotId) : undefined
  const acceptedAt = booking.events.find(e => e.id.startsWith('ops-accepted'))?.ts

  // Nothing to show until Ops has actually accepted — the gate is real now.
  if (!booking.opsAccepted) {
    return (
      <div className="max-w-3xl">
        <PageHeader
          breadcrumb={`Bookings / ${BOOKING.id}`}
          title="Booking Confirmed"
          subtitle={`${BOOKING.customer} · ${BOOKING.pol} → ${BOOKING.pod} · ${BOOKING.equipment}`}
          actions={<Badge variant="awaiting" label="Not Yet Accepted" />}
        />
        <div style={{ background: '#231a06', border: '1px solid #854d0e', borderRadius: 8 }} className="p-5">
          <div className="text-[14px] font-semibold mb-1" style={{ color: '#fbbf24' }}>
            This booking has not been confirmed
          </div>
          <div className="text-[12px] mb-3" style={{ color: '#fde68a' }}>
            Confirmation happens only when an Ops user accepts at the gate. Outstanding:
          </div>
          <div className="space-y-1.5">
            {prereqs.filter(p => !p.done).map(p => (
              <div key={p.id} className="text-[12px]" style={{ color: '#fde68a' }}>
                · {p.label} — <span style={{ color: '#fbbf2499' }}>{p.owner}</span>
              </div>
            ))}
            {prereqs.every(p => p.done) && (
              <div className="text-[12px]" style={{ color: '#fde68a' }}>
                Nothing outstanding — the booking is ready for Ops to accept.
              </div>
            )}
          </div>
          <button onClick={() => onNavigate('ops-accept')} className={`${cls.btnPrimary} mt-4`}>
            Go to Booking Acceptance →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb={`Bookings / ${BOOKING.id}`}
        title="Booking Confirmed"
        subtitle={`${BOOKING.customer} · ${BOOKING.pol} → ${BOOKING.pod} · ${BOOKING.equipment}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="confirmed" label="Confirmed" />
            <button onClick={() => onNavigate('order-timeline')} className={cls.btnSecondary} style={{ fontSize: 12, padding: '5px 10px' }}>
              Order Timeline
            </button>
          </div>
        }
      />

      {/* Ops acceptance banner */}
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
              Accepted by Ops — {booking.opsAcceptedBy}
            </div>
            <div className="text-[12px] mb-3" style={{ color: '#86efac' }}>
              Accepted at <span className="font-mono">{acceptedAt}</span> after reviewing the checklist below.
              Confirmation was never automatic — a booking sits at the acceptance gate until an Ops user accepts it.
              The CRO was issued on acceptance and mailed to the customer and the assigned depot.
            </div>

            <div className="space-y-2">
              {prereqs.map(p => (
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
                    <div className="text-[11px]" style={{ color: p.done ? '#4ade8099' : '#fbbf2499' }}>{p.detail}</div>
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
          <MonoRef>{BOOKING.id}</MonoRef>
        </div>
        <div className="px-5 py-4 grid grid-cols-3 gap-x-8 gap-y-4">
          {[
            { label: 'Shipper', value: BOOKING.customer },
            { label: 'Port of Load', value: `${BOOKING.pol} — ${BOOKING.polName}` },
            { label: 'Port of Discharge', value: `${BOOKING.pod} — ${BOOKING.podName}` },
            { label: 'Equipment', value: BOOKING.equipment },
            { label: 'Freight Rate', value: rateLabel(booking.agreedRate ?? BOOKING.agreedRate) },
            { label: 'Gross Freight', value: `${money(BOOKING_GROSS)} (${BOOKING.containerCount} × ${BOOKING.agreedRate})` },
            { label: 'Quotation Ref', value: BOOKING.quotationId },
            { label: 'Assigned Sales', value: BOOKING.salesRep },
            { label: 'Assigned Depot', value: depot?.name ?? '—' },
          ].map(f => (
            <div key={f.label}>
              <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>{f.label}</div>
              <div className="text-[13px]" style={{ color: C.text }}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Next step: the CRO, issued on acceptance */}
      <div style={{ background: '#0d1d35', border: '1px solid #1e3a5f', borderRadius: 8 }} className="flex items-center justify-between px-5 py-4 mb-5">
        <div>
          <div className="text-sm font-medium mb-0.5" style={{ color: '#93c5fd' }}>Next: CRO issued to depot & customer</div>
          <div className="text-[12px]" style={{ color: '#5a7ca0' }}>
            Two copies — a pickup notice to {depot?.name}, and a downloadable copy in the customer's portal.
          </div>
        </div>
        <button onClick={() => onNavigate('cro-release')} className={cls.btnPrimary} style={{ flexShrink: 0 }}>
          View CRO →
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
