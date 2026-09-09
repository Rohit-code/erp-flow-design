// Sailing schedule for the booking's lane. In the real system this is fetched
// automatically for POL → POD; here it is the fetched result.

export type Sailing = {
  id: string
  vessel: string
  line: string
  voyage: string
  etd: string
  eta: string
  transit: number
  cutoff: string
  spaces: number
  /** Earliest available on this lane. */
  highlight: boolean
}

export const SAILINGS: Sailing[] = [
  { id: 'v1', vessel: 'MSC Gulsun', line: 'MSC', voyage: '2411E', etd: '22 Nov 2024', eta: '14 Dec 2024', transit: 22, cutoff: '20 Nov 2024, 18:00', spaces: 12, highlight: true },
  { id: 'v2', vessel: 'CMA CGM Marco Polo', line: 'CMA CGM', voyage: '2411S', etd: '25 Nov 2024', eta: '18 Dec 2024', transit: 23, cutoff: '23 Nov 2024, 12:00', spaces: 8, highlight: false },
  { id: 'v3', vessel: 'Maersk Elba', line: 'Maersk', voyage: '411E', etd: '29 Nov 2024', eta: '21 Dec 2024', transit: 22, cutoff: '27 Nov 2024, 18:00', spaces: 24, highlight: false },
]

export const getSailing = (id: string): Sailing | undefined => SAILINGS.find(s => s.id === id)
