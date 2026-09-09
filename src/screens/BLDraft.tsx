import { useState } from 'react'
import { Screen, Role, Session } from '../types'
import { Field, Textarea, PageHeader, SectionCard, cls, C, Badge, MonoRef, Icon } from '../components/ui'
import { MblType, BOOKING } from '../data/booking'
import { getAddress } from '../data/addresses'
import { useBooking } from '../state/BookingContext'

type Status = 'drafted' | 'changes-requested' | 'approved'


// The customer picks Original vs Surrender MBL here, at BL-drafting time — not
// later at release. Approving the draft without choosing is not possible.
export default function BLDraft({
  role, session, onNavigate,
}: {
  role: Role
  session: Session
  onNavigate: (s: Screen) => void
}) {
  const { booking, actions, sailing } = useBooking()
  // The draft is generated from the submitted Shipping Instructions, so every
  // field here traces back to a choice made earlier in the booking.
  const dispatch = booking.shippingAddressIds.map(getAddress).filter(Boolean)
  const containers = booking.containers
  const notLoaded = containers.filter(c => !c.sob)
  const approvedBeforeSob = booking.events.some(e => e.label === 'Confirmed Before SOB — Override')
  const DRAFT_FIELDS: { label: string; value: string; mono?: boolean }[] = [
    { label: 'Shipper', value: dispatch.length
        ? `${BOOKING.customer}, ${dispatch[0]!.city}, ${dispatch[0]!.country}`
        : BOOKING.customer },
    { label: 'Consignee', value: 'Shanghai Huaxin Trading Co., Ltd, Pudong, Shanghai, China' },
    { label: 'Notify Party', value: 'Shanghai Huaxin Trading Co., Ltd, Pudong, Shanghai, China' },
    { label: 'Route', value: `${BOOKING.pol} → ${BOOKING.pod}` },
    { label: 'Vessel / Voyage', value: sailing ? `${sailing.vessel} / ${sailing.voyage}` : '—' },
    { label: 'Booking Ref', value: BOOKING.id, mono: true },
    { label: 'Containers', value: booking.containers.map(c => c.number).join(', ') || 'None handed over yet' },
    { label: 'Gate In', value: containers.length && containers.every(c => c.gatedIn)
        ? 'All containers received at terminal'
        : `${containers.filter(c => c.gatedIn).length} of ${containers.length} gated in` },
    { label: 'Shipped On Board', value: containers.length && notLoaded.length === 0
        ? `All containers · SOB ${containers[0].sobDate}`
        : `${containers.length - notLoaded.length} of ${containers.length} loaded` },
  ]
  // The chosen type is only local until the draft is approved — approving is
  // what writes it to the booking.
  const [pendingType, setPendingType] = useState<MblType | null>(booking.mblType)
  const [noteDraft, setNoteDraft] = useState('')
  const [showChangeForm, setShowChangeForm] = useState(false)

  const status: Status = booking.blStatus === 'none' ? 'drafted' : (booking.blStatus as Status)
  const mblType = booking.mblType ?? pendingType
  const changeNote = booking.blChangeNote ?? ''

  const isCustomer = role === 'customer'

  const badgeFor = (s: Status) =>
    s === 'approved'
      ? { variant: 'approved' as const, label: 'Approved' }
      : s === 'changes-requested'
      ? { variant: 'countered' as const, label: 'Changes Requested' }
      : { variant: 'draft' as const, label: 'Drafted' }

  const handleApprove = () => { if (pendingType) actions.approveBl(pendingType, session.name) }

  const handleSubmitChanges = () => {
    if (!noteDraft.trim()) return
    actions.requestBlChanges(noteDraft.trim(), session.name)
    setShowChangeForm(false)
    setNoteDraft('')
  }

  const handleRedraft = () => actions.redraftBl(session.name)

  const badge = badgeFor(status)

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb="Bill of Lading"
        title="Bill of Lading — Draft & Confirmation"
        subtitle={`${BOOKING.id} · ${BOOKING.customer} · ${BOOKING.pol} → ${BOOKING.pod}`}
        actions={<Badge variant={badge.variant} label={badge.label} />}
      />

      {/* Warn, don't block. A shut-out container is exactly when Ops most needs
          to act, so confirmation stays possible — but the override is logged. */}
      {notLoaded.length > 0 && status !== 'approved' && (
        <div style={{ background: C.red.bg, border: `1px solid ${C.red.border}`, borderRadius: 6 }} className="flex items-start gap-3 px-4 py-3.5 mb-5">
          <span style={{ color: C.red.text, marginTop: 1 }}><Icon.warning /></span>
          <div className="text-[12px]" style={{ color: C.red.text }}>
            <strong>Not shipped on board.</strong>{' '}
            {containers.length === 0
              ? 'No containers have been loaded to the vessel yet.'
              : `${notLoaded.map(c => c.number).join(', ')} ${notLoaded.length === 1 ? 'has' : 'have'} no SOB record.`}{' '}
            {isCustomer
              ? 'You can still approve the wording — but the Master BL is not released until the cargo actually sails.'
              : 'Confirming a BL for cargo that never sailed is the real claim risk. You can proceed, but the override is recorded in the Order Timeline against your name.'}
          </div>
        </div>
      )}

      {status === 'approved' && approvedBeforeSob && (
        <div style={{ background: C.amber.bg, border: `1px solid ${C.amber.border}`, borderRadius: 6 }} className="flex items-start gap-3 px-4 py-3 mb-5">
          <span style={{ color: C.amber.text, marginTop: 1 }}><Icon.warning /></span>
          <div className="text-[12px]" style={{ color: C.amber.text }}>
            This BL was confirmed before shipped-on-board was recorded. The override is in the Order Timeline.
          </div>
        </div>
      )}

      {!isCustomer && (
        <SectionCard title="Bill of Lading Type">
          <div className="flex items-center gap-2">
            {mblType
              ? <>
                  <Badge variant="approved" label={mblType === 'surrender' ? 'Surrender MBL' : 'Original MBL'} />
                  <span className="text-[12px]" style={{ color: C.textMuted }}>Chosen by the customer at drafting time.</span>
                </>
              : <span className="text-[12px]" style={{ color: C.amber.text }}>
                  Customer hasn't chosen yet — they select Surrender or Original when they approve this draft.
                </span>
            }
          </div>
        </SectionCard>
      )}

      <SectionCard title="Draft Details">
        <div style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }} className="p-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {DRAFT_FIELDS.map(f => (
              <div key={f.label}>
                <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>{f.label}</div>
                {f.mono ? <MonoRef>{f.value}</MonoRef> : <span className="text-[13px]" style={{ color: C.text }}>{f.value}</span>}
              </div>
            ))}
          </div>
        </div>
        <p className="text-[12px] mt-3" style={{ color: C.textMuted }}>
          Auto-prepared from the submitted Shipping Instructions — no re-entry needed.
        </p>
      </SectionCard>

      {status === 'changes-requested' && (
        <SectionCard title="Requested Changes">
          <p className="text-[13px] mb-3" style={{ color: C.text }}>{changeNote}</p>
          {!isCustomer && (
            <button onClick={handleRedraft} className={cls.btnPrimary}>Re-draft &amp; Re-send</button>
          )}
        </SectionCard>
      )}

      {!isCustomer && status !== 'approved' && (
        <div className="flex gap-2 pt-1">
          <button onClick={handleRedraft} className={cls.btnSecondary}>Re-send Draft</button>
        </div>
      )}

      {isCustomer && status === 'drafted' && (
        <SectionCard title="Bill of Lading Type — your choice, made now">
          <p className="text-[12px] mb-3" style={{ color: C.textMuted }}>
            Choose how you want the Master Bill released. This is decided at drafting time, before the invoice — it is
            printed on the BL itself, so it cannot be changed after you approve the draft.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: 'surrender' as const, title: 'Surrender MBL', desc: 'Stamped surrendered and kept in our office. Nothing physical to courier — faster release at destination.' },
              { id: 'original' as const, title: 'Original MBL', desc: 'Physically issued and couriered to you. Required when your buyer\'s bank asks for original documents.' },
            ]).map(opt => {
              const on = pendingType === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPendingType(opt.id)}
                  style={{
                    textAlign: 'left', padding: '14px 16px', borderRadius: 8,
                    background: on ? '#0d1d35' : '#1c1e26',
                    border: `1px solid ${on ? C.accent : C.border}`,
                    cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div
                      aria-hidden
                      style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${on ? C.accent : C.border}`,
                        background: on ? C.accent : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {on && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'white' }} />}
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: on ? C.accentDim : C.text }}>{opt.title}</span>
                  </div>
                  <span className="text-[11px]" style={{ color: C.textMuted }}>{opt.desc}</span>
                </button>
              )
            })}
          </div>
        </SectionCard>
      )}

      {isCustomer && status === 'drafted' && (
        <div className="pt-1">
          {!showChangeForm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleApprove}
                disabled={!pendingType}
                className={notLoaded.length > 0 ? cls.btnAmber : cls.btnPrimary}
                style={!pendingType ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
              >
                <Icon.check /> {notLoaded.length > 0 ? 'Approve anyway' : 'Approve'}
              </button>
              <button onClick={() => setShowChangeForm(true)} className={cls.btnAmber}>Request Changes</button>
              {!pendingType && (
                <span className="text-[11px]" style={{ color: C.amber.text }}>
                  Choose Surrender or Original above before approving.
                </span>
              )}
            </div>
          ) : (
            <SectionCard title="Request Changes">
              <Field label="What needs to change?">
                <Textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} placeholder="e.g. Consignee address needs correction…" />
              </Field>
              <div className="flex gap-2 mt-3">
                <button onClick={handleSubmitChanges} className={cls.btnPrimary}>Submit</button>
                <button onClick={() => setShowChangeForm(false)} className={cls.btnSecondary}>Cancel</button>
              </div>
            </SectionCard>
          )}
        </div>
      )}

      {status === 'approved' && (
        <div
          style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }}
          className="flex items-center justify-between px-4 py-3 mt-2"
        >
          <div className="flex items-center gap-2">
            <Icon.check />
            <span className="text-sm font-medium" style={{ color: C.green.text }}>
              BL draft approved{mblType ? ` — ${mblType === 'surrender' ? 'Surrender' : 'Original'} MBL` : ''}
            </span>
          </div>
          <button onClick={() => onNavigate('invoice')} className={cls.btnPrimary} style={{ fontSize: 12, padding: '5px 10px' }}>
            Continue to Invoice →
          </button>
        </div>
      )}
    </div>
  )
}
