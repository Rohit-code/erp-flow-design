import { useState } from 'react'
import { Screen, Role, Session } from '../types'
import { getInquiry, InquiryRecord } from '../data/inquiries'
import { Field, Input, Textarea, PageHeader, SectionCard, cls, C, Badge, MonoRef, Icon } from '../components/ui'

function confColor(pct: number): string {
  if (pct === 0) return '#f87171'
  if (pct < 70) return '#fbbf24'
  return '#4ade80'
}

function ConfField({ label, value, confidence }: { label: string; value: string; confidence: number }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: C.textMuted }}>{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-[13px]" style={{ color: confidence === 0 ? C.textMuted : C.text }}>
          {confidence === 0 ? 'Not stated in mail' : value}
        </span>
        {confidence > 0 && (
          <span className="text-[10px] font-mono" style={{ color: confColor(confidence) }}>{confidence}%</span>
        )}
      </div>
    </div>
  )
}

const STATUS_NOTE_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  'awaiting-customer-info': { bg: '#0d1d35', border: '#1e3a5f', text: '#93c5fd' },
  'sent-to-trade':  { bg: '#0d1d35', border: '#1e3a5f', text: '#93c5fd' },
  'awaiting-trade': { bg: '#231a06', border: '#854d0e', text: '#fbbf24' },
  quoted:           { bg: '#0d2818', border: '#166534', text: '#4ade80' },
  declined:         { bg: '#220d0d', border: '#7f1d1d', text: '#f87171' },
}

const FIELD_LABELS: Record<string, string> = {
  pol: 'Port of Load', pod: 'Port of Discharge', containerQty: 'Container count',
  commodity: 'Commodity', targetRate: 'Target rate',
}

function draftMissingInfoMessage(record: InquiryRecord, missingLabels: string[], senderName: string): string {
  return `Hi ${record.senderName.split(' ')[0]},

Thanks for reaching out about ${record.pol} to ${record.pod}. Before I can put a quote together, could you confirm:
${missingLabels.map(l => `- ${l}`).join('\n')}

Once I have these I'll get a rate back to you.

Thanks,
${senderName}`
}

function draftQuoteMessage(record: InquiryRecord, proposedRate: number, senderName: string): string {
  return `Hi ${record.senderName.split(' ')[0]},

Thanks for your patience. Here's our quote for ${record.pol} to ${record.pod}:

USD ${proposedRate} / TEU all-in.

Let me know if you'd like to proceed, or if you'd like to discuss further.

Thanks,
${senderName}`
}

export default function InquiryDetail({
  role, session, id, onNavigate, onOpenQuote,
}: {
  role: Role
  session: Session
  id: string
  onNavigate: (s: Screen) => void
  onOpenQuote: (quoteId: string) => void
}) {
  const record = getInquiry(id)
  const [action, setAction] = useState<string | null>(null)
  const [needsReview, setNeedsReview] = useState(record.needsReview)
  const [detailsRequested, setDetailsRequested] = useState(false)

  const canAct = role === 'sales'
  const isPending = record.status === 'pending-review'
  const editable = canAct && isPending
  const hasCost = record.cost !== null
  const missingLabels = Object.entries(record.confidence)
    .filter(([, v]) => v === 0)
    .map(([k]) => FIELD_LABELS[k] ?? k)
  const [messageText, setMessageText] = useState(() => draftMissingInfoMessage(record, missingLabels, session.name))

  const [tariff, setTariff] = useState(record.cost?.tariff ?? 0)
  const [slotRate, setSlotRate] = useState(record.cost?.slotRate ?? 0)
  const [oceanFreight, setOceanFreight] = useState(record.cost?.oceanFreight ?? 0)
  const [proposedRate, setProposedRate] = useState(record.proposedRate ?? record.customerAsk ?? 0)
  const [quoteMessage, setQuoteMessage] = useState(() =>
    draftQuoteMessage(record, record.proposedRate ?? record.customerAsk ?? 0, session.name))

  const internalCost = tariff + slotRate + oceanFreight
  const hasAsk = record.customerAsk !== null
  const marginDelta = hasAsk ? record.customerAsk! - internalCost : 0
  const marginOk = hasAsk ? marginDelta >= 0 : true
  const proposedBelowCost = hasAsk && proposedRate < internalCost

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb={`Inquiries / ${record.id}`}
        title="Inquiry Detail — AI Review"
        subtitle="AI-extracted fields, shown next to the original mail they came from."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="in-progress" label={record.statusLabel} />
            {record.quoteId && (
              <button onClick={() => onOpenQuote(record.quoteId!)} className={cls.btnSecondary} style={{ fontSize: 12, padding: '5px 10px' }}>
                View Quotation
              </button>
            )}
          </div>
        }
      />

      {needsReview && (
        <div
          style={{ background: '#231a06', border: '1px solid #854d0e', borderRadius: 6 }}
          className="flex items-start justify-between gap-3 px-4 py-3.5 mb-5"
        >
          <div className="flex items-start gap-3">
            <span style={{ color: '#fbbf24', marginTop: 1 }}><Icon.warning /></span>
            <div>
              <div className="text-sm font-semibold" style={{ color: '#fbbf24' }}>aiNeedsReview — low-confidence fields</div>
              <div className="text-[12px] mt-0.5" style={{ color: '#fde68a' }}>
                One or more fields were extracted at below-70% confidence (see the AI-Parsed Fields card below). Sales must
                review and confirm before this inquiry can be sent to Trade.
              </div>
            </div>
          </div>
          {canAct && (
            <button
              onClick={() => setNeedsReview(false)}
              className={cls.btnAmber}
              style={{ fontSize: 12, padding: '5px 10px', flexShrink: 0 }}
            >
              Confirm Reviewed
            </button>
          )}
        </div>
      )}

      {/* Original mail — the source of everything below */}
      <SectionCard title="Original Customer Mail">
        <div className="flex items-center justify-between mb-3 text-[12px]" style={{ color: C.textMuted }}>
          <span>{record.senderName} · <span className="font-mono">{record.senderEmail}</span></span>
          <span className="font-mono">{record.receivedAt}</span>
        </div>
        <pre
          style={{ background: '#0e0f13', border: `1px solid ${C.border}`, borderRadius: 6, whiteSpace: 'pre-wrap' }}
          className="p-4 text-[12.5px] leading-relaxed font-sans"
        >
          {record.rawMail}
        </pre>
      </SectionCard>

      {/* What AI parsed out of that mail, with confidence per field */}
      <SectionCard title="AI-Parsed Fields">
        <div className="grid grid-cols-2 gap-4">
          <ConfField label="Port of Load" value={record.pol} confidence={record.confidence.pol} />
          <ConfField label="Port of Discharge" value={record.pod} confidence={record.confidence.pod} />
          <ConfField label="Container Type & Qty" value={`${record.containerQty} × ${record.containerType}`} confidence={record.confidence.containerQty} />
          <ConfField label="Commodity" value={record.commodity} confidence={record.confidence.commodity} />
          <ConfField
            label="Target Rate"
            value={hasAsk ? `USD ${record.customerAsk} / TEU` : ''}
            confidence={record.confidence.targetRate}
          />
        </div>
      </SectionCard>

      {/* Customer match */}
      <SectionCard title="Customer Match">
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-4">
            <div
              style={{ width: 36, height: 36, borderRadius: 8, background: '#1c1e26', border: `1px solid ${C.border}` }}
              className="flex items-center justify-center text-[11px] font-bold text-[#9ca3af]"
            >
              {record.customer.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-[#dde1ea]">{record.customer}</div>
              <div className="text-[12px]" style={{ color: C.textMuted }}>
                <MonoRef>{record.customerId}</MonoRef>
              </div>
            </div>
          </div>
          <Badge variant={record.kycApproved ? 'approved' : 'pending'} label={record.kycApproved ? 'KYC Approved' : 'KYC Pending'} />
        </div>
      </SectionCard>

      {/* Missing operational details — nothing to price until the customer fills these in */}
      {!hasCost && (
        <SectionCard title="Missing Details — Ask the Customer">
          <p className="text-[12px] mb-3" style={{ color: C.textMuted }}>
            The mail didn't say: <strong style={{ color: C.text }}>{missingLabels.join(', ')}</strong>. There's nothing to
            price — and no money to show — until we know that. Ask the customer before doing anything else.
          </p>

          {detailsRequested ? (
            <div>
              <div className="flex items-center gap-2 text-[12px] mb-2" style={{ color: '#4ade80' }}>
                <Icon.check /> Sent to <span className="font-mono">{record.senderEmail}</span> — customer will reply via the
                portal; this inquiry re-parses once they do.
              </div>
              <pre
                style={{ background: '#0e0f13', border: `1px solid ${C.border}`, borderRadius: 6, whiteSpace: 'pre-wrap' }}
                className="p-4 text-[12.5px] leading-relaxed font-sans"
              >
                {messageText}
              </pre>
            </div>
          ) : canAct ? (
            <>
              <Field label={`Message to ${record.senderEmail}`}>
                <Textarea rows={7} value={messageText} onChange={e => setMessageText(e.target.value)} />
              </Field>
              <button onClick={() => setDetailsRequested(true)} className={cls.btnPrimary} style={{ marginTop: 10 }}>
                Send Request
              </button>
            </>
          ) : (
            <p className="text-[12px]" style={{ color: C.textMuted }}>Waiting on Sales to request these from the customer.</p>
          )}
        </SectionCard>
      )}

      {/* Margin — only meaningful once we have both a cost basis and a target rate to compare it to */}
      {hasCost && (
        hasAsk ? (
          <div
            style={marginOk
              ? { background: '#0d2818', border: '1px solid #166534', borderRadius: 6 }
              : { background: '#231a06', border: '1px solid #854d0e', borderRadius: 6 }
            }
            className="flex items-start gap-3 px-4 py-3.5 mb-5"
          >
            <div
              style={{
                width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                background: marginOk ? '#14532d' : '#451a03',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {marginOk ? <Icon.check /> : <Icon.warning />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold" style={{ color: marginOk ? '#4ade80' : '#fbbf24' }}>
                  Margin Check — {marginOk ? 'Within Sales Authority' : 'Requires Trade Approval'}
                </span>
                <Badge variant={marginOk ? 'within-authority' : 'requires-trade'} />
              </div>
              <div className="text-[12px]" style={{ color: marginOk ? '#86efac' : '#fde68a' }}>
                Customer asked <strong>USD {record.customerAsk} / TEU</strong> in their mail. Our combined cost — Tariff + Slot
                {' '}Rate + Ocean Freight, below — comes to <strong>USD {internalCost} / TEU</strong>. That's{' '}
                <strong>{marginOk ? `+USD ${marginDelta}` : `USD ${Math.abs(marginDelta)} short`}</strong>{' '}
                {marginOk
                  ? 'above cost — Sales may quote directly, and can ask for more than the customer offered.'
                  : '— below our cost, this file must go to Trade before quoting.'
                }
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: '#0d1d35', border: '1px solid #1e3a5f', borderRadius: 6 }} className="px-4 py-3.5 mb-5">
            <div className="text-sm font-semibold mb-0.5" style={{ color: '#93c5fd' }}>No target rate given</div>
            <div className="text-[12px]" style={{ color: '#93c5fd' }}>
              The customer didn't indicate a rate — nothing to compare against yet. Our cost basis is shown below; quote from
              the rate sheet.
            </div>
          </div>
        )
      )}

      {/* Cost breakdown — this is what "margin" is computed from */}
      {hasCost && (
        <SectionCard title="Our Cost Breakdown (Tariff + Slot Rate + Ocean Freight)">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Field label="Tariff (USD / TEU)">
              <Input type="number" value={tariff} disabled={!editable} mono
                onChange={e => setTariff(parseInt(e.target.value) || 0)} />
            </Field>
            <Field label="Slot Rate (USD / TEU)">
              <Input type="number" value={slotRate} disabled={!editable} mono
                onChange={e => setSlotRate(parseInt(e.target.value) || 0)} />
            </Field>
            <Field label="Ocean Freight (USD / TEU)">
              <Input type="number" value={oceanFreight} disabled={!editable} mono
                onChange={e => setOceanFreight(parseInt(e.target.value) || 0)} />
            </Field>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}` }} className="pt-3 flex items-center justify-between">
            <span className={cls.sectionTitle} style={{ marginBottom: 0 }}>Internal Cost (our floor — never shown to the customer)</span>
            <span className="font-mono text-[17px] font-semibold" style={{ color: C.text }}>USD {internalCost} / TEU</span>
          </div>
        </SectionCard>
      )}

      {/* What we actually quote back — only live while the inquiry is still pending */}
      {hasCost && (isPending || record.proposedRate !== null) && (
        <SectionCard title="Rate to Quote the Customer">
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <div className={cls.sectionTitle}>Customer's Ask (from their mail)</div>
              <div className="font-mono text-[17px] font-medium" style={{ color: C.textMuted }}>
                {hasAsk ? `USD ${record.customerAsk} / TEU` : 'Not stated'}
              </div>
            </div>
            <Field label="Proposed Rate — what Sales sends back">
              <Input type="number" value={proposedRate} disabled={!editable} mono
                onChange={e => setProposedRate(parseInt(e.target.value) || 0)} />
            </Field>
          </div>
          {isPending && (
            <p className="text-[12px] mt-3 mb-3" style={{ color: C.textMuted }}>
              Defaults to the customer's ask — while margin is healthy, Sales can push this higher. This is the number that
              opens the negotiation on the Quotation screen.
            </p>
          )}
          {proposedBelowCost && (
            <p className="text-[12px] mt-2 mb-3" style={{ color: '#fbbf24' }}>
              This proposed rate is itself below our USD {internalCost} cost — that would also need Trade sign-off.
            </p>
          )}

          {editable ? (
            <Field label="Message to send with the quote" className={isPending ? 'mt-1' : 'mt-3'}>
              <Textarea rows={6} value={quoteMessage} onChange={e => setQuoteMessage(e.target.value)} />
            </Field>
          ) : (
            <div>
              <div className={cls.sectionTitle}>Message Sent With the Quote</div>
              <pre
                style={{ background: '#0e0f13', border: `1px solid ${C.border}`, borderRadius: 6, whiteSpace: 'pre-wrap' }}
                className="p-4 text-[12.5px] leading-relaxed font-sans"
              >
                {quoteMessage}
              </pre>
            </div>
          )}
        </SectionCard>
      )}

      {/* Historical note for inquiries that have already moved past this screen */}
      {!isPending && record.note && (
        <div
          style={{
            background: STATUS_NOTE_STYLE[record.status]?.bg ?? '#1a1d24',
            border: `1px solid ${STATUS_NOTE_STYLE[record.status]?.border ?? C.border}`,
            borderRadius: 6,
          }}
          className="p-4 mb-4"
        >
          <div className="text-sm font-medium mb-1" style={{ color: STATUS_NOTE_STYLE[record.status]?.text ?? C.text }}>
            {record.statusLabel}
          </div>
          <div className="text-[12px]" style={{ color: STATUS_NOTE_STYLE[record.status]?.text ?? C.textMuted }}>
            {record.note}
          </div>
        </div>
      )}

      {/* Live action area — Sales only, only while pending review */}
      {isPending && (
        action === 'trade' ? (
          <div style={{ background: '#231a06', border: '1px solid #854d0e', borderRadius: 6 }} className="p-4 mb-4">
            <div className="text-sm font-medium mb-1" style={{ color: '#fbbf24' }}>Sent to Trade for review</div>
            <div className="text-[12px]" style={{ color: '#fde68a' }}>
              Trade team notified. SLA: 4 business hours.
            </div>
          </div>
        ) : action === 'decline' ? (
          <div style={{ background: '#220d0d', border: '1px solid #7f1d1d', borderRadius: 6 }} className="p-4 mb-4">
            <div className="text-sm font-medium" style={{ color: '#f87171' }}>Inquiry declined</div>
            <div className="text-[12px] mt-0.5" style={{ color: '#fca5a5' }}>A decline notification will be sent to the customer.</div>
          </div>
        ) : action === 'lost' ? (
          <div style={{ background: '#1a1d24', border: '1px solid #2a2d38', borderRadius: 6 }} className="p-4 mb-4">
            <div className="text-sm font-medium" style={{ color: '#9ca3af' }}>Marked as lost</div>
            <div className="text-[12px] mt-0.5" style={{ color: '#6b7280' }}>This inquiry will be archived. No further action required.</div>
          </div>
        ) : canAct ? (
          <div className="flex items-center gap-2 pt-2">
            <button
              disabled={needsReview}
              onClick={() => setAction('trade')}
              className={cls.btnAmber}
              style={needsReview ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            >
              Send to Trade
            </button>
            <button
              disabled={needsReview || !marginOk}
              onClick={() => onNavigate('quotation')}
              className={cls.btnPrimary}
              style={(needsReview || !marginOk) ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            >
              Proceed to Quote
            </button>
            {!marginOk && !needsReview && (
              <span className="text-[11px]" style={{ color: '#fbbf24' }}>Below cost — send to Trade instead.</span>
            )}
            <div className="flex-1" />
            <button onClick={() => setAction('decline')} className={cls.btnDanger}>
              Decline
            </button>
            <button onClick={() => setAction('lost')} className={cls.btnSecondary}>
              Mark Lost
            </button>
          </div>
        ) : (
          <div className="text-[12px] pt-2" style={{ color: C.textMuted }}>
            Read-only — routing actions are performed by Sales.
          </div>
        )
      )}
    </div>
  )
}
