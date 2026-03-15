import React from 'react'

const avatarData = {
  kimDohyun: {
    hair: '#2c2c54', skin: '#f5cda7', shirt: '#3c6382',
    hairStyle: 'short', accessory: null,
  },
  leeSoyeon: {
    hair: '#4a2c2a', skin: '#f5cda7', shirt: '#c0392b',
    hairStyle: 'long', accessory: null,
  },
  parkJunhyuk: {
    hair: '#1a1a2e', skin: '#f5cda7', shirt: '#2c3e50',
    hairStyle: 'short', accessory: 'glasses',
  },
  choiYejin: {
    hair: '#5c3317', skin: '#f5cda7', shirt: '#8e44ad',
    hairStyle: 'long', accessory: null,
  },
  jungMinsu: {
    hair: '#34495e', skin: '#f5cda7', shirt: '#e67e22',
    hairStyle: 'short', accessory: null,
  },
  hanJiho: {
    hair: '#7f8c8d', skin: '#f5cda7', shirt: '#1a1a2e',
    hairStyle: 'short', accessory: 'tie',
  },
}

function PixelAvatar({ agentId, size = 48 }) {
  const d = avatarData[agentId]
  if (!d) return null

  const isLong = d.hairStyle === 'long'

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
    >
      <rect width="16" height="16" fill="#1a1a2e" />

      {/* Hair */}
      {isLong ? (
        <>
          <rect x="4" y="1" width="8" height="2" fill={d.hair} />
          <rect x="3" y="3" width="10" height="3" fill={d.hair} />
        </>
      ) : (
        <>
          <rect x="5" y="1" width="6" height="3" fill={d.hair} />
          <rect x="4" y="3" width="8" height="2" fill={d.hair} />
        </>
      )}

      {/* Face */}
      <rect x="5" y={isLong ? 5 : 5} width="6" height="4" fill={d.skin} />

      {/* Eyes */}
      <rect x="6" y={isLong ? 6 : 7} width="1" height="1" fill="#1a1a2e" />
      <rect x="9" y={isLong ? 6 : 7} width="1" height="1" fill="#1a1a2e" />

      {/* Glasses */}
      {d.accessory === 'glasses' && (
        <>
          <rect x="5" y="6" width="1" height="1" fill="#bdc3c7" />
          <rect x="10" y="6" width="1" height="1" fill="#bdc3c7" />
        </>
      )}

      {/* Mouth */}
      <rect x="7" y={isLong ? 8 : 8} width="2" height="1" fill="#e8a87c" />

      {/* Shirt / Body */}
      <rect x="4" y="9" width="8" height="4" fill={d.shirt} />
      <rect x="7" y="9" width="2" height="1" fill={d.skin} />

      {/* Tie */}
      {d.accessory === 'tie' && (
        <rect x="6" y="10" width="4" height="1" fill="#c0392b" />
      )}

      {/* Collar for non-tie */}
      {!d.accessory && (
        <rect x="7" y="9" width="2" height="1" fill="#ecf0f1" />
      )}

      {/* Legs */}
      <rect x="4" y="13" width="3" height="3" fill="#2c3e50" />
      <rect x="9" y="13" width="3" height="3" fill="#2c3e50" />
    </svg>
  )
}

export function SystemAvatar({ size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: '#2a2a40', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: size * 0.42,
    }}>📢</div>
  )
}

export function UserAvatar({ size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: '#2a2a40', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: size * 0.42,
    }}>👤</div>
  )
}

export default PixelAvatar
