import { useState } from 'react'
import { Screen } from '../types'
import { Field, Input, PageHeader, SectionCard, cls, C, Badge, Icon } from '../components/ui'

const CANDIDATE_DEPOTS = [
  { name: 'JNPT CFS Gate 1', available: true },
  { name: 'JNPT CFS Gate 3', available: true },
  { name: 'Nhava Sheva Freight Terminal', available: false },
]

export default function OpsDepotSelect({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [sent, setSent] = useState(false)
  const [containerNumbers, setContainerNumbers] = useState('')
  const [commodity, setCommodity] = useState('')
  const [repliesIn, setRepliesIn] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="max-w-2xl">
      <PageHeader title="Depot Pre-Check" subtitle="Confirm container availability before CRO release" />

      <SectionCard title="Send Requirement to Depot">
        {!sent ? (
          <button onClick={() => setSent(true)} className={cls.btnPrimary}>
            <Icon.mail /> Send Requirement to Depot
          </button>
        ) : (
          <div className="space-y-4">
            <div className="text-sm" style={{ color: C.text }}>
              Requesting <strong>2 × 40ft High Cube</strong> containers
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Container Numbers (optional)">
                <Input value={containerNumbers} onChange={e => setContainerNumbers(e.target.value)} placeholder="e.g. MSCU3841290" />
              </Field>
              <Field label="Commodity (optional)">
                <Input value={commodity} onChange={e => setCommodity(e.target.value)} placeholder="e.g. Cotton Yarn" />
              </Field>
            </div>
            {!repliesIn && (
              <button onClick={() => setRepliesIn(true)} className={cls.btnSecondary}>
                Simulate depot replies
              </button>
            )}
          </div>
        )}
      </SectionCard>

      {sent && repliesIn && (
        <SectionCard title="Candidate Depots">
          <div className="space-y-2">
            {CANDIDATE_DEPOTS.map(d => (
              <div
                key={d.name}
                onClick={() => d.available && setSelected(d.name)}
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background: '#1c1e26',
                  border: `1px solid ${selected === d.name ? C.accent : C.border}`,
                  borderRadius: 6,
                  cursor: d.available ? 'pointer' : 'default',
                }}
              >
                <div className="flex items-center gap-3">
                  {d.available && (
                    <input type="radio" checked={selected === d.name} onChange={() => setSelected(d.name)} />
                  )}
                  <span className="text-sm" style={{ color: C.text }}>{d.name}</span>
                </div>
                <Badge variant={d.available ? 'approved' : 'rejected'} label={d.available ? 'Yes, we have it' : 'No'} />
              </div>
            ))}
          </div>

          <div className="text-[12px] mt-4" style={{ color: C.textMuted }}>
            If only one depot confirms, it is auto-selected — no manual step needed.
          </div>
        </SectionCard>
      )}

      {selected && (
        <div
          style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }}
          className="flex items-center justify-between px-4 py-3 mb-4"
        >
          <div className="text-sm" style={{ color: C.green.text }}>
            Depot selected — <strong>{selected}</strong>. Feeds CRO's depot address.
          </div>
          <button onClick={() => onNavigate('cro-release')} className={cls.btnPrimary}>
            Continue to CRO →
          </button>
        </div>
      )}
    </div>
  )
}
