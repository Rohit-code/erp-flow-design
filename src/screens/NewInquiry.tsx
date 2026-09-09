import { useState } from 'react'
import { Screen } from '../types'
import { Field, Input, Select, PageHeader, SectionCard, cls, C, Icon } from '../components/ui'

type ContainerRow = { type: string; qty: number }

export default function NewInquiry({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [pol, setPol] = useState('INNSA')
  const [pod, setPod] = useState('CNSHA')
  const [containers, setContainers] = useState<ContainerRow[]>([
    { type: '40ft High Cube', qty: 2 },
  ])
  const [senderName, setSenderName] = useState('Nisha Patel')
  const [senderEmail, setSenderEmail] = useState('nisha@stellarexports.in')
  const [submitted, setSubmitted] = useState(false)
  const [matchResult, setMatchResult] = useState<'existing' | 'new' | null>(null)

  const addContainer = () => setContainers(prev => [...prev, { type: '20ft Dry', qty: 1 }])
  const removeContainer = (i: number) => setContainers(prev => prev.filter((_, idx) => idx !== i))
  const updateContainer = (i: number, field: keyof ContainerRow, value: string | number) =>
    setContainers(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c))

  const handleSave = () => {
    setSubmitted(true)
    setMatchResult(senderEmail.includes('stellarexports') ? 'existing' : 'new')
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        breadcrumb="Inquiries"
        title="New Inquiry"
        subtitle="Create a new freight inquiry from customer contact"
        actions={
          <button onClick={handleSave} className={cls.btnPrimary}>
            <Icon.check /> Save Inquiry
          </button>
        }
      />

      {submitted && matchResult === 'existing' && (
        <div
          style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }}
          className="flex items-start gap-3 px-4 py-3 mb-5"
        >
          <span style={{ color: C.green.text, marginTop: 1 }}><Icon.check /></span>
          <div>
            <div className="text-sm font-medium" style={{ color: C.green.text }}>Existing customer matched</div>
            <div className="text-[12px] mt-0.5" style={{ color: '#6ee7b7' }}>
              Stellar Exports Pvt Ltd · <span className="font-mono">CUST-0042</span> — KYC approved, billing address on file.
            </div>
          </div>
        </div>
      )}

      {submitted && matchResult === 'new' && (
        <div
          style={{ background: '#231a06', border: '1px solid #854d0e', borderRadius: 6 }}
          className="flex items-start gap-3 px-4 py-3 mb-5"
        >
          <span style={{ color: '#fbbf24', marginTop: 1 }}><Icon.warning /></span>
          <div>
            <div className="text-sm font-medium" style={{ color: '#fbbf24' }}>New customer — will be created</div>
            <div className="text-[12px] mt-0.5" style={{ color: '#fde68a' }}>
              No existing record for this email. A draft customer record will be created and KYC intake will be triggered.
            </div>
          </div>
        </div>
      )}

      <SectionCard title="Route">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Port of Load (POL)">
            <Input
              value={pol}
              onChange={e => setPol(e.target.value.toUpperCase().slice(0, 5))}
              mono
              placeholder="INNSA"
              maxLength={5}
            />
            <div className="text-[11px] mt-1" style={{ color: C.textMuted }}>5-letter UN/LOCODE</div>
          </Field>
          <Field label="Port of Discharge (POD)">
            <Input
              value={pod}
              onChange={e => setPod(e.target.value.toUpperCase().slice(0, 5))}
              mono
              placeholder="CNSHA"
              maxLength={5}
            />
            <div className="text-[11px] mt-1" style={{ color: C.textMuted }}>5-letter UN/LOCODE</div>
          </Field>
        </div>

        {pol.length === 5 && pod.length === 5 && (
          <div
            style={{ background: '#0d1d35', border: '1px solid #1e3a5f', borderRadius: 5 }}
            className="flex items-center gap-3 px-4 py-2.5 mt-4"
          >
            <span className="font-mono text-[13px]" style={{ color: '#93c5fd' }}>{pol}</span>
            <svg width="60" height="10" viewBox="0 0 60 10" fill="none"><path d="M0 5h55M50 1l5 4-5 4" stroke="#3d5a8a" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <span className="font-mono text-[13px]" style={{ color: '#93c5fd' }}>{pod}</span>
            <span className="text-[11px] ml-2" style={{ color: '#5a7ca0' }}>Trade lane verified</span>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Container Requirements"
        action={
          <button onClick={addContainer} className={cls.btnSecondary} style={{ fontSize: 12, padding: '4px 10px' }}>
            <Icon.plus /> Add
          </button>
        }
      >
        <div className="space-y-2">
          {/* Header */}
          <div className="grid gap-3 px-1 mb-1" style={{ gridTemplateColumns: '1fr 120px 40px' }}>
            <span className={cls.sectionTitle} style={{ marginBottom: 0 }}>Container Type</span>
            <span className={cls.sectionTitle} style={{ marginBottom: 0 }}>Quantity</span>
          </div>

          {containers.map((c, i) => (
            <div key={i} className="grid gap-3 items-center" style={{ gridTemplateColumns: '1fr 120px 40px' }}>
              <Select
                value={c.type}
                onChange={e => updateContainer(i, 'type', e.target.value)}
              >
                <option>20ft Dry</option>
                <option>40ft Dry</option>
                <option>40ft High Cube</option>
                <option>20ft Reefer</option>
                <option>40ft Reefer</option>
                <option>20ft Open Top</option>
                <option>40ft Flat Rack</option>
              </Select>
              <Input
                type="number"
                min={1}
                value={c.qty}
                onChange={e => updateContainer(i, 'qty', parseInt(e.target.value) || 1)}
              />
              <button
                onClick={() => removeContainer(i)}
                className="flex items-center justify-center rounded transition-colors"
                style={{ width: 32, height: 36, color: '#5a6174', background: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5a6174')}
                disabled={containers.length === 1}
              >
                <Icon.trash />
              </button>
            </div>
          ))}

          <div className="pt-2" style={{ borderTop: `1px solid ${C.border}` }}>
            <span className="text-[12px]" style={{ color: C.textMuted }}>
              Total: <strong style={{ color: C.textSubtle }}>{containers.reduce((s, c) => s + c.qty, 0)} TEU</strong>
            </span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Customer Contact">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Sender Name">
            <Input value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Sender Email">
            <Input type="email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} placeholder="email@company.com" />
          </Field>
        </div>
        <Field label="Notes / Additional Requirements" className="mt-4">
          <textarea
            className={`${cls.input} resize-none`}
            rows={3}
            placeholder="Any specific requirements, commodity details, or scheduling constraints…"
            style={{ lineHeight: '1.6' }}
          />
        </Field>
      </SectionCard>

      <div className="flex justify-end gap-2 pt-2">
        <button className={cls.btnSecondary}>Save Draft</button>
        <button
          onClick={handleSave}
          className={cls.btnPrimary}
          onMouseEnter={e => e.currentTarget.style.background = '#4a62e4'}
          onMouseLeave={e => e.currentTarget.style.background = '#5b73f5'}
        >
          <Icon.check /> Save & Route to AI Review
        </button>
      </div>

      {submitted && (
        <div className="flex justify-end mt-3">
          <button
            onClick={() => onNavigate('inquiry-detail')}
            className="text-sm transition-colors"
            style={{ color: C.accentDim }}
          >
            View Inquiry Detail →
          </button>
        </div>
      )}
    </div>
  )
}
