import { useState } from 'react'
import { Screen, Role } from '../types'
import { PageHeader, SectionCard, cls, C, Badge, Icon } from '../components/ui'

type Choice = 'surrender' | 'original'

export default function MBLRelease({ role, onNavigate }: { role: Role; onNavigate: (s: Screen) => void }) {
  const [released, setReleased] = useState(false)
  const [choice, setChoice] = useState<Choice | null>(null)

  const isCustomer = role === 'customer'

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb="Master Bill of Lading"
        title="Master Bill of Lading"
        subtitle="BKG-2024-00142 · Stellar Exports Pvt Ltd · INNSA → CNSHA"
        actions={<Badge variant={released ? 'active' : 'pending'} label={released ? 'Released' : 'Pending'} />}
      />

      {!isCustomer && !released && (
        <SectionCard title="Release">
          <p className="text-[13px] mb-3" style={{ color: C.textMuted }}>
            Invoice has been settled. The Master Bill of Lading can now be released.
          </p>
          <button onClick={() => setReleased(true)} className={cls.btnPrimary}>Release MBL</button>
        </SectionCard>
      )}

      {!isCustomer && released && (
        <div style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }} className="flex items-center gap-2 px-4 py-3 mb-5">
          <Icon.check />
          <span className="text-sm font-medium" style={{ color: C.green.text }}>MBL released</span>
        </div>
      )}

      {isCustomer && !released && (
        <SectionCard title="Master Bill of Lading">
          <p className="text-[13px]" style={{ color: C.textMuted }}>
            Awaiting release from Ops — the MBL choice will appear here once released.
          </p>
        </SectionCard>
      )}

      {isCustomer && released && !choice && (
        <SectionCard title="Choose Release Type">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setChoice('surrender')}
              className={cls.btnSecondary}
              style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6, padding: '16px 18px', height: 'auto' }}
            >
              <span className="text-sm font-semibold" style={{ color: C.text }}>Surrender MBL</span>
              <span className="text-[12px] text-left" style={{ color: C.textMuted }}>Stamped surrendered, kept in-office</span>
            </button>
            <button
              onClick={() => setChoice('original')}
              className={cls.btnSecondary}
              style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6, padding: '16px 18px', height: 'auto' }}
            >
              <span className="text-sm font-semibold" style={{ color: C.text }}>Original MBL</span>
              <span className="text-[12px] text-left" style={{ color: C.textMuted }}>Physically issued</span>
            </button>
          </div>
        </SectionCard>
      )}

      {choice && (
        <div style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }} className="flex items-center gap-2 px-4 py-3 mb-5">
          <Icon.check />
          <span className="text-sm font-medium" style={{ color: C.green.text }}>
            {choice === 'surrender' ? 'Surrender MBL confirmed — stamped surrendered, kept in-office' : 'Original MBL confirmed — will be physically issued'}
          </span>
        </div>
      )}

      {released && (
        <div style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }} className="flex items-center justify-between px-4 py-3">
          <span className="text-[12px]" style={{ color: C.textMuted }}>
            End of the export booking flow — everything above is recorded in the Order Timeline.
          </span>
          <button onClick={() => onNavigate('order-timeline')} className={cls.btnSecondary}>
            <Icon.timeline /> View Order Timeline
          </button>
        </div>
      )}
    </div>
  )
}
