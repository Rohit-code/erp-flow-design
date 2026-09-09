import { useState } from 'react'
import { Screen, Session } from '../types'
import { useBooking } from '../state/BookingContext'
import { getSailing } from '../data/sailings'
import { PageHeader, SectionCard, Field, Textarea, cls, C, Badge, MonoRef, Icon } from '../components/ui'
import { BOOKING } from '../data/booking'
import { rateLabel } from '../data/pricing'

// The mandatory manual gate. Nothing downstream — Booking Confirmed, CRO issue,
// depot notification — may happen until Ops accepts here. Acceptance is only
// offered once every prerequisite below is complete; an incomplete booking can
// be sent back to whoever owns the missing piece, but it cannot be accepted.


export default function OpsAccept({ session, onNavigate }: { session: Session; onNavigate: (s: Screen) => void }) {
  const { booking, prereqs, readyForOps, actions } = useBooking()
  const [showSendBack, setShowSendBack] = useState(false)
  const [reason, setReason] = useState('')

  const outcome = booking.opsAccepted ? 'accepted' : booking.sentBackReason ? 'sent-back' : null
  const blocking = prereqs.filter(p => !p.done)
  const ready = readyForOps

  const handleSendBack = () => {
    if (!reason.trim()) return
    actions.sendBack(reason.trim(), session.name)
    setShowSendBack(false)
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb="Bookings / BKG-2024-00142"
        title="Booking Acceptance — Ops"
        subtitle="Stellar Exports Pvt Ltd · INNSA → CNSHA · 2 × 40ft HC"
        actions={
          <Badge
            variant={outcome === 'accepted' ? 'confirmed' : outcome === 'sent-back' ? 'rejected' : 'awaiting'}
            label={outcome === 'accepted' ? 'Accepted' : outcome === 'sent-back' ? 'Sent Back' : 'Awaiting Ops'}
          />
        }
      />

      <div
        style={{ background: C.blue.bg, border: `1px solid ${C.blue.border}`, borderRadius: 6 }}
        className="flex items-start gap-3 px-4 py-3.5 mb-5"
      >
        <span style={{ color: C.blue.text, marginTop: 1 }}><Icon.warning /></span>
        <div className="text-[12px]" style={{ color: C.blue.text }}>
          <strong>Mandatory manual gate.</strong> The booking is not confirmed and no CRO is issued until Ops accepts here.
          Accepting commits a physical container at a named depot — it is never automatic.
        </div>
      </div>

      <SectionCard title="Readiness Checklist">
        <div className="space-y-3">
          {prereqs.map(p => (
            <div key={p.id} className="flex items-start gap-3">
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
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium" style={{ color: p.done ? C.text : '#fbbf24' }}>
                    {p.label}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: C.textMuted }}>{p.owner}</span>
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: C.textMuted }}>
                  {p.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

      </SectionCard>

      <SectionCard title="Booking Summary">
        <div className="grid grid-cols-3 gap-x-8 gap-y-4">
          {[
            { label: 'Shipper', value: BOOKING.customer },
            { label: 'Route', value: `${BOOKING.pol} → ${BOOKING.pod}` },
            { label: 'Equipment', value: BOOKING.equipment },
            { label: 'Agreed Rate', value: booking.agreedRate ? rateLabel(booking.agreedRate) : 'Not agreed yet' },
            { label: 'Quotation Ref', value: BOOKING.quotationId },
            { label: 'Assigned Depot', value: prereqs.find(p => p.id === 'depot')?.done ? prereqs.find(p => p.id === 'depot')!.detail.split(' · ')[0] : 'Not assigned' },
          ].map(f => (
            <div key={f.label}>
              <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>{f.label}</div>
              <div className="text-[13px]" style={{ color: C.text }}>{f.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {outcome === 'accepted' && (
        <div
          style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }}
          className="flex items-center justify-between px-4 py-3.5 mb-4"
        >
          <div className="flex items-center gap-2">
            <Icon.check />
            <span className="text-sm font-medium" style={{ color: C.green.text }}>
              Booking accepted by {booking.opsAcceptedBy} — CRO issued to <MonoRef>{prereqs.find(p => p.id === 'depot')?.detail.split(' · ')[0]}</MonoRef> and the customer.
            </span>
          </div>
          <button onClick={() => onNavigate('booking-confirmed')} className={cls.btnPrimary} style={{ flexShrink: 0 }}>
            Continue →
          </button>
        </div>
      )}

      {outcome === 'sent-back' && (
        <div style={{ background: C.red.bg, border: `1px solid ${C.red.border}`, borderRadius: 6 }} className="px-4 py-3.5 mb-4">
          <div className="text-sm font-medium" style={{ color: C.red.text }}>Sent back — booking not accepted</div>
          <div className="text-[12px] mt-1" style={{ color: '#fca5a5' }}>{booking.sentBackReason}</div>
        </div>
      )}

      {showSendBack && (
        <SectionCard title="Send Back">
          <Field label="What's missing or wrong? (required)">
            <Textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Customer hasn't selected a voyage yet…" />
          </Field>
          <div className="flex gap-2 mt-3">
            <button onClick={handleSendBack} className={cls.btnDanger}>Confirm Send Back</button>
            <button onClick={() => setShowSendBack(false)} className={cls.btnSecondary}>Cancel</button>
          </div>
        </SectionCard>
      )}

      {!outcome && !showSendBack && (
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => actions.acceptBooking(session.name)}
            disabled={!ready}
            className={cls.btnPrimary}
            style={!ready ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
          >
            <Icon.check /> Accept Booking
          </button>
          {!ready && (
            <span className="text-[11px]" style={{ color: '#fbbf24' }}>
              Waiting on {blocking.map(p => p.short).join(', ')} — cannot accept yet.
            </span>
          )}
          <div className="flex-1" />
          <button onClick={() => setShowSendBack(true)} className={cls.btnDanger}>Send Back</button>
        </div>
      )}
    </div>
  )
}
