import { useState } from 'react'
import { Screen, Role, Session } from '../types'
import { PageHeader, SectionCard, cls, C, Badge, Icon } from '../components/ui'
import { BOOKING } from '../data/booking'
import { useBooking } from '../state/BookingContext'

// The Surrender/Original decision is NOT made here — the customer made it at
// BL-drafting time and it is printed on the BL. This screen only carries it out.
export default function MBLRelease({
  role, session, onNavigate,
}: {
  role: Role
  session: Session
  onNavigate: (s: Screen) => void
}) {
  const { booking, actions } = useBooking()
  const { mblType } = booking
  // Warn at BL confirmation, block here. Confirming draft wording is reversible;
  // releasing the document of title for cargo that never sailed is not.
  const notLoaded = booking.containers.filter(c => !c.sob)
  const sobOk = booking.containers.length > 0 && notLoaded.length === 0
  const released = booking.mblReleased

  const isCustomer = role === 'customer'
  const label = mblType === 'surrender' ? 'Surrender MBL' : mblType === 'original' ? 'Original MBL' : null

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb="Master Bill of Lading"
        title="Master Bill of Lading"
        subtitle={`${BOOKING.id} · ${BOOKING.customer} · ${BOOKING.pol} → ${BOOKING.pod}`}
        actions={<Badge variant={released ? 'active' : 'pending'} label={released ? 'Released' : 'Pending'} />}
      />

      <SectionCard title="Release Type">
        {label ? (
          <div className="flex items-center gap-2">
            <Badge variant="approved" label={label} />
            <span className="text-[12px]" style={{ color: C.textMuted }}>
              {mblType === 'surrender'
                ? 'Stamped surrendered and kept in-office — chosen by the customer when they approved the BL draft.'
                : 'Physically issued and couriered — chosen by the customer when they approved the BL draft.'}
            </span>
          </div>
        ) : (
          <div className="text-[12px]" style={{ color: C.amber.text }}>
            No BL type on file — the customer chooses Surrender or Original when approving the BL draft. Approve the draft
            first; the MBL cannot be released without it.
          </div>
        )}
      </SectionCard>

      {!isCustomer && !released && (
        <SectionCard title="Release">
          <p className="text-[13px] mb-3" style={{ color: C.textMuted }}>
            {!label
              ? 'Blocked — the BL draft has not been approved, so there is no release type to act on.'
              : !sobOk
                ? `Blocked — ${notLoaded.length === booking.containers.length ? 'no container has' : `${notLoaded.length} container${notLoaded.length === 1 ? ' has' : 's have'}`} a shipped-on-board record. The MBL is the document of title; it is not released for cargo that has not sailed.`
                : `Invoice settled. The Master Bill of Lading can now be released as a ${label}.`}
          </p>
          {!sobOk && label && (
            <div style={{ background: C.red.bg, border: `1px solid ${C.red.border}`, borderRadius: 6 }} className="px-4 py-3 mb-3 text-[12px]">
              <span style={{ color: C.red.text }}>
                Outstanding: {notLoaded.map(c => c.number).join(', ') || 'no containers on this booking'}. Record SOB on
                the Load Vessel screen first.
              </span>
            </div>
          )}
          <button
            onClick={() => actions.releaseMbl(session.name)}
            disabled={!label || !sobOk}
            className={cls.btnPrimary}
            style={!label || !sobOk ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
          >
            Release MBL
          </button>
        </SectionCard>
      )}

      {!isCustomer && released && (
        <div style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }} className="flex items-center gap-2 px-4 py-3 mb-5">
          <Icon.check />
          <span className="text-sm font-medium" style={{ color: C.green.text }}>{label} released</span>
        </div>
      )}

      {isCustomer && !released && (
        <SectionCard title="Master Bill of Lading">
          <p className="text-[13px]" style={{ color: C.textMuted }}>
            {label
              ? `Awaiting release from Ops. It will be issued as the ${label} you chose when approving the BL draft.`
              : 'Awaiting release from Ops.'}
          </p>
        </SectionCard>
      )}



      {released && (
        <div style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }} className="flex items-center justify-between px-4 py-3">
          <span className="text-[12px]" style={{ color: C.textMuted }}>
            End of the export booking flow — everything above is recorded in the Order Timeline.
          </span>
          <button onClick={() => onNavigate('order-timeline')} className={cls.btnSecondary}>
            <Icon.timeline /> View Order Timeline
          </button>
        </div>
      )}
    </div>
  )
}
