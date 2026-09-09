// Mock quotation records — one per row in QuotationList, each telling a
// different negotiation story (fresh draft, just sent, countered into Trade,
// accepted, and rejected) instead of one static screen for every row.

export type NegoEntry = {
  actor: string
  role: string
  type: 'offer' | 'counter' | 'negotiate' | 'accept' | 'decline' | 'reject' | 'note'
  rate: number
  /** Shown to everyone on the thread, customer included. Never put cost, floor
   *  margin or internal authority reasoning here. */
  note?: string
  /** Staff-only commentary — cost basis, floor margin, why authority moved.
   *  Rendered for Sales/Trade/Ops and hidden from the customer. */
  internalNote?: string
  ts: string
}

export type QuotationRecord = {
  id: string
  inquiryId?: string
  customer: string
  pol: string
  pod: string
  containers: string
  status: 'draft' | 'sent' | 'countered' | 'accepted' | 'rejected'
  history: NegoEntry[]
  /** Our internal cost basis (Tariff + Slot Rate + Ocean Freight) for this quote's lane/containers. */
  cost: number
}

export const QUOTATIONS: QuotationRecord[] = [
  {
    id: 'QT-2024-0217',
    inquiryId: 'INQ-2024-0391',
    customer: 'Stellar Exports Pvt Ltd',
    pol: 'INNSA',
    pod: 'CNSHA',
    containers: '2 × 40ft HC',
    status: 'countered',
    cost: 440,
    history: [
      { actor: 'Rohit Kumar', role: 'Sales', type: 'offer', rate: 520, note: 'Thanks for the enquiry — here is our rate for this lane and sailing.', internalNote: 'Ask of USD 500 clears the USD 493 floor (cost USD 440) — Blue, so Sales quoted higher at 520 without Trade.', ts: '14 Nov, 09:58' },
      { actor: 'Nisha Patel', role: 'Customer', type: 'counter', rate: 460, note: "Counter-offer — we need it closer to last quarter's rate.", ts: '14 Nov, 11:24' },
      { actor: 'Priya Singh', role: 'Trade', type: 'counter', rate: 485, note: 'Best we can do on the current sailing allocation.', internalNote: 'USD 460 was USD 33 under the USD 493 floor — above cost, but outside Sales authority. Countered at 485 and accepted under Trade authority.', ts: '14 Nov, 14:05' },
    ],
  },
  {
    id: 'QT-2024-0215',
    customer: 'Meridian Apparel Co.',
    pol: 'INMUN',
    pod: 'NLRTM',
    containers: '1 × 40ft Dry',
    status: 'sent',
    cost: 780,
    history: [
      { actor: 'Rohit Kumar', role: 'Sales', type: 'offer', rate: 890, note: 'Initial quote — awaiting customer response.', ts: '13 Nov, 15:10' },
    ],
  },
  {
    id: 'QT-2024-0209',
    inquiryId: 'INQ-2024-0385',
    customer: 'Suvarna Textiles',
    pol: 'INNSA',
    pod: 'USNYC',
    containers: '1 × 40ft HC',
    status: 'accepted',
    cost: 1110,
    history: [
      { actor: 'Rohit Kumar', role: 'Sales', type: 'offer', rate: 1340, note: 'Our rate for this lane — happy to talk it through.', internalNote: 'Ask of USD 1250 cleared the USD 1243 floor by USD 7 — Blue. Quoted 1340 for a comfortable margin.', ts: '10 Nov, 09:30' },
      { actor: 'Suresh Iyer', role: 'Customer', type: 'accept', rate: 1340, note: 'Accepted — proceeding to booking form.', ts: '10 Nov, 13:05' },
    ],
  },
  {
    id: 'QT-2024-0201',
    customer: 'Kiran Marine Exports',
    pol: 'INBOM',
    pod: 'SGSIN',
    containers: '1 × 20ft Dry',
    status: 'draft',
    cost: 380,
    history: [],
  },
  {
    id: 'QT-2024-0188',
    customer: 'Vasavi Textiles',
    pol: 'INMAA',
    pod: 'GBFXT',
    containers: '2 × 40ft Dry',
    status: 'rejected',
    cost: 1300,
    history: [
      { actor: 'Rohit Kumar', role: 'Sales', type: 'offer', rate: 1510, note: 'Our rate for this lane.', internalNote: 'Ask cleared the floor — Blue, quoted without Trade.', ts: '05 Nov, 10:12' },
      { actor: 'Meera Nair', role: 'Customer', type: 'counter', rate: 1400, note: 'Counter-offer.', ts: '05 Nov, 14:40' },
      { actor: 'Meera Nair', role: 'Customer', type: 'reject', rate: 1400, note: 'Found a better rate elsewhere — declining outright.', ts: '06 Nov, 09:00' },
    ],
  },
]

export function getQuotation(id: string | null): QuotationRecord {
  return QUOTATIONS.find(q => q.id === id) ?? QUOTATIONS[0]
}
