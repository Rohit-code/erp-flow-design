import { Screen } from '../types'
import { getOrder } from '../data/orders'
import { BOOKING } from '../data/booking'
import { DEPOTS, getDepot } from '../data/depots'
import { useBooking } from '../state/BookingContext'
import { PageHeader, SectionCard, cls, C, Badge, MonoRef, BadgeVariant } from '../components/ui'

const roleColors: Record<string, string> = {
  'Customer': '#93c5fd',
  'Sales': '#a5b4fc',
  'Trade': '#c4b5fd',
  'System': '#6b7280',
  'KYC Officer': '#86efac',
  'Ops': '#fcd34d',
  'Depot': '#fdba74',
}

const VARIANT_BADGE: Record<string, BadgeVariant> = {
  active: 'active',
  'in-progress': 'in-progress',
  cancelled: 'cancelled',
}

export default function OrderTimeline({ id, onNavigate }: { id: string; onNavigate: (s: Screen) => void }) {
  const record = getOrder(id)
  const { booking } = useBooking()
  // The booking this prototype walks writes its own history as you act on it —
  // every entry below was appended by a real action, not hardcoded. The other
  // orders are static examples.
  const isLive = record.id === BOOKING.id
  const TIMELINE = isLive ? booking.events : record.timeline

  // Everything below the booking bar is read from the live booking for the
  // one case the prototype walks interactively, and from the case's own
  // snapshot for every other one — so the dossier can never disagree with
  // whichever source actually holds the truth for this booking.
  const s = record.snapshot
  const foodGrade = isLive ? booking.foodGrade : s.foodGrade
  const requirementSent = isLive ? booking.requirementSent : s.requirementSent
  const depotReplies = isLive ? booking.depotReplies : s.depotReplies
  const depotId = isLive ? booking.depotId : s.depotId
  const croId = isLive ? (booking.croHistory[booking.croHistory.length - 1]?.number ?? null) : s.croId
  const containers = isLive ? booking.containers : s.containers
  const containersExpected = isLive ? [...BOOKING.containers] : s.containersExpected
  const kycStatus = isLive ? booking.kycStatus : s.kycStatus
  const kycRejectionReason = isLive ? booking.kycRejectionReason : s.kycRejectionReason
  const blStatus = isLive ? booking.blStatus : s.blStatus
  const blChangeNote = isLive ? booking.blChangeNote : s.blChangeNote
  const mblType = isLive ? booking.mblType : s.mblType
  const invoiceReleased = isLive ? booking.invoiceReleased : s.invoiceReleased
  const hasStandingCredit = isLive ? booking.hasStandingCredit : s.hasStandingCredit
  const paymentStatus = isLive ? booking.paymentStatus : s.paymentStatus
  const mblReleased = isLive ? booking.mblReleased : s.mblReleased
  const answeredDepots = DEPOTS.filter(d => depotReplies[d.id]).length

  const kycBadge: { variant: BadgeVariant; label: string } =
    kycStatus === 'approved' ? { variant: 'approved', label: 'KYC Approved' }
    : kycStatus === 'rejected' ? { variant: 'rejected', label: 'KYC Rejected' }
    : kycStatus === 'submitted' ? { variant: 'pending', label: 'KYC Submitted' }
    : { variant: 'inactive', label: 'KYC Not Started' }

  const blBadge: { variant: BadgeVariant; label: string } =
    blStatus === 'approved' ? { variant: 'approved', label: 'BL Approved' }
    : blStatus === 'changes-requested' ? { variant: 'countered', label: 'Changes Requested' }
    : blStatus === 'drafted' ? { variant: 'pending', label: 'BL Drafted' }
    : { variant: 'inactive', label: 'No BL Yet' }

  return (
    <div className="max-w-2xl">
      <PageHeader
        breadcrumb={`Bookings / ${record.id}`}
        title="Order Timeline"
        subtitle={isLive ? `Live audit trail — ${booking.events.length} entries, appended as the booking moves` : 'Full audit trail — Inquiry to CRO'}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={VARIANT_BADGE[record.statusVariant]} label={record.statusLabel} />
          </div>
        }
      />

      {/* Booking bar */}
      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 6 }} className="flex items-center gap-6 px-5 py-3 mb-6 flex-wrap">
        {[
          { l: 'Booking Ref', v: record.id, m: true },
          { l: 'Customer', v: record.customer, m: false },
          { l: 'Route', v: `${record.pol} → ${record.pod}`, m: true },
          { l: 'Equipment', v: record.equipment, m: false },
        ].map(f => (
          <div key={f.l}>
            <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: C.textMuted }}>{f.l}</div>
            {f.m
              ? <MonoRef>{f.v}</MonoRef>
              : <span className="text-[12px]" style={{ color: C.textSubtle }}>{f.v}</span>
            }
          </div>
        ))}
      </div>

      {/* Depot & CRO */}
      <SectionCard title="Depot & CRO">
        {!requirementSent ? (
          <p className="text-[12px]" style={{ color: C.textMuted }}>Requirement not sent to depots yet.</p>
        ) : (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Badge variant={depotId ? 'approved' : 'pending'} label={depotId ? getDepot(depotId)?.name ?? 'Depot assigned' : `${answeredDepots}/${DEPOTS.length} replied`} />
              {foodGrade && <Badge variant="pending" label="Food Grade" />}
            </div>
            {croId && <span className="text-[12px]" style={{ color: C.textMuted }}>CRO <MonoRef>{croId}</MonoRef></span>}
          </div>
        )}
      </SectionCard>

      {/* Container tracking */}
      {containersExpected.length > 0 && (
        <SectionCard title={`Container Tracking — ${containers.length} of ${containersExpected.length} recorded`}>
          <div className="space-y-2">
            {containersExpected.map(num => {
              const c = containers.find(c => c.number === num)
              return (
                <div key={num} className="flex items-center justify-between px-4 py-2.5" style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }}>
                  <MonoRef>{num}</MonoRef>
                  <div className="flex items-center gap-2">
                    {foodGrade && (
                      <Badge variant={c?.cleanCertified ? 'approved' : 'pending'} label={c?.cleanCertified ? 'Clean' : 'Not Certified'} />
                    )}
                    <Badge
                      variant={c?.sob ? 'approved' : c?.gatedIn ? 'pending' : c ? 'sent' : 'inactive'}
                      label={c?.sob ? 'On Board' : c?.gatedIn ? 'Gated In' : c ? 'Handed Over' : 'Not Handed Over'}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>
      )}

      {/* Documents & payment */}
      <SectionCard title="Documents & Payment">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest font-medium mb-1" style={{ color: C.textMuted }}>KYC</div>
            <Badge variant={kycBadge.variant} label={kycBadge.label} />
            {kycStatus === 'rejected' && kycRejectionReason && (
              <div className="text-[11px] mt-1" style={{ color: C.textMuted }}>{kycRejectionReason}</div>
            )}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-medium mb-1" style={{ color: C.textMuted }}>Bill of Lading</div>
            <div className="flex items-center gap-2">
              <Badge variant={blBadge.variant} label={blBadge.label} />
              {mblType && <Badge variant="inactive" label={mblType === 'surrender' ? 'Surrender' : 'Original'} />}
            </div>
            {blStatus === 'changes-requested' && blChangeNote && (
              <div className="text-[11px] mt-1" style={{ color: C.textMuted }}>{blChangeNote}</div>
            )}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-medium mb-1" style={{ color: C.textMuted }}>Invoice</div>
            <Badge variant={invoiceReleased ? 'active' : 'inactive'} label={invoiceReleased ? 'Released' : 'Not Released'} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-medium mb-1" style={{ color: C.textMuted }}>Payment</div>
            <Badge
              variant={paymentStatus === 'paid' || paymentStatus === 'standing-credit' ? 'paid' : 'pending'}
              label={hasStandingCredit ? 'Standing Credit' : paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
            />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-medium mb-1" style={{ color: C.textMuted }}>Master BL</div>
            <Badge variant={mblReleased ? 'active' : 'inactive'} label={mblReleased ? 'Released' : 'Not Released'} />
          </div>
        </div>
      </SectionCard>

      {/* Timeline */}
      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 8 }} className="p-6">
        <div className="relative">
          {/* Vertical connector */}
          <div style={{ position: 'absolute', left: 14, top: 28, bottom: 28, width: 1, background: C.border }} />

          <div className="space-y-0">
            {TIMELINE.map((entry, i) => {
              const isLast = i === TIMELINE.length - 1
              // Static examples carry an explicit status; live events don't —
              // the most recent one is what the booking is doing now.
              const status = 'status' in entry ? entry.status : isLast ? 'active' : 'done'
              const isActive = status === 'active'
              const isPending = status === 'pending'

              return (
                <div key={entry.id} className="flex gap-5 relative" style={{ paddingBottom: isLast ? 0 : 24 }}>
                  {/* Node */}
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: isPending ? C.surface : isActive ? '#0d1d35' : '#0d2818',
                      border: `2px solid ${isPending ? C.border : isActive ? C.accent : '#166534'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 1, position: 'relative',
                    }}
                  >
                    <span style={{ fontSize: 10, color: isPending ? C.textMuted : isActive ? C.accentDim : '#4ade80' }}>
                      {entry.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[13px] font-semibold"
                          style={{ color: isPending ? C.textMuted : isActive ? C.accentDim : C.text }}
                        >
                          {entry.label}
                        </span>
                        {isActive && <Badge variant="in-progress" label="Latest" />}
                      </div>
                      {!isPending && (
                        <span className="font-mono text-[10px] flex-shrink-0" style={{ color: C.textMuted }}>{entry.ts}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: roleColors[entry.role] || C.textMuted }}
                      >
                        {entry.actor}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider" style={{ color: C.textMuted }}>
                        {entry.role}
                      </span>
                    </div>
                    {entry.note && !isPending && (
                      <p className="text-[12px] leading-relaxed" style={{ color: '#7a8599' }}>{entry.note}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
