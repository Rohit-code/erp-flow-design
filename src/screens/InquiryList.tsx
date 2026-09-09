import { Screen } from '../types'
import { INQUIRIES } from '../data/inquiries'
import { PageHeader, cls, C, Badge, MonoRef, Icon, BadgeVariant } from '../components/ui'

const STATUS_BADGE: Record<string, { variant: BadgeVariant; label: string }> = {
  'pending-review':        { variant: 'in-progress', label: 'Pending Review' },
  'awaiting-customer-info': { variant: 'awaiting',    label: 'Awaiting Customer Info' },
  'sent-to-trade':  { variant: 'sent',        label: 'Sent to Trade' },
  'awaiting-trade': { variant: 'pending',     label: 'Awaiting Trade' },
  quoted:           { variant: 'approved',    label: 'Quoted' },
  declined:         { variant: 'denied',      label: 'Declined by Trade' },
}

export default function InquiryList({ onNavigate, onOpen }: { onNavigate: (s: Screen) => void; onOpen: (id: string) => void }) {
  return (
    <div className="max-w-4xl">
      <PageHeader
        breadcrumb="Booking Pipeline"
        title="Inquiries"
        subtitle="Rate requests captured from customer mail, awaiting AI review and routing."
        actions={
          <button onClick={() => onNavigate('new-inquiry')} className={cls.btnPrimary}>
            <Icon.plus /> New Inquiry
          </button>
        }
      />

      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 8 }} className="overflow-hidden mb-4">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Inquiry', 'Customer', 'Route', 'AI Review', 'Status', ''].map(h => (
                <th key={h} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INQUIRIES.map(row => {
              const badge = STATUS_BADGE[row.status]
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
                    {row.needsReview ? (
                      <Badge variant="pending" label="Needs Review" />
                    ) : (
                      <span className="text-[12px]" style={{ color: C.textMuted }}>Clear</span>
                    )}
                  </td>
                  <td className={cls.tableCell}>
                    <Badge variant={badge.variant} label={badge.label} />
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

      <p className="text-[12px]" style={{ color: C.textMuted }}>
        Rows flagged <strong>Needs Review</strong> are blocked from Trade until Sales confirms the AI-extracted fields.
      </p>
    </div>
  )
}
