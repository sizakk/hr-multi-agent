import React, { useState, useCallback } from 'react'
import './styles/global.css'
import { colors } from './styles/theme'
import { parseCSVText, readFileAsText, extractCompanyList } from './utils/csvParser'
import { useAnalysis } from './hooks/useAnalysis'

import Header from './components/Header'
import FileUpload from './components/Sidebar/FileUpload'
import CompanySelect from './components/Sidebar/CompanySelect'
import AgentList from './components/Sidebar/AgentList'
import ChatArea from './components/Chat/ChatArea'
import OrgChart from './components/OrgChart'

function PasswordGate({ onAuth }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // 서버에서 최종 검증하므로 클라이언트는 비어있지 않으면 통과
    if (input.trim()) {
      onAuth(input.trim())
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: colors.darkBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: colors.panelBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 12, padding: '40px 48px',
        display: 'flex', flexDirection: 'column', gap: 16,
        minWidth: 320, textAlign: 'center',
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: colors.textPrimary }}>
          HR 분석 시스템
        </div>
        <div style={{ fontSize: 13, color: colors.textSecondary }}>
          접속 비밀번호를 입력하세요
        </div>
        <input
          type="password"
          autoFocus
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false) }}
          placeholder="비밀번호"
          style={{
            background: colors.cardBg,
            border: `1px solid ${error ? '#e74c3c' : colors.border}`,
            borderRadius: 6, padding: '10px 12px',
            color: colors.textPrimary, fontSize: 14, outline: 'none',
            textAlign: 'center',
          }}
        />
        {error && (
          <div style={{ fontSize: 12, color: '#e74c3c' }}>비밀번호가 올바르지 않습니다.</div>
        )}
        <button type="submit" style={{
          background: colors.accent, color: '#fff',
          border: 'none', borderRadius: 8,
          padding: '10px', fontSize: 14, fontWeight: 600,
          cursor: 'pointer',
        }}>
          입장
        </button>
      </form>
    </div>
  )
}

export default function App() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('app_pw') || '')
  const [tab, setTab] = useState('analysis') // 'analysis' | 'orgchart'
  const [allData, setAllData] = useState(null)
  const [companies, setCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])

  const {
    messages,
    isRunning,
    activeAgent,
    completedAgents,
    analysisComplete,
    tokenSummary,
    runAnalysis,
    sendFollowUp,
    resetMessages,
  } = useAnalysis({ password, allData })

  const handleAuth = (pw) => {
    sessionStorage.setItem('app_pw', pw)
    setPassword(pw)
  }

  const handleFiles = useCallback(async (fileList) => {
    const data = {}
    const names = []

    for (const file of Array.from(fileList)) {
      const text = await readFileAsText(file)
      const baseName = file.name.replace(/\.csv$/i, '')
      data[baseName] = parseCSVText(text)
      names.push(file.name)
    }

    setAllData(data)
    setUploadedFiles(names)
    setCompanies(extractCompanyList(data))
  }, [])

  const handleResetUpload = () => {
    setAllData(null)
    setUploadedFiles([])
    setCompanies([])
    setSelectedCompany('')
    resetMessages()
  }

  const handleCompanyChange = (name) => {
    setSelectedCompany(name)
    resetMessages()
  }

  const handleStart = () => {
    if (selectedCompany && allData) {
      runAnalysis(selectedCompany)
    }
  }

  const handleFollowUp = (question) => {
    sendFollowUp(question, selectedCompany)
  }

  if (!password) return <PasswordGate onAuth={handleAuth} />

  return (
    <div style={{ minHeight: '100vh', background: colors.darkBg, color: colors.textPrimary }}>
      <Header tokenSummary={tokenSummary} tab={tab} onTabChange={setTab} />

      <div style={{ display: 'flex', height: 'calc(100vh - 62px)' }}>
        {tab === 'orgchart' && <OrgChart />}
        {/* Analysis View */}
        {tab === 'analysis' && <div style={{
          width: 270, minWidth: 270,
          background: colors.panelBg,
          borderRight: `1px solid ${colors.border}`,
          padding: 16, overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <FileUpload
            uploadedFiles={uploadedFiles}
            onUpload={handleFiles}
            onReset={handleResetUpload}
          />
          <CompanySelect
            companies={companies}
            value={selectedCompany}
            onChange={handleCompanyChange}
            allData={allData}
          />

          {selectedCompany && (
            <button
              style={{
                width: '100%',
                background: colors.accent, color: '#fff',
                border: 'none', borderRadius: 8,
                padding: '12px 18px', fontSize: 13, fontWeight: 600,
                cursor: isRunning ? 'not-allowed' : 'pointer',
                opacity: isRunning ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
              onClick={handleStart}
              disabled={isRunning}
            >
              {isRunning ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{
                    display: 'inline-block', width: 14, height: 14,
                    border: '2px solid #555', borderTopColor: '#fff',
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                  }} />
                  분석 진행중...
                </span>
              ) : (
                '🔍 분석 회의 시작'
              )}
            </button>
          )}

          <AgentList activeAgent={activeAgent} completedAgents={completedAgents} />
        </div>}

        {/* Chat */}
        {tab === 'analysis' && <ChatArea
          messages={messages}
          analysisComplete={analysisComplete}
          isRunning={isRunning}
          onFollowUp={handleFollowUp}
        />}
      </div>
    </div>
  )
}
