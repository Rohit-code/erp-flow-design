import { useState } from 'react'
import { Screen, Session } from '../types'
import { SAILINGS } from '../data/sailings'
import { useBooking } from '../state/BookingContext'
import { cls, C, MonoRef, Icon } from '../components/ui'


export default function SelectSailing({ session, onNavigate }: { session: Session; onNavigate: (s: Screen) => void }) {
  const { booking, actions } = useBooking()
  const [selected, setSelected] = useState<string | null>(booking.sailingId)
  const confirmed = booking.sailingId !== null

  const sailing = SAILINGS.find(s => s.id === (booking.sailingId ?? selected))

  return (
    <div>
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-widest font-semibold mb-1" style={{ color: C.textMuted }}>
          Booking · <MonoRef>BKG-2024-00142</MonoRef>
        </div>
        <h1 className="text-xl font-semibold mb-1" style={{ color: C.text }}>Select a Sailing</h1>
        <p className="text-sm" style={{ color: C.textMuted }}>
          Choose a voyage for <strong style={{ color: C.textSubtle }}>INNSA → CNSHA</strong> · 2 × 40ft High Cube
        </p>
      </div>

      {confirmed && sailing ? (
        <div style={{ background: C.green.bg, border: '1px solid #166534', borderRadius: 8 }} className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ width: 38, height: 38, borderRadius: 8, background: '#14532d' }} className="flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="font-semibold" style={{ color: '#4ade80' }}>Sailing confirmed — your part is done</div>
              <div className="text-[12px]" style={{ color: '#86efac' }}>
                KYC, addresses and sailing are all complete. Your booking has gone to our operations team for acceptance.
              </div>
            </div>
          </div>

          {/* The three tasks the customer completes in one session — all must be
              done before the booking can reach Ops. */}
          <div style={{ background: '#0d2818', border: '1px solid #166534', borderRadius: 6 }} className="p-4 mb-4">
            <div className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#4ade8099' }}>
              Booking Completion
            </div>
            <div className="space-y-2">
              {[
                booking.kycStatus === 'approved' ? 'KYC / KYV approved' : 'KYC / KYV submitted — under review',
                `Billing address selected · ${booking.shippingAddressIds.length} shipping address${booking.shippingAddressIds.length === 1 ? '' : 'es'} selected`,
                `Voyage selected — ${sailing.vessel} / ${sailing.voyage}`,
              ].map(item => (
                <div key={item} className="flex items-center gap-2.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M2 6l3 3 5-6" stroke="#4ade80" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[12px]" style={{ color: '#86efac' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#0d2818', border: '1px solid #166534', borderRadius: 6 }} className="p-4 mb-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Vessel', v: sailing.vessel },
                { l: 'Voyage', v: sailing.voyage },
                { l: 'ETD', v: sailing.etd },
                { l: 'ETA', v: sailing.eta },
                { l: 'Transit Days', v: `${sailing.transit} days` },
                { l: 'SI Cutoff', v: sailing.cutoff },
              ].map(f => (
                <div key={f.l}>
                  <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: '#4ade8066' }}>{f.l}</div>
                  <div className="text-[13px]" style={{ color: '#86efac' }}>{f.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{ background: '#0d1d35', border: '1px solid #1e3a5f', borderRadius: 6 }}
            className="flex items-start gap-3 px-4 py-3"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="7" cy="7" r="5.5" stroke="#93c5fd" strokeWidth="1.2"/>
              <path d="M7 4v3.5l2 1.5" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <div className="text-[12px]" style={{ color: '#93c5fd' }}>
              <strong>Awaiting operations acceptance.</strong> Your Container Release Order is issued once Ops accepts —
              you'll be notified, and it will appear under CRO in your portal. Nothing is released to the depot before then.
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-5">
            {SAILINGS.map(s => {
              const isSelected = selected === s.id
              return (
                <div
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  style={{
                    background: isSelected ? '#0d1d35' : '#15171d',
                    border: `1px solid ${isSelected ? C.accent : s.highlight ? '#2d3d5a' : C.border}`,
                    borderRadius: 8, padding: '16px 18px', cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  {s.highlight && (
                    <div
                      style={{ background: '#0d1d35', color: C.accentDim, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 3, display: 'inline-block', marginBottom: 10 }}
                    >
                      EARLIEST AVAILABLE
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Radio */}
                      <div
                        style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                          border: `2px solid ${isSelected ? C.accent : C.border}`,
                          background: isSelected ? C.accent : 'transparent',
                          transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {isSelected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[14px] font-semibold" style={{ color: isSelected ? C.accentDim : C.text }}>{s.vessel}</span>
                          <span className="font-mono text-[11px]" style={{ color: C.textMuted }}>{s.line} · {s.voyage}</span>
                        </div>

                        <div className="flex items-center gap-4 text-[12px]" style={{ color: C.textMuted }}>
                          <span>ETD <strong style={{ color: C.textSubtle }}>{s.etd}</strong></span>
                          <svg width="28" height="8" viewBox="0 0 28 8" fill="none"><path d="M0 4h24M20 1l4 3-4 3" stroke="#3d4456" strokeWidth="1.2" strokeLinecap="round"/></svg>
                          <span>ETA <strong style={{ color: C.textSubtle }}>{s.eta}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 text-right flex-shrink-0">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>Transit</div>
                        <div className="font-mono text-[14px] font-medium" style={{ color: isSelected ? C.accentDim : C.text }}>{s.transit}d</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>Spaces</div>
                        <div className="font-mono text-[14px] font-medium" style={{ color: s.spaces < 10 ? '#fbbf24' : C.textSubtle }}>{s.spaces}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>SI Cutoff</div>
                        <div className="text-[12px]" style={{ color: C.textMuted }}>{s.cutoff}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => selected && actions.selectSailing(selected, session.name)}
            disabled={!selected}
            className={`${cls.btnPrimary} w-full justify-center py-3`}
            style={{ fontSize: 14, opacity: selected ? 1 : 0.4 }}
          >
            Confirm Sailing Selection
          </button>
        </>
      )}
    </div>
  )
}
