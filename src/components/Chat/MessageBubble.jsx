import React from 'react'
import { colors } from '../../styles/theme'
import PixelAvatar, { SystemAvatar, UserAvatar } from '../Avatar/PixelAvatar'

function Avatar({ agentId }) {
  if (agentId === 'system') return <SystemAvatar size={44} />
  if (agentId === 'user') return <UserAvatar size={44} />
  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', border: `2px solid ${colors.border}` }}>
      <PixelAvatar agentId={agentId} size={44} />
    </div>
  )
}

export default function MessageBubble({ message }) {
  const { agentId, name, role, color, text, isReport } = message

  const contentStyle = isReport
    ? {
        background: '#0d0d18',
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        padding: 20,
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
        lineHeight: 1.8,
        whiteSpace: 'pre-wrap',
        maxWidth: '90%',
      }
    : {
        background: colors.cardBg,
        borderRadius: '4px 12px 12px 12px',
        padding: '12px 16px',
        maxWidth: '85%',
        border: `1px solid ${colors.border}`,
        borderLeft: `3px solid ${color}`,
      }

  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{ flexShrink: 0 }}>
        <Avatar agentId={agentId} />
      </div>
      <div style={contentStyle}>
        <div style={{ fontSize: 12, fontWeight: 700, color: color, marginBottom: 2 }}>
          {name}
        </div>
        {role && (
          <div style={{ fontSize: 10, color: colors.textSecondary, marginBottom: 8 }}>
            {role}
          </div>
        )}
        <div style={{
          fontSize: 13, lineHeight: 1.7,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          {text}
        </div>
      </div>
    </div>
  )
}
