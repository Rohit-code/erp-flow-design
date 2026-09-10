import { ORDERS } from '../data/orders'
import { BOOKING } from '../data/booking'
import { useBooking } from '../state/BookingContext'
import { PageHeader, cls, C, Badge, MonoRef } from '../components/ui'

const VARIANT_BADGE: Record<string, 'active' | 'in-progress' | 'cancelled'> = {
  active: 'active',
  'in-progress': 'in-progress',
  cancelled: 'cancelled',
}

export default function OrderList({ onOpen, filterCustomer }: { onOpen: (id: string) => void; filterCustomer?: string }) {
  // This prototype's booking writes its own history, so its row reports live.
  const { statusLabel, latestEvent, booking } = useBooking()
  const rows = filterCustomer ? ORDERS.filter(o => o.customer === filterCustomer) : ORDERS

  return (
    <div className="max-w-4xl">
      <PageHeader
        breadcrumb="Booking Pipeline"
        title={filterCustomer ? 'Order History' : 'Order Timeline'}
        subtitle={filterCustomer ? `Every booking on record for ${filterCustomer}.` : 'Full audit trail per booking — inquiry through CRO (and beyond).'}
      />

      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 8 }} className="overflow-hidden mb-4">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Booking', 'Customer', 'Route', 'Latest Event', 'Status', ''].map(h => (
                <th key={h} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const isLive = row.id === BOOKING.id
              const latest = isLive && latestEvent ? latestEvent : row.timeline[row.timeline.length - 1]
              return (
                <tr key={row.id} className={cls.tableRow} onClick={() => onOpen(row.id)}>
                  <td className={cls.tableCell}>
                    <MonoRef>{row.id}</MonoRef>
                  </td>
                  <td className={cls.tableCell + ' font-medium'}>{row.customer}</td>
                  <td className={cls.tableCell}>
                    <span className="font-mono text-[12px]" style={{ color: C.textMuted }}>{row.pol}</span>
                    <span style={{ color: C.textMuted }}> → </span>
                    <span className="font-mono text-[12px]" style={{ color: C.textMuted }}>{row.pod}</span>
                  </td>
                  <td className={cls.tableCell} style={{ color: C.textMuted }}>{latest.label}</td>
                  <td className={cls.tableCell}>
                    <Badge
                      variant={isLive ? (booking.opsAccepted ? 'active' : 'in-progress') : VARIANT_BADGE[row.statusVariant]}
                      label={isLive ? statusLabel : row.statusLabel}
                    />
                  </td>
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
