import { useState } from 'react'
import { Screen, Session } from '../types'
import { DEPOTS } from '../data/depots'
import { BOOKING } from '../data/booking'
import { useBooking } from '../state/BookingContext'
import { Field, Input, PageHeader, SectionCard, cls, C, Badge, Icon } from '../components/ui'

// The Ops half of the parallel track that runs alongside the customer's KYC.
// The requirement goes to EVERY candidate depot for the port; each replies on
// its own screen. Exactly one confirmation is auto-picked with no human step —
// two or more and Ops chooses. Both paths are real here, not described in prose.

export default function OpsDepotSelect({ session, onNavigate }: { session: Session; onNavigate: (s: Screen) => void }) {
  const { booking, actions } = useBooking()
  const [containerNumbers, setContainerNumbers] = useState('')
  const [commodity, setCommodity] = useState('')

  const sent = booking.requirementSent
  const selected = booking.depotId
  const replies = booking.depotReplies
  const replied = DEPOTS.filter(d => replies[d.id] === 'yes' || replies[d.id] === 'no')
  const confirmed = DEPOTS.filter(d => replies[d.id] === 'yes')
  const allIn = replied.length === DEPOTS.length
  const canAutoPick = allIn && confirmed.length === 1 && !selected

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Depot Pre-Check"
        subtitle="Confirm container availability before the booking can be accepted"
        actions={selected ? <Badge variant="approved" label="Depot Assigned" /> : sent ? <Badge variant="awaiting" label="Awaiting Replies" /> : undefined}
      />

      <div
        style={{ background: C.blue.bg, border: `1px solid ${C.blue.border}`, borderRadius: 6 }}
        className="flex items-start gap-3 px-4 py-3 mb-5"
      >
        <span style={{ color: C.blue.text, marginTop: 1 }}><Icon.warning /></span>
        <div className="text-[12px]" style={{ color: C.blue.text }}>
          Runs in parallel with the customer's KYC, straight after Rate Agreed — it does not wait for them. The assigned
          depot's address is what the CRO carries, so this must resolve before Ops can accept the booking.
        </div>
      </div>

      <SectionCard title="Send Requirement to Depots">
        {!sent ? (
          <>
            <div className="text-sm mb-3" style={{ color: C.text }}>
              Requesting <strong>{BOOKING.equipment}</strong> at {BOOKING.polName}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Container Numbers (optional)">
                <Input value={containerNumbers} onChange={e => setContainerNumbers(e.target.value)} placeholder="e.g. MSCU3841290" />
              </Field>
              <Field label="Commodity (optional)">
                <Input value={commodity} onChange={e => setCommodity(e.target.value)} placeholder="e.g. Garments & Textiles" />
              </Field>
            </div>
            <button onClick={() => actions.sendDepotRequirement(session.name)} className={cls.btnPrimary}>
              <Icon.mail /> Send to all {DEPOTS.length} candidate depots
            </button>
          </>
        ) : (
          <div className="text-[13px]" style={{ color: C.textMuted }}>
            Requirement for <strong style={{ color: C.text }}>{BOOKING.equipment}</strong> mailed to all {DEPOTS.length}{' '}
            candidate depots near {BOOKING.polName}. Replies arrive from each depot's own Requirement Inbox.
          </div>
        )}
      </SectionCard>

      {sent && (
        <SectionCard title={`Depot Replies — ${replied.length} of ${DEPOTS.length} in`}>
          <div className="space-y-2">
            {DEPOTS.map(d => {
              const reply = replies[d.id]
              const isSelected = selected === d.id
              const selectable = reply === 'yes' && !selected && !canAutoPick
              return (
                <div
                  key={d.id}
                  onClick={() => selectable && actions.assignDepot(d.id, session.name, false)}
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    background: '#1c1e26',
                    border: `1px solid ${isSelected ? C.accent : C.border}`,
                    borderRadius: 6,
                    cursor: selectable ? 'pointer' : 'default',
                    opacity: reply === 'no' ? 0.55 : 1,
                  }}
                >
                  <div className="flex items-center gap-3">
                    {reply === 'yes' && (
                      <div
                        aria-hidden
                        style={{
                          width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${isSelected ? C.accent : C.border}`,
                          background: isSelected ? C.accent : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {isSelected && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'white' }} />}
                      </div>
                    )}
                    <div>
                      <div className="text-sm" style={{ color: C.text }}>{d.name}</div>
                      <div className="text-[11px]" style={{ color: C.textMuted }}>{d.address}</div>
                    </div>
                  </div>
                  {reply
                    ? <Badge variant={reply === 'yes' ? 'approved' : 'rejected'} label={reply === 'yes' ? 'Yes, we have it' : 'No'} />
                    : <Badge variant="pending" label="Awaiting reply" />
                  }
                </div>
              )
            })}
          </div>

          {!selected && (
            <div className="text-[12px] mt-4" style={{ color: C.textMuted }}>
              {!allIn
                ? `Waiting on ${DEPOTS.length - replied.length} more repl${DEPOTS.length - replied.length === 1 ? 'y' : 'ies'}. Depots answer from their own inbox.`
                : confirmed.length === 0
                  ? 'No depot can supply these containers — the booking cannot proceed until one can.'
                  : confirmed.length === 1
                    ? 'Exactly one depot confirmed, so there is nothing for Ops to choose — it is auto-selected.'
                    : `${confirmed.length} depots confirmed — pick the one to use.`}
            </div>
          )}

          {canAutoPick && (
            <button
              onClick={() => actions.assignDepot(confirmed[0].id, session.name, true)}
              className={`${cls.btnPrimary} mt-3`}
            >
              Auto-select {confirmed[0].name} →
            </button>
          )}
        </SectionCard>
      )}

      {selected && (
        <div
          style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }}
          className="flex items-center justify-between px-4 py-3 mb-4"
        >
          <div className="text-sm" style={{ color: C.green.text }}>
            Depot assigned — <strong>{DEPOTS.find(d => d.id === selected)?.name}</strong>. Its address is what the CRO carries.
          </div>
          <button onClick={() => onNavigate('ops-accept')} className={cls.btnPrimary} style={{ flexShrink: 0 }}>
            Booking Acceptance →
          </button>
        </div>
      )}
    </div>
  )
}
