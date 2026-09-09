import { useState } from 'react'
import { Screen, Session } from '../types'
import { BOOKING } from '../data/booking'
import { useBooking } from '../state/BookingContext'
import { PageHeader, SectionCard, cls, C, Badge, Field, Input, MonoRef, Icon } from '../components/ui'

// Where the physical world meets the booking. Two ways in:
//
//   Single    — one container at the gate, recorded as it leaves.
//   Out-report — the yard's evening batch: every container that went out that
//                day, against its booking. This is the FIRST time Maxicon
//                learns which physical box went to which booking.
//
// For food cargo a container cannot be handed over until it is certified clean.
// Unlike the shipped-on-board warning, this one blocks: a dirty box loaded with
// food cargo is a rejected shipment at destination, not a recoverable situation.

type Mode = 'single' | 'batch'

export default function DepotHandover({ session, onNavigate }: { session: Session; onNavigate: (s: Screen) => void }) {
  const { booking, actions } = useBooking()
  const [mode, setMode] = useState<Mode>('single')
  const [containerNumber, setContainerNumber] = useState('')
  const [batchText, setBatchText] = useState('')
  const [clean, setClean] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const recorded = booking.containers
  const remaining = BOOKING.containers.filter(n => !recorded.some(c => c.number === n))
  const done = remaining.length === 0 && recorded.length > 0
  const nextContainer = remaining[0] ?? ''

  // Food cargo gates the handover entirely.
  const needsClean = booking.foodGrade
  const cleanBlocked = needsClean && !clean

  const batchNumbers = batchText.split(/[\s,]+/).map(t => t.trim()).filter(Boolean)

  const handleSingle = () => {
    const num = containerNumber.trim() || nextContainer
    if (!num || cleanBlocked) return
    actions.recordHandover(num, session.name, clean)
    setContainerNumber('')
  }

  const handleBatch = () => {
    if (!batchNumbers.length || cleanBlocked) return
    actions.recordOutReport(batchNumbers, session.name, clean)
    setBatchText('')
  }

  const handleUpload = () => {
    setUploaded(true)
    setBatchText(remaining.join('\n'))
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Container Handover"
        subtitle="Record the container(s) handed over against a booking"
        actions={<Badge variant={done ? 'approved' : 'pending'} label={`${recorded.length} of ${BOOKING.containers.length} recorded`} />}
      />

      {/* Cargo grade — drives whether the clean certificate is required */}
      <SectionCard title="Cargo">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[13px]" style={{ color: C.text }}>{BOOKING.commodity}</span>
              <Badge variant={needsClean ? 'pending' : 'inactive'} label={needsClean ? 'Food Grade' : 'General Cargo'} />
            </div>
            <div className="text-[12px]" style={{ color: C.textMuted }}>
              {needsClean
                ? 'Food cargo — every container must be certified clean before it leaves the yard.'
                : 'General cargo — no cleanliness certificate required.'}
            </div>
          </div>
          <button
            onClick={() => actions.setFoodGrade(!needsClean, session.name)}
            className={cls.btnSecondary}
            style={{ fontSize: 11, padding: '4px 9px', flexShrink: 0 }}
          >
            Simulate: {needsClean ? 'general cargo' : 'food cargo'}
          </button>
        </div>
      </SectionCard>

      {needsClean && (
        <div
          style={{ background: cleanBlocked ? C.red.bg : C.green.bg, border: `1px solid ${cleanBlocked ? C.red.border : C.green.border}`, borderRadius: 6 }}
          className="px-4 py-3.5 mb-5"
        >
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={clean}
              onChange={e => setClean(e.target.checked)}
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            <div>
              <div className="text-[13px] font-medium" style={{ color: cleanBlocked ? C.red.text : C.green.text }}>
                Container inspected and certified clean for food cargo
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: cleanBlocked ? '#fca5a5' : '#86efac' }}>
                {cleanBlocked
                  ? 'Handover is blocked until this is certified. A dirty container loaded with food cargo is a rejected shipment at destination.'
                  : `Certified by ${session.name} — recorded against each container handed over.`}
              </div>
            </div>
          </label>
          <div
            style={{ background: C.amber.bg, border: `1px solid ${C.amber.border}`, borderRadius: 5 }}
            className="mt-3 px-3 py-2 text-[11px]"
          >
            <span style={{ color: C.amber.text }}>
              <strong>Open question.</strong> Who certifies this — the depot, as here, or a third-party food-grade
              surveyor whose certificate gets uploaded? Not decided yet; a document upload slots in here if it's the latter.
            </span>
          </div>
        </div>
      )}

      <SectionCard title="Booking Lookup">
        <div className="flex items-end gap-3">
          <Field label="Booking Number" className="flex-1">
            <Input mono value={BOOKING.id} readOnly />
          </Field>
          <div className="flex gap-2">
            {(['single', 'batch'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={mode === m ? cls.btnPrimary : cls.btnSecondary}
                style={{ fontSize: 12, padding: '8px 12px' }}
              >
                {m === 'single' ? 'Single container' : "Day's out-report"}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {done ? (
        <div style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }} className="px-4 py-3.5">
          <div className="text-[13px]" style={{ color: C.green.text }}>
            {recorded.map(c => c.number).join(', ')} handed over — Depot In → Depot Out, allocated to {BOOKING.id}.
            {recorded.every(c => c.cleanCertified) && needsClean ? ' All certified food-grade clean.' : ''}
          </div>
          <button onClick={() => onNavigate('container-tracking')} className={`${cls.btnPrimary} mt-3`}>
            View Container Tracking →
          </button>
        </div>
      ) : mode === 'single' ? (
        <SectionCard title="Record Container">
          <Field label="Container Number" className="mb-4">
            <Input
              mono
              placeholder={nextContainer || 'All containers recorded'}
              value={containerNumber}
              onChange={e => setContainerNumber(e.target.value)}
            />
          </Field>
          <div className="flex items-center gap-3">
            <button
              className={cls.btnPrimary}
              onClick={handleSingle}
              disabled={cleanBlocked}
              style={cleanBlocked ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            >
              Confirm Handover{remaining.length > 1 ? ` (${remaining.length} left)` : ''}
            </button>
            {cleanBlocked && (
              <span className="text-[11px]" style={{ color: C.red.text }}>Certify the container clean first.</span>
            )}
          </div>
        </SectionCard>
      ) : (
        <SectionCard
          title="Day's Out-Report"
          action={
            <button onClick={handleUpload} className={cls.btnSecondary} style={{ fontSize: 12, padding: '4px 10px' }}>
              <Icon.upload /> Upload Excel
            </button>
          }
        >
          <p className="text-[12px] mb-3" style={{ color: C.textMuted }}>
            The yard sends this each evening: every container that went out that day, against its booking number. Paste the
            container numbers, or upload the yard's spreadsheet.
          </p>
          {uploaded && (
            <div className="flex items-center gap-2 text-[12px] mb-3" style={{ color: C.green.text }}>
              <Icon.check /> <span>out-report-14nov.xlsx parsed — {remaining.length} containers for this booking</span>
            </div>
          )}
          <Field label="Container Numbers (one per line, or comma separated)" className="mb-3">
            <textarea
              className={`${cls.input} resize-none font-mono`}
              rows={4}
              value={batchText}
              onChange={e => setBatchText(e.target.value)}
              placeholder={remaining.join('\n')}
            />
          </Field>
          <div className="flex items-center gap-3">
            <button
              className={cls.btnPrimary}
              onClick={handleBatch}
              disabled={cleanBlocked || batchNumbers.length === 0}
              style={cleanBlocked || batchNumbers.length === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            >
              Record {batchNumbers.length || ''} Container{batchNumbers.length === 1 ? '' : 's'}
            </button>
            {cleanBlocked && (
              <span className="text-[11px]" style={{ color: C.red.text }}>Certify the containers clean first.</span>
            )}
          </div>
          <div
            style={{ background: C.amber.bg, border: `1px solid ${C.amber.border}`, borderRadius: 5 }}
            className="mt-4 px-3 py-2 text-[11px]"
          >
            <span style={{ color: C.amber.text }}>
              The Excel upload is a stand-in — the real column set (container no. + gate date + ?) hasn't been confirmed
              with the yards yet.
            </span>
          </div>
        </SectionCard>
      )}

      {recorded.length > 0 && !done && (
        <div className="text-[12px] mt-4" style={{ color: C.textMuted }}>
          Recorded so far: <MonoRef>{recorded.map(c => c.number).join(', ')}</MonoRef>
        </div>
      )}
    </div>
  )
}
