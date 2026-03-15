import React from 'react'
import { colors } from '../styles/theme'

const TAB_ITEMS = [
  { key: 'analysis', label: '분석 회의' },
  { key: 'orgchart', label: '조직도' },
]

export default function Header({ tokenSummary, tab, onTabChange }) {
  return (
    <header style={{
      background: `linear-gradient(135deg, ${colors.cardBg} 0%, #1e1e3a 100%)`,
      borderBottom: `1px solid ${colors.border}`,
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      height: 62,
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
          HR Multi-Agent Analysis
        </div>
        <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
          HR혁신실 인재전략팀· AI Agent 분석 시스템
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginLeft: 24 }}>
        {TAB_ITEMS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            style={{
              background: tab === key ? colors.accent : 'transparent',
              color: tab === key ? '#fff' : colors.textSecondary,
              border: `1px solid ${tab === key ? colors.accent : colors.border}`,
              borderRadius: 6,
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: tab === key ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
        {tokenSummary && (
          <span style={{ fontSize: 11, color: colors.textSecondary }}>
            {tokenSummary.totalTokens.toLocaleString()} tokens · ~${tokenSummary.estimatedCost}
          </span>
        )}
        <span style={{
          background: colors.accent, color: '#fff',
          fontSize: 10, fontWeight: 700,
          padding: '3px 8px', borderRadius: 4,
          letterSpacing: '0.05em',
        }}>
          CRISIS MODE
        </span>
      </div>
    </header>
  )
}
