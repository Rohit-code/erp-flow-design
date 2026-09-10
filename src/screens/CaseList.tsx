import { ORDERS, OrderRecord, CaseSnapshot } from '../data/orders'
import { BOOKING } from '../data/booking'
import { DEPOTS, getDepot } from '../data/depots'
import { useBooking } from '../state/BookingContext'
import { PageHeader, cls, C, Badge, MonoRef, BadgeVariant } from '../components/ui'

// Every stage from Booking Acceptance through MBL Release used to open
// straight into the one live booking, with no way to see where any other
// case stood. This is the list every one of those stages now opens into
// first — same shape as Order List and Booking List, just scoped to what
// matters at that particular stage — before dropping into the real screen
// (live booking) or a read-only case dossier (every other booking).

export type Stage =
  | 'ops-accept' | 'cro-release' | 'container-tracking'
  | 'gate-in' | 'load-vessel' | 'bl-draft' | 'invoice' | 'mbl-release'

export const STAGE_META: Record<Stage, { title: string; subtitle: string; breadcrumb: string }> = {
  'ops-accept':        { title: 'Booking Acceptance', breadcrumb: 'Booking Pipeline / Booking Acceptance', subtitle: 'Every booking against the mandatory Ops acceptance gate.' },
  'cro-release':       { title: 'Container Release Orders', breadcrumb: 'Booking Pipeline / CRO', subtitle: 'CRO status and container requirement, per booking.' },
  'container-tracking':{ title: 'Container Tracking', breadcrumb: 'Booking Pipeline / Container Tracking', subtitle: 'Depot-out through shipped-on-board, per booking.' },
  'gate-in':           { title: 'Gate In', breadcrumb: 'Booking Pipeline / Gate In', subtitle: 'Containers awaiting or confirmed at the terminal.' },
  'load-vessel':       { title: 'Load Vessel', breadcrumb: 'Booking Pipeline / Load Vessel', subtitle: 'Shipped-on-board status, per booking.' },
  'bl-draft':          { title: 'Bill of Lading', breadcrumb: 'Booking Pipeline / BL Draft', subtitle: 'Draft and confirmation status, per booking.' },
  'invoice':           { title: 'Invoice', breadcrumb: 'Booking Pipeline / Invoice', subtitle: 'Charges, release and payment status, per booking.' },
  'mbl-release':       { title: 'Master Bill of Lading', breadcrumb: 'Booking Pipeline / MBL', subtitle: 'Release status, per booking.' },
}

type RowStatus = { variant: BadgeVariant; label: string }

/** What the row's status badge says, per stage — always derived from the
 *  snapshot (or the live booking, for the one case that's interactive), so a
 *  list can never show a status the real screen would contradict. */
function statusFor(stage: Stage, s: CaseSnapshot): RowStatus {
  const expected = s.containersExpected.length
  const gated = s.containers.filter(c => c.gatedIn).length
  const onBoard = s.containers.filter(c => c.sob).length

  switch (stage) {
    case 'ops-accept':
      if (s.croId) return { variant: 'confirmed', label: 'Accepted' }
      if (s.kycStatus === 'rejected') return { variant: 'rejected', label: 'Blocked — KYC Rejected' }
      if (s.agreedRate === null) return { variant: 'inactive', label: 'Not Ready — No Rate Agreed' }
      return { variant: 'awaiting', label: 'Awaiting Acceptance' }

    case 'cro-release':
      return s.croId ? { variant: 'active', label: s.croId } : { variant: 'inactive', label: 'Not Issued' }

    case 'container-tracking':
      if (expected === 0) return { variant: 'inactive', label: 'No Containers Yet' }
      if (onBoard === expected) return { variant: 'approved', label: 'All On Board' }
      if (gated > 0) return { variant: 'pending', label: `${gated} of ${expected} Gated In` }
      if (s.containers.length > 0) return { variant: 'pending', label: `${s.containers.length} of ${expected} Depot Out` }
      return { variant: 'inactive', label: 'Not Handed Over' }

    case 'gate-in':
      if (expected === 0) return { variant: 'inactive', label: 'No Containers Yet' }
      return { variant: gated === expected ? 'approved' : gated > 0 ? 'pending' : 'inactive', label: `${gated} of ${expected} gated in` }

    case 'load-vessel':
      if (expected === 0) return { variant: 'inactive', label: 'No Containers Yet' }
      return { variant: onBoard === expected ? 'approved' : onBoard > 0 ? 'pending' : 'inactive', label: `${onBoard} of ${expected} on board` }

    case 'bl-draft':
      return s.blStatus === 'approved' ? { variant: 'approved', label: 'Approved' }
        : s.blStatus === 'changes-requested' ? { variant: 'countered', label: 'Changes Requested' }
        : s.blStatus === 'drafted' ? { variant: 'pending', label: 'Drafted' }
        : { variant: 'inactive', label: 'No Draft Yet' }

    case 'invoice':
      if (!s.invoiceReleased) return { variant: 'inactive', label: 'Not Released' }
      if (s.paymentStatus === 'paid') return { variant: 'paid', label: 'Paid' }
      if (s.paymentStatus === 'standing-credit') return { variant: 'paid', label: 'Standing Credit' }
      return { variant: 'pending', label: 'Payment Pending' }

    case 'mbl-release':
      if (s.mblReleased) return { variant: 'active', label: `Released — ${s.mblType === 'original' ? 'Original' : 'Surrender'}` }
      return { variant: 'inactive', label: 'Not Released' }
  }
}

export default function CaseList({ stage, onOpen }: { stage: Stage; onOpen: (id: string) => void }) {
  const { booking } = useBooking()
  const meta = STAGE_META[stage]

  return (
    <div className="max-w-4xl">
      <PageHeader breadcrumb={meta.breadcrumb} title={meta.title} subtitle={meta.subtitle} />

      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 8 }} className="overflow-hidden mb-4">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Booking', 'Customer', 'Route', 'Containers', 'Depot', 'Status', ''].map((h, i) => (
                <th key={`${h}-${i}`} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((row: OrderRecord) => {
              const isLive = row.id === BOOKING.id
              const s: CaseSnapshot = isLive
                ? {
                    ...row.snapshot,
                    foodGrade: booking.foodGrade,
                    requirementSent: booking.requirementSent,
                    depotReplies: booking.depotReplies,
                    depotId: booking.depotId,
                    containersExpected: [...BOOKING.containers],
                    containers: booking.containers,
                    croId: booking.croHistory[booking.croHistory.length - 1]?.number ?? null,
                    kycStatus: booking.kycStatus,
                    kycRejectionReason: booking.kycRejectionReason,
                    blStatus: booking.blStatus,
                    blChangeNote: booking.blChangeNote,
                    mblType: booking.mblType,
                    invoiceReleased: booking.invoiceReleased,
                    hasStandingCredit: booking.hasStandingCredit,
                    paymentStatus: booking.paymentStatus,
                    mblReleased: booking.mblReleased,
                    agreedRate: booking.agreedRate,
                  }
                : row.snapshot
              const st = statusFor(stage, s)
              const depotName = s.depotId ? getDepot(s.depotId)?.name : null

              return (
                <tr key={row.id} className={cls.tableRow} onClick={() => onOpen(row.id)}>
                  <td className={cls.tableCell}><MonoRef>{row.id}</MonoRef></td>
                  <td className={cls.tableCell + ' font-medium'}>{row.customer}</td>
                  <td className={cls.tableCell}>
                    <span className="font-mono text-[12px]" style={{ color: C.textMuted }}>{row.pol}</span>
                    <span style={{ color: C.textMuted }}> → </span>
                    <span className="font-mono text-[12px]" style={{ color: C.textMuted }}>{row.pod}</span>
                  </td>
                  <td className={cls.tableCell} style={{ color: C.textMuted }}>{row.equipment}</td>
                  <td className={cls.tableCell} style={{ color: C.textMuted }}>{depotName ?? '—'}</td>
                  <td className={cls.tableCell}><Badge variant={st.variant} label={st.label} /></td>
                  <td className={cls.tableCell}>
                    <button
                      onClick={e => { e.stopPropagation(); onOpen(row.id) }}
                      style={{ color: C.accentDim, fontSize: 12 }}
                      className="font-medium"
                    >
                      Open →
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px]" style={{ color: C.textMuted }}>
        Every row is one booking — open it to work the live case, or view the read-only record for any other.
      </p>
    </div>
  )
}
