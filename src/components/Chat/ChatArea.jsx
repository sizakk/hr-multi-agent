import React, { useRef, useEffect } from 'react'
import { colors } from '../../styles/theme'
import MessageBubble from './MessageBubble'
import FollowUpInput from './FollowUpInput'

export default function ChatArea({ messages, analysisComplete, isRunning, onFollowUp }) {
  const chatRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div
        ref={chatRef}
        style={{
          flex: 1, overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}
      >
        {messages.length === 0 && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: colors.textSecondary, gap: 12,
          }}>
            <div style={{ fontSize: 48, opacity: 0.3 }}>📊</div>
            <div style={{ fontSize: 14, textAlign: 'center', lineHeight: 1.8 }}>
              1. API Key 입력<br />
              2. CSV 파일 업로드<br />
              3. 분석할 회사 선택<br />
              4. "분석 회의 시작" 클릭
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
      </div>

      {analysisComplete && (
        <FollowUpInput onSend={onFollowUp} disabled={isRunning} />
      )}
    </div>
  )
}
