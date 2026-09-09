// The one booking the prototype walks end to end.
//
// Every screen that shows this booking's facts — Ops acceptance, Booking
// Confirmed, CRO, BL Draft, Invoice, MBL — reads them from here instead of
// keeping its own copy. Before this existed, the rate was 485 in the quotation
// and 562 on the invoice for the same booking.

import { splitRate } from './pricing'

export type MblType = 'surrender' | 'original'

export const BOOKING = {
  id: 'BKG-2024-00142',
  quotationId: 'QT-2024-0217',
  inquiryId: 'INQ-2024-0391',

  customer: 'Stellar Exports Pvt Ltd',
  customerContact: 'Nisha Patel',
  customerEmail: 'nisha@stellarexports.in',

  pol: 'INNSA',
  polName: 'Nhava Sheva',
  pod: 'CNSHA',
  podName: 'Shanghai',

  commodity: 'Garments & Textiles',
  containerType: '40ft High Cube',
  containerCount: 2,
  equipment: '2 × 40ft High Cube',

  /** Our cost basis: tariff + slot rate + ocean freight. Never shown to the customer. */
  cost: 440,
  /** The rate the customer accepted, after Trade countered. Quoted per container. */
  agreedRate: 485,

  depot: 'JNPT CFS Gate 3',
  depotRef: 'JNPT-DEP-CFS3',
  croId: 'CRO-2024-0089',

  vessel: 'MSC Gulsun',
  voyage: '2411E',
  etd: '22 Nov 2024',
  eta: '14 Dec 2024',

  salesRep: 'Rohit Kumar',
  tradeRep: 'Priya Singh',
  opsRep: 'Arjun Mehta',
  kycOfficer: 'Sunita R.',

  containers: ['MSCU3841290', 'MSCU4012876'],

  /**
   * Whether this customer has standing credit with Maxicon. Set by Finance on
   * the customer account — never by the customer. When true, the MBL releases
   * on invoice without waiting for payment to clear.
   */
  hasStandingCredit: false,
} as const

/** Charge breakdown for the agreed rate — the same split the quotation shows. */
export const BOOKING_CHARGES = splitRate(BOOKING.agreedRate)

/** Total freight for the booking: rate per container × container count. */
export const BOOKING_GROSS = BOOKING.agreedRate * BOOKING.containerCount
