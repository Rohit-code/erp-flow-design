export type Screen =
  | 'login'
  | 'home'
  | 'new-inquiry' | 'inquiry-list' | 'inquiry-detail' | 'quotation-list' | 'quotation'
  | 'booking-form' | 'address-select'
  | 'kyc-queue' | 'kyc-form'
  | 'booking-list' | 'booking-confirmed' | 'select-sailing'
  | 'ops-depot-select'
  | 'depot-requirement' | 'depot-handover'
  | 'cro-release' | 'order-list' | 'order-timeline'
  | 'shipping-instructions' | 'gate-in' | 'bl-draft' | 'invoice' | 'mbl-release'
  | 'trade-queue'
  | 'iam-dashboard' | 'iam-users' | 'iam-groups' | 'iam-policies' | 'iam-permissions' | 'iam-audit'
  | 'org-hierarchy'

export type Role = 'sales' | 'trade' | 'ops' | 'depot' | 'ou-admin' | 'ho-admin' | 'customer'

export type Session = {
  role: Role
  name: string
  org: string
}
