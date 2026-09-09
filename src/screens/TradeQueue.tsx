import { floorRate, rateLabel } from '../data/pricing'
import { PageHeader, cls, C, Badge, MonoRef } from '../components/ui'

type TradeEntry = {
  ref: string
  customer: string
  pol: string
  pod: string
  quoted: number
  cost: number
}

const QUEUE: TradeEntry[] = [
  { ref: 'INQ-2024-0391', customer: 'Stellar Exports Pvt Ltd', pol: 'INNSA', pod: 'CNSHA', quoted: 460, cost: 440 },
  { ref: 'INQ-2024-0388', customer: 'Apex Logistics Pvt Ltd', pol: 'INMUN', pod: 'AEJEA', quoted: 410, cost: 435 },
  { ref: 'INQ-2024-0382', customer: 'Mehta Container Lines', pol: 'INNSA', pod: 'SGSIN', quoted: 375, cost: 400 },
  { ref: 'INQ-2024-0379', customer: 'Global Cargo Solutions', pol: 'INBOM', pod: 'USNYC', quoted: 1180, cost: 1220 },
]

export default function TradeQueue({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="max-w-4xl">
      <PageHeader
        breadcrumb="Trade"
        title="Trade Queue"
        subtitle="Inquiries below the margin floor — Sales cannot accept these without Trade sign-off."
      />

      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 8 }} className="overflow-hidden mb-4">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Inquiry', 'Customer', 'Route', 'Quoted vs Floor', 'Status', ''].map(h => (
                <th key={h} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {QUEUE.map(row => (
              <tr key={row.ref} className={cls.tableRow} onClick={() => onOpen('QT-2024-0217')}>
                <td className={cls.tableCell}>
                  <MonoRef>{row.ref}</MonoRef>
                </td>
                <td className={cls.tableCell + ' font-medium'}>{row.customer}</td>
                <td className={cls.tableCell}>
                  <span className="font-mono text-[12px]" style={{ color: C.textMuted }}>{row.pol}</span>
                  <span style={{ color: C.textMuted }}> → </span>
                  <span className="font-mono text-[12px]" style={{ color: C.textMuted }}>{row.pod}</span>
                </td>
                <td className={cls.tableCell}>
                  <span className="font-mono text-[12px]" style={{ color: '#f87171' }}>{rateLabel(row.quoted)}</span>
                  <span className="text-[12px]" style={{ color: C.textMuted }}> · floor </span>
                  <span className="font-mono text-[12px]" style={{ color: C.textMuted }}>{rateLabel(floorRate(row.cost))}</span>
                </td>
                <td className={cls.tableCell}>
                  <Badge variant="requires-trade" />
                </td>
                <td className={cls.tableCell}>
                  <button
                    onClick={e => { e.stopPropagation(); onOpen('QT-2024-0217') }}
                    style={{ color: C.accentDim, fontSize: 12 }}
                    className="font-medium"
                  >
                    Review →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[12px]" style={{ color: C.textMuted }}>
        Opening a row hands Trade exactly three actions: <strong>Decline</strong>, <strong>Negotiate</strong>, or <strong>Accept</strong>.
      </p>
    </div>
  )
}
