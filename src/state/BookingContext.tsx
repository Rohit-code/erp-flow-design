import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { BOOKING, MblType } from '../data/booking'
import { getAddress, addressLine } from '../data/addresses'
import { getSailing, Sailing } from '../data/sailings'
import { getDepot } from '../data/depots'

// One booking, one state object, one event log.
//
// Before this existed every screen kept its own copy of BKG-2024-00142, which
// is why the rate could read 485 on the quotation and 562 on the invoice, and
// why choosing a vessel on the sailing screen never reached the CRO. Screens
// along the booking spine now read and write here instead of holding their own
// truth. Form drafts — a half-typed message, an unsent note — stay local; only
// facts about the booking belong in this file.
//
// Every action appends to `events`, which is what the Order Timeline renders.
// That is the flow's "everything is logged to the Order Timeline" promise, kept
// by construction rather than by a hardcoded array.

export type KycStatus = 'not-started' | 'submitted' | 'approved' | 'rejected'
export type BlStatus = 'none' | 'drafted' | 'changes-requested' | 'approved'
export type PaymentStatus = 'unpaid' | 'standing-credit' | 'paid'
export type ContainerStatus = 'depot-in' | 'depot-out'
export type DepotReply = 'pending' | 'yes' | 'no'

/**
 * A CRO is immutable once issued. An amendment never edits it — it supersedes
 * it and issues a NEW number. The old one stays in the record, marked
 * superseded, because the depot may already be holding a printed copy of it.
 */
export type CroRecord = {
  number: string
  issuedAt: string
  depotId: string
  containerCount: number
  reason: string | null
  supersededBy: string | null
}

export type ContainerRecord = {
  number: string
  status: ContainerStatus
  gatedIn: boolean
  /** Shipped on board — set when the container is actually loaded to the vessel. */
  sob: boolean
  sobDate: string | null
  /** Food-grade cleanliness, certified at handover. Only meaningful when the
   *  booking carries food cargo. */
  cleanCertified: boolean
  cleanCertifiedBy: string | null
}

export type BookingEvent = {
  id: string
  label: string
  actor: string
  role: string
  ts: string
  note?: string
  icon: string
}

export type BookingState = {
  /** Food cargo requires every container to be certified clean before handover. */
  foodGrade: boolean

  /** Set once the customer opens the magic link and sets a password. */
  customerRegistered: boolean

  agreedRate: number | null

  kycStatus: KycStatus
  kycRejectionReason: string | null

  billingAddressId: string | null
  shippingAddressIds: string[]

  sailingId: string | null

  requirementSent: boolean
  depotReplies: Record<string, DepotReply>
  depotId: string | null

  opsAccepted: boolean
  opsAcceptedBy: string | null
  sentBackReason: string | null

  croIssued: boolean
  croHistory: CroRecord[]

  containers: ContainerRecord[]

  siSubmitted: boolean
  blStatus: BlStatus
  blChangeNote: string | null
  mblType: MblType | null

  invoiceReleased: boolean
  hasStandingCredit: boolean
  paymentStatus: PaymentStatus
  paymentRef: string | null

  mblReleased: boolean

  events: BookingEvent[]
}

const INITIAL: BookingState = {
  foodGrade: false,
  customerRegistered: false,
  agreedRate: null,
  kycStatus: 'not-started',
  kycRejectionReason: null,
  billingAddressId: null,
  shippingAddressIds: [],
  sailingId: null,
  requirementSent: false,
  depotReplies: {},
  depotId: null,
  opsAccepted: false,
  opsAcceptedBy: null,
  sentBackReason: null,
  croIssued: false,
  croHistory: [],
  containers: [],
  siSubmitted: false,
  blStatus: 'none',
  blChangeNote: null,
  mblType: null,
  invoiceReleased: false,
  hasStandingCredit: BOOKING.hasStandingCredit,
  paymentStatus: 'unpaid',
  paymentRef: null,
  mblReleased: false,
  events: [
    {
      id: 'inq-create',
      label: 'Inquiry Created',
      actor: BOOKING.customerContact,
      role: 'Customer',
      ts: '14 Nov 2024 · 09:41 IST',
      note: `Customer email received: ${BOOKING.pol}→${BOOKING.pod}, ${BOOKING.equipment}, asking USD 500 / container`,
      icon: '◎',
    },
    {
      id: 'ai-review',
      label: 'AI Reviewed',
      actor: 'Regnus AI',
      role: 'System',
      ts: '14 Nov 2024 · 09:41 IST',
      note: 'Extraction confidence 94% · BLUE — ask of USD 500 clears the USD 493 floor, within Sales authority',
      icon: '⬡',
    },
  ],
}

/** Readiness for the Ops acceptance gate — derived, never stored. */
export type Prereq = {
  id: string
  label: string
  short: string
  detail: string
  owner: 'Customer' | 'Sales' | 'Ops' | 'KYC'
  done: boolean
}

function prereqsFor(s: BookingState): Prereq[] {
  const billing = s.billingAddressId ? getAddress(s.billingAddressId) : undefined
  const shipping = s.shippingAddressIds.map(getAddress).filter(Boolean)
  const sailing = s.sailingId ? getSailing(s.sailingId) : undefined
  const depot = s.depotId ? getDepot(s.depotId) : undefined
  return [
    {
      id: 'rate',
      label: 'Rate agreed',
      short: 'an agreed rate',
      owner: 'Sales',
      done: s.agreedRate !== null,
      detail: s.agreedRate !== null
        ? `USD ${s.agreedRate} / container accepted by the customer`
        : 'The quotation has not been accepted yet — everything downstream depends on it.',
    },
    {
      id: 'kyc',
      label: 'KYC / KYV approved',
      short: 'KYC approval',
      owner: 'KYC',
      done: s.kycStatus === 'approved',
      detail: s.kycStatus === 'approved'
        ? `${BOOKING.customer} · approved by ${BOOKING.kycOfficer}`
        : s.kycStatus === 'submitted'
          ? 'Submitted — awaiting review by the KYC desk.'
          : 'Not submitted yet — still with the customer.',
    },
    {
      id: 'billing',
      label: 'Billing address selected',
      short: 'billing address',
      owner: 'Customer',
      done: !!billing,
      detail: billing ? `${billing.name} · ${addressLine(billing)}` : 'Not selected yet — still with the customer.',
    },
    {
      id: 'shipping',
      label: 'Shipping addresses selected',
      short: 'shipping addresses',
      owner: 'Customer',
      done: shipping.length > 0,
      detail: shipping.length
        ? `${shipping.length} address${shipping.length === 1 ? '' : 'es'} — ${shipping.map(a => a!.name).join(', ')}`
        : 'Not selected yet — still with the customer.',
    },
    {
      id: 'sailing',
      label: 'Voyage / vessel selected',
      short: 'voyage selection',
      owner: 'Customer',
      done: !!sailing,
      detail: sailing
        ? `${sailing.vessel} · Voyage ${sailing.voyage} · ETD ${sailing.etd} · ETA ${sailing.eta}`
        : 'Not selected yet — still with the customer.',
    },
    {
      id: 'depot',
      label: 'Depot confirmed & assigned',
      short: 'depot assignment',
      owner: 'Ops',
      done: !!depot,
      detail: depot
        ? `${depot.name} · confirmed availability for ${BOOKING.equipment}`
        : s.requirementSent
          ? 'Requirement sent — awaiting depot replies.'
          : 'Requirement not sent to depots yet.',
    },
  ]
}

export type BookingActions = {
  registerCustomer: (actor: string) => void
  agreeRate: (rate: number, actor: string, role: string) => void
  submitKyc: (actor: string) => void
  approveKyc: (actor: string) => void
  rejectKyc: (reason: string, actor: string) => void
  setAddresses: (billingId: string, shippingIds: string[], actor: string) => void
  selectSailing: (sailingId: string, actor: string) => void
  sendDepotRequirement: (actor: string) => void
  replyDepot: (depotId: string, reply: 'yes' | 'no', actor: string) => void
  assignDepot: (depotId: string, actor: string, auto: boolean) => void
  acceptBooking: (actor: string) => void
  amendCro: (reason: string, newDepotId: string | null, actor: string) => void
  sendBack: (reason: string, actor: string) => void
  recordHandover: (containerNumber: string, actor: string, clean?: boolean) => void
  recordOutReport: (containerNumbers: string[], actor: string, clean?: boolean) => void
  setFoodGrade: (on: boolean, actor: string) => void
  submitSI: (actor: string) => void
  confirmGateIn: (containerNumber: string, actor: string) => void
  confirmLoaded: (containerNumber: string, actor: string) => void
  approveBl: (mblType: MblType, actor: string) => void
  requestBlChanges: (note: string, actor: string) => void
  redraftBl: (actor: string) => void
  releaseInvoice: (actor: string) => void
  setStandingCredit: (on: boolean, actor: string) => void
  recordPayment: (ref: string, actor: string) => void
  releaseMbl: (actor: string) => void
  reset: () => void
}

/** Where the booking has actually got to — derived, so a list screen can never
 *  disagree with the booking's own record. */
export function bookingStatusLabel(s: BookingState): string {
  if (s.mblReleased) return 'MBL Released'
  if (s.paymentStatus === 'paid' || s.paymentStatus === 'standing-credit') return 'Payment Settled'
  if (s.invoiceReleased) return 'Invoiced'
  if (s.blStatus === 'approved') return 'BL Approved'
  if (s.containers.length > 0 && s.containers.every(c => c.sob)) return 'Shipped On Board'
  if (s.containers.some(c => c.gatedIn)) return 'Gated In'
  if (s.siSubmitted) return 'SI Submitted'
  if (s.containers.length > 0) return 'Containers Released'
  if (s.croIssued) return 'CRO Released'
  if (s.opsAccepted) return 'Confirmed'
  if (s.agreedRate !== null) return 'Awaiting Ops Acceptance'
  return 'Negotiating'
}

type Ctx = {
  booking: BookingState
  statusLabel: string
  latestEvent: BookingEvent | undefined
  prereqs: Prereq[]
  readyForOps: boolean
  sailing: Sailing | undefined
  actions: BookingActions
}

const BookingCtx = createContext<Ctx | null>(null)

/** Timestamps advance from the seeded 14 Nov morning so the log reads in order. */
let clock = 0
function stamp(): string {
  clock += 1
  const base = new Date(2024, 10, 14, 9, 45)
  base.setMinutes(base.getMinutes() + clock * 7)
  const hh = String(base.getHours()).padStart(2, '0')
  const mm = String(base.getMinutes()).padStart(2, '0')
  return `14 Nov 2024 · ${hh}:${mm} IST`
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(INITIAL)

  const actions = useMemo<BookingActions>(() => {
    // Every mutation goes through here so nothing changes without being logged.
    const commit = (
      patch: Partial<BookingState> | ((s: BookingState) => Partial<BookingState>),
      event: Omit<BookingEvent, 'ts'>,
    ) =>
      setBooking(s => {
        const next = typeof patch === 'function' ? patch(s) : patch
        return { ...s, ...next, events: [...s.events, { ...event, id: `${event.id}-${s.events.length}`, ts: stamp() }] }
      })

    return {
      registerCustomer: actor =>
        commit({ customerRegistered: true }, {
          id: 'portal-created', label: 'Portal Account Created', actor, role: 'Customer', icon: '◎',
          note: 'Password set from the magic link. All communication moves into the portal from here.',
        }),

      agreeRate: (rate, actor, role) =>
        commit({ agreedRate: rate }, {
          id: 'rate-agreed', label: 'Rate Agreed', actor, role, icon: '✓',
          note: `Accepted at USD ${rate} / container`,
        }),

      submitKyc: actor =>
        commit({ kycStatus: 'submitted', kycRejectionReason: null }, {
          id: 'kyc-submitted', label: 'KYC Submitted', actor, role: 'Customer', icon: '◎',
          note: 'Company details and 5 supporting documents submitted for verification',
        }),

      approveKyc: actor =>
        commit({ kycStatus: 'approved', kycRejectionReason: null }, {
          id: 'kyc-approved', label: 'KYC Approved', actor, role: 'KYC Officer', icon: '✓',
          note: 'All documents verified.',
        }),

      rejectKyc: (reason, actor) =>
        commit({ kycStatus: 'rejected', kycRejectionReason: reason }, {
          id: 'kyc-rejected', label: 'KYC Rejected', actor, role: 'KYC Officer', icon: '✕', note: reason,
        }),

      setAddresses: (billingId, shippingIds, actor) => {
        const b = getAddress(billingId)
        const ship = shippingIds.map(getAddress).filter(Boolean)
        commit({ billingAddressId: billingId, shippingAddressIds: shippingIds }, {
          id: 'addresses-selected', label: 'Addresses Selected', actor, role: 'Customer', icon: '◎',
          note: `Billing: ${b?.name ?? '—'} · Shipping: ${ship.map(a => a!.name).join(', ')}`,
        })
      },

      selectSailing: (sailingId, actor) => {
        const v = getSailing(sailingId)
        commit({ sailingId }, {
          id: 'sailing-selected', label: 'Sailing Selected', actor, role: 'Customer', icon: '⚓',
          note: v ? `${v.vessel} · Voyage ${v.voyage} · ETD ${v.etd} · ETA ${v.eta}` : undefined,
        })
      },

      sendDepotRequirement: actor =>
        commit({ requirementSent: true }, {
          id: 'depot-requirement', label: 'Requirement Sent to Depots', actor, role: 'Ops', icon: '→',
          note: `Mailed to 3 candidate depots near ${BOOKING.polName} — runs in parallel with the customer's KYC`,
        }),

      replyDepot: (depotId, reply, actor) => {
        const d = getDepot(depotId)
        commit(s => ({ depotReplies: { ...s.depotReplies, [depotId]: reply } }), {
          id: `depot-reply-${depotId}`, label: 'Depot Replied', actor, role: 'Depot', icon: '↔',
          note: `${d?.name ?? depotId}: ${reply === 'yes' ? 'has the containers' : 'cannot supply'}`,
        })
      },

      assignDepot: (depotId, actor, auto) => {
        const d = getDepot(depotId)
        commit({ depotId }, {
          id: 'depot-assigned', label: 'Depot Assigned', actor, role: 'Ops', icon: '⬡',
          note: auto
            ? `${d?.name} was the only depot to confirm — auto-selected`
            : `Ops selected ${d?.name} from the depots that confirmed`,
        })
      },

      acceptBooking: actor =>
        commit(s => ({
          opsAccepted: true, opsAcceptedBy: actor, croIssued: true, sentBackReason: null,
          croHistory: [{
            number: BOOKING.croId,
            issuedAt: stamp(),
            depotId: s.depotId ?? '',
            containerCount: BOOKING.containerCount,
            reason: null,
            supersededBy: null,
          }],
        }), {
          id: 'ops-accepted', label: 'Accepted by Ops', actor, role: 'Ops', icon: '✓',
          note: 'Mandatory manual gate — KYC, addresses, sailing and depot all verified. CRO issued to the depot and the customer.',
        }),

      // Never edits the standing CRO. Marks it superseded and issues a new
      // number, so a depot holding the old printed copy can be told which one
      // it has and that it no longer stands.
      amendCro: (reason, newDepotId, actor) =>
        commit(s => {
          const current = s.croHistory[s.croHistory.length - 1]
          if (!current) return {}
          const seq = 89 + s.croHistory.length
          const next: CroRecord = {
            number: `CRO-2024-${String(seq).padStart(4, '0')}`,
            issuedAt: stamp(),
            depotId: newDepotId ?? current.depotId,
            containerCount: current.containerCount,
            reason,
            supersededBy: null,
          }
          return {
            depotId: newDepotId ?? s.depotId,
            croHistory: [
              ...s.croHistory.slice(0, -1),
              { ...current, supersededBy: next.number },
              next,
            ],
          }
        }, {
          id: 'cro-amended', label: 'CRO Superseded', actor, role: 'Ops', icon: '⬡',
          note: `${reason} — a new CRO was issued; the previous one no longer stands and the depot has been re-notified.`,
        }),

      sendBack: (reason, actor) =>
        commit({ sentBackReason: reason }, {
          id: 'sent-back', label: 'Sent Back by Ops', actor, role: 'Ops', icon: '✕', note: reason,
        }),

      recordHandover: (containerNumber, actor, clean = false) =>
        commit(s => ({
          containers: [...s.containers, {
            number: containerNumber, status: 'depot-out', gatedIn: false, sob: false, sobDate: null,
            cleanCertified: clean, cleanCertifiedBy: clean ? actor : null,
          }],
        }), {
          id: `handover-${containerNumber}`, label: 'Container Handed Over', actor, role: 'Depot', icon: '⬡',
          note: `${containerNumber} · Depot In → Depot Out, allocated to ${BOOKING.id}${clean ? ' · certified food-grade clean' : ''}`,
        }),

      // The yard's evening out-report: the whole day's containers against their
      // bookings in one go. This is the first time Maxicon learns which physical
      // box went to which booking.
      recordOutReport: (containerNumbers, actor, clean = false) =>
        commit(s => ({
          containers: [
            ...s.containers,
            ...containerNumbers
              .filter(n => !s.containers.some(c => c.number === n))
              .map(n => ({
                number: n, status: 'depot-out' as const, gatedIn: false, sob: false, sobDate: null,
                cleanCertified: clean, cleanCertifiedBy: clean ? actor : null,
              })),
          ],
        }), {
          id: 'out-report', label: 'Depot Out-Report Received', actor, role: 'Depot', icon: '⬡',
          note: `${containerNumbers.length} containers recorded against ${BOOKING.id} — ${containerNumbers.join(', ')}${clean ? ' · all certified food-grade clean' : ''}`,
        }),

      setFoodGrade: (on, actor) =>
        commit({ foodGrade: on }, {
          id: 'cargo-grade', label: 'Cargo Grade Set', actor, role: 'Ops', icon: '◇',
          note: on
            ? 'Booking marked food-grade — containers must be certified clean before handover'
            : 'Booking marked general cargo',
        }),

      submitSI: actor =>
        commit({ siSubmitted: true, blStatus: 'drafted' }, {
          id: 'si-submitted', label: 'Shipping Instructions Submitted', actor, role: 'Customer', icon: '◇',
          note: 'SI submitted — BL draft prepared from it automatically',
        }),

      confirmGateIn: (containerNumber, actor) =>
        commit(s => ({
          containers: s.containers.map(c => (c.number === containerNumber ? { ...c, gatedIn: true } : c)),
        }), {
          id: `gate-in-${containerNumber}`, label: 'Gate In Confirmed', actor, role: 'Ops', icon: '⚓',
          note: `${containerNumber} received at the terminal inside the port cutoff`,
        }),

      confirmLoaded: (containerNumber, actor) =>
        commit(s => ({
          containers: s.containers.map(c =>
            c.number === containerNumber ? { ...c, sob: true, sobDate: BOOKING.etd } : c),
        }), {
          id: `sob-${containerNumber}`, label: 'Loaded to Vessel', actor, role: 'Ops', icon: '⚓',
          note: `${containerNumber} shipped on board — SOB set`,
        }),

      approveBl: (mblType, actor) =>
        setBooking(s => {
          const notLoaded = s.containers.filter(c => !c.sob)
          const events: BookingEvent[] = [{
            id: `bl-approved-${s.events.length}`,
            label: 'BL Draft Approved',
            actor, role: 'Customer', icon: '✓', ts: stamp(),
            note: `Approved · ${mblType === 'surrender' ? 'Surrender' : 'Original'} MBL requested`,
          }]
          // Warn, don't block — but never let it pass unrecorded.
          if (notLoaded.length > 0) {
            events.push({
              id: `bl-override-${s.events.length + 1}`,
              label: 'Confirmed Before SOB — Override',
              actor, role: 'Customer', icon: '!', ts: stamp(),
              note: `BL confirmed while ${notLoaded.length} container${notLoaded.length === 1 ? '' : 's'} (${notLoaded.map(c => c.number).join(', ')}) had no shipped-on-board record. Risk accepted by ${actor}.`,
            })
          }
          return { ...s, blStatus: 'approved', mblType, blChangeNote: null, events: [...s.events, ...events] }
        }),

      requestBlChanges: (note, actor) =>
        commit({ blStatus: 'changes-requested', blChangeNote: note }, {
          id: 'bl-changes', label: 'BL Changes Requested', actor, role: 'Customer', icon: '↔', note,
        }),

      redraftBl: actor =>
        commit({ blStatus: 'drafted', blChangeNote: null }, {
          id: 'bl-redraft', label: 'BL Re-drafted', actor, role: 'Ops', icon: '◇',
          note: 'Draft corrected and re-sent to the customer',
        }),

      releaseInvoice: actor =>
        commit(s => ({
          invoiceReleased: true,
          paymentStatus: s.hasStandingCredit ? 'standing-credit' : 'unpaid',
        }), {
          id: 'invoice-released', label: 'Invoice Released', actor, role: 'Ops', icon: '◇',
          note: 'Freight invoice raised against the booking',
        }),

      setStandingCredit: (on, actor) =>
        commit(s => ({
          hasStandingCredit: on,
          paymentStatus: on && s.invoiceReleased ? 'standing-credit' : on ? s.paymentStatus : 'unpaid',
        }), {
          id: 'credit-terms', label: 'Payment Terms Changed', actor, role: 'Ops', icon: '◇',
          note: on ? 'Account set to standing credit by Finance' : 'Standing credit removed — pay per booking',
        }),

      recordPayment: (ref, actor) =>
        commit({ paymentStatus: 'paid', paymentRef: ref }, {
          id: 'payment', label: 'Payment Recorded', actor, role: 'Customer', icon: '✓',
          note: `Bank transfer reference ${ref}`,
        }),

      releaseMbl: actor =>
        commit({ mblReleased: true }, {
          id: 'mbl-released', label: 'MBL Released', actor, role: 'Ops', icon: '✓',
          note: 'Master Bill of Lading released to the customer',
        }),

      reset: () => { clock = 0; setBooking(INITIAL) },
    }
  }, [])

  const value = useMemo<Ctx>(() => {
    const prereqs = prereqsFor(booking)
    return {
      booking,
      statusLabel: bookingStatusLabel(booking),
      latestEvent: booking.events[booking.events.length - 1],
      prereqs,
      readyForOps: prereqs.every(p => p.done),
      sailing: booking.sailingId ? getSailing(booking.sailingId) : undefined,
      actions,
    }
  }, [booking, actions])

  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>
}

export function useBooking(): Ctx {
  const ctx = useContext(BookingCtx)
  if (!ctx) throw new Error('useBooking must be used inside a BookingProvider')
  return ctx
}
