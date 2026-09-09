import { useState } from 'react'
import { Screen, Role } from '../types'
import { Field, Input, PageHeader, SectionCard, cls, C, Badge, MonoRef, Icon } from '../components/ui'

const TEU_COUNT = 2

const CHARGES = [
  { label: 'Ocean Freight', rate: 420 },
  { label: 'BAF', rate: 95 },
  { label: 'CAF', rate: 47 },
]

const RATE_TOTAL = CHARGES.reduce((sum, c) => sum + c.rate, 0)

export default function Invoice({ role, onNavigate }: { role: Role; onNavigate: (s: Screen) => void }) {
  const [released, setReleased] = useState(false)
  const [standingCredit, setStandingCredit] = useState(false)
  const [paid, setPaid] = useState(false)
  const [showBankTransfer, setShowBankTransfer] = useState(false)
  const [refNumber, setRefNumber] = useState('')

  const isCustomer = role === 'customer'

  const handleStandingCredit = (checked: boolean) => {
    setStandingCredit(checked)
    if (checked) setPaid(true)
  }

  const handleBankTransferSubmit = () => {
    if (!refNumber.trim()) return
    setPaid(true)
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb="Invoice"
        title="Invoice"
        subtitle="BKG-2024-00142 · Stellar Exports Pvt Ltd · INNSA → CNSHA"
        actions={<Badge variant={paid ? 'paid' : released ? 'sent' : 'draft'} label={paid ? 'Paid' : released ? 'Released' : 'Draft'} />}
      />

      <SectionCard title="Charges">
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            ...CHARGES.map(c => ({ label: c.label, value: `USD ${c.rate}` })),
            { label: 'Total All-In', value: `USD ${RATE_TOTAL}` },
          ].map((r, i) => (
            <div
              key={i}
              style={{ background: i === 3 ? '#0d1d35' : 'transparent', border: i === 3 ? '1px solid #1e3a5f' : 'none', borderRadius: 6, padding: i === 3 ? '10px 14px' : '0 14px 0 0', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}
            >
              <div className={cls.sectionTitle} style={{ marginBottom: 4 }}>{r.label}</div>
              <div className="font-mono text-[15px] font-medium" style={{ color: i === 3 ? C.accentDim : C.text }}>
                {r.value} <span className="text-[11px] font-normal" style={{ color: C.textMuted }}>/ TEU</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 text-[12px] mb-3" style={{ color: C.textMuted }}>
          <span>Container Count: <strong style={{ color: C.textSubtle }}>{TEU_COUNT} TEU</strong></span>
          <span>Ref: <MonoRef>BKG-2024-00142</MonoRef></span>
        </div>
        <div style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }} className="p-4">
          <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: C.textMuted }}>Extended Total ({TEU_COUNT} TEU)</div>
          <div className="font-mono text-[18px] font-semibold" style={{ color: C.accentDim }}>
            USD {RATE_TOTAL * TEU_COUNT}
          </div>
        </div>
      </SectionCard>

      <div style={{ background: C.amber.bg, border: `1px solid ${C.amber.border}`, borderRadius: 6 }} className="flex items-start gap-3 px-4 py-3 mb-5">
        <span style={{ color: C.amber.text, marginTop: 1 }}><Icon.warning /></span>
        <div className="text-[12px]" style={{ color: C.amber.text }}>
          Payment reconciliation path — link vs. bank transfer — is not finalized yet. This is an acknowledged open gap, not a bug.
        </div>
      </div>

      {!isCustomer && !released && (
        <div className="flex gap-2 pt-1 mb-5">
          <button onClick={() => setReleased(true)} className={cls.btnPrimary}>Release Invoice</button>
        </div>
      )}

      {!isCustomer && released && (
        <div style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }} className="flex items-center gap-2 px-4 py-3 mb-5">
          <Icon.check />
          <span className="text-sm font-medium" style={{ color: C.green.text }}>Invoice released to customer</span>
        </div>
      )}

      {isCustomer && (
        <SectionCard title="Standing Credit">
          <label className="flex items-center gap-2 text-[13px]" style={{ color: C.text }}>
            <input type="checkbox" checked={standingCredit} onChange={e => handleStandingCredit(e.target.checked)} />
            This customer has standing credit
          </label>
          <p className="text-[12px] mt-2" style={{ color: C.textMuted }}>
            Standing-credit customers skip payment here — MBL releases immediately once invoiced.
          </p>
        </SectionCard>
      )}

      {isCustomer && released && !standingCredit && !paid && (
        <SectionCard title="Payment">
          <div className="grid grid-cols-2 gap-3">
            <button disabled className={cls.btnSecondary} style={{ opacity: 0.5, cursor: 'not-allowed', justifyContent: 'center' }}>
              Pay via Link — redirecting to payment gateway…
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
                <button onClick={handleBankTransferSubmit} className={cls.btnPrimary} style={{ marginTop: 10 }}>Submit Reference</button>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {paid && (
        <div
          style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }}
          className="flex items-center justify-between px-4 py-3 mt-2"
        >
          <div className="flex items-center gap-2">
            <Icon.check />
            <span className="text-sm font-medium" style={{ color: C.green.text }}>
              {standingCredit ? 'Standing credit — invoice cleared without payment' : 'Payment recorded'}
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
