import { Screen, Session } from '../types'
import { DEPOTS } from '../data/depots'
import { BOOKING } from '../data/booking'
import { useBooking } from '../state/BookingContext'
import { PageHeader, SectionCard, cls, C, Badge, MonoRef } from '../components/ui'

// The depot's side of the pre-check. In the real system each depot sees only
// its own inbox; here the signed-in depot user answers on behalf of whichever
// depot row they are looking at, so both the auto-pick and the manual-choice
// paths can be walked without three separate logins.

export default function DepotRequirement({ session, onNavigate }: { session: Session; onNavigate: (s: Screen) => void }) {
  const { booking, actions } = useBooking()

  if (!booking.requirementSent) {
    return (
      <div className="max-w-2xl">
        <PageHeader
          title="Requirement Inbox"
          subtitle="Booking requests asking whether this depot has the required containers"
          actions={<Badge variant="awaiting" label="Nothing waiting" />}
        />
        <SectionCard>
          <p className="text-[13px] mb-3" style={{ color: C.text }}>
            <MonoRef>{BOOKING.id}</MonoRef> — the live demo booking — hasn't reached this step yet.
          </p>
          <p className="text-[12px]" style={{ color: C.textMuted }}>
            A requirement only lands here after Sales/Trade agree a rate with the customer and Ops sends the container
            requirement out to every candidate depot at the port. Right now that hasn't happened for the live booking, so
            there's nothing to answer — this isn't a bug, it's this booking's actual state.
          </p>
        </SectionCard>
        <div style={{ background: C.blue.bg, border: `1px solid ${C.blue.border}`, borderRadius: 6 }} className="flex items-center justify-between px-4 py-3.5">
          <span className="text-[12px]" style={{ color: C.blue.text }}>
            Want to see requirement, food-grade and handover status for real bookings instead? Every case this desk has
            touched is in the Case Queue.
          </span>
          <button onClick={() => onNavigate('depot-queue')} className={cls.btnPrimary} style={{ flexShrink: 0 }}>
            Case Queue →
          </button>
        </div>
      </div>
    )
  }

  const answered = DEPOTS.filter(d => booking.depotReplies[d.id]).length

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Requirement Inbox"
        subtitle="Booking requests asking whether this depot has the required containers"
        actions={<Badge variant={answered === DEPOTS.length ? 'approved' : 'pending'} label={`${answered} of ${DEPOTS.length} answered`} />}
      />

      {DEPOTS.map(depot => {
        const reply = booking.depotReplies[depot.id]
        const assigned = booking.depotId === depot.id
        return (
          <SectionCard key={depot.id}>
            <div className="text-[11px] uppercase tracking-widest font-medium mb-2" style={{ color: C.textMuted }}>
              {depot.name}
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm mb-1" style={{ color: C.text }}>
                  <MonoRef>{BOOKING.id}</MonoRef>
                </div>
                <div className="text-[13px]" style={{ color: C.textSubtle }}>{BOOKING.equipment}</div>
                <div className="text-[11px] mt-0.5" style={{ color: C.textMuted }}>
                  {BOOKING.pol} → {BOOKING.pod} · {BOOKING.customer}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {reply && (
                  <Badge
                    variant={reply === 'yes' ? 'approved' : 'inactive'}
                    label={reply === 'yes' ? 'Replied: Yes' : 'Replied: No'}
                  />
                )}
                {assigned && <Badge variant="confirmed" label="Assigned" />}
              </div>
            </div>
            {!reply ? (
              <div className="flex gap-2">
                <button className={cls.btnPrimary} onClick={() => actions.replyDepot(depot.id, 'yes', session.name)}>
                  Yes, we have it
                </button>
                <button className={cls.btnSecondary} onClick={() => actions.replyDepot(depot.id, 'no', session.name)}>
                  No
                </button>
              </div>
            ) : (
              <p className="text-[12px]" style={{ color: C.textMuted }}>
                {assigned
                  ? 'Ops assigned this booking to you — the CRO will carry your address, and the customer will bring a copy to your gate.'
                  : reply === 'yes'
                    ? 'Reply sent. If you are the only depot that confirmed, you are auto-picked; otherwise Ops chooses.'
                    : 'Reply sent — this booking will go to another depot.'}
              </p>
            )}
          </SectionCard>
        )
      })}

      {booking.depotId && (
        <div
          style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }}
          className="flex items-center justify-between px-4 py-3"
        >
          <span className="text-[13px]" style={{ color: C.green.text }}>
            Booking assigned to {DEPOTS.find(d => d.id === booking.depotId)?.name}.
          </span>
          <button onClick={() => onNavigate('depot-handover')} className={cls.btnPrimary} style={{ fontSize: 12, padding: '5px 10px' }}>
            Container Handover →
          </button>
        </div>
      )}
    </div>
  )
}
