import { useState } from 'react'
import { Screen, Session } from '../types'
import { useBooking } from '../state/BookingContext'
import { Field, Input, cls, C, MonoRef, Icon } from '../components/ui'

// The magic-link landing page. Sales replies to the customer's first mail with
// their answer plus this link; opening it creates the portal account. It is the
// only screen a customer sees before they have a portal, so PortalShell renders
// it without navigation — there is nothing to navigate to yet.
//
// Deliberately light. Everything heavy (legal name, GSTIN, IEC, PAN, CIN, bank
// details, documents) belongs to KYC, which happens much later — after a rate
// has been agreed. Nobody uploads a cancelled cheque before they have a price.
//
// Name and company are shown, not asked: the AI already extracted both from the
// customer's original mail. Re-typing them is how the day-one spelling drifts
// away from the GST certificate.

// What Sales already knows, carried over from the parsed enquiry mail.
const KNOWN = {
  email: 'nisha@stellarexports.in',
  contactName: 'Nisha Patel',
  company: 'Stellar Exports Pvt Ltd',
  inquiryRef: 'INQ-2024-0391',
  salesRep: 'Rohit Kumar',
}

export default function Register({ session, onNavigate }: { session: Session; onNavigate: (s: Screen) => void }) {
  const { booking, actions } = useBooking()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const done = booking.customerRegistered

  const tooShort = password.length > 0 && password.length < 8
  const mismatch = confirm.length > 0 && confirm !== password
  const canSubmit = password.length >= 8 && confirm === password

  const handleSubmit = () => {
    if (canSubmit) actions.registerCustomer(session.name)
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto pt-10">
        <div style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 8 }} className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 38, height: 38, borderRadius: 8, background: '#14532d' }} className="flex items-center justify-center flex-shrink-0">
              <Icon.check />
            </div>
            <div>
              <div className="font-semibold" style={{ color: C.green.text }}>Account created</div>
              <div className="text-[12px]" style={{ color: '#86efac' }}>
                You're signed in. From here on, everything happens in this portal.
              </div>
            </div>
          </div>
          <p className="text-[12px] mb-4" style={{ color: '#86efac' }}>
            {KNOWN.salesRep} has replied to your enquiry <MonoRef>{KNOWN.inquiryRef}</MonoRef>. We'll email you whenever
            there's something new — but the message itself always lives here, never in the mail.
          </p>
          <button onClick={() => onNavigate('quotation')} className={`${cls.btnPrimary} w-full justify-center py-2.5`}>
            Go to your enquiry →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto pt-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1" style={{ color: C.text }}>Set up your account</h1>
        <p className="text-sm" style={{ color: C.textMuted }}>
          {KNOWN.salesRep} has replied to your enquiry. Choose a password to open your portal — that's the only thing we
          need from you right now. No forms, no documents.
        </p>
      </div>

      {/* Link validity is shown once, in the portal header — not repeated here. */}

      {/* What we already know — shown, never re-typed */}
      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 6 }} className="p-4 mb-4">
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: C.textMuted }}>
          From your enquiry
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'Email', value: KNOWN.email, mono: true },
            { label: 'Contact', value: KNOWN.contactName, mono: false },
            { label: 'Company', value: KNOWN.company, mono: false },
          ].map(f => (
            <div key={f.label} className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest font-medium" style={{ color: C.textMuted }}>{f.label}</span>
              {f.mono
                ? <MonoRef>{f.value}</MonoRef>
                : <span className="text-[13px]" style={{ color: C.text }}>{f.value}</span>
              }
            </div>
          ))}
        </div>
        <p className="text-[11px] mt-3 pt-3" style={{ color: C.textMuted, borderTop: `1px solid ${C.border}` }}>
          Taken from your original mail. Your company's <strong style={{ color: C.textSubtle }}>legal</strong> name and tax
          details are collected later, at verification — not here. Something wrong?{' '}
          <span style={{ color: C.accentDim, cursor: 'pointer' }}>Tell {KNOWN.salesRep.split(' ')[0]}</span>.
        </p>
      </div>

      {/* The only things we ask for */}
      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 6 }} className="p-4 mb-5">
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: C.textMuted }}>
          Choose a password
        </div>

        <Field label="Password" className="mb-4">
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
          {tooShort && (
            <div className="text-[11px] mt-1" style={{ color: C.red.text }}>Use at least 8 characters.</div>
          )}
        </Field>

        <Field label="Confirm password">
          <Input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
          />
          {mismatch && (
            <div className="text-[11px] mt-1" style={{ color: C.red.text }}>Passwords don't match.</div>
          )}
        </Field>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`${cls.btnPrimary} w-full justify-center py-3`}
        style={{ fontSize: 14, opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
      >
        Create Account & Open Portal
      </button>

      <p className="text-[11px] text-center mt-4" style={{ color: C.textMuted }}>
        We'll email you when there's an update — the message itself always lives in the portal.
      </p>
    </div>
  )
}
