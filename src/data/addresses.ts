// The customer's KYC-verified address book. Only their own entity addresses
// live here — that is what makes "KYC approved" meaningful. Overseas consignees
// and notify parties are entered per shipment on the Shipping Instructions.

export type Address = {
  id: string
  name: string
  entity: string
  line1: string
  city: string
  state: string
  pin: string
  country: string
  gstin: string
  approved: boolean
  approvedDate: string | null
  pendingReason?: string
}

export const ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    name: 'Registered Office — Mumbai',
    entity: 'Stellar Exports Private Limited',
    line1: 'Plot 14, SEEPZ SEZ, Andheri East',
    city: 'Mumbai', state: 'Maharashtra', pin: '400 096', country: 'India',
    gstin: '27AAGCS3460Q1Z5',
    approved: true,
    approvedDate: '02 Sep 2024',
  },
  {
    id: 'addr-2',
    name: 'Warehouse / Dispatch — Thane',
    entity: 'Stellar Exports Private Limited',
    line1: 'Unit 7B, Trans-Thane Creek Industrial Area',
    city: 'Thane', state: 'Maharashtra', pin: '400 604', country: 'India',
    gstin: '27AAGCS3460Q1Z5',
    approved: true,
    approvedDate: '12 Oct 2024',
  },
  {
    id: 'addr-3',
    name: 'Factory — Bhiwandi',
    entity: 'Stellar Exports Private Limited',
    line1: 'Survey 212, Kalyan-Bhiwandi Road, Val',
    city: 'Bhiwandi', state: 'Maharashtra', pin: '421 302', country: 'India',
    gstin: '27AAGCS3460Q1Z5',
    approved: true,
    approvedDate: '28 Oct 2024',
  },
  {
    id: 'addr-4',
    name: 'Branch Office — Delhi',
    entity: 'Stellar Exports Private Limited',
    line1: '4th Floor, DLF Cyber Hub, Gurugram',
    city: 'Gurugram', state: 'Haryana', pin: '122 002', country: 'India',
    gstin: '06AAGCS3460Q1ZZ',
    approved: false,
    approvedDate: null,
    pendingReason: 'Haryana GSTIN still under verification — not selectable until KYC clears it.',
  },
]

export const getAddress = (id: string): Address | undefined => ADDRESSES.find(a => a.id === id)

/** Short one-line form used in summaries and on downstream documents. */
export const addressLine = (a: Address): string => `${a.line1}, ${a.city} ${a.pin}`
