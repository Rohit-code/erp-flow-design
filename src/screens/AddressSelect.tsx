import { useState } from 'react'
import { Screen, Session } from '../types'
import { ADDRESSES, Address, getAddress } from '../data/addresses'
import { useBooking } from '../state/BookingContext'
import { Field, Textarea, cls, C, Badge, MonoRef, Icon } from '../components/ui'

// Address selection for one booking. Two distinct rules, both from the flow:
//
//   Billing  — exactly ONE, always an explicit choice. No default, not even for
//              a returning customer whose last booking used the same address.
//   Shipping — one or MORE, the customer's own dispatch/pickup locations. These
//              feed Shipper and Place of Receipt on the Shipping Instructions.
//
// The book holds only the customer's own entity addresses, which is what makes
// "KYC approved" meaningful. The overseas Consignee and Notify Party are not in
// here — they change per deal and are entered on the SI itself.
//
// Nothing is editable here. Adding or amending an address goes through Sales →
// Admin → mail to the customer → Order Timeline, so the KYC book keeps one
// verified source of truth.

const byId = (id: string) => getAddress(id)!

function AddressLines({ a }: { a: Address }) {
  return (
    <>
      <div className="text-[12px] mb-1" style={{ color: C.text }}>{a.entity}</div>
      <div className="text-[12px]" style={{ color: C.textMuted }}>
        {a.line1}, {a.city}, {a.state} {a.pin} · {a.country}
      </div>
    </>
  )
}

/** One selectable address row. Renders as a radio or a checkbox. */
function AddressRow({
  a, kind, selected, onToggle,
}: {
  a: Address
  kind: 'radio' | 'checkbox'
  selected: boolean
  onToggle: () => void
}) {
  const disabled = !a.approved
  return (
    <button
      type="button"
      role={kind === 'radio' ? 'radio' : 'checkbox'}
      aria-checked={selected}
      aria-disabled={disabled}
      onClick={() => !disabled && onToggle()}
      disabled={disabled}
      style={{
        width: '100%', textAlign: 'left',
        background: selected ? '#0d1d35' : '#15171d',
        border: `1px solid ${selected ? C.accent : C.border}`,
        borderRadius: 8,
        padding: '14px 16px',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <div className="flex items-start gap-3.5">
        <div
          aria-hidden
          style={{
            width: 18, height: 18, flexShrink: 0, marginTop: 2,
            borderRadius: kind === 'radio' ? '50%' : 4,
            border: `2px solid ${selected ? C.accent : C.border}`,
            background: selected ? C.accent : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >
          {selected && (kind === 'radio'
            ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />
            : <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5L9 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-semibold" style={{ color: selected ? C.accentDim : C.text }}>
              {a.name}
            </span>
            {a.approved
              ? <Badge variant="approved" label="KYC Approved" />
              : <Badge variant="pending" label="Pending Approval" />
            }
          </div>
          <AddressLines a={a} />
          <div className="flex items-center gap-4 mt-2 text-[11px]" style={{ color: C.textMuted }}>
            <span>GSTIN <MonoRef>{a.gstin}</MonoRef></span>
            {a.approved && a.approvedDate && <span>Approved {a.approvedDate}</span>}
          </div>
          {!a.approved && a.pendingReason && (
            <div className="text-[11px] mt-2" style={{ color: C.amber.text }}>{a.pendingReason}</div>
          )}
        </div>
      </div>
    </button>
  )
}

export default function AddressSelect({ session, onNavigate }: { session: Session; onNavigate: (s: Screen) => void }) {
  const { booking, actions } = useBooking()
  // No default. The flow is explicit: always an explicit selection, even for a
  // customer whose previous booking used the same address.
  const [billing, setBilling] = useState<string | null>(booking.billingAddressId)
  const [shipping, setShipping] = useState<string[]>(booking.shippingAddressIds)
  const [editing, setEditing] = useState(false)
  const confirmed = booking.billingAddressId !== null && !editing
  const [touched, setTouched] = useState(false)

  const [showRequest, setShowRequest] = useState(false)
  const [requestText, setRequestText] = useState('')
  const [requestSent, setRequestSent] = useState(false)

  const selectable = ADDRESSES.filter(a => a.approved)
  const canConfirm = billing !== null && shipping.length > 0

  const toggleShipping = (id: string) =>
    setShipping(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))

  const handleConfirm = () => {
    setTouched(true)
    if (!canConfirm) return
    actions.setAddresses(billing!, shipping, session.name)
    setEditing(false)
  }

  const handleSendRequest = () => {
    if (!requestText.trim()) return
    setRequestSent(true)
    setShowRequest(false)
  }

  if (confirmed) {
    const b = byId(billing!)
    return (
      <div className="max-w-2xl">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-widest font-semibold mb-1" style={{ color: C.textMuted }}>
            Booking · <MonoRef>BKG-2024-00142</MonoRef>
          </div>
          <h1 className="text-xl font-semibold" style={{ color: C.text }}>Addresses confirmed</h1>
        </div>

        <div style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 8 }} className="p-5 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ width: 36, height: 36, borderRadius: 6, background: '#14532d' }} className="flex items-center justify-center flex-shrink-0">
              <Icon.check />
            </div>
            <div>
              <div className="font-semibold" style={{ color: C.green.text }}>Saved to this booking</div>
              <div className="text-[12px]" style={{ color: '#86efac' }}>Next: choose your voyage.</div>
            </div>
          </div>

          <div style={{ background: '#0d2818', border: `1px solid ${C.green.border}`, borderRadius: 6 }} className="p-4">
            <div className="mb-3">
              <div className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: '#4ade8099' }}>
                Billing address — 1
              </div>
              <div className="text-[12px]" style={{ color: '#86efac' }}>
                {b.name} · {b.line1}, {b.city} {b.pin}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: '#4ade8099' }}>
                Shipping / dispatch — {shipping.length}
              </div>
              {/* Listed in address-book order, not the order they were clicked. */}
              {ADDRESSES.filter(a => shipping.includes(a.id)).map(({ id }) => {
                const a = byId(id)
                return (
                  <div key={id} className="text-[12px]" style={{ color: '#86efac' }}>
                    {a.name} · {a.line1}, {a.city} {a.pin}
                  </div>
                )
              })}
              <div className="text-[11px] mt-2" style={{ color: '#4ade8099' }}>
                These feed Shipper and Place of Receipt on your Shipping Instructions.
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onNavigate('select-sailing')} className={cls.btnPrimary}>
            Continue to Select Sailing →
          </button>
          <button onClick={() => { setEditing(true); setTouched(false) }} className={cls.btnSecondary}>
            Change addresses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-widest font-semibold mb-1" style={{ color: C.textMuted }}>
          Booking · <MonoRef>BKG-2024-00142</MonoRef>
        </div>
        <h1 className="text-xl font-semibold mb-1" style={{ color: C.text }}>Select Addresses</h1>
        <p className="text-sm" style={{ color: C.textMuted }}>
          Both are drawn from your KYC-verified address book. Only approved addresses can be used on a booking.
        </p>
      </div>

      {/* ── Billing: exactly one, no default ─────────────────────────────── */}
      <div className="mb-7">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-[13px] font-semibold" style={{ color: C.text }}>Billing Address</h2>
          <span className="text-[11px]" style={{ color: billing ? C.green.text : C.textMuted }}>
            {billing ? '1 selected' : 'Required — choose one'}
          </span>
        </div>
        <p className="text-[12px] mb-3" style={{ color: C.textMuted }}>
          Exactly one, and it is never pre-selected — the invoice for this booking is raised against whichever you pick here.
        </p>
        <div className="space-y-3" role="radiogroup" aria-label="Billing address">
          {ADDRESSES.map(a => (
            <AddressRow
              key={a.id}
              a={a}
              kind="radio"
              selected={billing === a.id}
              onToggle={() => setBilling(a.id)}
            />
          ))}
        </div>
        {touched && !billing && (
          <div className="text-[12px] mt-2" style={{ color: C.red.text }}>
            Choose a billing address before continuing.
          </div>
        )}
      </div>

      {/* ── Shipping: one or more ────────────────────────────────────────── */}
      <div className="mb-7">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-[13px] font-semibold" style={{ color: C.text }}>Shipping / Dispatch Addresses</h2>
          <span className="text-[11px]" style={{ color: shipping.length ? C.green.text : C.textMuted }}>
            {shipping.length ? `${shipping.length} selected` : 'Required — choose at least one'}
          </span>
        </div>
        <p className="text-[12px] mb-3" style={{ color: C.textMuted }}>
          Pick every location cargo for this booking will move from. They become the Shipper and Place of Receipt on your
          Shipping Instructions. Your overseas Consignee and Notify Party are entered on the SI itself — they aren't stored
          here.
        </p>
        <div className="space-y-3" role="group" aria-label="Shipping addresses">
          {ADDRESSES.map(a => (
            <AddressRow
              key={a.id}
              a={a}
              kind="checkbox"
              selected={shipping.includes(a.id)}
              onToggle={() => toggleShipping(a.id)}
            />
          ))}
        </div>
        {touched && shipping.length === 0 && (
          <div className="text-[12px] mt-2" style={{ color: C.red.text }}>
            Choose at least one shipping address before continuing.
          </div>
        )}
        {selectable.length > 1 && shipping.length === selectable.length && (
          <div className="text-[12px] mt-2" style={{ color: C.textMuted }}>
            All {selectable.length} approved addresses selected.
          </div>
        )}
      </div>

      {/* ── Change request: Sales → Admin → mail → Order Timeline ─────────── */}
      <div
        style={{ background: '#1a1d24', border: `1px solid ${C.border}`, borderRadius: 6 }}
        className="px-4 py-3.5 mb-6"
      >
        {requestSent ? (
          <div className="flex items-start gap-3">
            <span style={{ color: C.green.text, marginTop: 1 }}><Icon.check /></span>
            <div>
              <div className="text-[12px] font-medium" style={{ color: C.green.text }}>Request sent to Rohit Kumar (Sales)</div>
              <div className="text-[11px] mt-1" style={{ color: C.textMuted }}>
                An admin makes the change on your KYC record, you'll get a mail once it's done, and the whole exchange is
                recorded in the Order Timeline. Your new address becomes selectable here after KYC approves it.
              </div>
              <div className="text-[11px] mt-2 italic" style={{ color: C.textSubtle }}>"{requestText}"</div>
            </div>
          </div>
        ) : showRequest ? (
          <>
            <Field label="What needs adding or changing?">
              <Textarea
                rows={3}
                value={requestText}
                onChange={e => setRequestText(e.target.value)}
                placeholder="e.g. Please add our new Pune warehouse — Gat 44, Chakan MIDC, Pune 410 501."
              />
            </Field>
            <div className="flex gap-2 mt-3">
              <button onClick={handleSendRequest} className={cls.btnPrimary} style={{ fontSize: 12, padding: '5px 10px' }}>
                Send Request
              </button>
              <button onClick={() => setShowRequest(false)} className={cls.btnSecondary} style={{ fontSize: 12, padding: '5px 10px' }}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[12px] font-medium" style={{ color: C.textSubtle }}>Need an address that isn't listed?</div>
              <div className="text-[11px] mt-0.5" style={{ color: C.textMuted }}>
                Addresses can't be edited here. Ask Sales — an admin updates your KYC record, you get a mail, and it's
                logged in the Order Timeline.
              </div>
            </div>
            <button
              onClick={() => setShowRequest(true)}
              className={cls.btnSecondary}
              style={{ fontSize: 12, padding: '5px 10px', flexShrink: 0 }}
            >
              Ask Sales
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!canConfirm}
        className={`${cls.btnPrimary} w-full justify-center`}
        style={{ padding: '10px', opacity: canConfirm ? 1 : 0.4, cursor: canConfirm ? 'pointer' : 'not-allowed' }}
      >
        Confirm Addresses & Continue
      </button>
      {!canConfirm && (
        <p className="text-[11px] text-center mt-2" style={{ color: C.textMuted }}>
          {!billing && shipping.length === 0
            ? 'Choose a billing address and at least one shipping address.'
            : !billing
              ? 'Choose a billing address.'
              : 'Choose at least one shipping address.'}
        </p>
      )}
    </div>
  )
}
