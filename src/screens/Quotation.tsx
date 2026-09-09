import { useState } from 'react'
import { Screen, Role, Session } from '../types'
import { ROLE_LABEL } from '../auth'
import { getQuotation, NegoEntry } from '../data/quotations'
import { useBooking } from '../state/BookingContext'
import { BOOKING } from '../data/booking'
import { assessMargin, splitRate, RATE_UNIT, FLOOR_MARGIN_PCT, FLOOR_MARGIN_IS_PROVISIONAL } from '../data/pricing'
import { PageHeader, SectionCard, cls, C, Badge, MonoRef, Icon, Input, Field, Textarea } from '../components/ui'

// The action set is role-driven, per the decided rules:
// Customer -> Counter, Accept. Sales -> Negotiate, Accept — but the moment the
// rate on the table falls below the FLOOR MARGIN (not merely below cost), Sales
// loses both and gets exactly one option: Send to Trade. A rate a dollar above
// cost is still Red. Trade -> Decline, Negotiate, Accept (unconditional).
function actionsFor(role: Role, belowFloor: boolean): Array<'counter' | 'negotiate' | 'accept' | 'decline' | 'send-to-trade'> {
  if (role === 'trade') return ['decline', 'negotiate', 'accept']
  if (role === 'customer') return ['counter', 'accept']
  if (role === 'sales') return belowFloor ? ['send-to-trade'] : ['negotiate', 'accept']
  return []
}

export default function Quotation({ role, session, id, onNavigate }: { role: Role; session: Session; id: string; onNavigate: (s: Screen) => void }) {
  const record = getQuotation(id)
  const { actions: bookingActions } = useBooking()
  const [status, setStatus] = useState(record.status)
  const [history, setHistory] = useState<NegoEntry[]>(record.history)
  const [counterRate, setCounterRate] = useState('')
  const [counterNote, setCounterNote] = useState('')
  const [showCounter, setShowCounter] = useState(false)
  const [showAccept, setShowAccept] = useState(false)
  const [acceptNote, setAcceptNote] = useState('Accepted — proceeding to booking form.')
  const [showDecline, setShowDecline] = useState(false)
  const [declineNote, setDeclineNote] = useState('')
  const [draftRate, setDraftRate] = useState(500)
  const [draftMessage, setDraftMessage] = useState('Initial quote — happy to discuss further if this doesn\'t work for you.')
  const [noteText, setNoteText] = useState('')
  const [sentToTrade, setSentToTrade] = useState(false)

  const latestRate = history.length ? history[history.length - 1].rate : draftRate
  // Re-checked on every new number, exactly as the flow requires.
  const margin = assessMargin(latestRate, record.cost)
  const belowFloor = !margin.salesMayAccept
  const ownedByTrade = history.some(entry => entry.role === ROLE_LABEL['trade'])
  const salesHandedOff = role === 'sales' && (ownedByTrade || sentToTrade)
  const actions = salesHandedOff ? [] : actionsFor(role, belowFloor)
  // "Negotiate" is the term for opening/adjusting a rate before the customer has
  // pushed back. The moment the customer has made their own counter, everyone
  // still moving the rate — Sales, Trade — is now countering that counter, so
  // the same button switches to "Counter" for the rest of the thread.
  const hasCustomerCountered = history.some(entry => entry.role === ROLE_LABEL['customer'] && entry.type === 'counter')
  const counterVerb = (role === 'customer' || hasCustomerCountered) ? 'counter' : 'negotiate'

  const addEntry = (type: NegoEntry['type'], rate: number, note: string, internalNote?: string) => {
    setHistory(prev => [...prev, {
      actor: session.name, role: ROLE_LABEL[role], type, rate, note, internalNote, ts: 'Now'
    }])
  }

  const handleAccept = () => {
    const rate = history[history.length - 1].rate
    addEntry('accept', rate, acceptNote.trim() || 'Accepted.')
    setStatus('accepted')
    setShowAccept(false)
    // Only the booking this prototype walks feeds the shared booking state.
    if (record.id === BOOKING.quotationId) bookingActions.agreeRate(rate, session.name, ROLE_LABEL[role])
  }
  const handleDecline = () => {
    addEntry('decline', history[history.length - 1].rate, declineNote.trim() || 'Declined.')
    setStatus('rejected')
    setShowDecline(false)
  }
  const handleCounter = () => {
    const rate = parseInt(counterRate)
    if (!rate) return
    addEntry(counterVerb, rate, counterNote)
    setStatus('countered')
    setCounterRate('')
    setCounterNote('')
    setShowCounter(false)
  }
  const handleSendDraft = () => {
    addEntry('offer', draftRate, draftMessage)
    setStatus('sent')
  }
  const handleAddNote = () => {
    if (!noteText.trim()) return
    addEntry('note', history[history.length - 1]?.rate ?? draftRate, noteText)
    setNoteText('')
  }
  const handleSendToTrade = () => {
    addEntry(
      'note',
      latestRate,
      'Passed to our trade desk for review.',
      `Routed to Trade — USD ${latestRate} is under the USD ${margin.floor} floor margin, so Sales can't accept it.`,
    )
    setSentToTrade(true)
  }

  const typeColors: Record<NegoEntry['type'], { dot: string; border: string; label: string }> = {
    offer:     { dot: '#93c5fd', border: '#1e3a5f', label: 'Offer' },
    counter:   { dot: '#fbbf24', border: '#854d0e', label: 'Counter' },
    negotiate: { dot: '#fbbf24', border: '#854d0e', label: 'Negotiate' },
    accept:    { dot: '#4ade80', border: '#166534', label: 'Accepted' },
    decline:   { dot: '#f87171', border: '#7f1d1d', label: 'Declined' },
    reject:    { dot: '#f87171', border: '#7f1d1d', label: 'Rejected' },
    note:      { dot: '#6b7280', border: '#2a2d38', label: 'Note' },
  }

  const breakdown = splitRate(history.length ? history[0].rate : draftRate)

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb={`Quotations / ${record.id}`}
        title="Quotation & Negotiation"
        subtitle={`${record.customer} · ${record.pol} → ${record.pod} · ${record.containers}`}
        actions={
          <Badge
            variant={
              status === 'accepted' ? 'accepted'
              : status === 'rejected' ? 'rejected'
              : status === 'countered' ? 'countered'
              : status === 'sent' ? 'sent'
              : 'draft'
            }
            label={status.charAt(0).toUpperCase() + status.slice(1)}
          />
        }
      />

      {status === 'draft' && history.length === 0 ? (
        <SectionCard title="Draft — Not Yet Sent">
          <p className="text-[12px] mb-3" style={{ color: C.textMuted }}>
            This quote hasn't gone to the customer yet.
          </p>
          {role === 'sales' ? (
            <>
              <div className="mb-3">
                <label className={cls.sectionTitle} style={{ color: C.textMuted }}>Rate (USD / container)</label>
                <Input type="number" mono value={draftRate} onChange={e => setDraftRate(parseInt(e.target.value) || 0)} />
              </div>
              <div className="mb-3">
                <label className={cls.sectionTitle} style={{ color: C.textMuted }}>Message to send with the quote</label>
                <textarea
                  className={`${cls.input} resize-none`}
                  rows={4}
                  value={draftMessage}
                  onChange={e => setDraftMessage(e.target.value)}
                />
              </div>
              <button onClick={handleSendDraft} className={cls.btnPrimary}>Send Quote</button>
            </>
          ) : (
            <p className="text-[12px]" style={{ color: C.textMuted }}>Waiting on Sales to send the initial quote.</p>
          )}
        </SectionCard>
      ) : (
        <SectionCard title="Quoted Rate">
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Ocean Freight', value: `USD ${breakdown.ocean}` },
              { label: 'BAF', value: `USD ${breakdown.baf}` },
              { label: 'CAF', value: `USD ${breakdown.caf}` },
              { label: 'Total All-In', value: `USD ${history[0]?.rate ?? draftRate}` },
            ].map((r, i) => (
              <div
                key={i}
                style={{ background: i === 3 ? '#0d1d35' : 'transparent', border: i === 3 ? '1px solid #1e3a5f' : 'none', borderRadius: 6, padding: i === 3 ? '10px 14px' : '0 14px 0 0', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}
              >
                <div className={cls.sectionTitle} style={{ marginBottom: 4 }}>{r.label}</div>
                <div
                  className="font-mono text-[15px] font-medium"
                  style={{ color: i === 3 ? C.accentDim : C.text }}
                >
                  {r.value} <span className="text-[11px] font-normal" style={{ color: C.textMuted }}>/ {RATE_UNIT}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 text-[12px]" style={{ color: C.textMuted }}>
            <span>Route: <MonoRef>{record.pol}</MonoRef> → <MonoRef>{record.pod}</MonoRef></span>
            <span>Validity: 7 days from issue</span>
            <span>Ref: <MonoRef>{record.id}</MonoRef></span>
          </div>
        </SectionCard>
      )}

      {/* Margin check — re-run on every new number in the thread. Internal only:
          the customer must never see our cost basis or floor. */}
      {role !== 'customer' && history.length > 0 && (
        <div
          style={{
            background: margin.salesMayAccept ? C.green.bg : C.amber.bg,
            border: `1px solid ${margin.salesMayAccept ? C.green.border : C.amber.border}`,
            borderRadius: 6,
          }}
          className="px-4 py-3.5 mb-5"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-sm font-semibold"
              style={{ color: margin.salesMayAccept ? C.green.text : C.amber.text }}
            >
              {margin.salesMayAccept ? 'BLUE' : 'RED'} — {margin.salesMayAccept ? 'Within Sales Authority' : 'Trade Authority Required'}
            </span>
            <Badge variant={margin.salesMayAccept ? 'within-authority' : 'requires-trade'} />
            <span className="text-[11px]" style={{ color: C.textMuted }}>on the current number</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2.5">
            {[
              { l: 'Cost basis', v: `USD ${margin.cost}` },
              { l: `Floor (+${Math.round(FLOOR_MARGIN_PCT * 100)}%)`, v: `USD ${margin.floor}` },
              { l: 'Rate on the table', v: `USD ${margin.rate}` },
            ].map(f => (
              <div key={f.l}>
                <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>{f.l}</div>
                <div className="font-mono text-[14px] font-medium" style={{ color: C.text }}>{f.v}</div>
              </div>
            ))}
          </div>
          <div className="text-[12px] mt-2.5" style={{ color: margin.salesMayAccept ? '#86efac' : '#fde68a' }}>
            {margin.verdict === 'blue'
              ? `USD ${margin.rate - margin.floor} clear of the floor — Sales may negotiate or accept.`
              : margin.verdict === 'below-floor'
                ? `USD ${margin.shortfall} short of the floor. Still above cost, but under the minimum margin — Sales may negotiate, only Trade may accept.`
                : `Below cost by USD ${margin.cost - margin.rate} — loss-making. Sales may negotiate, only Trade may accept.`}
          </div>
          {FLOOR_MARGIN_IS_PROVISIONAL && (
            <div className="text-[11px] mt-1.5" style={{ color: C.textMuted }}>
              Floor margin is a provisional {Math.round(FLOOR_MARGIN_PCT * 100)}% placeholder — pending the ERP team's rule.
            </div>
          )}
        </div>
      )}

      {/* Negotiation timeline */}
      {history.length > 0 && (
        <SectionCard title="Negotiation History">
          <div className="relative">
            <div style={{ position: 'absolute', left: 11, top: 12, bottom: 12, width: 1, background: C.border }} />
            <div className="space-y-5">
              {history.map((entry, i) => {
                const tc = typeColors[entry.type]
                return (
                  <div key={i} className="flex gap-4 relative">
                    <div
                      style={{
                        width: 23, height: 23, borderRadius: '50%',
                        background: C.surface, border: `2px solid ${tc.dot}`,
                        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1, position: 'relative'
                      }}
                    >
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: tc.dot }} />
                    </div>

                    <div
                      style={{ background: '#1a1d24', border: `1px solid ${C.border}`, borderRadius: 6 }}
                      className="flex-1 p-3.5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium" style={{ color: C.text }}>{entry.actor}</span>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: C.textMuted }}>{entry.role}</span>
                          <span
                            style={{ background: '#0d1a2e', color: tc.dot, border: `1px solid ${tc.border}30`, borderRadius: 4, fontSize: 10, padding: '1px 6px', fontWeight: 600 }}
                          >
                            {tc.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[13px] font-medium" style={{ color: C.accentDim }}>USD {entry.rate} / {RATE_UNIT}</span>
                          <span className="text-[11px]" style={{ color: C.textMuted }}>{entry.ts}</span>
                        </div>
                      </div>
                      {entry.note && (
                        <p className="text-[12px] leading-relaxed" style={{ color: '#8a95a6' }}>{entry.note}</p>
                      )}
                      {/* Cost basis and floor margin are ours, not the customer's. */}
                      {entry.internalNote && role !== 'customer' && (
                        <div
                          style={{ background: '#12141a', border: `1px dashed ${C.border}`, borderRadius: 4 }}
                          className="mt-2 px-2.5 py-1.5"
                        >
                          <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: C.textMuted }}>
                            Internal
                          </span>
                          <p className="text-[11.5px] leading-relaxed mt-0.5" style={{ color: '#7c8798' }}>{entry.internalNote}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </SectionCard>
      )}

      {/* Counter / negotiate form */}
      {showCounter && (
        <SectionCard title={counterVerb === 'negotiate' ? 'Negotiate Rate' : 'Counter Offer'}>
          <Field label="Rate (USD / container)" className="mb-3">
            <Input
              type="number"
              mono
              placeholder="e.g. 555"
              value={counterRate}
              onChange={e => setCounterRate(e.target.value)}
            />
          </Field>
          <Field label="Message to the other side" className="mb-3">
            <Textarea
              rows={3}
              placeholder="Explain the number — why this rate, what's driving it…"
              value={counterNote}
              onChange={e => setCounterNote(e.target.value)}
            />
          </Field>
          <div className="flex gap-2">
            <button onClick={handleCounter} className={cls.btnPrimary}>
              Submit {counterVerb === 'negotiate' ? 'Negotiation' : 'Counter'}
            </button>
            <button onClick={() => setShowCounter(false)} className={cls.btnSecondary}>Cancel</button>
          </div>
        </SectionCard>
      )}

      {/* Decline form */}
      {showDecline && (
        <SectionCard title="Decline">
          <Field label="Reason for declining">
            <Textarea rows={3} value={declineNote} onChange={e => setDeclineNote(e.target.value)} placeholder="Let them know why…" />
          </Field>
          <div className="flex gap-2 mt-3">
            <button onClick={handleDecline} className={cls.btnDanger}>Confirm Decline</button>
            <button onClick={() => setShowDecline(false)} className={cls.btnSecondary}>Cancel</button>
          </div>
        </SectionCard>
      )}

      {/* Accept form */}
      {showAccept && (
        <SectionCard title="Accept Quote">
          <Field label="Message to the other side (optional)">
            <Textarea rows={3} value={acceptNote} onChange={e => setAcceptNote(e.target.value)} />
          </Field>
          <div className="flex gap-2 mt-3">
            <button onClick={handleAccept} className={cls.btnPrimary}><Icon.check /> Confirm Accept</button>
            <button onClick={() => setShowAccept(false)} className={cls.btnSecondary}>Cancel</button>
          </div>
        </SectionCard>
      )}

      {/* Actions — role-driven: Customer gets Counter+Accept, Sales gets Negotiate+Accept (or just
          Send to Trade the moment the rate is below cost), Trade gets Decline+Negotiate+Accept */}
      {history.length > 0 && status !== 'accepted' && status !== 'rejected' && (
        actions.includes('send-to-trade') ? (
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSendToTrade} className={cls.btnAmber}>Send to Trade</button>
            <span className="text-[11px]" style={{ color: '#fbbf24' }}>
              USD {latestRate} is under the USD {margin.floor} floor — Sales can't Negotiate or Accept this one.
            </span>
          </div>
        ) : actions.length > 0 ? (
          <div className="flex items-center gap-2 pt-2">
            {actions.includes('decline') && !showDecline && (
              <button onClick={() => setShowDecline(true)} className={cls.btnDanger}>Decline</button>
            )}
            {(actions.includes('counter') || actions.includes('negotiate')) && !showCounter && (
              <button onClick={() => setShowCounter(true)} className={cls.btnAmber}>
                {counterVerb === 'negotiate' ? 'Negotiate' : 'Counter'}
              </button>
            )}
            <div className="flex-1" />
            {actions.includes('accept') && !showAccept && (
              <button onClick={() => setShowAccept(true)} className={cls.btnPrimary}>
                <Icon.check /> Accept Quote
              </button>
            )}
          </div>
        ) : (
          <SectionCard>
            <p className="text-[12px] mb-3" style={{ color: C.textMuted }}>
              {ownedByTrade
                ? "Escalated to Trade — you can't Counter, Negotiate, or Accept here, but you can still leave a note for Trade."
                : sentToTrade
                  ? 'Sent to Trade — awaiting their response. You can still leave a note.'
                  : 'Read-only — negotiation actions belong to Customer, Sales, or Trade. You can still leave a note.'}
            </p>
            <div className="flex gap-2">
              <input
                className={cls.input}
                placeholder="Add a note for the thread…"
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddNote() }}
              />
              <button onClick={handleAddNote} className={cls.btnSecondary} style={{ flexShrink: 0 }}>Add Note</button>
            </div>
          </SectionCard>
        )
      )}

      {status === 'accepted' && (
        <div
          style={{ background: C.green.bg, border: '1px solid #166534', borderRadius: 6 }}
          className="flex items-center justify-between px-4 py-3 mt-2"
        >
          <div className="flex items-center gap-2">
            <Icon.check />
            <span className="text-sm font-medium" style={{ color: C.green.text }}>
              Rate agreed at USD {latestRate} / {RATE_UNIT} — customer now completes KYC, addresses and sailing in the portal
            </span>
          </div>
          <button onClick={() => onNavigate('kyc-form')} className={cls.btnPrimary} style={{ fontSize: 12, padding: '5px 10px' }}>
            Continue to KYC →
          </button>
        </div>
      )}

      {status === 'rejected' && (
        <div
          style={{ background: C.red.bg, border: '1px solid #7f1d1d', borderRadius: 6 }}
          className="flex items-center gap-2 px-4 py-3 mt-2"
        >
          <Icon.warning />
          <span className="text-sm font-medium" style={{ color: C.red.text }}>Quote rejected — customer declined outright. Inquiry marked Lost.</span>
        </div>
      )}
    </div>
  )
}
