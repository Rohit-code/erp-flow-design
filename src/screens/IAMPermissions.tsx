import { Screen } from '../types'
import { C } from '../components/ui'

const ROWS = [
  { resource: 'booking:*',        action: 'read',    effect: 'Allow', grantedTo: ['Administrators', 'Sales Team', 'Operations'] },
  { resource: 'booking:*',        action: 'write',   effect: 'Allow', grantedTo: ['Administrators', 'Operations'] },
  { resource: 'booking:*',        action: 'delete',  effect: 'Allow', grantedTo: ['Administrators'] },
  { resource: 'inquiry:*',        action: 'read',    effect: 'Allow', grantedTo: ['Administrators', 'Sales Team'] },
  { resource: 'inquiry:*',        action: 'write',   effect: 'Allow', grantedTo: ['Administrators', 'Sales Team'] },
  { resource: 'quotation:*',      action: 'read',    effect: 'Allow', grantedTo: ['Administrators', 'Sales Team', 'Trade Team'] },
  { resource: 'quotation:*',      action: 'write',   effect: 'Allow', grantedTo: ['Administrators', 'Trade Team'] },
  { resource: 'kyc:submission',   action: 'read',    effect: 'Allow', grantedTo: ['Administrators', 'KYC Officers'] },
  { resource: 'kyc:submission',   action: 'approve', effect: 'Allow', grantedTo: ['Administrators', 'KYC Officers'] },
  { resource: 'kyc:submission',   action: 'reject',  effect: 'Allow', grantedTo: ['Administrators', 'KYC Officers'] },
  { resource: 'rate:*',           action: 'read',    effect: 'Allow', grantedTo: ['Administrators', 'Trade Team'] },
  { resource: 'rate:*',           action: 'write',   effect: 'Allow', grantedTo: ['Administrators', 'Trade Team'] },
  { resource: 'invoice:*',        action: 'read',    effect: 'Allow', grantedTo: ['Administrators'] },
  { resource: 'invoice:*',        action: 'write',   effect: 'Deny',  grantedTo: [] },
  { resource: 'cro:*',            action: 'write',   effect: 'Allow', grantedTo: ['Administrators', 'Operations'] },
  { resource: 'iam:user',         action: 'write',   effect: 'Allow', grantedTo: ['Administrators'] },
  { resource: 'iam:policy',       action: 'read',    effect: 'Allow', grantedTo: ['Administrators'] },
  { resource: 'org:hierarchy',    action: 'read',    effect: 'Allow', grantedTo: ['Administrators'] },
]

export default function IAMPermissions({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 4 }}>Permissions</h1>
        <p style={{ fontSize: 13, color: C.textMuted }}>Raw grant list — resource · action · effect · granted-to groups</p>
      </div>

      <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #252830' }}>
              {['Resource', 'Action', 'Effect', 'Granted To'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6174' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i} style={{ borderBottom: i < ROWS.length - 1 ? '1px solid #1a1d24' : 'none' }}>
                <td style={{ padding: '10px 16px' }}>
                  <span className="font-mono" style={{ fontSize: 12, color: C.accentDim }}>{r.resource}</span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span className="font-mono" style={{ fontSize: 12, color: '#9ba3af' }}>{r.action}</span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: r.effect === 'Allow' ? '#4ade80' : '#f87171' }}>
                    {r.effect}
                  </span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {r.grantedTo.length === 0
                      ? <span style={{ fontSize: 11, color: '#3d4456' }}>—</span>
                      : r.grantedTo.map(g => (
                        <span key={g} style={{ background: '#1c1e26', border: '1px solid #252830', borderRadius: 4, padding: '2px 7px', fontSize: 11, color: C.textMuted }}>
                          {g}
                        </span>
                      ))
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
