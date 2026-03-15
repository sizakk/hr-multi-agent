import React, { useState } from 'react'
import { colors } from '../../styles/theme'

export default function FollowUpInput({ onSend, disabled }) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
  }

  return (
    <div style={{
      borderTop: `1px solid ${colors.border}`,
      padding: '12px 24px',
      display: 'flex', gap: 8,
      background: colors.panelBg,
    }}>
      <input
        style={{
          flex: 1, background: colors.cardBg,
          border: `1px solid ${colors.border}`, borderRadius: 8,
          padding: '10px 14px', color: colors.textPrimary,
          fontSize: 13, outline: 'none',
        }}
        placeholder="추가 질문을 입력하세요... (예: 이 회사의 구조조정 우선순위는?)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
          }
        }}
        disabled={disabled}
      />
      <button
        style={{
          background: colors.accent, color: '#fff',
          border: 'none', borderRadius: 8,
          padding: '10px 18px', fontSize: 13, fontWeight: 600,
          cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
          opacity: disabled || !value.trim() ? 0.5 : 1,
          transition: 'opacity 0.2s',
        }}
        onClick={handleSend}
        disabled={disabled || !value.trim()}
      >
        전송
      </button>
    </div>
  )
}
