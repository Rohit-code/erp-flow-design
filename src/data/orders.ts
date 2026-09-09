// Mock order/booking records — one per row in OrderList, each with its own
// full audit trail instead of every row opening the same hardcoded timeline.

export type TimelineEntry = {
  id: string
  label: string
  actor: string
  role: string
  ts: string
  status: 'done' | 'active' | 'pending'
  note?: string
  icon: string
}

export type OrderRecord = {
  id: string
  customer: string
  pol: string
  pod: string
  equipment: string
  statusLabel: string
  statusVariant: 'active' | 'in-progress' | 'cancelled'
  timeline: TimelineEntry[]
}

export const ORDERS: OrderRecord[] = [
  {
    id: 'BKG-2024-00142',
    customer: 'Stellar Exports Pvt Ltd',
    pol: 'INNSA',
    pod: 'CNSHA',
    equipment: '2 × 40ft HC',
    statusLabel: 'CRO Released',
    statusVariant: 'active',
    timeline: [
      { id: 'inq-create', label: 'Inquiry Created', actor: 'Nisha Patel', role: 'Customer', ts: '14 Nov 2024 · 09:41 IST', status: 'done', note: 'Customer email received: INNSA→CNSHA, 2×40HC, asking USD 500 / container', icon: '◎' },
      { id: 'ai-review', label: 'AI Reviewed', actor: 'Regnus AI', role: 'System', ts: '14 Nov 2024 · 09:41 IST', status: 'done', note: 'Extraction confidence 94% · BLUE — ask of USD 500 clears the USD 493 floor, within Sales authority', icon: '⬡' },
      { id: 'magic-link', label: 'Magic Link Sent', actor: 'Rohit Kumar', role: 'Sales', ts: '14 Nov 2024 · 09:58 IST', status: 'done', note: 'First reply carried the quote plus a single-use portal link to nisha@stellarexports.in', icon: '✉' },
      { id: 'quote-sent', label: 'Quote Sent', actor: 'Rohit Kumar', role: 'Sales', ts: '14 Nov 2024 · 09:58 IST', status: 'done', note: 'QT-2024-0217 · USD 520 / container initial offer — above the floor, sent without Trade', icon: '◇' },
      { id: 'portal-created', label: 'Portal Account Created', actor: 'Nisha Patel', role: 'Customer', ts: '14 Nov 2024 · 10:12 IST', status: 'done', note: 'Password set from the magic link. All negotiation moves into the portal from here.', icon: '◎' },
      { id: 'quote-countered', label: 'Quote Countered', actor: 'Nisha Patel', role: 'Customer', ts: '14 Nov 2024 · 11:24 IST', status: 'done', note: 'Customer counter: USD 460 / container', icon: '↔' },
      { id: 'sent-trade', label: 'Sent to Trade', actor: 'Rohit Kumar', role: 'Sales', ts: '14 Nov 2024 · 11:31 IST', status: 'done', note: 'RED — USD 460 is USD 33 under the USD 493 floor. Above cost, but outside Sales authority, so Sales could neither accept nor counter it away.', icon: '→' },
      { id: 'trade-counter', label: 'Trade Counter', actor: 'Priya Singh', role: 'Trade', ts: '14 Nov 2024 · 14:05 IST', status: 'done', note: 'Final offer: USD 485 / container — still under the floor, accepted under Trade authority', icon: '◇' },
      { id: 'quote-accepted', label: 'Quote Accepted', actor: 'Nisha Patel', role: 'Customer', ts: '14 Nov 2024 · 14:38 IST', status: 'done', note: 'Customer accepted USD 485 / container · Rate Agreed', icon: '✓' },
      { id: 'depot-requirement', label: 'Requirement Sent to Depots', actor: 'Arjun Mehta', role: 'Ops', ts: '14 Nov 2024 · 14:44 IST', status: 'done', note: 'Mailed to 3 candidate depots near JNPT — runs in parallel with the customer’s KYC', icon: '→' },
      { id: 'kyc-submitted', label: 'KYC Submitted', actor: 'Nisha Patel', role: 'Customer', ts: '14 Nov 2024 · 15:02 IST', status: 'done', note: '5 documents uploaded · company details provided', icon: '◎' },
      { id: 'kyc-approved', label: 'KYC Approved', actor: 'Sunita R.', role: 'KYC Officer', ts: '14 Nov 2024 · 15:04 IST', status: 'done', note: 'All documents verified.', icon: '✓' },
      { id: 'addresses-selected', label: 'Addresses Selected', actor: 'Nisha Patel', role: 'Customer', ts: '14 Nov 2024 · 15:06 IST', status: 'done', note: 'Billing: Registered Office, Mumbai · Shipping: 2 dispatch addresses from the KYC book', icon: '◎' },
      { id: 'sailing-selected', label: 'Sailing Selected', actor: 'Nisha Patel', role: 'Customer', ts: '14 Nov 2024 · 15:11 IST', status: 'done', note: 'MSC Gulsun · Voyage 2411E · ETD 22 Nov · ETA 14 Dec — last of the customer’s three tasks', icon: '⚓' },
      { id: 'depot-assigned', label: 'Depot Assigned', actor: 'Arjun Mehta', role: 'Ops', ts: '14 Nov 2024 · 15:18 IST', status: 'done', note: '2 of 3 depots confirmed availability — Ops selected JNPT CFS Gate 3', icon: '⬡' },
      { id: 'ops-accepted', label: 'Accepted by Ops', actor: 'Arjun Mehta', role: 'Ops', ts: '14 Nov 2024 · 15:26 IST', status: 'done', note: 'Mandatory manual gate — KYC, addresses, sailing and depot all verified before acceptance', icon: '✓' },
      { id: 'bkg-confirmed', label: 'Booking Confirmed', actor: 'Regnus System', role: 'System', ts: '14 Nov 2024 · 15:26 IST', status: 'done', note: 'Confirmed on Ops acceptance — never automatic', icon: '✓' },
      { id: 'cro-released', label: 'CRO Released', actor: 'Regnus System', role: 'System', ts: '14 Nov 2024 · 15:27 IST', status: 'active', note: 'CRO-2024-0089 · Two copies — pickup notice to JNPT-CFS3, download copy to the customer portal', icon: '⬡' },
    ],
  },
  {
    id: 'BKG-2024-00139',
    customer: 'Suvarna Textiles',
    pol: 'INNSA',
    pod: 'USNYC',
    equipment: '1 × 40ft HC',
    statusLabel: 'Awaiting KYC',
    statusVariant: 'in-progress',
    timeline: [
      { id: 'inq-create', label: 'Inquiry Created', actor: 'Suresh Iyer', role: 'Customer', ts: '10 Nov 2024 · 08:15 IST', status: 'done', note: 'Customer email received: INNSA→USNYC, 1×40HC', icon: '◎' },
      { id: 'ai-review', label: 'AI Reviewed', actor: 'Regnus AI', role: 'System', ts: '10 Nov 2024 · 08:16 IST', status: 'done', note: 'Extraction confidence 90% · BLUE — ask of USD 1250 clears the USD 1243 floor', icon: '⬡' },
      { id: 'quote-sent', label: 'Quote Sent', actor: 'Rohit Kumar', role: 'Sales', ts: '10 Nov 2024 · 09:30 IST', status: 'done', note: 'QT-2024-0209 · USD 1340 / container initial offer', icon: '◇' },
      { id: 'quote-accepted', label: 'Quote Accepted', actor: 'Suresh Iyer', role: 'Customer', ts: '10 Nov 2024 · 13:05 IST', status: 'done', note: 'Customer accepted USD 1340 / container', icon: '✓' },
      { id: 'bkgform-sent', label: 'Magic Link Sent', actor: 'Regnus System', role: 'System', ts: '10 Nov 2024 · 13:06 IST', status: 'done', note: 'Single-use portal link emailed to suresh@suvarnatextiles.in · expires 24h', icon: '✉' },
      { id: 'kyc-submitted', label: 'KYC Submitted', actor: 'Suresh Iyer', role: 'Customer', ts: '11 Nov 2024 · 10:20 IST', status: 'active', note: '3 documents uploaded — awaiting KYC officer review', icon: '◎' },
    ],
  },
  {
    id: 'BKG-2024-00128',
    customer: 'Apex Logistics Pvt Ltd',
    pol: 'INMUN',
    pod: 'AEJEA',
    equipment: '3 × 20ft Dry',
    statusLabel: 'Cancelled',
    statusVariant: 'cancelled',
    timeline: [
      { id: 'inq-create', label: 'Inquiry Created', actor: 'Kiran Mehta', role: 'Customer', ts: '12 Nov 2024 · 11:20 IST', status: 'done', note: 'Customer email received: INMUN→AEJEA, 3×20ft Dry, budget USD 410 / container', icon: '◎' },
      { id: 'ai-review', label: 'AI Reviewed', actor: 'Regnus AI', role: 'System', ts: '12 Nov 2024 · 11:21 IST', status: 'done', note: 'Extraction confidence 95% · RED — USD 410 is below the USD 435 cost, let alone the USD 487 floor', icon: '⬡' },
      { id: 'sent-trade', label: 'Sent to Trade', actor: 'Rohit Kumar', role: 'Sales', ts: '12 Nov 2024 · 11:25 IST', status: 'done', note: 'Below cost — Sales cannot accept or counter, routed to Trade.', icon: '→' },
      { id: 'trade-ack', label: 'Trade Acknowledged', actor: 'Priya Singh', role: 'Trade', ts: '12 Nov 2024 · 13:40 IST', status: 'done', note: 'Reviewing sailing allocation before countering.', icon: '◇' },
      { id: 'cancelled', label: 'Booking Cancelled', actor: 'Kiran Mehta', role: 'Customer', ts: '13 Nov 2024 · 09:10 IST', status: 'active', note: 'Customer withdrew the request — budget could not be met in time.', icon: '✕' },
    ],
  },
]

export function getOrder(id: string | null): OrderRecord {
  return ORDERS.find(o => o.id === id) ?? ORDERS[0]
}
