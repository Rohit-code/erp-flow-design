import { Screen, Session } from '../types'
import { BOOKING } from '../data/booking'
import { useBooking } from '../state/BookingContext'
import { PageHeader, SectionCard, cls, C, Badge, MonoRef, Icon } from '../components/ui'

// Load Vessel — where a container stops being a plan and becomes cargo at sea.
// Setting SOB (shipped on board) here is what makes the Bill of Lading truthful
// and what the freight invoice is raised against.
//
// A container can only be loaded if it was gated in: you cannot ship a box that
// never reached the terminal. Containers that miss the vessel stay unloaded and
// are what "shut out" means.

export default function LoadVessel({ session, onNavigate }: { session: Session; onNavigate: (s: Screen) => void }) {
  const { booking, actions, sailing } = useBooking()

  const containers = booking.containers
  const gatedIn = containers.filter(c => c.gatedIn)
  const loaded = containers.filter(c => c.sob)
  const shutOut = gatedIn.filter(c => !c.sob)
  const allLoaded = containers.length > 0 && containers.every(c => c.sob)

  if (containers.length === 0) {
    return (
      <div className="max-w-2xl">
        <PageHeader breadcrumb={`Bookings / ${BOOKING.id}`} title="Load Vessel" subtitle={`${BOOKING.id} · ${BOOKING.customer} — record shipped-on-board against the vessel`} />
        <SectionCard>
          <p className="text-[13px]" style={{ color: C.textMuted }}>
            No containers on this booking yet. They appear once the depot has handed them over and Ops has recorded gate-in
            at the terminal.
          </p>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        breadcrumb={`Bookings / ${BOOKING.id}`}
        title="Load Vessel"
        subtitle={sailing ? `${BOOKING.id} · ${sailing.vessel} · Voyage ${sailing.voyage} · ETD ${sailing.etd}` : `${BOOKING.id} · No vessel selected yet`}
        actions={
          <Badge
            variant={allLoaded ? 'approved' : loaded.length ? 'pending' : 'awaiting'}
            label={allLoaded ? 'All Loaded' : `${loaded.length} of ${containers.length} loaded`}
          />
        }
      />

      <div
        style={{ background: C.blue.bg, border: `1px solid ${C.blue.border}`, borderRadius: 6 }}
        className="flex items-start gap-3 px-4 py-3 mb-5"
      >
        <span style={{ color: C.blue.text, marginTop: 1 }}><Icon.warning /></span>
        <div className="text-[12px]" style={{ color: C.blue.text }}>
          <strong>SOB is what makes the BL true.</strong> A Bill of Lading confirmed for a container that never sailed is a
          real claim risk — the freight invoice is raised against this, not against the booking.
        </div>
      </div>

      <SectionCard title="Containers">
        <div style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }} className="overflow-hidden">
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Container No.', 'Gate In', 'Shipped On Board', ''].map(h => (
                  <th key={h} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {containers.map((c, i) => (
                <tr key={c.number} style={{ borderBottom: i < containers.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <td className={cls.tableCell}><MonoRef>{c.number}</MonoRef></td>
                  <td className={cls.tableCell}>
                    <Badge variant={c.gatedIn ? 'confirmed' : 'pending'} label={c.gatedIn ? 'Received' : 'Not gated in'} />
                  </td>
                  <td className={cls.tableCell}>
                    {c.sob
                      ? <Badge variant="approved" label={`SOB ${c.sobDate}`} />
                      : <Badge variant="pending" label="Not loaded" />
                    }
                  </td>
                  <td className={cls.tableCell} style={{ textAlign: 'right' }}>
                    {!c.sob && c.gatedIn && (
                      <button
                        onClick={() => actions.confirmLoaded(c.number, session.name)}
                        className={cls.btnSecondary}
                        style={{ fontSize: 12, padding: '4px 10px' }}
                      >
                        Confirm Loaded
                      </button>
                    )}
                    {!c.gatedIn && (
                      <span className="text-[11px]" style={{ color: C.textMuted }}>Gate in first</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {shutOut.length > 0 && loaded.length > 0 && (
          <div
            style={{ background: C.amber.bg, border: `1px solid ${C.amber.border}`, borderRadius: 6 }}
            className="mt-4 px-4 py-3 text-[12px]"
          >
            <strong style={{ color: C.amber.text }}>Partial load.</strong>{' '}
            <span style={{ color: C.amber.text }}>
              {shutOut.map(c => c.number).join(', ')} reached the terminal but has not been loaded. If the vessel sails
              without it, it is shut out and the BL must not cover it.
            </span>
          </div>
        )}
      </SectionCard>

      {allLoaded && (
        <div
          style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }}
          className="flex items-center justify-between px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <Icon.check />
            <span className="text-sm font-medium" style={{ color: C.green.text }}>
              All {containers.length} containers shipped on board — the BL can be confirmed and the invoice raised.
            </span>
          </div>
          <button onClick={() => onNavigate('bl-draft')} className={cls.btnPrimary} style={{ flexShrink: 0 }}>
            Continue to BL Draft →
          </button>
        </div>
      )}

      {!allLoaded && (
        <div className="text-[12px]" style={{ color: C.textMuted }}>
          {BOOKING.id} · {containers.length - loaded.length} container
          {containers.length - loaded.length === 1 ? '' : 's'} still to load.
        </div>
      )}
    </div>
  )
}
