import { useState } from 'react'
import { Screen } from '../types'
import { PageHeader, SectionCard, cls, C, Badge, MonoRef } from '../components/ui'

type ReplyState = 'pending' | 'yes' | 'no'

const REQUESTS = [
  { bookingRef: 'BKG-2024-00142', containers: '2 × 40ft High Cube', depotName: 'JNPT CFS Gate 3' },
  { bookingRef: 'BKG-2024-00158', containers: '1 × 20ft Standard', depotName: 'JNPT CFS Gate 1' },
]

export default function DepotRequirement({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [replies, setReplies] = useState<Record<string, ReplyState>>({})

  return (
    <div>
      <PageHeader
        title="Requirement Inbox"
        subtitle="Booking requests asking whether this depot has the required containers"
      />

      {REQUESTS.map(req => {
        const reply = replies[req.bookingRef] ?? 'pending'
        return (
          <SectionCard key={req.bookingRef}>
            <div className="text-[11px] uppercase tracking-widest font-medium mb-2" style={{ color: C.textMuted }}>
              This depot: {req.depotName}
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm mb-1" style={{ color: C.text }}>
                  <MonoRef>{req.bookingRef}</MonoRef>
                </div>
                <div className="text-[13px]" style={{ color: C.textSubtle }}>{req.containers}</div>
              </div>
              {reply !== 'pending' && (
                <Badge
                  variant={reply === 'yes' ? 'approved' : 'inactive'}
                  label={reply === 'yes' ? 'Replied: Yes' : 'Replied: No'}
                />
              )}
            </div>
            <div className="flex gap-2">
              <button
                className={cls.btnPrimary}
                disabled={reply !== 'pending'}
                style={reply !== 'pending' ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                onClick={() => setReplies(r => ({ ...r, [req.bookingRef]: 'yes' }))}
              >
                Yes, we have it
              </button>
              <button
                className={cls.btnSecondary}
                disabled={reply !== 'pending'}
                style={reply !== 'pending' ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                onClick={() => setReplies(r => ({ ...r, [req.bookingRef]: 'no' }))}
              >
                No
              </button>
            </div>
          </SectionCard>
        )
      })}

      <p className="text-[12px]" style={{ color: C.textMuted }}>
        Your reply feeds Ops's depot selection — if you're the only depot that confirms, you're auto-picked.
      </p>
    </div>
  )
}
