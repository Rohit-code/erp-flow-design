import { Screen, Role } from '../types'
import { BOOKING } from '../data/booking'
import { DEPOTS, getDepot } from '../data/depots'
import { useState } from 'react'
import { useBooking } from '../state/BookingContext'
import { Field, Select, Textarea, PageHeader, SectionCard, cls, C, Badge, MonoRef, Icon } from '../components/ui'

const CONTAINERS = [
  { number: 'MSCU3841290', type: '40ft HC', seal: 'ML-449021', tare: '3,900 kg' },
  { number: 'MSCU4012876', type: '40ft HC', seal: 'ML-449022', tare: '3,900 kg' },
]

export default function CRORelease({ role, onNavigate }: { role: Role; onNavigate: (s: Screen) => void }) {
  const { booking, sailing, actions } = useBooking()
  const depot = booking.depotId ? getDepot(booking.depotId) : undefined
  const [showAmend, setShowAmend] = useState(false)
  const [reason, setReason] = useState('Container count changed')
  const [newDepot, setNewDepot] = useState('')
  const [downloaded, setDownloaded] = useState(false)
  const [resent, setResent] = useState<'depot' | 'customer' | null>(null)

  const handleDownload = () => {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }
  const handleResend = (target: 'depot' | 'customer') => {
    setResent(target)
    setTimeout(() => setResent(null), 2000)
  }
  const history = booking.croHistory
  const current = history[history.length - 1]
  const superseded = history.filter(c => c.supersededBy)

  const handleAmend = () => {
    actions.amendCro(reason, newDepot || null, 'Arjun Mehta')
    setShowAmend(false)
    setNewDepot('')
  }
  const confirmedCount = DEPOTS.filter(d => booking.depotReplies[d.id] === 'yes').length
  const autoPicked = confirmedCount === 1

  // The CRO exists only once Ops has accepted. Before that there is nothing to
  // show — and nothing has been released to any depot.
  if (!booking.croIssued) {
    return (
      <div className="max-w-3xl">
        <PageHeader
          breadcrumb="CRO"
          title="Container Release Order"
          subtitle={`${BOOKING.id} · ${BOOKING.customer}`}
          actions={<Badge variant="awaiting" label="Not Issued" />}
        />
        <div style={{ background: '#231a06', border: '1px solid #854d0e', borderRadius: 8 }} className="p-5">
          <div className="text-[14px] font-semibold mb-1" style={{ color: '#fbbf24' }}>No CRO yet</div>
          <div className="text-[12px]" style={{ color: '#fde68a' }}>
            The CRO is issued automatically the moment Ops accepts the booking — never before. Nothing has been sent to a
            depot and there is nothing for the customer to download.
          </div>
          {role !== 'customer' && (
            <button onClick={() => onNavigate('ops-accept')} className={`${cls.btnPrimary} mt-4`}>
              Go to Booking Acceptance →
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb={`CRO / ${current?.number ?? BOOKING.croId}`}
        title="Container Release Order"
        subtitle={`${BOOKING.id} · ${BOOKING.customer} · ${BOOKING.pol} → ${BOOKING.pod}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="active" label="Released" />
            <button onClick={handleDownload} className={cls.btnPrimary}>
              {downloaded ? <><Icon.check /> Downloaded</> : <><Icon.download /> Download PDF</>}
            </button>
          </div>
        }
      />

      {/* Depot pre-check lead-in — which depot this CRO resolved to, and how */}
      <div
        style={{ background: '#0d1d35', border: '1px solid #1e3a5f', borderRadius: 6 }}
        className="flex items-center gap-3 px-4 py-3 mb-5"
      >
        <Icon.check />
        <div className="text-[12px]" style={{ color: '#93c5fd' }}>
          <strong>Depot resolved before CRO issue</strong> — {confirmedCount} of {DEPOTS.length} candidate depots near{' '}
          {BOOKING.polName} confirmed availability
          {autoPicked
            ? <>, so <strong>{depot?.name}</strong> was auto-selected with no manual step.</>
            : <>; Ops selected <strong>{depot?.name}</strong>.</>}
        </div>
      </div>

      {/* Mail status */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div style={{ background: C.green.bg, border: '1px solid #166534', borderRadius: 6 }} className="flex items-center gap-3 px-4 py-3">
          <Icon.mail />
          <div>
            <div className="text-[12px] font-semibold" style={{ color: '#4ade80' }}>Mailed to depot</div>
            <div className="font-mono text-[11px]" style={{ color: '#4ade8099' }}>15 Nov 2024 · 07:22 IST</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 'auto' }}>
            <path d="M2.5 7l3 3 6-6" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ background: C.green.bg, border: '1px solid #166534', borderRadius: 6 }} className="flex items-center gap-3 px-4 py-3">
          <Icon.mail />
          <div>
            <div className="text-[12px] font-semibold" style={{ color: '#4ade80' }}>Mailed to customer</div>
            <div className="font-mono text-[11px]" style={{ color: '#4ade8099' }}>15 Nov 2024 · 07:22 IST</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 'auto' }}>
            <path d="M2.5 7l3 3 6-6" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* CRO document preview */}
      <div
        style={{
          background: '#15171d', border: `2px solid ${C.border}`,
          borderRadius: 10, overflow: 'hidden', marginBottom: 20,
        }}
      >
        {/* Document header */}
        <div style={{ background: '#0b0c0f', borderBottom: `1px solid ${C.border}`, padding: '18px 24px' }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div style={{ width: 40, height: 40, borderRadius: 8, background: C.accent }} className="flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M2 9l2.5-6 2.5 4 2-2.5L11 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#dde1ea]">Maxicon Container Line</div>
                <div className="text-[11px]" style={{ color: C.textMuted }}>NVOCC · IEC AAACM5678K · Mumbai</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-widest font-bold" style={{ color: C.textMuted }}>Container Release Order</div>
              <div className="font-mono text-[16px] font-bold mt-0.5" style={{ color: C.accentDim }}>{current?.number ?? BOOKING.croId}</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Booking info grid */}
          <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-6">
            {[
              { label: 'Booking Ref', value: BOOKING.id, mono: true },
              { label: 'Issue Date', value: '15 Nov 2024', mono: false },
              { label: 'Validity', value: '20 Nov 2024 (5 days)', mono: false },
              { label: 'Shipper', value: BOOKING.customer, mono: false },
              { label: 'Port of Load', value: `${BOOKING.pol} — ${BOOKING.polName}`, mono: false },
              { label: 'Port of Discharge', value: `${BOOKING.pod} — ${BOOKING.podName}`, mono: false },
              { label: 'Vessel / Voyage', value: sailing ? `${sailing.vessel} / ${sailing.voyage}` : '—', mono: false },
              { label: 'ETD', value: sailing?.etd ?? BOOKING.etd, mono: false },
              { label: 'SI Cutoff', value: sailing?.cutoff ?? '20 Nov 2024, 18:00', mono: false },
            ].map(f => (
              <div key={f.label}>
                <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>{f.label}</div>
                {f.mono
                  ? <MonoRef>{f.value}</MonoRef>
                  : <span className="text-[13px]" style={{ color: C.text }}>{f.value}</span>
                }
              </div>
            ))}
          </div>

          {/* Depot */}
          <div style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }} className="p-4 mb-6">
            <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: C.textMuted }}>Pickup Depot</div>
            <div className="font-medium mb-0.5" style={{ color: C.text }}>{depot?.name}</div>
            <div className="text-[12px]" style={{ color: C.textMuted }}>{depot?.address}</div>
            <div className="flex items-center gap-6 mt-3 text-[12px]" style={{ color: C.textMuted }}>
              <span>Hours: <strong style={{ color: C.textSubtle }}>Mon–Sat 06:00–22:00</strong></span>
              <span>Contact: <span className="font-mono">+91 22 6738 9900</span></span>
              <span>Depot Ref: <MonoRef>{depot?.ref}</MonoRef></span>
            </div>
          </div>

          {/* Container list */}
          <div style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }} className="overflow-hidden mb-5">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Container No.', 'Type', 'Seal No.', 'Tare Weight', 'Status'].map(h => (
                    <th key={h} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CONTAINERS.map((c, i) => (
                  <tr key={c.number} style={{ borderBottom: i < CONTAINERS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <td className={cls.tableCell}><MonoRef>{c.number}</MonoRef></td>
                    <td className={cls.tableCell}>{c.type}</td>
                    <td className={cls.tableCell}><MonoRef>{c.seal}</MonoRef></td>
                    <td className={cls.tableCell} style={{ color: C.textMuted }}>{c.tare}</td>
                    <td className={cls.tableCell}><Badge variant="active" label="Available" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Instructions */}
          <div style={{ background: '#0d1d35', border: '1px solid #1e3a5f', borderRadius: 6 }} className="p-4">
            <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#5a7ca0' }}>Pickup Instructions</div>
            <ul className="space-y-1.5">
              {[
                'Present this CRO (original or digital) at the depot gate.',
                'Driver must carry valid government photo ID and transport vehicle registration.',
                'Containers to be picked up within validity period. Demurrage applies after expiry.',
                'VGM declaration mandatory before gate-in. Use depot\'s VGM service or shipper\'s own scale.',
                'Container condition report to be signed at pickup — any pre-existing damage noted.',
              ].map((inst, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: '#7a9fc0' }}>
                  <span style={{ color: '#3d5a8a', marginTop: 2, flexShrink: 0 }}>·</span>
                  {inst}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Superseded CROs stay in the record — a depot may hold a printed copy */}
      {superseded.length > 0 && (
        <SectionCard title={`Superseded — ${superseded.length} earlier CRO${superseded.length === 1 ? '' : 's'}`}>
          <p className="text-[12px] mb-3" style={{ color: C.textMuted }}>
            A CRO is never edited or deleted. Each amendment issues a new number and marks the previous one superseded, so
            a depot holding an old printed copy can be told exactly which one it has.
          </p>
          <div className="space-y-2">
            {superseded.map(c => (
              <div
                key={c.number}
                style={{ background: '#1a1d24', border: `1px solid ${C.border}`, borderRadius: 6, opacity: 0.75 }}
                className="px-4 py-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[13px]" style={{ color: C.textMuted, textDecoration: 'line-through' }}>
                    {c.number}
                  </span>
                  <Badge variant="cancelled" label={`Superseded by ${c.supersededBy}`} />
                </div>
                <div className="text-[11px]" style={{ color: C.textMuted }}>
                  Issued {c.issuedAt} · {getDepot(c.depotId)?.name ?? '—'}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {current?.reason && (
        <div
          style={{ background: C.blue.bg, border: `1px solid ${C.blue.border}`, borderRadius: 6 }}
          className="px-4 py-3 mb-5 text-[12px]"
        >
          <span style={{ color: C.blue.text }}>
            <strong>This CRO replaced an earlier one.</strong> Reason: {current.reason}. The superseded number is listed
            above and no longer stands at the depot gate.
          </span>
        </div>
      )}

      {/* Amend — never edits, always supersedes */}
      {showAmend && (
        <SectionCard title="Amend CRO">
          <p className="text-[12px] mb-3" style={{ color: C.amber.text }}>
            This will not change {current?.number}. It marks it superseded and issues a new CRO with a new number, then
            re-notifies the depot and the customer.
          </p>
          <Field label="Reason for amendment" className="mb-3">
            <Select value={reason} onChange={e => setReason(e.target.value)}>
              <option>Container count changed</option>
              <option>Container type changed</option>
              <option>Depot changed — original depot could no longer supply</option>
              <option>Pickup validity extended</option>
              <option>Customer details corrected</option>
            </Select>
          </Field>
          <Field label="Move to a different depot (optional)" className="mb-3">
            <Select value={newDepot} onChange={e => setNewDepot(e.target.value)}>
              <option value="">Keep {depot?.name}</option>
              {DEPOTS.filter(d => d.id !== booking.depotId).map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
          </Field>
          <div className="flex gap-2">
            <button onClick={handleAmend} className={cls.btnAmber}>Supersede &amp; Issue New CRO</button>
            <button onClick={() => setShowAmend(false)} className={cls.btnSecondary}>Cancel</button>
          </div>
        </SectionCard>
      )}

      {/* Actions — Ops can re-send either copy; Customer only ever downloads their own */}
      <div className="flex gap-2">
        <button onClick={handleDownload} className={cls.btnPrimary}>
          {downloaded ? <><Icon.check /> Downloaded</> : <><Icon.download /> Download PDF</>}
        </button>
        {role === 'ops' && (
          <>
            <button onClick={() => handleResend('depot')} className={cls.btnSecondary}>
              {resent === 'depot' ? <><Icon.check /> Sent</> : <><Icon.mail /> Re-send to Depot</>}
            </button>
            <button onClick={() => handleResend('customer')} className={cls.btnSecondary}>
              {resent === 'customer' ? <><Icon.check /> Sent</> : <><Icon.mail /> Re-send to Customer</>}
            </button>
            {!showAmend && (
              <button onClick={() => setShowAmend(true)} className={cls.btnAmber}>Amend (supersede)</button>
            )}
          </>
        )}
        <div className="flex-1" />
        <button onClick={() => onNavigate('order-timeline')} className={cls.btnSecondary}><Icon.timeline /> Timeline</button>
      </div>
    </div>
  )
}
