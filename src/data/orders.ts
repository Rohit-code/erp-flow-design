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
      { id: 'inq-create', label: 'Inquiry Created', actor: 'Nisha Patel', role: 'Customer', ts: '14 Nov 2024 · 09:41 IST', status: 'done', note: 'Customer email received: INNSA→CNSHA, 2×40HC', icon: '◎' },
      { id: 'ai-review', label: 'AI Reviewed', actor: 'Regnus AI', role: 'System', ts: '14 Nov 2024 · 09:41 IST', status: 'done', note: 'Extraction confidence 94% · Margin check passed (within Sales authority)', icon: '⬡' },
      { id: 'sent-trade', label: 'Sent to Trade', actor: 'Rohit Kumar', role: 'Sales', ts: '14 Nov 2024 · 09:52 IST', status: 'done', note: 'Escalated for rate validation. Trade sign-off not required — margin within authority.', icon: '→' },
      { id: 'quote-sent', label: 'Quote Sent', actor: 'Rohit Kumar', role: 'Sales', ts: '14 Nov 2024 · 09:58 IST', status: 'done', note: 'QT-2024-0217 · USD 520 / TEU initial offer', icon: '◇' },
      { id: 'quote-countered', label: 'Quote Countered', actor: 'Nisha Patel', role: 'Customer', ts: '14 Nov 2024 · 11:24 IST', status: 'done', note: 'Customer counter: USD 460 / TEU', icon: '↔' },
      { id: 'trade-counter', label: 'Trade Counter', actor: 'Priya Singh', role: 'Trade', ts: '14 Nov 2024 · 14:05 IST', status: 'done', note: 'Final offer: USD 485 / TEU (just above cost)', icon: '◇' },
      { id: 'quote-accepted', label: 'Quote Accepted', actor: 'Nisha Patel', role: 'Customer', ts: '14 Nov 2024 · 14:38 IST', status: 'done', note: 'Customer accepted USD 485 / TEU', icon: '✓' },
      { id: 'bkgform-sent', label: 'Booking Form Sent', actor: 'Regnus System', role: 'System', ts: '14 Nov 2024 · 14:38 IST', status: 'done', note: 'One-time link emailed to nisha@stellarexports.in · expires 24h', icon: '✉' },
      { id: 'kyc-submitted', label: 'KYC Submitted', actor: 'Nisha Patel', role: 'Customer', ts: '14 Nov 2024 · 15:02 IST', status: 'done', note: '5 documents uploaded · company details provided', icon: '◎' },
      { id: 'kyc-approved', label: 'KYC Approved', actor: 'Sunita R.', role: 'KYC Officer', ts: '14 Nov 2024 · 15:04 IST', status: 'done', note: 'All documents verified. Billing address confirmed.', icon: '✓' },
      { id: 'bkg-confirmed', label: 'Booking Confirmed', actor: 'Regnus System', role: 'System', ts: '14 Nov 2024 · 15:04 IST', status: 'done', note: 'Auto-confirmed: KYC ✓ · Billing address ✓', icon: '✓' },
      { id: 'sailing-selected', label: 'Sailing Selected', actor: 'Nisha Patel', role: 'Customer', ts: '15 Nov 2024 · 07:15 IST', status: 'done', note: 'MSC Gulsun · Voyage 2411E · ETD 22 Nov · ETA 14 Dec', icon: '⚓' },
      { id: 'cro-released', label: 'CRO Released', actor: 'Regnus System', role: 'System', ts: '15 Nov 2024 · 07:22 IST', status: 'active', note: 'CRO-2024-0089 · Mailed to JNPT-CFS3 depot and customer', icon: '⬡' },
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
      { id: 'ai-review', label: 'AI Reviewed', actor: 'Regnus AI', role: 'System', ts: '10 Nov 2024 · 08:16 IST', status: 'done', note: 'Extraction confidence 90% · Margin check passed (within Sales authority)', icon: '⬡' },
      { id: 'quote-sent', label: 'Quote Sent', actor: 'Rohit Kumar', role: 'Sales', ts: '10 Nov 2024 · 09:30 IST', status: 'done', note: 'QT-2024-0209 · USD 1340 / TEU initial offer', icon: '◇' },
      { id: 'quote-accepted', label: 'Quote Accepted', actor: 'Suresh Iyer', role: 'Customer', ts: '10 Nov 2024 · 13:05 IST', status: 'done', note: 'Customer accepted USD 1340 / TEU', icon: '✓' },
      { id: 'bkgform-sent', label: 'Booking Form Sent', actor: 'Regnus System', role: 'System', ts: '10 Nov 2024 · 13:06 IST', status: 'done', note: 'One-time link emailed to suresh@suvarnatextiles.in · expires 24h', icon: '✉' },
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
      { id: 'inq-create', label: 'Inquiry Created', actor: 'Kiran Mehta', role: 'Customer', ts: '12 Nov 2024 · 11:20 IST', status: 'done', note: 'Customer email received: INMUN→AEJEA, 3×20ft Dry, budget USD 410/TEU', icon: '◎' },
      { id: 'ai-review', label: 'AI Reviewed', actor: 'Regnus AI', role: 'System', ts: '12 Nov 2024 · 11:21 IST', status: 'done', note: 'Extraction confidence 95% · Margin check failed — USD 410 below USD 435 cost', icon: '⬡' },
      { id: 'sent-trade', label: 'Sent to Trade', actor: 'Rohit Kumar', role: 'Sales', ts: '12 Nov 2024 · 11:25 IST', status: 'done', note: 'Below cost — Sales cannot accept, routed to Trade.', icon: '→' },
      { id: 'trade-ack', label: 'Trade Acknowledged', actor: 'Priya Singh', role: 'Trade', ts: '12 Nov 2024 · 13:40 IST', status: 'done', note: 'Reviewing sailing allocation before countering.', icon: '◇' },
      { id: 'cancelled', label: 'Booking Cancelled', actor: 'Kiran Mehta', role: 'Customer', ts: '13 Nov 2024 · 09:10 IST', status: 'active', note: 'Customer withdrew the request — budget could not be met in time.', icon: '✕' },
    ],
  },
]

export function getOrder(id: string | null): OrderRecord {
  return ORDERS.find(o => o.id === id) ?? ORDERS[0]
}
