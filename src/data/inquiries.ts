// Mock inquiry records — one per row in InquiryList. Deliberately varied so the
// UI shows every kind of outcome (missing data, healthy margin, below-cost,
// quoted, lost) instead of one scenario repeated everywhere. Nothing here is
// computed by an AI at runtime — this is what an AI parse would have already
// produced, shown next to the raw mail it came from, so the mapping is legible.

export type CostBreakdown = { tariff: number; slotRate: number; oceanFreight: number }

export type InquiryRecord = {
  id: string
  status: 'pending-review' | 'awaiting-customer-info' | 'sent-to-trade' | 'awaiting-trade' | 'quoted' | 'declined'
  statusLabel: string
  needsReview: boolean
  customer: string
  customerId: string
  kycApproved: boolean
  senderName: string
  senderEmail: string
  receivedAt: string
  rawMail: string
  pol: string
  pod: string
  containerType: string
  containerQty: number
  commodity: string
  /** AI confidence per extracted field, 0-100. Missing/unmentioned fields are 0. */
  confidence: { pol: number; pod: number; containerQty: number; commodity: number; targetRate: number }
  /** What the customer actually asked for in the mail — null if they didn't say. */
  customerAsk: number | null
  /** Our own cost basis for this lane/container combo — null if not assessed yet. */
  cost: CostBreakdown | null
  /** What Sales decided to quote back — null until Sales sets one. */
  proposedRate: number | null
  /** Set once a formal quote exists for this inquiry — links to quotations.ts. */
  quoteId?: string
  /** Shown for inquiries that have already moved past the "pending review" stage. */
  note?: string
}

export const INQUIRIES: InquiryRecord[] = [
  {
    id: 'INQ-2024-0391',
    status: 'pending-review',
    statusLabel: 'Pending Review',
    needsReview: true,
    customer: 'Stellar Exports Pvt Ltd',
    customerId: 'CUST-0042',
    kycApproved: true,
    senderName: 'Nisha Patel',
    senderEmail: 'nisha@stellarexports.in',
    receivedAt: '2024-11-14 09:41 IST',
    rawMail:
`Subject: Rate request - Nhava Sheva to Shanghai

Hi team,

We need to move 2 x 40ft High Cube containers from Nhava Sheva (INNSA) to
Shanghai (CNSHA). Cargo is garments and textiles. Looking at around USD 500
per TEU all-in if possible — that's what we paid last time.

Can you confirm availability and send a quote?

Thanks,
Nisha Patel
Stellar Exports Pvt Ltd`,
    pol: 'INNSA',
    pod: 'CNSHA',
    containerType: '40ft High Cube',
    containerQty: 2,
    commodity: 'Garments & Textiles',
    confidence: { pol: 96, pod: 96, containerQty: 62, commodity: 58, targetRate: 91 },
    customerAsk: 500,
    cost: { tariff: 190, slotRate: 140, oceanFreight: 110 },
    proposedRate: 520,
    quoteId: 'QT-2024-0217',
  },
  {
    id: 'INQ-2024-0390',
    status: 'awaiting-customer-info',
    statusLabel: 'Awaiting Customer Info',
    needsReview: false,
    customer: 'Bharat Foods Exporters',
    customerId: 'CUST-0117',
    kycApproved: true,
    senderName: 'Vikram Shah',
    senderEmail: 'vikram@bharatfoods.in',
    receivedAt: '2024-11-13 16:05 IST',
    rawMail:
`Subject: Need container booking

Hello,

We are looking to export frozen food products (reefer cargo) from Mundra to
Rotterdam. Please let us know the process.

Regards,
Vikram Shah
Bharat Foods Exporters`,
    pol: 'INMUN',
    pod: 'NLRTM',
    containerType: '40ft Reefer',
    containerQty: 0,
    commodity: 'Frozen Food Products',
    confidence: { pol: 88, pod: 90, containerQty: 0, commodity: 85, targetRate: 0 },
    customerAsk: null,
    cost: null,
    proposedRate: null,
    note: "Container count and target rate weren't given — Sales needs to ask the customer directly before this can be priced.",
  },
  {
    id: 'INQ-2024-0388',
    status: 'awaiting-trade',
    statusLabel: 'Awaiting Trade',
    needsReview: false,
    customer: 'Apex Logistics Pvt Ltd',
    customerId: 'CUST-0076',
    kycApproved: true,
    senderName: 'Kiran Mehta',
    senderEmail: 'kiran@apexlogistics.ae',
    receivedAt: '2024-11-12 11:20 IST',
    rawMail:
`Subject: Container rate - Mundra to Jebel Ali

We need pricing for 3 x 20ft Dry containers, Mundra to Jebel Ali, general
cargo (auto parts). Best rate you can do is USD 410 per TEU — that's our
budget ceiling from finance.

Kiran Mehta
Apex Logistics Pvt Ltd`,
    pol: 'INMUN',
    pod: 'AEJEA',
    containerType: '20ft Dry',
    containerQty: 3,
    commodity: 'Auto Parts',
    confidence: { pol: 94, pod: 96, containerQty: 95, commodity: 92, targetRate: 97 },
    customerAsk: 410,
    cost: { tariff: 190, slotRate: 160, oceanFreight: 85 },
    proposedRate: null,
    note: 'USD 410 is below our USD 435 cost — routed straight to Trade. Trade acknowledged; SLA 4 business hours.',
  },
  {
    id: 'INQ-2024-0385',
    status: 'quoted',
    statusLabel: 'Quoted',
    needsReview: false,
    customer: 'Suvarna Textiles',
    customerId: 'CUST-0059',
    kycApproved: true,
    senderName: 'Suresh Iyer',
    senderEmail: 'suresh@suvarnatextiles.in',
    receivedAt: '2024-11-10 08:15 IST',
    rawMail:
`Subject: Quote request INNSA-USNYC

Hi, please quote 1 x 40ft High Cube, Nhava Sheva to New York, cotton yarn
consignment. We're hoping for around USD 1250 / TEU based on current market.

Suresh Iyer
Suvarna Textiles`,
    pol: 'INNSA',
    pod: 'USNYC',
    containerType: '40ft High Cube',
    containerQty: 1,
    commodity: 'Cotton Yarn',
    confidence: { pol: 95, pod: 93, containerQty: 96, commodity: 90, targetRate: 94 },
    customerAsk: 1250,
    cost: { tariff: 480, slotRate: 350, oceanFreight: 280 },
    proposedRate: 1340,
    quoteId: 'QT-2024-0209',
    note: "The ask of USD 1250 cleared the USD 1243 floor by USD 7 — Blue, so Sales could act. Quoted 1340 for a comfortable margin; no Trade involvement needed.",
  },
  {
    id: 'INQ-2024-0379',
    status: 'declined',
    statusLabel: 'Declined by Trade',
    needsReview: false,
    customer: 'Global Cargo Solutions',
    customerId: 'CUST-0031',
    kycApproved: false,
    senderName: 'Arvind Rao',
    senderEmail: 'arvind@globalcargosolutions.com',
    receivedAt: '2024-11-08 13:47 IST',
    rawMail:
`Subject: Rate needed urgently

Need 1 x 40ft HC, Mumbai to New York, general cargo. Budget is USD 1180 per
TEU, need confirmation by end of week.

Arvind Rao
Global Cargo Solutions`,
    pol: 'INBOM',
    pod: 'USNYC',
    containerType: '40ft High Cube',
    containerQty: 1,
    commodity: 'General Cargo',
    confidence: { pol: 90, pod: 93, containerQty: 95, commodity: 70, targetRate: 92 },
    customerAsk: 1180,
    cost: { tariff: 520, slotRate: 400, oceanFreight: 300 },
    proposedRate: null,
    note: "Sent to Trade for below-cost approval — Trade declined it.",
  },
]

export function getInquiry(id: string | null): InquiryRecord {
  return INQUIRIES.find(i => i.id === id) ?? INQUIRIES[0]
}
