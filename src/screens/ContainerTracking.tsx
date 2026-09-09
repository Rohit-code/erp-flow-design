import { Screen, Role } from '../types'
import { BOOKING } from '../data/booking'
import { getDepot } from '../data/depots'
import { useBooking } from '../state/BookingContext'
import { PageHeader, SectionCard, cls, C, Badge, MonoRef } from '../components/ui'

// Container milestones, read straight off the booking. Nothing is stored here —
// every state below was written by the depot, Ops or the terminal step that
// actually happened, so this screen cannot drift from what the flow recorded.

type Milestone = {
  key: string
  label: string
  detail: string
  done: boolean
}

export default function ContainerTracking({ role, onNavigate }: { role: Role; onNavigate: (s: Screen) => void }) {
  const { booking, sailing } = useBooking()
  const depot = booking.depotId ? getDepot(booking.depotId) : undefined
  const containers = booking.containers

  if (containers.length === 0) {
    return (
      <div className="max-w-3xl">
        <PageHeader title="Container Tracking" subtitle={`${BOOKING.id} · ${BOOKING.pol} → ${BOOKING.pod}`} />
        <SectionCard>
          <p className="text-[13px]" style={{ color: C.textMuted }}>
            No containers allocated yet. A container appears here the moment the depot records it against this booking —
            that handover is the first point at which a physical box is tied to the order.
          </p>
          {role !== 'customer' && (
            <button onClick={() => onNavigate('depot-requirement')} className={`${cls.btnSecondary} mt-3`}>
              Depot Requirement →
            </button>
          )}
        </SectionCard>
      </div>
    )
  }

  const milestonesFor = (c: typeof containers[number]): Milestone[] => [
    {
      key: 'depot-out',
      label: 'Depot Out',
      detail: depot ? `Released by ${depot.name}, allocated to ${BOOKING.id}` : 'Released from depot',
      done: c.status === 'depot-out',
    },
    ...(booking.foodGrade ? [{
      key: 'clean',
      label: 'Food-grade certified',
      detail: c.cleanCertifiedBy ? `Certified clean by ${c.cleanCertifiedBy}` : 'Not certified',
      done: c.cleanCertified,
    }] : []),
    {
      key: 'gate-in',
      label: 'Gate In',
      detail: c.gatedIn ? 'Received at the terminal inside the port cutoff' : 'Not yet received at the terminal',
      done: c.gatedIn,
    },
    {
      key: 'sob',
      label: 'Shipped On Board',
      detail: c.sob
        ? `Loaded to ${sailing?.vessel ?? 'the vessel'} · SOB ${c.sobDate}`
        : 'Not loaded — a container still here when the vessel sails is shut out',
      done: c.sob,
    },
  ]

  const summary = {
    out: containers.filter(c => c.status === 'depot-out').length,
    gated: containers.filter(c => c.gatedIn).length,
    loaded: containers.filter(c => c.sob).length,
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Container Tracking"
        subtitle={`${BOOKING.id} · ${BOOKING.pol} → ${BOOKING.pod} · ${BOOKING.commodity}`}
        actions={
          <Badge
            variant={summary.loaded === containers.length ? 'approved' : 'pending'}
            label={`${summary.loaded} of ${containers.length} on board`}
          />
        }
      />

      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 8 }} className="flex gap-8 px-5 py-4 mb-5">
        {[
          { l: 'Depot Out', v: `${summary.out} / ${containers.length}` },
          { l: 'Gated In', v: `${summary.gated} / ${containers.length}` },
          { l: 'Shipped On Board', v: `${summary.loaded} / ${containers.length}` },
          { l: 'Vessel', v: sailing ? `${sailing.vessel} · ${sailing.voyage}` : 'Not selected' },
        ].map(f => (
          <div key={f.l}>
            <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>{f.l}</div>
            <div className="text-[13px]" style={{ color: C.text }}>{f.v}</div>
          </div>
        ))}
      </div>

      {containers.map(c => {
        const milestones = milestonesFor(c)
        return (
          <SectionCard key={c.number}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MonoRef>{c.number}</MonoRef>
                <span className="text-[12px]" style={{ color: C.textMuted }}>{BOOKING.containerType}</span>
              </div>
              <Badge
                variant={c.sob ? 'approved' : c.gatedIn ? 'pending' : 'inactive'}
                label={c.sob ? 'On board' : c.gatedIn ? 'At terminal' : 'In transit to terminal'}
              />
            </div>

            <div className="relative">
              <div style={{ position: 'absolute', left: 8, top: 10, bottom: 10, width: 1, background: C.border }} />
              <div className="space-y-3.5">
                {milestones.map(m => (
                  <div key={m.key} className="flex gap-4 relative">
                    <div
                      style={{
                        width: 17, height: 17, borderRadius: '50%', flexShrink: 0, marginTop: 1, zIndex: 1,
                        background: m.done ? '#14532d' : C.surface,
                        border: `2px solid ${m.done ? '#4ade80' : C.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {m.done && (
                        <svg width="8" height="8" viewBox="0 0 9 9" fill="none">
                          <path d="M1.5 4.5l2.5 2.5 3.5-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="text-[12.5px] font-medium" style={{ color: m.done ? C.text : C.textMuted }}>
                        {m.label}
                      </div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: C.textMuted }}>{m.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        )
      })}

      <p className="text-[11px]" style={{ color: C.textMuted }}>
        Milestones are derived from the booking's own record — nothing on this screen is entered here.
      </p>
    </div>
  )
}
