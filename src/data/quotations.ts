// Mock quotation records — one per row in QuotationList, each telling a
// different negotiation story (fresh draft, just sent, countered into Trade,
// accepted, and rejected) instead of one static screen for every row.

export type NegoEntry = {
  actor: string
  role: string
  type: 'offer' | 'counter' | 'negotiate' | 'accept' | 'decline' | 'reject' | 'note'
  rate: number
  note?: string
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
    cost: 480,
    history: [
      { actor: 'Rohit Kumar', role: 'Sales', type: 'offer', rate: 520, note: 'Customer asked USD 500 in their mail; our cost (Tariff + Slot Rate + Ocean Freight) came to USD 480, so Sales quoted higher.', ts: '14 Nov, 09:58' },
      { actor: 'Nisha Patel', role: 'Customer', type: 'counter', rate: 460, note: "Counter-offer — we need it closer to last quarter's rate.", ts: '14 Nov, 11:24' },
      { actor: 'Priya Singh', role: 'Trade', type: 'counter', rate: 485, note: "USD 460 falls below our USD 480 cost — Sales couldn't accept it. Best Trade can do just above cost, with current sailing allocation.", ts: '14 Nov, 14:05' },
    ],
  },
  {
    id: 'QT-2024-0215',
    customer: 'Meridian Apparel Co.',
    pol: 'INMUN',
    pod: 'NLRTM',
    containers: '1 × 40ft Dry',
    status: 'sent',
    cost: 800,
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
      { actor: 'Rohit Kumar', role: 'Sales', type: 'offer', rate: 1340, note: 'Customer asked USD 1250; cost came to USD 1110, healthy margin, quoted higher.', ts: '10 Nov, 09:30' },
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
      { actor: 'Rohit Kumar', role: 'Sales', type: 'offer', rate: 1510, note: 'Initial quote based on AI review.', ts: '05 Nov, 10:12' },
      { actor: 'Meera Nair', role: 'Customer', type: 'counter', rate: 1400, note: 'Counter-offer.', ts: '05 Nov, 14:40' },
      { actor: 'Meera Nair', role: 'Customer', type: 'reject', rate: 1400, note: 'Found a better rate elsewhere — declining outright.', ts: '06 Nov, 09:00' },
    ],
  },
]

export function getQuotation(id: string | null): QuotationRecord {
  return QUOTATIONS.find(q => q.id === id) ?? QUOTATIONS[0]
}
