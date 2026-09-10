import { useState } from 'react'
import { Screen, Session } from '../types'
import { useBooking } from '../state/BookingContext'
import { getAddress } from '../data/addresses'
import { BOOKING } from '../data/booking'
import { Field, Input, Select, PageHeader, SectionCard, cls, C, Icon } from '../components/ui'

type ContainerRow = {
  number: string
  seal: string
  grossWeight: string
  grossUom: string
  netWeight: string
  netUom: string
  cbm: string
  cbmUom: string
  packages: string
  packagesUom: string
}

const WEIGHT_UOMS = ['KGS', 'MT', 'MTS']
const VOLUME_UOMS = ['CBM', 'LTR', 'M3']
const PACKAGE_UOMS = ['PKGS', 'CTNS', 'BOX', 'BAGS', 'PALLETS', 'DRUMS']

const FREIGHT_PAYABLE_PORTS = ['Mumbai', 'Nhavasheva', 'Singapore', 'Dubai', 'Shanghai', 'Chennai', 'Kolkata']

export default function ShippingInstructions({ session, onNavigate }: { session: Session; onNavigate: (s: Screen) => void }) {
  const { booking, actions, sailing } = useBooking()
  // Derived from the dispatch addresses chosen at the address step — display only.
  const dispatch = booking.shippingAddressIds.map(getAddress).filter(Boolean)
  const shipper = dispatch.length
    ? `${BOOKING.customer} — ${dispatch[0]!.line1}, ${dispatch[0]!.city} ${dispatch[0]!.pin}, ${dispatch[0]!.country}`
    : BOOKING.customer
  const [consignee, setConsignee] = useState('Shanghai Huaxin Trading Co., Ltd, Pudong, Shanghai, China')
  const [consigneeSaved, setConsigneeSaved] = useState(false)
  const [notifyParty, setNotifyParty] = useState('Shanghai Huaxin Trading Co., Ltd, Pudong, Shanghai, China')

  const [vessel, setVessel] = useState(sailing ? `${sailing.vessel} / ${sailing.voyage}` : '')
  const [placeOfReceipt, setPlaceOfReceipt] = useState(
    dispatch.length ? `${dispatch[0]!.city}, ${dispatch[0]!.state}, ${dispatch[0]!.country}` : '',
  )
  const [pol, setPol] = useState<string>(BOOKING.pol)
  const [pod, setPod] = useState<string>(BOOKING.pod)
  const [placeOfDelivery, setPlaceOfDelivery] = useState('')
  const [freightStatus, setFreightStatus] = useState('Prepaid')
  const [freightPayableAt, setFreightPayableAt] = useState('Mumbai')
  const [clubbingType, setClubbingType] = useState('CY/CY')
  const [blType, setBlType] = useState('RFS')

  const [loadType, setLoadType] = useState('FCL')
  const [cargoDescription, setCargoDescription] = useState('')
  const [marksAndNos, setMarksAndNos] = useState('')

  const [containers, setContainers] = useState<ContainerRow[]>(
    booking.containers.map(c => ({
      number: c.number, seal: '', grossWeight: '', grossUom: 'KGS', netWeight: '', netUom: 'KGS',
      cbm: '', cbmUom: 'CBM', packages: '', packagesUom: 'PKGS',
    })),
  )

  const submitted = booking.siSubmitted

  const updateContainer = (i: number, field: keyof Omit<ContainerRow, 'number'>, value: string) =>
    setContainers(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c))

  const handleSubmit = () => actions.submitSI(session.name)

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb="Shipping Instructions"
        title="Shipping Instructions"
        subtitle="Booking BKG-2024-00142 · containers already allocated — no need to re-enter container numbers."
      />

      {submitted && (
        <div
          style={{ background: C.green.bg, border: `1px solid ${C.green.border}`, borderRadius: 6 }}
          className="flex items-center justify-between gap-3 px-4 py-3 mb-5"
        >
          <div className="flex items-start gap-3">
            <span style={{ color: C.green.text, marginTop: 1 }}><Icon.check /></span>
            <div>
              <div className="text-sm font-medium" style={{ color: C.green.text }}>Shipping Instructions submitted</div>
              <div className="text-[12px] mt-0.5" style={{ color: '#6ee7b7' }}>
                SI has been routed for BL draft generation. Containers can now proceed to Gate In.
              </div>
            </div>
          </div>
          <button onClick={() => onNavigate('gate-in')} className={cls.btnPrimary}>
            Continue to Gate In →
          </button>
        </div>
      )}

      <SectionCard title="Parties">
        <div className="space-y-4">
          {/* Shipper is the customer's own KYC-verified entity and address. It is
              not editable here — it must match what customs and the BL expect,
              and changes go through Sales → Admin → KYC. */}
          <Field label="Shipper">
            <div
              style={{ background: '#1a1d24', border: `1px solid ${C.border}`, borderRadius: 4 }}
              className="flex items-center justify-between gap-3 px-3 py-2"
            >
              <span className="text-sm" style={{ color: C.textSubtle }}>{shipper}</span>
              <span className="text-[11px] flex-shrink-0" style={{ color: C.textMuted }}>
                From your KYC address book · locked
              </span>
            </div>
          </Field>
          <Field label="Consignee">
            <Input value={consignee} onChange={e => setConsignee(e.target.value)} required />
          </Field>
          <Field label="Notify Party">
            <Input value={notifyParty} onChange={e => setNotifyParty(e.target.value)} required />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Routing">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Vessel / Voyage (optional)">
            <Input value={vessel} onChange={e => setVessel(e.target.value)} placeholder="Vessel / Voyage No." />
          </Field>
          <Field label="Place of Receipt">
            <Input value={placeOfReceipt} onChange={e => setPlaceOfReceipt(e.target.value)} required />
          </Field>
          <Field label="Port of Loading">
            <Input value={pol} onChange={e => setPol(e.target.value.toUpperCase())} mono required />
          </Field>
          <Field label="Port of Discharge">
            <Input value={pod} onChange={e => setPod(e.target.value.toUpperCase())} mono required />
          </Field>
          <Field label="Place of Delivery">
            <Input value={placeOfDelivery} onChange={e => setPlaceOfDelivery(e.target.value)} required />
          </Field>
          <Field label="Freight Status">
            <Select value={freightStatus} onChange={e => setFreightStatus(e.target.value)} required>
              <option>Prepaid</option>
              <option>Collect</option>
            </Select>
          </Field>
          <Field label="Freight Payable At">
            <Select value={freightPayableAt} onChange={e => setFreightPayableAt(e.target.value)} required>
              {FREIGHT_PAYABLE_PORTS.map(p => <option key={p}>{p}</option>)}
            </Select>
          </Field>
          <Field label="Clubbing Type">
            <Select value={clubbingType} onChange={e => setClubbingType(e.target.value)} required>
              <option>CY/CY</option>
              <option>CFS/CY</option>
              <option>CY/CFS</option>
              <option>CFS/CFS</option>
            </Select>
          </Field>
          <Field label="BL Type">
            <Select value={blType} onChange={e => setBlType(e.target.value)} required>
              <option>RFS</option>
              <option>SOB</option>
            </Select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Cargo">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Load Type">
            <Select value={loadType} onChange={e => setLoadType(e.target.value)} required>
              <option>FCL</option>
              <option>LCL</option>
            </Select>
          </Field>
          <Field label="Cargo Description">
            <Input value={cargoDescription} onChange={e => setCargoDescription(e.target.value)} required />
          </Field>
          <Field label="Marks & Nos" className="col-span-2">
            <Input value={marksAndNos} onChange={e => setMarksAndNos(e.target.value)} required />
            <div className="text-[11px] mt-1" style={{ color: C.textMuted }}>Carried on the first container line only</div>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Containers">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 960 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {/* 'UOM' repeats four times, so index is the only stable key here. */}
                {['Container No.', 'Seal No.', 'Gross Weight', 'UOM', 'Net Weight', 'UOM', 'CBM', 'UOM', 'No. of Packages', 'UOM'].map((h, i) => (
                  <th key={`${h}-${i}`} className={cls.tableHeader} style={{ textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {containers.map((c, i) => (
                <tr key={c.number} style={{ borderBottom: i < containers.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <td className={cls.tableCell}>
                    <span className="font-mono text-[13px]" style={{ color: C.accentDim }}>{c.number}</span>
                  </td>
                  <td className={cls.tableCell}>
                    <Input value={c.seal} onChange={e => updateContainer(i, 'seal', e.target.value)} placeholder="Seal No." />
                  </td>
                  <td className={cls.tableCell}>
                    <Input value={c.grossWeight} onChange={e => updateContainer(i, 'grossWeight', e.target.value)} placeholder="0.00" />
                  </td>
                  <td className={cls.tableCell}>
                    <Select value={c.grossUom} onChange={e => updateContainer(i, 'grossUom', e.target.value)}>
                      {WEIGHT_UOMS.map(u => <option key={u}>{u}</option>)}
                    </Select>
                  </td>
                  <td className={cls.tableCell}>
                    <Input value={c.netWeight} onChange={e => updateContainer(i, 'netWeight', e.target.value)} placeholder="0.00" />
                  </td>
                  <td className={cls.tableCell}>
                    <Select value={c.netUom} onChange={e => updateContainer(i, 'netUom', e.target.value)}>
                      {WEIGHT_UOMS.map(u => <option key={u}>{u}</option>)}
                    </Select>
                  </td>
                  <td className={cls.tableCell}>
                    <Input value={c.cbm} onChange={e => updateContainer(i, 'cbm', e.target.value)} placeholder="0.00" />
                  </td>
                  <td className={cls.tableCell}>
                    <Select value={c.cbmUom} onChange={e => updateContainer(i, 'cbmUom', e.target.value)}>
                      {VOLUME_UOMS.map(u => <option key={u}>{u}</option>)}
                    </Select>
                  </td>
                  <td className={cls.tableCell}>
                    <Input value={c.packages} onChange={e => updateContainer(i, 'packages', e.target.value)} placeholder="0" />
                  </td>
                  <td className={cls.tableCell}>
                    <Select value={c.packagesUom} onChange={e => updateContainer(i, 'packagesUom', e.target.value)}>
                      {PACKAGE_UOMS.map(u => <option key={u}>{u}</option>)}
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="Where these addresses came from"
        action={
          <button
            onClick={() => setConsigneeSaved(true)}
            disabled={consigneeSaved}
            className={cls.btnSecondary}
            style={{ fontSize: 12, padding: '4px 10px', opacity: consigneeSaved ? 0.6 : 1 }}
          >
            {consigneeSaved ? <><Icon.check /> Saved for reuse</> : <><Icon.plus /> Save consignee for reuse</>}
          </button>
        }
      >
        <p className="text-[12px] leading-relaxed" style={{ color: C.textMuted }}>
          <strong style={{ color: C.textSubtle }}>Shipper</strong> is locked. It comes from the dispatch address you chose
          for this booking and must match your KYC-verified entity — to change it, ask Sales.
          <br />
          <strong style={{ color: C.textSubtle }}>Place of Receipt</strong> is pre-filled from the same address but stays
          editable, since it may be an ICD or CFS rather than one of your own locations.
          <br />
          <strong style={{ color: C.textSubtle }}>Consignee</strong> and{' '}
          <strong style={{ color: C.textSubtle }}>Notify Party</strong> are entered per shipment — your overseas buyer
          changes deal to deal. Save one to reuse it on your next booking to the same consignee.
        </p>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <button onClick={handleSubmit} className={cls.btnPrimary}>
          <Icon.check /> Submit Shipping Instructions
        </button>
      </div>
    </div>
  )
}
