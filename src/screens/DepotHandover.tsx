import { useState } from 'react'
import { Screen } from '../types'
import { PageHeader, SectionCard, cls, C, Badge, Field, Input } from '../components/ui'

export default function DepotHandover({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [bookingNumber, setBookingNumber] = useState('BKG-2024-00142')
  const [lookedUp, setLookedUp] = useState(false)
  const [containerNumber, setContainerNumber] = useState('')
  const [depotOut, setDepotOut] = useState(false)
  const [handedOver, setHandedOver] = useState(false)

  return (
    <div>
      <PageHeader
        title="Container Handover"
        subtitle="Record the container(s) handed over against a booking"
      />

      <SectionCard title="Booking Lookup">
        <div className="flex items-end gap-3">
          <Field label="Booking Number" className="flex-1">
            <Input mono value={bookingNumber} onChange={e => setBookingNumber(e.target.value)} />
          </Field>
          <button className={cls.btnPrimary} onClick={() => setLookedUp(true)}>
            Look Up
          </button>
        </div>
      </SectionCard>

      {lookedUp && (
        <SectionCard title="Record Container">
          <Field label="Container Number" className="mb-4">
            <Input
              mono
              placeholder="MSCU3841290"
              value={containerNumber}
              onChange={e => setContainerNumber(e.target.value)}
              disabled={handedOver}
            />
          </Field>

          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px]" style={{ color: C.textMuted }}>Current status</span>
            {depotOut
              ? <Badge variant="rejected" label="Depot Out — already allocated elsewhere" />
              : <Badge variant="approved" label="Depot In (open)" />
            }
          </div>

          {!handedOver && (
            <button
              className={cls.btnSecondary + ' mb-4'}
              onClick={() => setDepotOut(d => !d)}
            >
              Simulate: already Depot Out
            </button>
          )}

          {handedOver && (
            <div style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }} className="px-4 py-3 text-[13px]" >
              <span style={{ color: C.green.text }}>
                Container MSCU3841290 handed over — status updated Depot In → Depot Out, allocated to BKG-2024-00142.
              </span>
            </div>
          )}

          {!handedOver && depotOut && (
            <div style={{ background: C.red.bg, border: `1px solid ${C.red.border}`, borderRadius: 6 }} className="px-4 py-3 text-[13px]">
              <span style={{ color: C.red.text }}>
                Blocked — container already Depot Out / assigned elsewhere.
              </span>
            </div>
          )}

          {!handedOver && !depotOut && (
            <button className={cls.btnPrimary} onClick={() => setHandedOver(true)}>
              Confirm Handover
            </button>
          )}
        </SectionCard>
      )}
    </div>
  )
}
