import { useState } from 'react'
import { Screen } from '../types'
import { cls, C, MonoRef, Icon } from '../components/ui'

const SAILINGS = [
  {
    id: 'v1',
    vessel: 'MSC Gulsun',
    line: 'MSC',
    voyage: '2411E',
    etd: '22 Nov 2024',
    eta: '14 Dec 2024',
    transit: 22,
    cutoff: '20 Nov 2024, 18:00',
    spaces: 12,
    highlight: true,
  },
  {
    id: 'v2',
    vessel: 'CMA CGM Marco Polo',
    line: 'CMA CGM',
    voyage: '2411S',
    etd: '25 Nov 2024',
    eta: '18 Dec 2024',
    transit: 23,
    cutoff: '23 Nov 2024, 12:00',
    spaces: 8,
    highlight: false,
  },
  {
    id: 'v3',
    vessel: 'Maersk Elba',
    line: 'Maersk',
    voyage: '411E',
    etd: '29 Nov 2024',
    eta: '21 Dec 2024',
    transit: 22,
    cutoff: '27 Nov 2024, 18:00',
    spaces: 24,
    highlight: false,
  },
]

export default function SelectSailing({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const sailing = SAILINGS.find(s => s.id === selected)

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
              <div className="font-semibold" style={{ color: '#4ade80' }}>Sailing confirmed</div>
              <div className="text-[12px]" style={{ color: '#86efac' }}>Your booking is fully confirmed. The CRO will be issued shortly.</div>
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
          <button onClick={() => onNavigate('cro-release')} className={cls.btnPrimary}>
            View CRO →
          </button>
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
            onClick={() => selected && setConfirmed(true)}
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
