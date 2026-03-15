import React from 'react'
import { colors } from '../../styles/theme'

export default function ApiKeyInput({ value, onChange }) {
  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, color: colors.textSecondary,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6,
      }}>
        API Key
      </div>
      <input
        type="password"
        placeholder="sk-ant-..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', background: colors.cardBg,
          border: `1px solid ${colors.border}`, borderRadius: 6,
          padding: '8px 10px', color: colors.textPrimary,
          fontSize: 12, outline: 'none',
        }}
      />
      <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>
        Anthropic API 키 · 브라우저에서만 사용
      </div>
    </div>
  )
}
