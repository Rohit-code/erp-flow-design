import { useState } from 'react'
import { Screen, Session } from '../types'
import { useBooking } from '../state/BookingContext'
import { PageHeader, cls, C, Badge, MonoRef, Icon } from '../components/ui'

type KYCEntry = {
  id: string
  customer: string
  entity: string
  submitted: string
  slaHours: number
  status: 'pending' | 'in-progress' | 'approved' | 'rejected'
  officer?: string
}

const QUEUE: KYCEntry[] = [
  { id: 'KYC-2024-0214', customer: 'Nisha Patel', entity: 'Stellar Exports Pvt Ltd', submitted: '14 Nov 2024, 10:02', slaHours: 4, status: 'pending' },
  { id: 'KYC-2024-0213', customer: 'Arjun Mehta', entity: 'Mehta Container Lines', submitted: '14 Nov 2024, 07:30', slaHours: 7, status: 'in-progress', officer: 'Sunita R.' },
  { id: 'KYC-2024-0212', customer: 'Preeti Joshi', entity: 'Global Cargo Solutions', submitted: '13 Nov 2024, 16:18', slaHours: 18, status: 'approved' },
  { id: 'KYC-2024-0211', customer: 'Vikram Das', entity: 'FastShip International', submitted: '13 Nov 2024, 09:55', slaHours: 24, status: 'rejected' },
  { id: 'KYC-2024-0210', customer: 'Meena Shah', entity: 'Shah Maritime Pvt Ltd', submitted: '12 Nov 2024, 14:40', slaHours: 32, status: 'approved' },
]

type DocField = { label: string; value: string; mono?: boolean }

const DETAIL_FIELDS: DocField[] = [
  { label: 'Company Legal Name', value: 'Stellar Exports Private Limited' },
  { label: 'GSTIN', value: '27AAGCS3460Q1Z5', mono: true },
  { label: 'PAN', value: 'AAGCS3460Q', mono: true },
  { label: 'IEC', value: 'AAGCS3460Q', mono: true },
  { label: 'CIN', value: 'U74999MH2018PTC312456', mono: true },
  { label: 'Registered Address', value: 'Plot 14, SEEPZ SEZ, Andheri East, Mumbai – 400 096' },
  { label: 'Bank Account', value: 'HDFC Bank · 50100426789012', mono: true },
  { label: 'IFSC', value: 'HDFC0001234', mono: true },
]

/** The KYC record belonging to the booking this prototype walks. */
const BOOKING_KYC_ID = 'KYC-2024-0214'

export default function KYCQueue({ session, onNavigate }: { session: Session; onNavigate: (s: Screen) => void }) {
  const { booking, actions } = useBooking()
  const [selected, setSelected] = useState<string | null>(null)
  const [action, setAction] = useState<'approve' | 'reject' | 'more' | null>(null)
  const [reason, setReason] = useState('')
  const [actionDone, setActionDone] = useState<Record<string, 'approve' | 'reject' | 'more'>>({})

  const entry = selected ? QUEUE.find(e => e.id === selected) : null

  const handleAction = () => {
    if (!selected) return
    if ((action === 'reject' || action === 'more') && !reason) return
    setActionDone(prev => ({ ...prev, [selected]: action! }))
    setAction(null)
    setSelected(null)
  }

  return (
    <div className="max-w-5xl">
      <PageHeader
        breadcrumb="KYC"
        title="KYC Review Queue"
        subtitle={`${QUEUE.filter(e => e.status === 'pending' || e.status === 'in-progress').length} submissions awaiting review`}
      />

      {/* Detail panel */}
      {entry && (
        <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 8 }} className="mb-5">
          {/* Detail header */}
          <div
            style={{ borderBottom: `1px solid ${C.border}`, padding: '14px 20px' }}
            className="flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold" style={{ color: C.text }}>{entry.customer}</span>
                <span style={{ color: C.textMuted }}>·</span>
                <span className="text-[12px]" style={{ color: C.textMuted }}>{entry.entity}</span>
                <Badge variant={entry.status as any} />
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: C.textMuted }}>
                <MonoRef>{entry.id}</MonoRef> · Submitted {entry.submitted} · SLA age: <span style={{ color: entry.slaHours > 8 ? '#f87171' : entry.slaHours > 4 ? '#fbbf24' : '#4ade80' }}>{entry.slaHours}h</span>
              </div>
            </div>
            <button onClick={() => { setSelected(null); setAction(null) }} style={{ color: C.textMuted, fontSize: 18, lineHeight: 1 }}>×</button>
          </div>

          {/* Side-by-side */}
          <div className="grid grid-cols-2 gap-0" style={{ borderBottom: `1px solid ${C.border}` }}>
            {/* Fields */}
            <div style={{ borderRight: `1px solid ${C.border}`, padding: 20 }}>
              <div className={cls.sectionTitle}>Submitted Fields</div>
              <div className="space-y-3">
                {DETAIL_FIELDS.map(f => (
                  <div key={f.label}>
                    <div className="text-[10px] uppercase tracking-widest font-medium" style={{ color: C.textMuted }}>{f.label}</div>
                    {f.mono
                      ? <div className="font-mono text-[13px]" style={{ color: C.accentDim }}>{f.value}</div>
                      : <div className="text-[13px]" style={{ color: C.text }}>{f.value}</div>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div style={{ padding: 20 }}>
              <div className={cls.sectionTitle}>Uploaded Documents</div>
              <div className="space-y-2">
                {[
                  { name: 'PAN Card', size: '184 KB', ext: 'PDF' },
                  { name: 'Certificate of Incorporation', size: '412 KB', ext: 'PDF' },
                  { name: 'GST Registration Certificate', size: '228 KB', ext: 'PDF' },
                  { name: 'Cancelled Cheque', size: '96 KB', ext: 'JPG' },
                  { name: 'IEC Certificate', size: '307 KB', ext: 'PDF' },
                ].map(doc => (
                  <div
                    key={doc.name}
                    style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 5 }}
                    className="flex items-center justify-between px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{ width: 28, height: 28, borderRadius: 4, background: '#252830', fontSize: 9, fontWeight: 700, color: C.accentDim, letterSpacing: '0.04em' }}
                        className="flex items-center justify-center font-mono"
                      >
                        {doc.ext}
                      </div>
                      <div>
                        <div className="text-[12px]" style={{ color: C.text }}>{doc.name}</div>
                        <div className="text-[10px]" style={{ color: C.textMuted }}>{doc.size}</div>
                      </div>
                    </div>
                    <button
                      style={{ color: C.accentDim, fontSize: 11 }}
                      className="flex items-center gap-1"
                    >
                      <Icon.download /> View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action area */}
          <div style={{ padding: '14px 20px' }}>
            {action === 'reject' || action === 'more' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: C.textMuted }}>
                    {action === 'reject' ? 'Rejection Reason (required)' : 'What additional info is needed? (required)'}
                  </label>
                  <textarea
                    className={`${cls.input} resize-none mt-1.5`}
                    rows={2}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder={action === 'reject' ? 'e.g. PAN name mismatch with company registration…' : 'e.g. Please re-upload a clearer copy of the IEC certificate…'}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAction}
                    disabled={!reason}
                    className={action === 'reject' ? cls.btnDanger : cls.btnAmber}
                    style={{ opacity: reason ? 1 : 0.4 }}
                  >
                    {action === 'reject' ? 'Confirm Reject' : 'Send Request'}
                  </button>
                  <button onClick={() => setAction(null)} className={cls.btnSecondary}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  // KYC approval clears one prerequisite — it does not confirm the
                  // booking. The booking still has to pass the Ops acceptance gate.
                  onClick={() => {
                    handleAction()
                    setActionDone(prev => ({ ...prev, [selected!]: 'approve' }))
                    // Only this booking's KYC feeds the booking state.
                    if (selected === BOOKING_KYC_ID) actions.approveKyc(session.name)
                    setSelected(null)
                    onNavigate('ops-accept')
                  }}
                  className={cls.btnPrimary}
                >
                  <Icon.check /> Approve KYC
                </button>
                <button onClick={() => setAction('reject')} className={cls.btnDanger}>Reject</button>
                <button onClick={() => setAction('more')} className={cls.btnAmber}>Request More Info</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#15171d', border: `1px solid ${C.border}`, borderRadius: 8 }} className="overflow-hidden">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Ref', 'Customer', 'Entity', 'Submitted', 'SLA Age', 'Officer', 'Status', ''].map(h => (
                <th key={h} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {QUEUE.map(row => {
              const done = actionDone[row.id]
              const effectiveStatus = done === 'approve' ? 'approved' : done === 'reject' ? 'rejected' : row.status
              return (
                <tr
                  key={row.id}
                  className={cls.tableRow}
                  style={{ background: selected === row.id ? '#0d1d35' : undefined }}
                  onClick={() => setSelected(row.id)}
                >
                  <td className={cls.tableCell}>
                    <MonoRef>{row.id}</MonoRef>
                  </td>
                  <td className={cls.tableCell + ' font-medium'}>{row.customer}</td>
                  <td className={cls.tableCell} style={{ color: C.textMuted }}>{row.entity}</td>
                  <td className={cls.tableCell} style={{ color: C.textMuted, fontSize: 12 }}>{row.submitted}</td>
                  <td className={cls.tableCell}>
                    <span
                      className="font-mono text-[12px]"
                      style={{ color: row.slaHours > 8 ? '#f87171' : row.slaHours > 4 ? '#fbbf24' : '#4ade80' }}
                    >
                      {row.slaHours}h
                    </span>
                  </td>
                  <td className={cls.tableCell} style={{ color: C.textMuted, fontSize: 12 }}>
                    {row.officer ?? <span style={{ color: '#3d4456' }}>—</span>}
                  </td>
                  <td className={cls.tableCell}>
                    <Badge variant={effectiveStatus as any} />
                  </td>
                  <td className={cls.tableCell}>
                    <span style={{ color: C.textMuted }}><Icon.chevronRight /></span>
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
