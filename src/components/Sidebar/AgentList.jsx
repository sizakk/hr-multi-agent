import React from 'react'
import { colors } from '../../styles/theme'
import { AGENTS, TEAM_LEADER } from '../../agents/agentConfig'
import PixelAvatar from '../Avatar/PixelAvatar'

function Spinner() {
  return (
    <span style={{
      display: 'inline-block', width: 14, height: 14,
      border: '2px solid #555', borderTopColor: colors.accent,
      borderRadius: '50%', animation: 'spin 0.8s linear infinite',
    }} />
  )
}

function AgentCard({ agent, isActive, isCompleted }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', borderRadius: 8,
      border: `1px solid ${isActive ? agent.color : colors.border}`,
      background: isActive ? agent.color + '18' : 'transparent',
      transition: 'all 0.2s',
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: isActive || isCompleted ? colors.success : '#555',
        flexShrink: 0,
      }} />
      <div style={{ borderRadius: 8, overflow: 'hidden', border: `2px solid ${colors.border}`, flexShrink: 0 }}>
        <PixelAvatar agentId={agent.id} size={36} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{agent.name}</div>
        <div style={{ fontSize: 10, color: colors.textSecondary }}>{agent.role}</div>
      </div>
      {isActive && <Spinner />}
      {isCompleted && !isActive && <span style={{ color: colors.success, fontSize: 14 }}>✓</span>}
    </div>
  )
}

export default function AgentList({ activeAgent, completedAgents }) {
  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, color: colors.textSecondary,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6,
      }}>
        분석관
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {AGENTS.map((a) => (
          <AgentCard
            key={a.id}
            agent={a}
            isActive={activeAgent === a.id}
            isCompleted={completedAgents.includes(a.id)}
          />
        ))}
        <div style={{ height: 1, background: colors.border, margin: '4px 0' }} />
        <AgentCard
          agent={TEAM_LEADER}
          isActive={activeAgent === 'hanJiho'}
          isCompleted={completedAgents.includes('hanJiho')}
        />
      </div>
    </div>
  )
}
