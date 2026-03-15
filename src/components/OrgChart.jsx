import React, { useState } from 'react'
import { colors } from '../styles/theme'
import { AGENTS, TEAM_LEADER } from '../agents/agentConfig'
import PixelAvatar from './Avatar/PixelAvatar'

const agentDetails = {
  kimDohyun: {
    emoji: '📊',
    expertise: ['직급별 인원 구성 (S/M/SA/A/JA)', '정규직 구조 · 적체 직급 진단', '인원 증감 추이 분석'],
    files: ['인력구조.csv', '인원현황.csv'],
    tag: '인력구조',
  },
  leeSoyeon: {
    emoji: '🔄',
    expertise: ['신규유입률 목표 대비 Gap', '인력 유출 징후 · 조기경보', '분기별 인원 변동 패턴'],
    files: ['생산성지표.csv', '인원현황.csv'],
    tag: '인력흐름',
  },
  parkJunhyuk: {
    emoji: '💰',
    expertise: ['인당매출 · 인당영업이익 추이', '인건비율 · 수익성 효율', 'YoY 개선/악화 판정'],
    files: ['인당효율.csv'],
    tag: '효율성',
  },
  choiYejin: {
    emoji: '🌱',
    expertise: ['S비율 목표 달성 여부', '평균연령 · 고령화 속도', '정규직비율 장기 추이'],
    files: ['생산성지표.csv', '정규직비율추이.csv'],
    tag: '인재성장',
  },
  jungMinsu: {
    emoji: '⚠️',
    expertise: ['고령화 × 인건비율 복합 위험', '직급 적체 × 유입률 시나리오', '위험도 등급화 (🔴🟡🟢)'],
    files: ['5개 파일 전체'],
    tag: '리스크',
  },
}

const leaderDetails = {
  emoji: '📋',
  expertise: ['5명 보고 종합 · 회의록 작성', '교차 인사이트 도출', '구조조정 방향 · 액션플랜 제시'],
  files: ['에이전트 보고 전체'],
  tag: '총괄',
}

function TagBadge({ label, color }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase',
      background: color + '28',
      color: color,
      border: `1px solid ${color}55`,
      borderRadius: 4,
      padding: '2px 7px',
    }}>
      {label}
    </span>
  )
}

function FilePill({ name }) {
  return (
    <span style={{
      fontSize: 10, color: colors.textSecondary,
      background: colors.darkBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 4,
      padding: '2px 6px',
      whiteSpace: 'nowrap',
    }}>
      {name}
    </span>
  )
}

function LeaderCard() {
  const [hovered, setHovered] = useState(false)
  const d = leaderDetails

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, #1e1e3a 0%, ${TEAM_LEADER.color}22 100%)`
          : `linear-gradient(135deg, ${colors.cardBg} 0%, #1e1e3a 100%)`,
        border: `2px solid ${hovered ? TEAM_LEADER.color : TEAM_LEADER.color + '88'}`,
        borderRadius: 16,
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        width: 480,
        transition: 'all 0.25s',
        cursor: 'default',
        boxShadow: hovered ? `0 8px 32px ${TEAM_LEADER.color}33` : '0 2px 12px #0004',
      }}
    >
      {/* Avatar */}
      <div style={{
        borderRadius: 14,
        overflow: 'hidden',
        border: `3px solid ${TEAM_LEADER.color}`,
        flexShrink: 0,
        boxShadow: `0 0 16px ${TEAM_LEADER.color}55`,
      }}>
        <PixelAvatar agentId={TEAM_LEADER.id} size={72} />
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: colors.textPrimary }}>
            {TEAM_LEADER.name}
          </span>
          <TagBadge label={d.tag} color={TEAM_LEADER.color} />
        </div>
        <div style={{ fontSize: 12, color: TEAM_LEADER.color, fontWeight: 600, marginBottom: 10 }}>
          {d.emoji} {TEAM_LEADER.role}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 10 }}>
          {d.expertise.map((e, i) => (
            <div key={i} style={{ fontSize: 11, color: colors.textSecondary, display: 'flex', gap: 6 }}>
              <span style={{ color: TEAM_LEADER.color, flexShrink: 0 }}>›</span>
              {e}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {d.files.map((f) => <FilePill key={f} name={f} />)}
        </div>
      </div>
    </div>
  )
}

function AgentCard({ agent }) {
  const [hovered, setHovered] = useState(false)
  const d = agentDetails[agent.id]
  if (!d) return null

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(160deg, ${colors.cardBg} 0%, ${agent.color}18 100%)`
          : colors.cardBg,
        border: `1.5px solid ${hovered ? agent.color : colors.border}`,
        borderRadius: 14,
        padding: '18px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        width: 180,
        transition: 'all 0.25s',
        cursor: 'default',
        boxShadow: hovered ? `0 6px 24px ${agent.color}2a` : 'none',
      }}
    >
      {/* Avatar */}
      <div style={{
        borderRadius: 10,
        overflow: 'hidden',
        border: `2px solid ${hovered ? agent.color : colors.border}`,
        transition: 'border-color 0.25s',
      }}>
        <PixelAvatar agentId={agent.id} size={56} />
      </div>

      {/* Name & Role */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary, marginBottom: 3 }}>
          {agent.name}
        </div>
        <div style={{ marginBottom: 6 }}>
          <TagBadge label={d.tag} color={agent.color} />
        </div>
        <div style={{ fontSize: 10, color: agent.color, fontWeight: 600 }}>
          {d.emoji} {agent.role}
        </div>
      </div>

      {/* Expertise */}
      <div style={{
        width: '100%',
        background: colors.darkBg,
        borderRadius: 8,
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        {d.expertise.map((e, i) => (
          <div key={i} style={{ fontSize: 10, color: colors.textSecondary, display: 'flex', gap: 4, lineHeight: 1.4 }}>
            <span style={{ color: agent.color, flexShrink: 0 }}>·</span>
            {e}
          </div>
        ))}
      </div>

      {/* Files */}
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
        {d.files.map((f) => <FilePill key={f} name={f} />)}
      </div>
    </div>
  )
}

// SVG connector lines
function OrgLines({ leaderWidth, agentCount, agentWidth, agentGap }) {
  const totalAgentsWidth = agentCount * agentWidth + (agentCount - 1) * agentGap
  const svgW = Math.max(leaderWidth, totalAgentsWidth)
  const svgH = 60
  const leaderCenterX = svgW / 2
  const agentsStartX = (svgW - totalAgentsWidth) / 2

  const agentCenters = Array.from({ length: agentCount }, (_, i) =>
    agentsStartX + i * (agentWidth + agentGap) + agentWidth / 2
  )

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', overflow: 'visible' }}>
      {/* Vertical from leader */}
      <line x1={leaderCenterX} y1={0} x2={leaderCenterX} y2={svgH * 0.5}
        stroke={colors.border} strokeWidth={1.5} />
      {/* Horizontal bar */}
      <line x1={agentCenters[0]} y1={svgH * 0.5} x2={agentCenters[agentCenters.length - 1]} y2={svgH * 0.5}
        stroke={colors.border} strokeWidth={1.5} />
      {/* Verticals to each agent */}
      {agentCenters.map((cx, i) => (
        <line key={i} x1={cx} y1={svgH * 0.5} x2={cx} y2={svgH}
          stroke={colors.border} strokeWidth={1.5} />
      ))}
    </svg>
  )
}

export default function OrgChart() {
  const AGENT_W = 180
  const AGENT_GAP = 16
  const LEADER_W = 480
  const totalAgentsW = AGENTS.length * AGENT_W + (AGENTS.length - 1) * AGENT_GAP
  const containerW = Math.max(LEADER_W, totalAgentsW)

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      background: colors.darkBg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 24px 60px',
      gap: 0,
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: colors.textPrimary, letterSpacing: '-0.02em' }}>
          HR전략실 분석팀 조직도
        </div>
        <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 6 }}>
          그룹 계열사 HR 데이터를 순차 분석 → 팀장이 종합 회의록 작성
        </div>
      </div>

      {/* Flow description */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: colors.panelBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 20, padding: '6px 16px',
        marginBottom: 36,
      }}>
        {['CSV 업로드', '5명 순차 분석', '팀장 종합'].map((step, i, arr) => (
          <React.Fragment key={step}>
            <span style={{ fontSize: 11, color: colors.textSecondary }}>{step}</span>
            {i < arr.length - 1 && (
              <span style={{ color: colors.border, fontSize: 12 }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Org Chart */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: containerW }}>

        {/* Team Leader */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <LeaderCard />
        </div>

        {/* Connector */}
        <OrgLines
          leaderWidth={LEADER_W}
          agentCount={AGENTS.length}
          agentWidth={AGENT_W}
          agentGap={AGENT_GAP}
        />

        {/* Agents Row */}
        <div style={{ display: 'flex', gap: AGENT_GAP }}>
          {AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

    </div>
  )
}
