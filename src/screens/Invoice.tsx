import { useState } from 'react'
import { Screen, Role, Session } from '../types'
import { useBooking } from '../state/BookingContext'
import { Field, Input, PageHeader, SectionCard, cls, C, Badge, MonoRef, Icon } from '../components/ui'
import { BOOKING_CHARGES, BOOKING_GROSS, BOOKING } from '../data/booking'
import { money, RATE_UNIT } from '../data/pricing'

// Charges come from the agreed rate, split the same way the quotation splits it.
// Neither this screen nor the quotation may invent its own numbers.
const CHARGES = [
  { label: 'Ocean Freight', rate: BOOKING_CHARGES.ocean },
  { label: 'BAF', rate: BOOKING_CHARGES.baf },
  { label: 'CAF', rate: BOOKING_CHARGES.caf },
]

export default function Invoice({ role, session, onNavigate }: { role: Role; session: Session; onNavigate: (s: Screen) => void }) {
  const { booking, actions } = useBooking()
  const [showBankTransfer, setShowBankTransfer] = useState(false)
  const [refNumber, setRefNumber] = useState('')

  const released = booking.invoiceReleased
  // Standing credit is an attribute of the customer's account, set by Finance.
  // The customer can see it; they can never set it.
  const standingCredit = booking.hasStandingCredit
  const isCustomer = role === 'customer'
  const settled = booking.paymentStatus === 'paid' || booking.paymentStatus === 'standing-credit'

  const handleBankTransferSubmit = () => {
    if (refNumber.trim()) actions.recordPayment(refNumber.trim(), session.name)
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb="Invoice"
        title="Invoice"
        subtitle={`${BOOKING.id} · ${BOOKING.customer} · ${BOOKING.pol} → ${BOOKING.pod}`}
        actions={<Badge variant={settled ? 'paid' : released ? 'sent' : 'draft'} label={settled ? 'Settled' : released ? 'Released' : 'Draft'} />}
      />

      <SectionCard title="Charges">
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            ...CHARGES.map(c => ({ label: c.label, value: `USD ${c.rate}` })),
            { label: 'Total All-In', value: `USD ${BOOKING.agreedRate}` },
          ].map((r, i) => (
            <div
              key={i}
              style={{ background: i === 3 ? '#0d1d35' : 'transparent', border: i === 3 ? '1px solid #1e3a5f' : 'none', borderRadius: 6, padding: i === 3 ? '10px 14px' : '0 14px 0 0', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}
            >
              <div className={cls.sectionTitle} style={{ marginBottom: 4 }}>{r.label}</div>
              <div className="font-mono text-[15px] font-medium" style={{ color: i === 3 ? C.accentDim : C.text }}>
                {r.value} <span className="text-[11px] font-normal" style={{ color: C.textMuted }}>/ {RATE_UNIT}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 text-[12px] mb-3" style={{ color: C.textMuted }}>
          <span>Equipment: <strong style={{ color: C.textSubtle }}>{BOOKING.equipment}</strong></span>
          <span>Quotation: <MonoRef>{BOOKING.quotationId}</MonoRef></span>
          <span>Ref: <MonoRef>{BOOKING.id}</MonoRef></span>
        </div>
        <div style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }} className="p-4">
          <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: C.textMuted }}>
            Extended Total — {BOOKING.containerCount} containers × USD {BOOKING.agreedRate}
          </div>
          <div className="font-mono text-[18px] font-semibold" style={{ color: C.accentDim }}>
            {money(BOOKING_GROSS)}
          </div>
        </div>
      </SectionCard>

      {/* Standing credit — an account fact, not a choice made here */}
      <SectionCard title="Payment Terms">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[13px] font-medium" style={{ color: C.text }}>
                {standingCredit ? 'Standing credit with Maxicon' : 'Payment required before MBL release'}
              </span>
              <Badge
                variant={standingCredit ? 'approved' : 'pending'}
                label={standingCredit ? 'Standing Credit' : 'Pay Per Booking'}
              />
            </div>
            <div className="text-[12px]" style={{ color: C.textMuted }}>
              {standingCredit
                ? 'This account settles on credit terms, so the MBL releases once the invoice is raised — no payment is collected on this booking.'
                : 'This account has no standing credit, so payment must clear before the MBL is released.'}
            </div>
            <div className="text-[11px] mt-1.5" style={{ color: C.textMuted }}>
              Set by Finance on the customer account — it is not a choice made on this booking, by Ops or by the customer.
            </div>
          </div>
          {!isCustomer && !settled && (
            <button
              onClick={() => actions.setStandingCredit(!standingCredit, session.name)}
              className={cls.btnSecondary}
              style={{ fontSize: 11, padding: '4px 9px', flexShrink: 0 }}
            >
              Simulate: {standingCredit ? 'no credit' : 'standing credit'}
            </button>
          )}
        </div>
      </SectionCard>

      <div style={{ background: C.amber.bg, border: `1px solid ${C.amber.border}`, borderRadius: 6 }} className="flex items-start gap-3 px-4 py-3 mb-5">
        <span style={{ color: C.amber.text, marginTop: 1 }}><Icon.warning /></span>
        <div className="text-[12px]" style={{ color: C.amber.text }}>
          Payment reconciliation path — link vs. bank transfer — is not finalized yet. This is an acknowledged open gap, not a bug.
        </div>
      </div>

      {!isCustomer && !released && (
        <div className="flex items-center gap-3 pt-1 mb-5">
          <button
            onClick={() => actions.releaseInvoice(session.name)}
            disabled={booking.blStatus !== 'approved'}
            className={cls.btnPrimary}
            style={booking.blStatus !== 'approved' ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
          >
            Release Invoice
          </button>
          {booking.blStatus !== 'approved' && (
            <span className="text-[11px]" style={{ color: C.amber.text }}>
              Freight is raised once the BL is confirmed — the draft has not been approved yet.
            </span>
          )}
        </div>
      )}

      {!isCustomer && released && (
        <div style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }} className="flex items-center gap-2 px-4 py-3 mb-5">
          <Icon.check />
          <span className="text-sm font-medium" style={{ color: C.green.text }}>
            Invoice released to customer{standingCredit ? ' — settles on standing credit, no payment collected' : ''}
          </span>
        </div>
      )}

      {isCustomer && !released && (
        <SectionCard title="Not Yet Released">
          <p className="text-[13px]" style={{ color: C.textMuted }}>
            This invoice hasn't been released yet. You'll be notified by mail when it is, and it will appear here.
          </p>
        </SectionCard>
      )}

      {isCustomer && released && !standingCredit && !settled && (
        <SectionCard title="Payment">
          <div className="grid grid-cols-2 gap-3">
            <button disabled className={cls.btnSecondary} style={{ opacity: 0.5, cursor: 'not-allowed', justifyContent: 'center' }}>
              Pay via Link — gateway not wired yet
            </button>
            {!showBankTransfer ? (
              <button onClick={() => setShowBankTransfer(true)} className={cls.btnPrimary} style={{ justifyContent: 'center' }}>
                I've Completed Bank Transfer
              </button>
            ) : (
              <div className="col-span-2">
                <Field label="Bank Transfer Reference Number">
                  <Input value={refNumber} onChange={e => setRefNumber(e.target.value)} placeholder="e.g. UTR / transaction ref" />
                </Field>
                <button
                  onClick={handleBankTransferSubmit}
                  disabled={!refNumber.trim()}
                  className={cls.btnPrimary}
                  style={{ marginTop: 10, opacity: refNumber.trim() ? 1 : 0.4, cursor: refNumber.trim() ? 'pointer' : 'not-allowed' }}
                >
                  Submit Reference
                </button>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {settled && (
        <div
          style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }}
          className="flex items-center justify-between px-4 py-3 mt-2"
        >
          <div className="flex items-center gap-2">
            <Icon.check />
            <span className="text-sm font-medium" style={{ color: C.green.text }}>
              {standingCredit
                ? `Settled on standing credit — ${money(BOOKING_GROSS)} billed to the account`
                : `Payment recorded — ${money(BOOKING_GROSS)}`}
            </span>
          </div>
          <button onClick={() => onNavigate('mbl-release')} className={cls.btnPrimary} style={{ fontSize: 12, padding: '5px 10px' }}>
            Continue to MBL →
          </button>
        </div>
      )}
    </div>
  )
}
