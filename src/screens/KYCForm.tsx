import { useState } from 'react'
import { Screen, Session } from '../types'
import { useBooking } from '../state/BookingContext'
import { Field, Input, Select, PageHeader, SectionCard, cls, C, Badge, Icon } from '../components/ui'

// KYC/KYV — the heavy compliance step. This runs AFTER a rate has been agreed,
// inside the portal, not at first contact: nobody uploads a cancelled cheque
// before they know the price. Registration (see Register.tsx) captured only a
// phone number and a password.
//
// The flow branches here: a brand-new customer fills the form from scratch; a
// returning customer sees their saved data pre-filled and only confirms it.

type UploadState = 'idle' | 'uploading' | 'done'
type Mode = 'new' | 'existing'

const DOCS = [
  { id: 'pan', label: 'PAN Card', hint: 'Permanent Account Number (India)' },
  { id: 'reg', label: 'Certificate of Incorporation', hint: 'Ministry of Corporate Affairs' },
  { id: 'gst', label: 'GST Registration Certificate', hint: 'GSTIN document' },
  { id: 'bank', label: 'Bank Proof', hint: 'Cancelled cheque or bank letter' },
  { id: 'iec', label: 'Import Export Code', hint: 'DGFT IEC certificate' },
]

// What a returning customer already has on file — pre-filled, not re-typed.
const SAVED = {
  legalName: 'Stellar Exports Private Limited',
  gstin: '27AAGCS3460Q1Z5',
  iec: 'AAGCS3460Q',
  pan: 'AAGCS3460Q',
  cin: 'U74999MH2018PTC312456',
  nature: 'Exporter',
  address: 'Plot 14, SEEPZ SEZ, Andheri East',
  city: 'Mumbai',
  state: 'Maharashtra',
  pin: '400 096',
  country: 'India',
  accountHolder: 'Stellar Exports Private Limited',
  bankName: 'HDFC Bank Ltd',
  accountNumber: '50100426789012',
  ifsc: 'HDFC0001234',
}

const EMPTY = Object.fromEntries(Object.keys(SAVED).map(k => [k, ''])) as typeof SAVED

export default function KYCForm({ session, onNavigate }: { session: Session; onNavigate: (s: Screen) => void }) {
  const { booking, actions } = useBooking()
  // In a real build this comes from the customer record. Here it's switchable so
  // both branches of the flow can be walked in a demo.
  const [mode, setMode] = useState<Mode>('existing')
  const [uploads, setUploads] = useState<Record<string, UploadState>>(
    mode === 'existing' ? Object.fromEntries(DOCS.map(d => [d.id, 'done' as UploadState])) : {}
  )
  const submitted = booking.kycStatus !== 'not-started'

  const v = mode === 'existing' ? SAVED : EMPTY

  const switchMode = (next: Mode) => {
    setMode(next)
    setUploads(next === 'existing' ? Object.fromEntries(DOCS.map(d => [d.id, 'done' as UploadState])) : {})
  }

  const handleUpload = (id: string) => {
    setUploads(prev => ({ ...prev, [id]: 'uploading' }))
    setTimeout(() => setUploads(prev => ({ ...prev, [id]: 'done' })), 900)
  }

  const uploadedCount = DOCS.filter(d => uploads[d.id] === 'done').length
  const allUploaded = uploadedCount === DOCS.length

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb="Booking BKG-2024-00142"
        title="KYC / KYV Verification"
        subtitle="Company verification — required before your booking can be accepted."
        actions={<Badge variant={mode === 'existing' ? 'approved' : 'pending'} label={mode === 'existing' ? 'Returning Customer' : 'New Customer'} />}
      />

      {/* The New vs Existing branch */}
      <div
        style={{
          background: mode === 'existing' ? C.green.bg : C.blue.bg,
          border: `1px solid ${mode === 'existing' ? C.green.border : C.blue.border}`,
          borderRadius: 6,
        }}
        className="flex items-start justify-between gap-3 px-4 py-3.5 mb-5"
      >
        <div className="flex items-start gap-3">
          <span style={{ color: mode === 'existing' ? C.green.text : C.blue.text, marginTop: 1 }}>
            {mode === 'existing' ? <Icon.check /> : <Icon.warning />}
          </span>
          <div className="text-[12px]" style={{ color: mode === 'existing' ? C.green.text : C.blue.text }}>
            {mode === 'existing' ? (
              <>
                <strong>Pre-filled from your saved details.</strong> Check everything below and submit — you only need to
                re-upload a document if one has expired.
              </>
            ) : (
              <>
                <strong>First booking with us.</strong> We need your company details and five documents. This is a one-time
                step — future bookings reuse it.
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => switchMode(mode === 'existing' ? 'new' : 'existing')}
          className={cls.btnSecondary}
          style={{ fontSize: 11, padding: '4px 9px', flexShrink: 0 }}
        >
          Simulate: {mode === 'existing' ? 'new' : 'returning'} customer
        </button>
      </div>

      {submitted && (
        <div
          style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }}
          className="flex items-start gap-3 px-4 py-3.5 mb-5"
        >
          <span style={{ color: C.green.text, marginTop: 1 }}><Icon.check /></span>
          <div>
            <div className="text-sm font-medium" style={{ color: C.green.text }}>KYC submitted</div>
            <div className="text-[12px] mt-0.5" style={{ color: '#86efac' }}>
              Most checks auto-verify within minutes. Nothing is auto-declined — anything that doesn't clear automatically
              is reviewed by a person. Next: choose your addresses for this booking.
            </div>
            <button onClick={() => onNavigate('address-select')} className={`${cls.btnPrimary} mt-3`}>
              Continue to Addresses →
            </button>
          </div>
        </div>
      )}

      <SectionCard title="Company Details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Legal Name (as on GST certificate)" className="col-span-2">
            <Input defaultValue={v.legalName} placeholder="Full registered legal name" key={`legal-${mode}`} />
          </Field>
          <Field label="GSTIN / Tax ID">
            <Input mono defaultValue={v.gstin} placeholder="27AAGCS3460Q1Z5" key={`gst-${mode}`} />
          </Field>
          <Field label="Import Export Code (IEC)">
            <Input mono defaultValue={v.iec} placeholder="AAGCS3460Q" key={`iec-${mode}`} />
          </Field>
          <Field label="PAN Number">
            <Input mono defaultValue={v.pan} placeholder="AAGCS3460Q" key={`pan-${mode}`} />
          </Field>
          <Field label="CIN / Registration Number">
            <Input mono defaultValue={v.cin} placeholder="U74999MH2018PTC312456" key={`cin-${mode}`} />
          </Field>
          <Field label="Nature of Business" className="col-span-2">
            <Select defaultValue={v.nature || 'Exporter'} key={`nat-${mode}`}>
              <option>Manufacturer</option>
              <option>Trader</option>
              <option>Exporter</option>
              <option>Freight Forwarder</option>
            </Select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Registered Address">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Address Line" className="col-span-2">
            <Input defaultValue={v.address} placeholder="Plot no., street, area" key={`addr-${mode}`} />
          </Field>
          <Field label="City">
            <Input defaultValue={v.city} placeholder="Mumbai" key={`city-${mode}`} />
          </Field>
          <Field label="State">
            <Input defaultValue={v.state} placeholder="Maharashtra" key={`state-${mode}`} />
          </Field>
          <Field label="PIN / ZIP">
            <Input defaultValue={v.pin} placeholder="400 096" key={`pin-${mode}`} />
          </Field>
          <Field label="Country">
            <Select defaultValue={v.country || 'India'} key={`ctry-${mode}`}>
              <option>India</option>
              <option>Singapore</option>
              <option>UAE</option>
            </Select>
          </Field>
        </div>
        <p className="text-[11px] mt-3" style={{ color: C.textMuted }}>
          This is your registered address. Billing and shipping addresses for each booking are chosen separately, in the
          next step — and saved here for reuse.
        </p>
      </SectionCard>

      <SectionCard title="Bank Details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Account Holder Name">
            <Input defaultValue={v.accountHolder} placeholder="Registered account name" key={`ah-${mode}`} />
          </Field>
          <Field label="Bank Name">
            <Input defaultValue={v.bankName} placeholder="HDFC Bank Ltd" key={`bank-${mode}`} />
          </Field>
          <Field label="Account Number">
            <Input mono defaultValue={v.accountNumber} placeholder="50100426789012" key={`acct-${mode}`} />
          </Field>
          <Field label="IFSC Code">
            <Input mono defaultValue={v.ifsc} placeholder="HDFC0001234" key={`ifsc-${mode}`} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title={`Supporting Documents — ${uploadedCount} of ${DOCS.length}`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {DOCS.map(doc => {
            const state = uploads[doc.id] || 'idle'
            return (
              <button
                key={doc.id}
                onClick={() => state === 'idle' && handleUpload(doc.id)}
                style={{
                  background: state === 'done' ? C.green.bg : '#1c1e26',
                  border: `1px solid ${state === 'done' ? C.green.border : state === 'uploading' ? C.accentDim : C.border}`,
                  borderRadius: 6, padding: '14px 12px', textAlign: 'left',
                  cursor: state === 'done' ? 'default' : 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: 6,
                      background: state === 'done' ? '#14532d' : '#252830',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {state === 'done'
                      ? <span style={{ color: C.green.text }}><Icon.check /></span>
                      : state === 'uploading'
                      ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin">
                          <circle cx="8" cy="8" r="6" stroke={C.accentDim} strokeWidth="1.5" strokeDasharray="25 15"/>
                        </svg>
                      : <span style={{ color: C.textMuted }}><Icon.upload /></span>
                    }
                  </div>
                  {state === 'done' && (
                    <span style={{ background: C.green.bg, color: C.green.text, borderRadius: 3, fontSize: 9, padding: '1px 5px', fontWeight: 600 }}>
                      {mode === 'existing' ? 'ON FILE' : 'UPLOADED'}
                    </span>
                  )}
                </div>
                <div className="text-[12px] font-medium" style={{ color: state === 'done' ? C.green.text : C.text }}>{doc.label}</div>
                <div className="text-[10px] mt-0.5" style={{ color: C.textMuted }}>{doc.hint}</div>
              </button>
            )
          })}
        </div>
      </SectionCard>

      {!submitted && (
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => actions.submitKyc(session.name)}
            disabled={!allUploaded}
            className={cls.btnPrimary}
            style={!allUploaded ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
          >
            Submit for Verification
          </button>
          {!allUploaded && (
            <span className="text-[11px]" style={{ color: C.amber.text }}>
              {DOCS.length - uploadedCount} document{DOCS.length - uploadedCount === 1 ? '' : 's'} still to upload.
            </span>
          )}
        </div>
      )}
    </div>
  )
}
