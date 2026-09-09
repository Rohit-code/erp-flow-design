// Rate rules, in one place.
//
// Everything that judges a number — the AI reviewer on an inquiry, the
// Blue/Red authority split on a quotation, the charge breakdown on an invoice —
// reads from here. Screens must never re-derive a floor or re-split a rate
// locally: that is exactly how the same booking came to show USD 485 on one
// screen and USD 562 on the next.

// ─── Floor margin ────────────────────────────────────────────────────────────
// PROVISIONAL. Placeholder pending confirmation from the ERP team; the real
// rule may vary by lane, container type or customer tier. Chosen as a
// percentage rather than a flat amount because a single flat figure cannot
// serve lanes whose cost basis ranges from USD 480 to USD 1,110 — the same
// flat margin would be 15.6% on one and 6.8% on the other.
export const FLOOR_MARGIN_PCT = 0.12

/** Set true to surface the "provisional rule" caveat wherever the floor is shown. */
export const FLOOR_MARGIN_IS_PROVISIONAL = true

/** Rates are quoted and invoiced per container, not per TEU. */
export const RATE_UNIT = 'container'

/** The lowest rate Sales may accept without Trade: cost plus the floor margin. */
export function floorRate(cost: number): number {
  return Math.round(cost * (1 + FLOOR_MARGIN_PCT))
}

export type MarginVerdict =
  | 'blue'         // at or above the floor — Sales may negotiate or accept
  | 'below-floor'  // profitable, but under the floor — Trade authority required
  | 'below-cost'   // loss-making — Trade authority required

export type MarginAssessment = {
  cost: number
  floor: number
  rate: number
  verdict: MarginVerdict
  /** Only a 'blue' rate may be accepted by Sales. Both red states go to Trade. */
  salesMayAccept: boolean
  /** How far under the floor, in USD. Zero when at or above it. */
  shortfall: number
  /** Actual margin over cost as a percentage, e.g. 0.01 for 1%. */
  marginPct: number
}

export function assessMargin(rate: number, cost: number): MarginAssessment {
  const floor = floorRate(cost)
  const verdict: MarginVerdict =
    rate >= floor ? 'blue' : rate >= cost ? 'below-floor' : 'below-cost'
  return {
    cost,
    floor,
    rate,
    verdict,
    salesMayAccept: verdict === 'blue',
    shortfall: Math.max(0, floor - rate),
    marginPct: cost > 0 ? (rate - cost) / cost : 0,
  }
}

/** Blue / Red, in the words the sales floor uses. */
export function verdictLabel(v: MarginVerdict): string {
  return v === 'blue' ? 'BLUE' : 'RED'
}

// ─── Charge breakdown ────────────────────────────────────────────────────────
// An all-in rate splits into Ocean Freight / BAF / CAF. The quotation and the
// invoice must show the same split for the same rate, so both call this.
export type ChargeSplit = { ocean: number; baf: number; caf: number; total: number }

export function splitRate(total: number): ChargeSplit {
  const ocean = Math.round(total * 0.62)
  const baf = Math.round(total * 0.2)
  return { ocean, baf, caf: total - ocean - baf, total }
}

/** Formats a rate with its unit, e.g. "USD 485 / container". */
export function rateLabel(amount: number): string {
  return `USD ${amount} / ${RATE_UNIT}`
}

/** Formats a total with thousands separators, e.g. "USD 970". */
export function money(amount: number): string {
  return `USD ${amount.toLocaleString('en-US')}`
}
