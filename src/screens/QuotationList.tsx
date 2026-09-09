import { QUOTATIONS } from '../data/quotations'
import { PageHeader, cls, C, Badge, MonoRef } from '../components/ui'

export default function QuotationList({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="max-w-4xl">
      <PageHeader
        breadcrumb="Booking Pipeline"
        title="Quotations"
        subtitle="Quotes, negotiation, and acceptance across all open inquiries."
      />

      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 8 }} className="overflow-hidden mb-4">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Quote', 'Customer', 'Route', 'Rate', 'Status', ''].map(h => (
                <th key={h} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {QUOTATIONS.map(row => {
              const latest = row.history[row.history.length - 1]
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
                  <td className={cls.tableCell}>
                    {latest ? (
                      <span className="font-mono text-[12px]" style={{ color: C.accentDim }}>USD {latest.rate} / container</span>
                    ) : (
                      <span className="text-[12px]" style={{ color: C.textMuted }}>Not yet sent</span>
                    )}
                  </td>
                  <td className={cls.tableCell}>
                    <Badge variant={row.status} />
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
