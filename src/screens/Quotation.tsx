import { useState } from 'react'
import { Screen, Role, Session } from '../types'
import { ROLE_LABEL } from '../auth'
import { getQuotation, NegoEntry } from '../data/quotations'
import { PageHeader, SectionCard, cls, C, Badge, MonoRef, Icon, Input, Field, Textarea } from '../components/ui'

// The action set is role-driven, per the decided rules:
// Customer -> Counter, Accept. Sales -> Negotiate, Accept — but the moment the
// rate on the table is below our cost, Sales loses both and gets exactly one
// option: Send to Trade. Trade -> Decline, Negotiate, Accept (unconditional).
function actionsFor(role: Role, belowCost: boolean): Array<'counter' | 'negotiate' | 'accept' | 'decline' | 'send-to-trade'> {
  if (role === 'trade') return ['decline', 'negotiate', 'accept']
  if (role === 'customer') return ['counter', 'accept']
  if (role === 'sales') return belowCost ? ['send-to-trade'] : ['negotiate', 'accept']
  return []
}

function splitRate(total: number): { ocean: number; baf: number; caf: number } {
  const ocean = Math.round(total * 0.62)
  const baf = Math.round(total * 0.2)
  return { ocean, baf, caf: total - ocean - baf }
}

export default function Quotation({ role, session, id, onNavigate }: { role: Role; session: Session; id: string; onNavigate: (s: Screen) => void }) {
  const record = getQuotation(id)
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
  const belowCost = latestRate < record.cost
  const ownedByTrade = history.some(entry => entry.role === ROLE_LABEL['trade'])
  const salesHandedOff = role === 'sales' && (ownedByTrade || sentToTrade)
  const actions = salesHandedOff ? [] : actionsFor(role, belowCost)
  // "Negotiate" is the term for opening/adjusting a rate before the customer has
  // pushed back. The moment the customer has made their own counter, everyone
  // still moving the rate — Sales, Trade — is now countering that counter, so
  // the same button switches to "Counter" for the rest of the thread.
  const hasCustomerCountered = history.some(entry => entry.role === ROLE_LABEL['customer'] && entry.type === 'counter')
  const counterVerb = (role === 'customer' || hasCustomerCountered) ? 'counter' : 'negotiate'

  const addEntry = (type: NegoEntry['type'], rate: number, note: string) => {
    setHistory(prev => [...prev, {
      actor: session.name, role: ROLE_LABEL[role], type, rate, note, ts: 'Now'
    }])
  }

  const handleAccept = () => {
    addEntry('accept', history[history.length - 1].rate, acceptNote.trim() || 'Accepted.')
    setStatus('accepted')
    setShowAccept(false)
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
    addEntry('note', latestRate, `Routed to Trade — USD ${latestRate} is below our USD ${record.cost} cost, Sales can't accept it.`)
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
                <label className={cls.sectionTitle} style={{ color: C.textMuted }}>Rate (USD / TEU)</label>
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
                  {r.value} <span className="text-[11px] font-normal" style={{ color: C.textMuted }}>/ TEU</span>
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
                          <span className="font-mono text-[13px] font-medium" style={{ color: C.accentDim }}>USD {entry.rate} / TEU</span>
                          <span className="text-[11px]" style={{ color: C.textMuted }}>{entry.ts}</span>
                        </div>
                      </div>
                      {entry.note && (
                        <p className="text-[12px] leading-relaxed" style={{ color: '#8a95a6' }}>{entry.note}</p>
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
          <Field label="Rate (USD / TEU)" className="mb-3">
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
              USD {latestRate} is below our USD {record.cost} cost — Sales can't Negotiate or Accept this one.
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
            <span className="text-sm font-medium" style={{ color: C.green.text }}>Quote accepted at USD {latestRate} / TEU — Booking Form link will be emailed to customer</span>
          </div>
          <button onClick={() => onNavigate('booking-form')} className={cls.btnPrimary} style={{ fontSize: 12, padding: '5px 10px' }}>
            Preview Form →
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
