import { useState } from 'react'
import { Screen } from '../types'
import { Field, Input, Select, PageHeader, SectionCard, cls, C, Icon } from '../components/ui'

const DOCS = [
  { id: 'gst', label: 'GST Certificate' },
  { id: 'iec', label: 'IEC Certificate' },
  { id: 'pan', label: 'PAN Card' },
]

export default function KYCForm({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div>
      <PageHeader
        title="Complete Your KYC/KYV"
        subtitle="One-time company verification before your first booking is confirmed."
      />

      {submitted && (
        <div
          style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }}
          className="flex items-start gap-3 px-4 py-3 mb-5"
        >
          <span style={{ color: C.green.text, marginTop: 1 }}><Icon.check /></span>
          <div>
            <div className="text-sm font-medium" style={{ color: C.green.text }}>KYC submitted</div>
            <div className="text-[12px] mt-0.5" style={{ color: '#86efac' }}>
              Most checks auto-verify within minutes; you'll be notified once approved. Nothing is auto-declined — a person reviews anything that doesn't clear automatically.
            </div>
            <button onClick={() => onNavigate('address-select')} className={`${cls.btnPrimary} mt-3`}>
              Continue →
            </button>
          </div>
        </div>
      )}

      <SectionCard title="Company Details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Legal Name" className="col-span-2">
            <Input defaultValue="Stellar Exports Pvt Ltd" />
          </Field>
          <Field label="GSTIN / Tax ID">
            <Input mono defaultValue="27AAGCS3460Q1Z5" />
          </Field>
          <Field label="IEC Code">
            <Input mono placeholder="AAGCS3460Q" />
          </Field>
          <Field label="Nature of Business" className="col-span-2">
            <Select defaultValue="Exporter">
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
            <Input placeholder="Plot no., street, area" />
          </Field>
          <Field label="City">
            <Input placeholder="Mumbai" />
          </Field>
          <Field label="State">
            <Input placeholder="Maharashtra" />
          </Field>
          <Field label="PIN / ZIP">
            <Input placeholder="400 096" />
          </Field>
          <Field label="Country">
            <Select defaultValue="India">
              <option>India</option>
              <option>Singapore</option>
              <option>UAE</option>
            </Select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Document Upload">
        <div className="space-y-3">
          {DOCS.map(doc => (
            <div
              key={doc.id}
              style={{ border: `1px dashed ${C.border}`, borderRadius: 6 }}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span style={{ color: C.textMuted }}><Icon.upload /></span>
                <span className="text-sm" style={{ color: C.text }}>{doc.label}</span>
              </div>
              <button className={cls.btnSecondary} style={{ fontSize: 12, padding: '5px 10px' }}>
                Choose File
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {!submitted && (
        <div className="flex justify-end pt-2">
          <button onClick={() => setSubmitted(true)} className={cls.btnPrimary}>
            Submit for Verification
          </button>
        </div>
      )}
    </div>
  )
}
