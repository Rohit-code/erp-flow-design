import { useState } from 'react'
import { Screen } from '../types'
import { C } from '../components/ui'

const BRANCHES = [
  { code: 'IN-OU1',  name: 'India Branch 1',  city: 'Chennai',   depts: 4,  tags: ['Depot','Kyc','Sales','Trade'] },
  { code: 'IN-OU10', name: 'India Branch 10', city: 'Mumbai',    depts: 0,  tags: [] },
  { code: 'IN-OU11', name: 'India Branch 11', city: 'New Delhi', depts: 0,  tags: [] },
  { code: 'IN-OU12', name: 'India Branch 12', city: 'Kandla',    depts: 0,  tags: [] },
  { code: 'IN-OU13', name: 'India Branch 13', city: 'Ludhiana',  depts: 0,  tags: [] },
  { code: 'IN-OU14', name: 'India Branch 14', city: 'Bangalore', depts: 0,  tags: [] },
  { code: 'IN-OU15', name: 'India Branch 15', city: 'Kolkata',   depts: 0,  tags: [] },
  { code: 'IN-OU2',  name: 'India Branch 2',  city: 'Pipavav',   depts: 0,  tags: [] },
  { code: 'IN-OU3',  name: 'India Branch 3',  city: 'Vadodara',  depts: 0,  tags: [] },
  { code: 'IN-OU4',  name: 'India Branch 4',  city: 'Ahmedabad', depts: 0,  tags: [] },
  { code: 'IN-OU5',  name: 'India Branch 5',  city: 'Vizag',     depts: 0,  tags: [] },
  { code: 'IN-OU6',  name: 'India Branch 6',  city: 'Jaipur',    depts: 0,  tags: [] },
  { code: 'IN-OU7',  name: 'India Branch 7',  city: 'Hyderabad', depts: 0,  tags: [] },
  { code: 'IN-OU8',  name: 'India Branch 8',  city: 'Paradeep',  depts: 0,  tags: [] },
  { code: 'IN-OU9',  name: 'India Branch 9',  city: 'Hazira',    depts: 0,  tags: [] },
  { code: 'IND-00001', name: 'Chennai Depot',  city: 'Chennai',   depts: 0,  tags: [] },
]

// SVG icons used in the tree
const BuildingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 13 13" fill="none" style={{ color: '#6b7280', flexShrink: 0 }}>
    <path d="M2 12V3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v9" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M1 12h11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    <rect x="4.5" y="6" width="4" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.1"/>
  </svg>
)

const BankIcon = () => (
  <svg width="14" height="14" viewBox="0 0 13 13" fill="none" style={{ color: '#6b7280', flexShrink: 0 }}>
    <path d="M1.5 5.5L6.5 2l5 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
    <path d="M2 5.5v5.5h9V5.5" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M1 11h11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    <path d="M4 7.5v3M6.5 7.5v3M9 7.5v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
)

const HierarchyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 13 13" fill="none">
    <rect x="4.5" y="1" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.1"/>
    <rect x="1" y="8.5" width="3.5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.1"/>
    <rect x="8.5" y="8.5" width="3.5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M6.5 4v2M6.5 6H2.75M6.5 6h3.75M2.75 6v2.5M10.25 6v2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
)

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.15s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', color: '#5a6174', flexShrink: 0 }}>
    <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const tagColors: Record<string, { bg: string; text: string }> = {
  Depot: { bg: '#0d1d35', text: '#93c5fd' },
  Kyc:   { bg: '#231a06', text: '#fbbf24' },
  Sales: { bg: '#0d2818', text: '#4ade80' },
  Trade: { bg: '#1a1d24', text: '#9ca3af' },
}

export default function OrgHierarchy({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [hoOpen, setHoOpen] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: 860 }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
        <div style={{ width: 42, height: 42, borderRadius: 8, background: '#1c1e26', border: '1px solid #252830', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.accentDim, flexShrink: 0 }}>
          <HierarchyIcon />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 2 }}>Organization Hierarchy</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#5a6174' }}>
            {['Corporate Group', 'Company', 'Region / Head Office', 'Branch / OU', 'Department'].map((part, i, arr) => (
              <span key={part} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>{part}</span>
                {i < arr.length - 1 && <span style={{ fontSize: 13 }}>→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Corporate group summary card */}
      <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px' }}>
          {/* Icon */}
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#1c1e26', border: '1px solid #252830', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <HierarchyIcon />
          </div>
          {/* Title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Maxicon Container Line Corporate Group</div>
            <div style={{ fontSize: 11.5, color: '#5a6174', marginTop: 2 }}>Corporate Group · CORP</div>
          </div>
          {/* Stats */}
          {[
            { value: '1',  label: 'COMPANIES' },
            { value: '1',  label: 'REGIONS / HOS' },
            { value: '16', label: 'BRANCHES / OUS' },
            { value: '4',  label: 'DEPARTMENTS' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', paddingLeft: 24, borderLeft: '1px solid #252830' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: C.text, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', color: '#5a6174', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tree */}
      <div style={{ background: '#15171d', border: '1px solid #252830', borderRadius: 8, overflow: 'hidden' }}>
        {/* Company row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: '1px solid #252830' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: C.accentDim, flexShrink: 0 }}>
            <path d="M2 14V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v10" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M1 14h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <rect x="5" y="7" width="4" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>Maxicon Container Line</span>
          <span className="font-mono" style={{ fontSize: 11, color: '#5a6174' }}>MAXICON-CONTAINER-</span>
          <span style={{ fontSize: 11, color: '#5a6174' }}>·</span>
          <span className="font-mono" style={{ fontSize: 11, color: '#5a6174' }}>IN</span>
        </div>

        {/* Head Office row */}
        <div>
          <button
            onClick={() => setHoOpen(!hoOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px 12px 32px', width: '100%', background: 'transparent', border: 'none', borderBottom: hoOpen ? '1px solid #1a1d24' : 'none', cursor: 'pointer', textAlign: 'left' }}
            onMouseEnter={e => e.currentTarget.style.background = '#161820'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <ChevronDown open={hoOpen} />
            <BankIcon />
            <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>India Head Office</span>
            <span className="font-mono" style={{ fontSize: 11, color: '#5a6174' }}>HO-IN</span>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginLeft: 2 }}>
              <span style={{ fontSize: 11, color: '#5a6174' }}>·</span>
              <span style={{ fontSize: 11, color: '#5a6174' }}>IN</span>
              <span style={{ fontSize: 11, color: '#5a6174' }}>·</span>
              <span style={{ fontSize: 11, color: '#5a6174' }}>INR base</span>
              <span style={{ fontSize: 11, color: '#5a6174' }}>·</span>
              <span style={{ background: '#0d2818', color: '#4ade80', border: '1px solid #14532d', borderRadius: 3, fontSize: 9.5, fontWeight: 700, padding: '1px 5px', letterSpacing: '0.04em' }}>e-invoice</span>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 12, color: '#5a6174' }}>{BRANCHES.length} Branches / OUs</div>
          </button>

          {/* Branches */}
          {hoOpen && (
            <div>
              {BRANCHES.map((branch, i) => (
                <div
                  key={branch.code}
                  onClick={() => setSelectedBranch(selectedBranch === branch.code ? null : branch.code)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: branch.tags.length > 0 ? '11px 16px 11px 56px' : '11px 16px 11px 56px',
                    borderBottom: i < BRANCHES.length - 1 ? '1px solid #1a1d24' : 'none',
                    cursor: 'pointer', background: selectedBranch === branch.code ? '#0d1d35' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (selectedBranch !== branch.code) e.currentTarget.style.background = '#161820' }}
                  onMouseLeave={e => { if (selectedBranch !== branch.code) e.currentTarget.style.background = 'transparent' }}
                >
                  <BuildingIcon />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: selectedBranch === branch.code ? C.accentDim : C.text }}>
                        {branch.name}
                      </span>
                      <span className="font-mono" style={{ fontSize: 11, color: '#5a6174' }}>{branch.code}</span>
                      <span style={{ fontSize: 11, color: '#5a6174' }}>·</span>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>{branch.city}</span>
                      {branch.tags.map(tag => {
                        const tc = tagColors[tag] || { bg: '#1a1d24', text: '#9ca3af' }
                        return (
                          <span key={tag} style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.text}33`, borderRadius: 3, fontSize: 10, fontWeight: 600, padding: '1px 6px', letterSpacing: '0.04em' }}>
                            {tag}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 11.5, color: '#5a6174' }}>INR</span>
                    <span style={{
                      background: branch.depts > 0 ? '#1a1f35' : '#1a1d24',
                      color: branch.depts > 0 ? C.accentDim : '#3d4456',
                      borderRadius: 4, fontSize: 10.5, fontWeight: 600, padding: '2px 7px',
                    }}>
                      {branch.depts} dept
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
