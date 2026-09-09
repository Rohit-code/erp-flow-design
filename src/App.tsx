import { useState } from 'react'
import { Screen, Role, Session } from './types'
import { DEMO_USERS, ROLE_LANDING, isScreenAllowed } from './auth'
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
import BookingForm from './screens/BookingForm'
import AddressSelect from './screens/AddressSelect'
import KYCQueue from './screens/KYCQueue'
import KYCForm from './screens/KYCForm'
import BookingList from './screens/BookingList'
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
import ShippingInstructions from './screens/ShippingInstructions'
import GateIn from './screens/GateIn'
import BLDraft from './screens/BLDraft'
import Invoice from './screens/Invoice'
import MBLRelease from './screens/MBLRelease'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedInquiryId, setSelectedInquiryId] = useState('INQ-2024-0391')
  const [selectedQuoteId, setSelectedQuoteId] = useState('QT-2024-0217')
  const [selectedOrderId, setSelectedOrderId] = useState('BKG-2024-00142')

  const handleLogin = (role: Role) => {
    setSession(DEMO_USERS[role])
    setScreen(ROLE_LANDING[role])
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
  const activeScreen: Screen = isScreenAllowed(role, screen) ? screen : ROLE_LANDING[role]
  const navigate = (s: Screen) => setScreen(isScreenAllowed(role, s) ? s : ROLE_LANDING[role])
  const openInquiry = (id: string) => { setSelectedInquiryId(id); navigate('inquiry-detail') }
  const openQuote = (id: string) => { setSelectedQuoteId(id); navigate('quotation') }
  const openOrder = (id: string) => { setSelectedOrderId(id); navigate('order-timeline') }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':                 return <Home role={role} onNavigate={navigate} />
      case 'new-inquiry':          return <NewInquiry onNavigate={navigate} />
      case 'inquiry-list':         return <InquiryList onNavigate={navigate} onOpen={openInquiry} />
      case 'inquiry-detail':       return <InquiryDetail key={selectedInquiryId} role={role} session={session} id={selectedInquiryId} onNavigate={navigate} onOpenQuote={openQuote} />
      case 'quotation-list':       return <QuotationList onOpen={openQuote} />
      case 'quotation':            return <Quotation key={selectedQuoteId} role={role} session={session} id={selectedQuoteId} onNavigate={navigate} />
      case 'booking-form':         return <BookingForm onNavigate={navigate} />
      case 'address-select':       return <AddressSelect onNavigate={navigate} />
      case 'kyc-queue':            return <KYCQueue onNavigate={navigate} />
      case 'kyc-form':             return <KYCForm onNavigate={navigate} />
      case 'booking-list':         return <BookingList onNavigate={navigate} />
      case 'booking-confirmed':    return <BookingConfirmed onNavigate={navigate} />
      case 'select-sailing':       return <SelectSailing onNavigate={navigate} />
      case 'ops-depot-select':     return <OpsDepotSelect onNavigate={navigate} />
      case 'depot-requirement':    return <DepotRequirement onNavigate={navigate} />
      case 'depot-handover':       return <DepotHandover onNavigate={navigate} />
      case 'cro-release':          return <CRORelease role={role} onNavigate={navigate} />
      case 'order-list':           return <OrderList onOpen={openOrder} />
      case 'order-timeline':       return <OrderTimeline id={selectedOrderId} onNavigate={navigate} />
      case 'shipping-instructions':return <ShippingInstructions onNavigate={navigate} />
      case 'gate-in':              return <GateIn onNavigate={navigate} />
      case 'bl-draft':             return <BLDraft role={role} onNavigate={navigate} />
      case 'invoice':              return <Invoice role={role} onNavigate={navigate} />
      case 'mbl-release':          return <MBLRelease role={role} onNavigate={navigate} />
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
