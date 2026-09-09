import { useState } from 'react'
import { Screen, Role } from '../types'
import { Field, Textarea, PageHeader, SectionCard, cls, C, Badge, MonoRef, Icon } from '../components/ui'

type Status = 'drafted' | 'changes-requested' | 'approved'

const DRAFT_FIELDS: { label: string; value: string; mono?: boolean }[] = [
  { label: 'Shipper', value: 'Stellar Exports Pvt Ltd, Mumbai, India' },
  { label: 'Consignee', value: 'Shanghai Huaxin Trading Co., Ltd, Pudong, Shanghai, China' },
  { label: 'Notify Party', value: 'Shanghai Huaxin Trading Co., Ltd, Pudong, Shanghai, China' },
  { label: 'Route', value: 'INNSA → CNSHA' },
  { label: 'Vessel / Voyage', value: 'MSC Gulsun / 2411E' },
  { label: 'Booking Ref', value: 'BKG-2024-00142', mono: true },
]

export default function BLDraft({ role, onNavigate }: { role: Role; onNavigate: (s: Screen) => void }) {
  const [status, setStatus] = useState<Status>('drafted')
  const [changeNote, setChangeNote] = useState('')
  const [noteDraft, setNoteDraft] = useState('')
  const [showChangeForm, setShowChangeForm] = useState(false)

  const isCustomer = role === 'customer'

  const badgeFor = (s: Status) =>
    s === 'approved'
      ? { variant: 'approved' as const, label: 'Approved' }
      : s === 'changes-requested'
      ? { variant: 'countered' as const, label: 'Changes Requested' }
      : { variant: 'draft' as const, label: 'Drafted' }

  const handleApprove = () => setStatus('approved')

  const handleSubmitChanges = () => {
    if (!noteDraft.trim()) return
    setChangeNote(noteDraft.trim())
    setStatus('changes-requested')
    setShowChangeForm(false)
    setNoteDraft('')
  }

  const handleRedraft = () => setStatus('drafted')

  const badge = badgeFor(status)

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb="Bill of Lading"
        title="Bill of Lading — Draft & Confirmation"
        subtitle="BKG-2024-00142 · Stellar Exports Pvt Ltd · INNSA → CNSHA"
        actions={<Badge variant={badge.variant} label={badge.label} />}
      />

      <div style={{ background: C.amber.bg, border: `1px solid ${C.amber.border}`, borderRadius: 6 }} className="flex items-start gap-3 px-4 py-3 mb-5">
        <span style={{ color: C.amber.text, marginTop: 1 }}><Icon.warning /></span>
        <div className="text-[12px]" style={{ color: C.amber.text }}>
          A confirmed BL for a container that missed Gate In is the real risk — confirmation should ideally be blocked
          (or at least warned) if Gate In isn't recorded yet.
        </div>
      </div>

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
          <button onClick={() => setStatus('drafted')} className={cls.btnSecondary}>Re-send Draft</button>
        </div>
      )}

      {isCustomer && status === 'drafted' && (
        <div className="pt-1">
          {!showChangeForm ? (
            <div className="flex items-center gap-2">
              <button onClick={handleApprove} className={cls.btnPrimary}>
                <Icon.check /> Approve
              </button>
              <button onClick={() => setShowChangeForm(true)} className={cls.btnAmber}>Request Changes</button>
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
            <span className="text-sm font-medium" style={{ color: C.green.text }}>BL draft approved</span>
          </div>
          <button onClick={() => onNavigate('invoice')} className={cls.btnPrimary} style={{ fontSize: 12, padding: '5px 10px' }}>
            Continue to Invoice →
          </button>
        </div>
      )}
    </div>
  )
}
