// Candidate depots for the booking's port of load. Ops mails the container
// requirement to all of them; each replies yes or no.

export type Depot = {
  id: string
  name: string
  ref: string
  address: string
}

export const DEPOTS: Depot[] = [
  { id: 'dep-1', name: 'JNPT CFS Gate 1', ref: 'JNPT-DEP-CFS1', address: 'Gate 1, JNPT Container Freight Station, Nhava Sheva, Navi Mumbai 400 707' },
  { id: 'dep-2', name: 'JNPT CFS Gate 3', ref: 'JNPT-DEP-CFS3', address: 'Gate 3, JNPT Container Freight Station, Nhava Sheva, Navi Mumbai 400 707' },
  { id: 'dep-3', name: 'Nhava Sheva Freight Terminal', ref: 'NSFT-DEP-01', address: 'Plot 22, Nhava Sheva Freight Terminal, Uran, Navi Mumbai 400 702' },
]

export const getDepot = (id: string): Depot | undefined => DEPOTS.find(d => d.id === id)
