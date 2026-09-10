import { useState } from 'react'
import { Screen, Role, Session } from './types'
import { DEMO_USERS, ROLE_LANDING, isScreenAllowed } from './auth'
import { useBooking } from './state/BookingContext'
import { BOOKING } from './data/booking'
import ERPShell from './components/ERPShell'
import PortalShell from './components/PortalShell'
import DepotShell from './components/DepotShell'

import Login from './screens/Login'
import Home from './screens/Home'
import NewInquiry from './screens/NewInquiry'
import InquiryList from './screens/InquiryList'
import InquiryDetail from './screens/InquiryDetail'
import QuotationList from './screens/QuotationList'
import Quotation from './screens/Quotation'
import Register from './screens/Register'
import AddressSelect from './screens/AddressSelect'
import KYCQueue from './screens/KYCQueue'
import KYCForm from './screens/KYCForm'
import BookingList from './screens/BookingList'
import OpsAccept from './screens/OpsAccept'
import BookingConfirmed from './screens/BookingConfirmed'
import SelectSailing from './screens/SelectSailing'
import CRORelease from './screens/CRORelease'
import OrderList from './screens/OrderList'
import OrderTimeline from './screens/OrderTimeline'
import IAMDashboard from './screens/IAMDashboard'
import IAMUsers from './screens/IAMUsers'
import IAMGroups from './screens/IAMGroups'
import IAMPolicies from './screens/IAMPolicies'
import IAMPermissions from './screens/IAMPermissions'
import IAMAuditLog from './screens/IAMAuditLog'
import OrgHierarchy from './screens/OrgHierarchy'
import TradeQueue from './screens/TradeQueue'
import OpsDepotSelect from './screens/OpsDepotSelect'
import DepotRequirement from './screens/DepotRequirement'
import DepotHandover from './screens/DepotHandover'
import DepotQueue from './screens/DepotQueue'
import DepotCaseDetail from './screens/DepotCaseDetail'
import CaseList, { Stage } from './screens/CaseList'
import StageCaseDetail from './screens/StageCaseDetail'
import ContainerTracking from './screens/ContainerTracking'
import ShippingInstructions from './screens/ShippingInstructions'
import GateIn from './screens/GateIn'
import LoadVessel from './screens/LoadVessel'
import BLDraft from './screens/BLDraft'
import Invoice from './screens/Invoice'
import MBLRelease from './screens/MBLRelease'

export default function App() {
  const { booking } = useBooking()
  const [session, setSession] = useState<Session | null>(null)
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedInquiryId, setSelectedInquiryId] = useState('INQ-2024-0391')
  const [selectedQuoteId, setSelectedQuoteId] = useState('QT-2024-0217')
  const [selectedOrderId, setSelectedOrderId] = useState('BKG-2024-00142')
  const [selectedCaseId, setSelectedCaseId] = useState('BKG-2024-00135')
  const [selectedCaseStage, setSelectedCaseStage] = useState<Stage>('ops-accept')

  // A customer who has already opened their magic link should land in the
  // portal, not back on the registration page.
  const landingFor = (role: Role): Screen =>
    role === 'customer' && booking.customerRegistered ? 'quotation' : ROLE_LANDING[role]

  const handleLogin = (role: Role) => {
    setSession(DEMO_USERS[role])
    setScreen(landingFor(role))
  }

  const handleLogout = () => {
    setSession(null)
    setScreen('home')
  }

  if (!session) {
    return <Login onLogin={handleLogin} />
  }

  const role = session.role

  // Guard: never render a screen outside the signed-in role's journey — fall
  // back to that role's landing screen instead.
  const activeScreen: Screen = isScreenAllowed(role, screen) ? screen : landingFor(role)
  const navigate = (s: Screen) => setScreen(isScreenAllowed(role, s) ? s : landingFor(role))
  const openInquiry = (id: string) => { setSelectedInquiryId(id); navigate('inquiry-detail') }
  const openQuote = (id: string) => { setSelectedQuoteId(id); navigate('quotation') }
  const openOrder = (id: string) => { setSelectedOrderId(id); navigate('order-timeline') }
  const openCase = (id: string) => {
    if (id === BOOKING.id) { navigate('depot-requirement'); return }
    setSelectedCaseId(id)
    navigate('depot-case-detail')
  }
  const openStageCase = (stage: Stage, id: string) => {
    if (id === BOOKING.id) { navigate(stage); return }
    setSelectedCaseStage(stage)
    setSelectedCaseId(id)
    navigate('stage-case-detail')
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':                 return <Home role={role} onNavigate={navigate} />
      case 'new-inquiry':          return <NewInquiry onNavigate={navigate} />
      case 'inquiry-list':         return <InquiryList onNavigate={navigate} onOpen={openInquiry} />
      case 'inquiry-detail':       return <InquiryDetail key={selectedInquiryId} role={role} session={session} id={selectedInquiryId} onNavigate={navigate} onOpenQuote={openQuote} />
      case 'quotation-list':       return <QuotationList onOpen={openQuote} />
      case 'quotation':            return <Quotation key={selectedQuoteId} role={role} session={session} id={selectedQuoteId} onNavigate={navigate} />
      case 'register':             return <Register session={session} onNavigate={navigate} />
      case 'address-select':       return <AddressSelect session={session} onNavigate={navigate} />
      case 'kyc-queue':            return <KYCQueue session={session} onNavigate={navigate} />
      case 'kyc-form':             return <KYCForm session={session} onNavigate={navigate} />
      case 'booking-list':         return <BookingList onNavigate={navigate} onOpen={openOrder} />
      case 'ops-accept':           return <OpsAccept session={session} onNavigate={navigate} />
      case 'booking-confirmed':    return <BookingConfirmed onNavigate={navigate} />
      case 'select-sailing':       return <SelectSailing session={session} onNavigate={navigate} />
      case 'ops-depot-select':     return <OpsDepotSelect session={session} onNavigate={navigate} />
      case 'depot-requirement':    return <DepotRequirement session={session} onNavigate={navigate} />
      case 'depot-handover':       return <DepotHandover session={session} onNavigate={navigate} />
      case 'depot-queue':          return <DepotQueue onOpen={openCase} />
      case 'depot-case-detail':    return <DepotCaseDetail id={selectedCaseId} onNavigate={navigate} />
      case 'container-tracking':   return <ContainerTracking role={role} onNavigate={navigate} />
      case 'cro-release':          return <CRORelease role={role} onNavigate={navigate} />
      case 'ops-accept-list':          return <CaseList stage="ops-accept" onOpen={id => openStageCase('ops-accept', id)} />
      case 'cro-list':                 return <CaseList stage="cro-release" onOpen={id => openStageCase('cro-release', id)} />
      case 'container-tracking-list': return <CaseList stage="container-tracking" onOpen={id => openStageCase('container-tracking', id)} />
      case 'gate-in-list':             return <CaseList stage="gate-in" onOpen={id => openStageCase('gate-in', id)} />
      case 'load-vessel-list':         return <CaseList stage="load-vessel" onOpen={id => openStageCase('load-vessel', id)} />
      case 'bl-draft-list':            return <CaseList stage="bl-draft" onOpen={id => openStageCase('bl-draft', id)} />
      case 'invoice-list':             return <CaseList stage="invoice" onOpen={id => openStageCase('invoice', id)} />
      case 'mbl-release-list':         return <CaseList stage="mbl-release" onOpen={id => openStageCase('mbl-release', id)} />
      case 'stage-case-detail':        return <StageCaseDetail stage={selectedCaseStage} id={selectedCaseId} onNavigate={navigate} />
      case 'order-list':           return <OrderList onOpen={openOrder} filterCustomer={role === 'customer' ? BOOKING.customer : undefined} />
      case 'order-timeline':       return <OrderTimeline id={selectedOrderId} onNavigate={navigate} />
      case 'shipping-instructions':return <ShippingInstructions session={session} onNavigate={navigate} />
      case 'gate-in':              return <GateIn session={session} onNavigate={navigate} />
      case 'load-vessel':          return <LoadVessel session={session} onNavigate={navigate} />
      case 'bl-draft':             return <BLDraft role={role} session={session} onNavigate={navigate} />
      case 'invoice':              return <Invoice role={role} session={session} onNavigate={navigate} />
      case 'mbl-release':          return <MBLRelease role={role} session={session} onNavigate={navigate} />
      case 'trade-queue':          return <TradeQueue onOpen={openQuote} />
      case 'iam-dashboard':        return <IAMDashboard onNavigate={navigate} />
      case 'iam-users':            return <IAMUsers onNavigate={navigate} />
      case 'iam-groups':           return <IAMGroups onNavigate={navigate} />
      case 'iam-policies':         return <IAMPolicies onNavigate={navigate} />
      case 'iam-permissions':      return <IAMPermissions onNavigate={navigate} />
      case 'iam-audit':            return <IAMAuditLog onNavigate={navigate} />
      case 'org-hierarchy':        return <OrgHierarchy onNavigate={navigate} />
      default:                     return <Home role={role} onNavigate={navigate} />
    }
  }

  if (role === 'customer') {
    return (
      <PortalShell screen={activeScreen} session={session} onNavigate={navigate} onLogout={handleLogout}>
        {renderScreen()}
      </PortalShell>
    )
  }

  if (role === 'depot') {
    return (
      <DepotShell screen={activeScreen} session={session} onNavigate={navigate} onLogout={handleLogout}>
        {renderScreen()}
      </DepotShell>
    )
  }

  return (
    <ERPShell screen={activeScreen} role={role} session={session} onNavigate={navigate} onLogout={handleLogout}>
      {renderScreen()}
    </ERPShell>
  )
}
