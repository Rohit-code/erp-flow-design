import { Screen } from '../types'
import { getOrder } from '../data/orders'
import { DEPOTS, getDepot } from '../data/depots'
import { splitRate, money, rateLabel } from '../data/pricing'
import { PageHeader, SectionCard, cls, C, Badge, MonoRef } from '../components/ui'
import { STAGE_META, Stage } from './CaseList'

// The read-only twin of every stage screen along the booking spine. This
// never renders the live booking — App.tsx sends that id straight to the
// real, interactive screen instead. Every other booking lands here: same
// visual language (SectionCard/Badge/MonoRef), no actions, always anchored
// to its own booking number.

const LIST_SCREEN: Record<Stage, Screen> = {
  'ops-accept': 'ops-accept-list',
  'cro-release': 'cro-list',
  'container-tracking': 'container-tracking-list',
  'gate-in': 'gate-in-list',
  'load-vessel': 'load-vessel-list',
  'bl-draft': 'bl-draft-list',
  'invoice': 'invoice-list',
  'mbl-release': 'mbl-release-list',
}

export default function StageCaseDetail({ stage, id, onNavigate }: { stage: Stage; id: string; onNavigate: (s: Screen) => void }) {
  const record = getOrder(id)
  const s = record.snapshot
  const meta = STAGE_META[stage]
  const depot = s.depotId ? getDepot(s.depotId) : undefined
  const expected = s.containersExpected
  const answeredDepots = DEPOTS.filter(d => s.depotReplies[d.id]).length

  return (
    <div className="max-w-2xl">
      <PageHeader
        breadcrumb={`${meta.title} / ${record.id}`}
        title={record.customer}
        subtitle={`${record.pol} → ${record.pod} · ${record.equipment}`}
        actions={<Badge variant="inactive" label="Read-only case record" />}
      />

      {stage === 'ops-accept' && (
        <>
          <SectionCard title="Readiness">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: 'Rate Agreed', ok: s.agreedRate !== null, detail: s.agreedRate !== null ? rateLabel(s.agreedRate) : 'Not agreed' },
                { label: 'KYC', ok: s.kycStatus === 'approved', detail: s.kycStatus === 'rejected' ? (s.kycRejectionReason ?? 'Rejected') : s.kycStatus },
                { label: 'Depot Assigned', ok: !!depot, detail: depot ? depot.name : s.requirementSent ? `${answeredDepots}/${DEPOTS.length} replied` : 'Requirement not sent' },
                { label: 'CRO', ok: !!s.croId, detail: s.croId ?? 'Not issued' },
              ].map(f => (
                <div key={f.label}>
                  <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>{f.label}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={f.ok ? 'approved' : 'pending'} label={f.ok ? 'Done' : 'Pending'} />
                    <span className="text-[12px]" style={{ color: C.textMuted }}>{f.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Outcome">
            {s.croId ? (
              <p className="text-[13px]" style={{ color: C.green.text }}>Accepted by Ops — CRO {s.croId} issued.</p>
            ) : s.kycStatus === 'rejected' ? (
              <p className="text-[13px]" style={{ color: C.red.text }}>Blocked — KYC rejected: {s.kycRejectionReason}</p>
            ) : record.statusVariant === 'cancelled' ? (
              <p className="text-[13px]" style={{ color: C.textMuted }}>Booking was cancelled before reaching Ops acceptance.</p>
            ) : (
              <p className="text-[13px]" style={{ color: C.amber.text }}>Still awaiting Ops acceptance.</p>
            )}
          </SectionCard>
        </>
      )}

      {stage === 'cro-release' && (
        <SectionCard title="Container Release Order">
          {!s.croId ? (
            <p className="text-[13px]" style={{ color: C.amber.text }}>No CRO yet — issued automatically once Ops accepts this booking.</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <MonoRef>{s.croId}</MonoRef>
                <Badge variant="active" label="Released" />
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>Pickup Depot</div>
                  <div className="text-[13px]" style={{ color: C.text }}>{depot?.name ?? '—'}</div>
                  <div className="text-[11px]" style={{ color: C.textMuted }}>{depot?.address}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-medium mb-0.5" style={{ color: C.textMuted }}>Containers Needed</div>
                  <div className="text-[13px]" style={{ color: C.text }}>{expected.length} — {record.equipment}</div>
                </div>
              </div>
              <div className="space-y-1.5">
                {expected.map(num => <MonoRef key={num}>{num}</MonoRef>)}
              </div>
            </>
          )}
        </SectionCard>
      )}

      {(stage === 'container-tracking' || stage === 'gate-in' || stage === 'load-vessel') && (
        <SectionCard title={expected.length === 0 ? 'Containers' : `${s.containers.length} of ${expected.length} recorded`}>
          {expected.length === 0 ? (
            <p className="text-[13px]" style={{ color: C.textMuted }}>No containers allocated yet — nothing to show until the depot records a handover.</p>
          ) : (
            <div className="space-y-2">
              {expected.map(num => {
                const c = s.containers.find(c => c.number === num)
                return (
                  <div key={num} className="flex items-center justify-between px-4 py-2.5" style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }}>
                    <MonoRef>{num}</MonoRef>
                    <div className="flex items-center gap-2">
                      {s.foodGrade && <Badge variant={c?.cleanCertified ? 'approved' : 'pending'} label={c?.cleanCertified ? 'Clean' : 'Not Certified'} />}
                      {stage !== 'load-vessel' && (
                        <Badge variant={c?.gatedIn ? 'approved' : c ? 'pending' : 'inactive'} label={c?.gatedIn ? 'Gated In' : c ? 'Handed Over' : 'Not Handed Over'} />
                      )}
                      {stage !== 'gate-in' && (
                        <Badge variant={c?.sob ? 'approved' : 'inactive'} label={c?.sob ? `On Board · ${c.sobDate}` : 'Not Loaded'} />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </SectionCard>
      )}

      {stage === 'bl-draft' && (
        <SectionCard title="Bill of Lading">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant={s.blStatus === 'approved' ? 'approved' : s.blStatus === 'changes-requested' ? 'countered' : s.blStatus === 'drafted' ? 'pending' : 'inactive'}
              label={s.blStatus === 'approved' ? 'Approved' : s.blStatus === 'changes-requested' ? 'Changes Requested' : s.blStatus === 'drafted' ? 'Drafted' : 'No Draft Yet'}
            />
            {s.mblType && <Badge variant="inactive" label={s.mblType === 'surrender' ? 'Surrender MBL' : 'Original MBL'} />}
          </div>
          {s.blStatus === 'changes-requested' && s.blChangeNote && (
            <p className="text-[12px]" style={{ color: C.textMuted }}>{s.blChangeNote}</p>
          )}
          {s.blStatus === 'none' && <p className="text-[12px]" style={{ color: C.textMuted }}>Drafted once Shipping Instructions are submitted.</p>}
        </SectionCard>
      )}

      {stage === 'invoice' && (
        <SectionCard title="Charges">
          {s.agreedRate === null ? (
            <p className="text-[13px]" style={{ color: C.textMuted }}>No agreed rate on file — nothing to invoice.</p>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {(() => {
                  const c = splitRate(s.agreedRate!)
                  return [
                    { label: 'Ocean Freight', value: `USD ${c.ocean}` },
                    { label: 'BAF', value: `USD ${c.baf}` },
                    { label: 'CAF', value: `USD ${c.caf}` },
                    { label: 'Total All-In', value: `USD ${c.total}` },
                  ]
                })().map((r, i) => (
                  <div key={i}>
                    <div className={cls.sectionTitle} style={{ marginBottom: 4 }}>{r.label}</div>
                    <div className="font-mono text-[14px] font-medium" style={{ color: i === 3 ? C.accentDim : C.text }}>{r.value}</div>
                  </div>
                ))}
              </div>
              <div className="text-[12px] mb-3" style={{ color: C.textMuted }}>
                Extended total: <strong style={{ color: C.textSubtle }}>{money(s.agreedRate * expected.length)}</strong> · {expected.length} × {rateLabel(s.agreedRate)}
              </div>
            </>
          )}
          <div className="flex items-center gap-2">
            <Badge variant={s.invoiceReleased ? 'active' : 'inactive'} label={s.invoiceReleased ? 'Invoice Released' : 'Not Released'} />
            <Badge
              variant={s.paymentStatus === 'paid' || s.paymentStatus === 'standing-credit' ? 'paid' : 'pending'}
              label={s.hasStandingCredit ? 'Standing Credit' : s.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
            />
          </div>
        </SectionCard>
      )}

      {stage === 'mbl-release' && (
        <SectionCard title="Master Bill of Lading">
          <Badge variant={s.mblReleased ? 'active' : 'inactive'} label={s.mblReleased ? `Released — ${s.mblType === 'original' ? 'Original' : 'Surrender'}` : 'Not Released'} />
          {!s.mblReleased && (
            <p className="text-[12px] mt-2" style={{ color: C.textMuted }}>
              {!s.blStatus || s.blStatus !== 'approved' ? 'Blocked — the BL draft has not been approved.'
                : s.containers.length === 0 || s.containers.some(c => !c.sob) ? 'Blocked — not every container has a shipped-on-board record.'
                : !s.invoiceReleased || (!s.hasStandingCredit && s.paymentStatus !== 'paid') ? 'Blocked — invoice must be released and settled first.'
                : 'Ready to release.'}
            </p>
          )}
        </SectionCard>
      )}

      <div className="flex gap-2 mt-2">
        <button onClick={() => onNavigate(LIST_SCREEN[stage])} className={cls.btnSecondary}>← Back to list</button>
      </div>
    </div>
  )
}
