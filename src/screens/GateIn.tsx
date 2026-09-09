import { useState } from 'react'
import { Screen } from '../types'
import { PageHeader, SectionCard, cls, C, Badge, MonoRef, Icon } from '../components/ui'

const CONTAINERS = [
  { number: 'MSCU3841290', type: '40ft HC' },
  { number: 'MSCU4012876', type: '40ft HC' },
]

export default function GateIn({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({})

  const allConfirmed = CONTAINERS.every(c => confirmed[c.number])

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Gate In"
        subtitle="Container must reach the terminal inside the port's own cutoff window before the vessel."
      />

      <SectionCard title="Cutoff Window">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>Vessel ETD</div>
            <span className="text-[13px]" style={{ color: C.text }}>22 Nov 2024</span>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>Gate-In Cutoff</div>
            <span className="text-[13px]" style={{ color: C.text }}>2 days prior to vessel (port-set)</span>
          </div>
        </div>
        <div
          style={{ background: '#231a06', border: '1px solid #854d0e', borderRadius: 6 }}
          className="flex items-start gap-3 px-4 py-3"
        >
          <span style={{ color: '#fbbf24', marginTop: 1 }}><Icon.warning /></span>
          <div className="text-[12px]" style={{ color: '#fde68a' }}>
            Checked manually via the port's own portal today — no direct integration yet.
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Containers">
        <div style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }} className="overflow-hidden">
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Container No.', 'Type', 'Gate In', ''].map(h => (
                  <th key={h} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTAINERS.map((c, i) => (
                <tr key={c.number} style={{ borderBottom: i < CONTAINERS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <td className={cls.tableCell}><MonoRef>{c.number}</MonoRef></td>
                  <td className={cls.tableCell}>{c.type}</td>
                  <td className={cls.tableCell}>
                    <Badge variant={confirmed[c.number] ? 'confirmed' : 'pending'} label={confirmed[c.number] ? 'Confirmed' : 'Pending'} />
                  </td>
                  <td className={cls.tableCell} style={{ textAlign: 'right' }}>
                    {!confirmed[c.number] && (
                      <button
                        onClick={() => setConfirmed(prev => ({ ...prev, [c.number]: true }))}
                        className={cls.btnSecondary}
                        style={{ fontSize: 12, padding: '4px 10px' }}
                      >
                        Confirm Gate In
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => onNavigate('bl-draft')}
          disabled={!allConfirmed}
          className={cls.btnPrimary}
          style={!allConfirmed ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
        >
          Continue to BL Draft →
        </button>
      </div>
    </div>
  )
}
