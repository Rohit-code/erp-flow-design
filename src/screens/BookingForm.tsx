import { useState } from 'react'
import { Screen } from '../types'
import { Field, Input, Select, cls, C, MonoRef, Icon } from '../components/ui'

type UploadState = 'idle' | 'uploading' | 'done'

const DOCS = [
  { id: 'pan', label: 'PAN Card', hint: 'Permanent Account Number (India)' },
  { id: 'reg', label: 'Certificate of Incorporation', hint: 'Ministry of Corporate Affairs' },
  { id: 'gst', label: 'GST Registration Certificate', hint: 'GSTIN document' },
  { id: 'bank', label: 'Bank Proof', hint: 'Cancelled cheque or bank letter' },
  { id: 'iec', label: 'Import Export Code', hint: 'DGFT IEC certificate' },
]

export default function BookingForm({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [uploads, setUploads] = useState<Record<string, UploadState>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleUpload = (id: string) => {
    setUploads(prev => ({ ...prev, [id]: 'uploading' }))
    setTimeout(() => setUploads(prev => ({ ...prev, [id]: 'done' })), 1200)
  }

  const allDone = DOCS.every(d => uploads[d.id] === 'done')

  return (
    <div>
      {/* Expiry banner */}
      <div
        style={{ background: '#231a06', border: '1px solid #854d0e', borderRadius: 6 }}
        className="flex items-center gap-2 px-4 py-2.5 mb-6"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="#fbbf24" strokeWidth="1.2"/><path d="M6.5 3.5v3.5l2 1.5" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round"/></svg>
        <span className="text-[12px]" style={{ color: '#fbbf24' }}>
          Secure one-time link · <strong>Expires 15 Nov 2024 at 09:58 IST</strong> · 23 hours remaining
        </span>
      </div>

      {/* Rate summary (read-only) */}
      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 6 }} className="p-5 mb-6">
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: C.textMuted }}>
          Agreed Rate Summary
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {[
            { label: 'Quotation Ref', value: 'QT-2024-0217', mono: true },
            { label: 'Booking Ref', value: 'BKG-2024-00142', mono: true },
            { label: 'Port of Load', value: 'INNSA — Nhava Sheva, India', mono: false },
            { label: 'Port of Discharge', value: 'CNSHA — Shanghai, China', mono: false },
            { label: 'Equipment', value: '2 × 40ft High Cube', mono: false },
            { label: 'Total All-In Rate', value: 'USD 562 / TEU', mono: true },
          ].map(f => (
            <div key={f.label}>
              <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>{f.label}</div>
              {f.mono
                ? <MonoRef>{f.value}</MonoRef>
                : <span className="text-sm" style={{ color: C.text }}>{f.value}</span>
              }
            </div>
          ))}
        </div>
        <div
          style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <span className="text-[11px]" style={{ color: C.textMuted }}>Rate validity: 7 days · Issued by Apex Logistics</span>
          <div
            style={{ background: C.green.bg, border: '1px solid #166534', borderRadius: 5, padding: '3px 10px' }}
            className="flex items-center gap-1.5"
          >
            <span style={{ width: 6, height: 6, background: '#4ade80', borderRadius: '50%' }} />
            <span className="text-[11px] font-medium" style={{ color: '#4ade80' }}>Rate Accepted</span>
          </div>
        </div>
      </div>

      {/* KYC Intake form */}
      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 6 }} className="p-5 mb-6">
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: C.textMuted }}>
          Company & KYC Details
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Company Legal Name" className="col-span-2">
            <Input defaultValue="Stellar Exports Private Limited" />
          </Field>
          <Field label="Tax / GSTIN">
            <Input mono defaultValue="27AAGCS3460Q1Z5" />
          </Field>
          <Field label="Import Export Code (IEC)">
            <Input mono defaultValue="AAGCS3460Q" />
          </Field>
          <Field label="PAN Number">
            <Input mono defaultValue="AAGCS3460Q" />
          </Field>
          <Field label="CIN / Registration Number">
            <Input mono defaultValue="U74999MH2018PTC312456" />
          </Field>
          <Field label="Registered Address" className="col-span-2">
            <Input defaultValue="Plot 14, SEEPZ SEZ, Andheri East, Mumbai – 400 096" />
          </Field>
          <Field label="City">
            <Input defaultValue="Mumbai" />
          </Field>
          <Field label="PIN / Postal Code">
            <Input defaultValue="400 096" />
          </Field>
          <Field label="Country">
            <Select defaultValue="India">
              <option>India</option>
              <option>Singapore</option>
              <option>UAE</option>
            </Select>
          </Field>
        </div>
      </div>

      {/* Bank details */}
      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 6 }} className="p-5 mb-6">
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: C.textMuted }}>
          Bank Details
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Account Holder Name">
            <Input defaultValue="Stellar Exports Private Limited" />
          </Field>
          <Field label="Bank Name">
            <Input defaultValue="HDFC Bank Ltd" />
          </Field>
          <Field label="Account Number">
            <Input mono defaultValue="50100426789012" />
          </Field>
          <Field label="IFSC Code">
            <Input mono defaultValue="HDFC0001234" />
          </Field>
        </div>
      </div>

      {/* Document upload */}
      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 6 }} className="p-5 mb-6">
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: C.textMuted }}>
          Supporting Documents
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {DOCS.map(doc => {
            const state = uploads[doc.id] || 'idle'
            return (
              <button
                key={doc.id}
                onClick={() => handleUpload(doc.id)}
                style={{
                  background: state === 'done' ? C.green.bg : '#1c1e26',
                  border: `1px solid ${state === 'done' ? '#166534' : state === 'uploading' ? C.accentDim : C.border}`,
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
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    {state === 'done'
                      ? <span style={{ color: '#4ade80' }}><Icon.check /></span>
                      : state === 'uploading'
                      ? <span style={{ color: C.accentDim }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin">
                            <circle cx="8" cy="8" r="6" stroke={C.accentDim} strokeWidth="1.5" strokeDasharray="25 15"/>
                          </svg>
                        </span>
                      : <span style={{ color: C.textMuted }}><Icon.upload /></span>
                    }
                  </div>
                  {state === 'done' && <span style={{ background: C.green.bg, color: '#4ade80', borderRadius: 3, fontSize: 9, padding: '1px 5px', fontWeight: 600 }}>UPLOADED</span>}
                </div>
                <div className="text-[12px] font-medium" style={{ color: state === 'done' ? '#4ade80' : C.text }}>{doc.label}</div>
                <div className="text-[10px] mt-0.5" style={{ color: C.textMuted }}>{doc.hint}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Submit */}
      {submitted ? (
        <div style={{ background: C.green.bg, border: '1px solid #166534', borderRadius: 6 }} className="flex items-center gap-3 px-4 py-4">
          <div style={{ width: 36, height: 36, borderRadius: 6, background: '#14532d' }} className="flex items-center justify-center flex-shrink-0">
            <Icon.check />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: '#4ade80' }}>Submitted successfully</div>
            <div className="text-[12px] mt-0.5" style={{ color: '#86efac' }}>
              Your KYC details are under review. You will be notified at nisha@stellarexports.in once approved.
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setSubmitted(true)}
          className={`${cls.btnPrimary} w-full justify-center py-3`}
          style={{ fontSize: 14 }}
        >
          Submit KYC & Booking Details
        </button>
      )}
    </div>
  )
}
