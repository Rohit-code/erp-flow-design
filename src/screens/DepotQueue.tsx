import { Screen } from '../types'
import { ORDERS } from '../data/orders'
import { BOOKING } from '../data/booking'
import { DEPOTS } from '../data/depots'
import { useBooking } from '../state/BookingContext'
import { PageHeader, cls, C, Badge, MonoRef, BadgeVariant } from '../components/ui'

// Every depot's own inbox only ever showed the one live booking. This is the
// browse view across every case this depot desk has touched — requirement
// replies, food-grade holds and handover progress, all at a glance.

export default function DepotQueue({ onOpen }: { onOpen: (id: string) => void }) {
  const { booking } = useBooking()

  return (
    <div className="max-w-4xl">
      <PageHeader
        breadcrumb="Depot Portal"
        title="Case Queue"
        subtitle="Every booking this desk has been asked about — requirement, food-grade and handover status."
      />

      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 8 }} className="overflow-hidden mb-4">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Booking', 'Customer', 'Route', 'Requirement', 'Cargo', 'Handover', ''].map(h => (
                <th key={h} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDERS.map(row => {
              const isLive = row.id === BOOKING.id
              const s = row.snapshot
              const requirementSent = isLive ? booking.requirementSent : s.requirementSent
              const depotId = isLive ? booking.depotId : s.depotId
              const depotReplies = isLive ? booking.depotReplies : s.depotReplies
              const foodGrade = isLive ? booking.foodGrade : s.foodGrade
              const containers = isLive ? booking.containers : s.containers
              const expected = isLive ? [...BOOKING.containers] : s.containersExpected

              const answered = DEPOTS.filter(d => depotReplies[d.id]).length
              const reqVariant: BadgeVariant = depotId ? 'approved' : requirementSent ? 'pending' : 'inactive'
              const reqLabel = depotId ? 'Assigned' : requirementSent ? `${answered}/${DEPOTS.length} replied` : 'Not sent'

              const handoverDone = expected.length > 0 && containers.length === expected.length
              const handoverVariant: BadgeVariant = expected.length === 0 ? 'inactive' : handoverDone ? 'approved' : 'pending'
              const handoverLabel = expected.length === 0 ? '—' : `${containers.length} / ${expected.length} recorded`

              return (
                <tr key={row.id} className={cls.tableRow} onClick={() => onOpen(row.id)}>
                  <td className={cls.tableCell}><MonoRef>{row.id}</MonoRef></td>
                  <td className={cls.tableCell + ' font-medium'}>{row.customer}</td>
                  <td className={cls.tableCell}>
                    <span className="font-mono text-[12px]" style={{ color: C.textMuted }}>{row.pol}</span>
                    <span style={{ color: C.textMuted }}> → </span>
                    <span className="font-mono text-[12px]" style={{ color: C.textMuted }}>{row.pod}</span>
                  </td>
                  <td className={cls.tableCell}><Badge variant={reqVariant} label={reqLabel} /></td>
                  <td className={cls.tableCell}>
                    <Badge variant={foodGrade ? 'pending' : 'inactive'} label={foodGrade ? 'Food Grade' : 'General'} />
                  </td>
                  <td className={cls.tableCell}><Badge variant={handoverVariant} label={handoverLabel} /></td>
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
    </div>
  )
}
