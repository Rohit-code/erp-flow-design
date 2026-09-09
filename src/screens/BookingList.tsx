import { Screen } from '../types'
import { ORDERS } from '../data/orders'
import { BOOKING } from '../data/booking'
import { useBooking } from '../state/BookingContext'
import { PageHeader, cls, C, Badge, MonoRef } from '../components/ui'

type Row = {
  ref: string
  customer: string
  pol: string
  pod: string
  containers: string
  status: 'confirmed' | 'in-progress' | 'pending' | 'cancelled'
  statusLabel: string
}

const ROWS: Row[] = [
  { ref: 'BKG-2024-00142', customer: 'Stellar Exports Pvt Ltd', pol: 'INNSA', pod: 'CNSHA', containers: '2 × 40ft HC', status: 'confirmed',  statusLabel: 'Confirmed' },
  { ref: 'BKG-2024-00139', customer: 'Suvarna Textiles',        pol: 'INNSA', pod: 'USNYC', containers: '1 × 40ft HC', status: 'in-progress', statusLabel: 'Awaiting KYC' },
  { ref: 'BKG-2024-00135', customer: 'Bharat Foods Exporters',  pol: 'INMUN', pod: 'NLRTM', containers: '2 × 40ft Reefer', status: 'pending',    statusLabel: 'Ops Review' },
  { ref: 'BKG-2024-00128', customer: 'Apex Logistics Pvt Ltd',  pol: 'INMUN', pod: 'AEJEA', containers: '3 × 20ft Dry', status: 'cancelled', statusLabel: 'Cancelled' },
]

export default function BookingList({ onNavigate, onOpen }: { onNavigate: (s: Screen) => void; onOpen: (id: string) => void }) {
  // The booking this prototype walks reports its real status, not a fixed label.
  const { booking, statusLabel } = useBooking()
  // Rows come from the same records the Order Timeline uses, so the two screens
  // can never list different bookings or disagree about their state.
  const ROWS = ORDERS.map(o => ({
    ref: o.id,
    customer: o.customer,
    pol: o.pol,
    pod: o.pod,
    containers: o.equipment,
    status: o.statusVariant === 'active' ? 'confirmed' as const
      : o.statusVariant === 'cancelled' ? 'cancelled' as const
      : 'in-progress' as const,
    statusLabel: o.statusLabel,
  }))
  return (
    <div className="max-w-4xl">
      <PageHeader
        breadcrumb="Booking Pipeline"
        title="Bookings"
        subtitle="Confirmed shipment bookings & job files."
      />

      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 8 }} className="overflow-hidden mb-4">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Booking', 'Customer', 'Route', 'Containers', 'Status', ''].map(h => (
                <th key={h} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(row => (
              <tr key={row.ref} className={cls.tableRow} onClick={() => (row.ref === BOOKING.id ? onNavigate('booking-confirmed') : onOpen(row.ref))}>
                <td className={cls.tableCell}>
                  <MonoRef>{row.ref}</MonoRef>
                </td>
                <td className={cls.tableCell + ' font-medium'}>{row.customer}</td>
                <td className={cls.tableCell}>
                  <span className="font-mono text-[12px]" style={{ color: C.textMuted }}>{row.pol}</span>
                  <span style={{ color: C.textMuted }}> → </span>
                  <span className="font-mono text-[12px]" style={{ color: C.textMuted }}>{row.pod}</span>
                </td>
                <td className={cls.tableCell} style={{ color: C.textMuted }}>{row.containers}</td>
                <td className={cls.tableCell}>
                  <Badge
                    variant={row.ref === BOOKING.id ? (booking.opsAccepted ? 'confirmed' : 'in-progress') : row.status}
                    label={row.ref === BOOKING.id ? statusLabel : row.statusLabel}
                  />
                </td>
                <td className={cls.tableCell}>
                  <button
                    onClick={e => { e.stopPropagation(); row.ref === BOOKING.id ? onNavigate('booking-confirmed') : onOpen(row.ref) }}
                    style={{ color: C.accentDim, fontSize: 12 }}
                    className="font-medium"
                  >
                    Open →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
