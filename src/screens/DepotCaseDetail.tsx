import { Screen } from '../types'
import { getOrder } from '../data/orders'
import { DEPOTS, getDepot } from '../data/depots'
import { PageHeader, SectionCard, cls, C, Badge, MonoRef } from '../components/ui'

// A read-only dossier for a case that isn't the one live booking — same visual
// language as the Requirement Inbox and Container Handover screens, but no
// actions: this is history, not something waiting on this desk today.

export default function DepotCaseDetail({ id, onNavigate }: { id: string; onNavigate: (s: Screen) => void }) {
  const record = getOrder(id)
  const s = record.snapshot

  const answered = DEPOTS.filter(d => s.depotReplies[d.id]).length

  return (
    <div className="max-w-2xl">
      <PageHeader
        breadcrumb={`Case Queue / ${record.id}`}
        title={record.customer}
        subtitle={`${record.pol} → ${record.pod} · ${record.equipment}`}
        actions={<Badge variant="inactive" label="Read-only case record" />}
      />

      <SectionCard title={s.requirementSent ? `Depot Replies — ${answered} of ${DEPOTS.length} in` : 'Requirement Inbox'}>
        {!s.requirementSent ? (
          <p className="text-[13px]" style={{ color: C.textMuted }}>
            Ops has not sent a container requirement for this booking yet.
          </p>
        ) : (
          <div className="space-y-2">
            {DEPOTS.map(d => {
              const reply = s.depotReplies[d.id]
              const isAssigned = s.depotId === d.id
              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    background: '#1c1e26',
                    border: `1px solid ${isAssigned ? C.accent : C.border}`,
                    borderRadius: 6,
                    opacity: reply === 'no' ? 0.55 : 1,
                  }}
                >
                  <div>
                    <div className="text-sm" style={{ color: C.text }}>{d.name}</div>
                    <div className="text-[11px]" style={{ color: C.textMuted }}>{d.address}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {reply
                      ? <Badge variant={reply === 'yes' ? 'approved' : 'rejected'} label={reply === 'yes' ? 'Yes, we have it' : 'No'} />
                      : <Badge variant="pending" label="Awaiting reply" />}
                    {isAssigned && <Badge variant="confirmed" label="Assigned" />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      {s.foodGrade && (
        <SectionCard title="Cargo Grade">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="pending" label="Food Grade" />
            <span className="text-[12px]" style={{ color: C.textMuted }}>
              Every container must be certified clean before handover.
            </span>
          </div>
        </SectionCard>
      )}

      <SectionCard
        title="Container Handover"
        action={<Badge
          variant={s.containersExpected.length > 0 && s.containers.length === s.containersExpected.length ? 'approved' : 'pending'}
          label={`${s.containers.length} of ${s.containersExpected.length || 0} recorded`}
        />}
      >
        {s.containersExpected.length === 0 ? (
          <p className="text-[13px]" style={{ color: C.textMuted }}>No containers requested for this booking yet.</p>
        ) : (
          <div className="space-y-2">
            {s.containersExpected.map(num => {
              const c = s.containers.find(c => c.number === num)
              return (
                <div
                  key={num}
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ background: '#1c1e26', border: `1px solid ${C.border}`, borderRadius: 6 }}
                >
                  <MonoRef>{num}</MonoRef>
                  <div className="flex items-center gap-2">
                    {s.foodGrade && (
                      <Badge variant={c?.cleanCertified ? 'approved' : 'pending'} label={c?.cleanCertified ? 'Clean Certified' : 'Not Certified'} />
                    )}
                    <Badge
                      variant={c?.sob ? 'approved' : c?.gatedIn ? 'pending' : c ? 'sent' : 'inactive'}
                      label={c?.sob ? 'On Board' : c?.gatedIn ? 'Gated In' : c ? 'Handed Over' : 'Not Handed Over'}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      {s.depotId && (
        <p className="text-[12px] mb-4" style={{ color: C.textMuted }}>
          Assigned depot: <strong style={{ color: C.textSubtle }}>{getDepot(s.depotId)?.name}</strong>
          {s.croId && <> · CRO <MonoRef>{s.croId}</MonoRef></>}
        </p>
      )}

      <div className="flex gap-2">
        <button onClick={() => onNavigate('depot-queue')} className={cls.btnSecondary}>← Back to Case Queue</button>
      </div>
    </div>
  )
}
