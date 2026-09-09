import { useState } from 'react'
import { Screen } from '../types'
import { cls, C, Badge, MonoRef, Icon } from '../components/ui'

const ADDRESSES = [
  {
    id: 'addr-1',
    name: 'Registered Office — Mumbai',
    entity: 'Stellar Exports Private Limited',
    line1: 'Plot 14, SEEPZ SEZ, Andheri East',
    city: 'Mumbai', state: 'Maharashtra', pin: '400 096', country: 'India',
    gstin: '27AAGCS3460Q1Z5',
    approved: true,
    approvedDate: '02 Sep 2024',
  },
  {
    id: 'addr-2',
    name: 'Warehouse / Dispatch Address',
    entity: 'Stellar Exports Private Limited',
    line1: 'Unit 7B, Trans-Thane Creek Industrial Area',
    city: 'Thane', state: 'Maharashtra', pin: '400 604', country: 'India',
    gstin: '27AAGCS3460Q1Z5',
    approved: true,
    approvedDate: '12 Oct 2024',
  },
  {
    id: 'addr-3',
    name: 'Branch Office — Delhi',
    entity: 'Stellar Exports Private Limited',
    line1: '4th Floor, DLF Cyber Hub, Gurugram',
    city: 'Gurugram', state: 'Haryana', pin: '122 002', country: 'India',
    gstin: '06AAGCS3460Q1ZZ',
    approved: false,
    approvedDate: null,
  },
]

export default function AddressSelect({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState<string | null>('addr-1')
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div>
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-widest font-semibold mb-1" style={{ color: C.textMuted }}>
          Booking · <MonoRef>BKG-2024-00142</MonoRef>
        </div>
        <h1 className="text-xl font-semibold mb-1" style={{ color: C.text }}>Select Billing Address</h1>
        <p className="text-sm" style={{ color: C.textMuted }}>
          Choose one of your KYC-approved addresses for this booking. Only approved addresses are selectable.
        </p>
      </div>

      {confirmed ? (
        <div style={{ background: C.green.bg, border: '1px solid #166534', borderRadius: 6 }} className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 36, height: 36, borderRadius: 6, background: '#14532d' }} className="flex items-center justify-center flex-shrink-0">
              <Icon.check />
            </div>
            <div>
              <div className="font-semibold" style={{ color: '#4ade80' }}>Address confirmed</div>
              <div className="text-[12px]" style={{ color: '#86efac' }}>Your booking will proceed automatically.</div>
            </div>
          </div>
          <button onClick={() => onNavigate('select-sailing')} className={`${cls.btnPrimary} mt-2`}>
            Continue to Select Sailing →
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-5">
            {ADDRESSES.map(addr => {
              const isSelected = selected === addr.id
              const canSelect = addr.approved

              return (
                <button
                  key={addr.id}
                  onClick={() => canSelect && setSelected(addr.id)}
                  disabled={!canSelect}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: isSelected ? '#0d1d35' : '#15171d',
                    border: `1px solid ${isSelected ? C.accent : C.border}`,
                    borderRadius: 8,
                    padding: '16px 18px',
                    opacity: canSelect ? 1 : 0.5,
                    cursor: canSelect ? 'pointer' : 'not-allowed',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Radio */}
                    <div
                      style={{
                        width: 18, height: 18, borderRadius: '50%',
                        border: `2px solid ${isSelected ? C.accent : C.border}`,
                        background: isSelected ? C.accent : 'transparent',
                        flexShrink: 0, marginTop: 2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      {isSelected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-semibold" style={{ color: isSelected ? C.accentDim : C.text }}>
                          {addr.name}
                        </span>
                        {addr.approved
                          ? <Badge variant="approved" label="KYC Approved" />
                          : <Badge variant="pending" label="Pending Approval" />
                        }
                      </div>
                      <div className="text-[12px] mb-1" style={{ color: C.text }}>{addr.entity}</div>
                      <div className="text-[12px]" style={{ color: C.textMuted }}>
                        {addr.line1}, {addr.city}, {addr.state} {addr.pin} · {addr.country}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-[11px]" style={{ color: C.textMuted }}>
                        <span>GSTIN <MonoRef>{addr.gstin}</MonoRef></span>
                        {addr.approved && addr.approvedDate && (
                          <span>Approved {addr.approvedDate}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Request change link */}
          <div
            style={{ background: '#1a1d24', border: `1px solid ${C.border}`, borderRadius: 6 }}
            className="flex items-center justify-between px-4 py-3 mb-5"
          >
            <div>
              <div className="text-[12px] font-medium" style={{ color: C.textSubtle }}>Need a different address or new entity?</div>
              <div className="text-[11px] mt-0.5" style={{ color: C.textMuted }}>
                Address changes go through your account manager — we keep the audit trail clean.
              </div>
            </div>
            <button className={cls.btnSecondary} style={{ fontSize: 12, padding: '5px 10px', flexShrink: 0 }}>
              Ask Account Contact
            </button>
          </div>

          <button
            onClick={() => selected && setConfirmed(true)}
            disabled={!selected}
            className={cls.btnPrimary}
            style={{ opacity: selected ? 1 : 0.4, width: '100%', justifyContent: 'center', padding: '10px' }}
          >
            Confirm Address & Continue
          </button>
        </>
      )}
    </div>
  )
}
