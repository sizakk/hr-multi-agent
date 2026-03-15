import { useState, useCallback, useRef } from 'react'
import { callClaude } from '../services/claudeApi'
import { getCompanyData, getSameIndustryData, getIndustryName } from '../utils/csvParser'
import { createTokenTracker } from '../utils/tokenTracker'
import { AGENTS, TEAM_LEADER } from '../agents/agentConfig'

export function useAnalysis({ password, allData }) {
  const [messages, setMessages] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [activeAgent, setActiveAgent] = useState(null)
  const [completedAgents, setCompletedAgents] = useState([])
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [tokenSummary, setTokenSummary] = useState(null)
  const trackerRef = useRef(createTokenTracker())

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { ...msg, ts: Date.now() }])
  }, [])

  const updateLastMessage = useCallback((text) => {
    setMessages((prev) => {
      const arr = [...prev]
      if (arr.length > 0) arr[arr.length - 1] = { ...arr[arr.length - 1], text }
      return arr
    })
  }, [])

  const runAnalysis = useCallback(async (companyName) => {
    if (!password || !companyName || !allData) return

    setIsRunning(true)
    setMessages([])
    setCompletedAgents([])
    setAnalysisComplete(false)
    setTokenSummary(null)

    const tracker = createTokenTracker()
    tracker.start()
    trackerRef.current = tracker

    const companyData = getCompanyData(allData, companyName)
    const industryData = getSameIndustryData(allData, companyName)
    const industryName = getIndustryName(allData, companyName)

    // 디버그: 로드된 파일 및 회사 데이터 확인
    const loadedFiles = Object.keys(allData)
    const foundFiles = Object.keys(companyData)
    const debugInfo = foundFiles.length > 0
      ? `로드된 파일: ${loadedFiles.join(', ')}\n매칭된 파일: ${foundFiles.join(', ')}`
      : `⚠️ 회사 데이터 없음!\n로드된 파일: ${loadedFiles.join(', ')}\n선택 회사명: "${companyName}"\n파일 내 샘플 회사명: ${loadedFiles.map(f => allData[f]?.[0]?.['회사명'] || '(회사명 컬럼 없음)').join(', ')}`

    addMessage({
      agentId: 'system',
      name: '시스템',
      role: '',
      color: '#8888a0',
      text: `📢 ${companyName} (${industryName || '산업군 미확인'}) 분석 회의를 시작합니다.\n분석관 5명이 순차적으로 보고하고, ${TEAM_LEADER.name} 팀장이 종합 보고서를 작성합니다.\n\n${debugInfo}`,
    })

    const agentReports = []

    for (const agent of AGENTS) {
      setActiveAgent(agent.id)

      const relevantData = {}
      for (const fName of agent.files) {
        if (companyData[fName]) relevantData[fName] = companyData[fName]
      }
      const industryContext = {}
      for (const fName of agent.files) {
        if (industryData[fName]) industryContext[fName] = industryData[fName]
      }

      const userMsg = `다음은 "${companyName}" (${industryName})의 HR 데이터입니다.

[분석 기준 시점]
- 당기(현재 최신): '26.2월
- 전기(비교 기준): '25.2월
- 인당효율 데이터 구조: '25.3월·'25.6월·'25.9월·'25.12월은 해당 시점까지의 연간 누적(YTD) 값임. '26.2월은 26년 1~2월(2개월) 누적값으로 기간이 짧아 절대값이 낮게 보임에 유의할 것.
- YoY 컬럼: 전년 동기('25.2월) 절대값 (증감률이 아님)
- 인원현황 합계 = 정규직+비정규직 전체 헤드카운트 / 인력구조 합계 = 직급 분류된 인원 (일부 차이 정상)

[해당 회사 데이터]
${JSON.stringify(relevantData, null, 2)}

[동일 산업군(${industryName}) 비교 데이터]
${JSON.stringify(industryContext, null, 2)}

이 데이터를 기반으로 ${companyName}에 대한 전문 분석을 수행하세요. 동일 산업군 내 상대적 위치를 반드시 포함해주세요.`

      addMessage({
        agentId: agent.id,
        name: agent.name,
        role: agent.role,
        color: agent.color,
        text: '분석 중...',
      })

      try {
        const result = await callClaude({
          password,
          systemPrompt: agent.systemPrompt,
          userMessage: userMsg,
          onStream: (streaming) => updateLastMessage(streaming),
        })
        tracker.addTokens(result.inputTokens, result.outputTokens)
        agentReports.push({ name: agent.name, role: agent.role, text: result.text })
      } catch (err) {
        updateLastMessage(`❌ 오류: ${err.message}`)
        agentReports.push({ name: agent.name, role: agent.role, text: `분석 실패: ${err.message}` })
      }

      setCompletedAgents((prev) => [...prev, agent.id])
      await new Promise((r) => setTimeout(r, 500))
    }

    // Team Leader
    setActiveAgent('hanJiho')
    const elapsed = tracker.getElapsedMinutes()
    const summary = tracker.getSummary()

    const now = new Date()
    const dateStr = now.toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    })

    const leaderUserMsg = `다음은 5명의 분석관이 "${companyName}" (${industryName})에 대해 보고한 내용입니다.

${agentReports.map((r) => `[${r.name} - ${r.role}]\n${r.text}`).join('\n\n---\n\n')}

위 보고를 종합하여 회의록을 작성하세요.
- 회의 일시: ${dateStr}
- 회의 시간: 약 ${elapsed}분
- 소모 비용: 약 ${summary.totalTokens} tokens (입력 ${summary.inputTokens} + 출력 ${summary.outputTokens}) / $${((summary.inputTokens * 3 + summary.outputTokens * 15) / 1_000_000).toFixed(4)}
- 대상 회사: ${companyName} (${industryName})`

    addMessage({
      agentId: 'hanJiho',
      name: TEAM_LEADER.name,
      role: 'HR전략실 팀장',
      color: TEAM_LEADER.color,
      text: '종합 보고서 작성 중...',
      isReport: true,
    })

    try {
      const result = await callClaude({
        password,
        systemPrompt: TEAM_LEADER.systemPrompt,
        userMessage: leaderUserMsg,
        onStream: (streaming) => updateLastMessage(streaming),
      })
      tracker.addTokens(result.inputTokens, result.outputTokens)
    } catch (err) {
      updateLastMessage(`❌ 보고서 작성 오류: ${err.message}`)
    }

    setTokenSummary(tracker.getSummary())
    setCompletedAgents((prev) => [...prev, 'hanJiho'])
    setActiveAgent(null)
    setIsRunning(false)
    setAnalysisComplete(true)
  }, [password, allData, addMessage, updateLastMessage])

  const sendFollowUp = useCallback(async (question, companyName) => {
    if (!question.trim() || !password || isRunning) return

    setIsRunning(true)

    addMessage({
      agentId: 'user',
      name: '사용자',
      role: 'HR담당자',
      color: '#8888a0',
      text: question,
    })

    const companyData = getCompanyData(allData, companyName)
    const industryData = getSameIndustryData(allData, companyName)
    const allReports = messages
      .filter((m) => m.agentId !== 'system' && m.agentId !== 'user')
      .map((m) => `[${m.name}] ${m.text}`)
      .join('\n\n')

    const systemMsg = `당신은 그룹 HR전략실의 AI 어시스턴트입니다.
아래는 "${companyName}"에 대해 이미 수행된 분석입니다:
${allReports}

해당 회사 원본 데이터:
${JSON.stringify(companyData, null, 2)}

동일 산업군 비교 데이터:
${JSON.stringify(industryData, null, 2)}

사용자의 후속 질문에 데이터와 기존 분석에 기반하여 답변하세요. 한국어로, 구체적 수치를 포함하여 답변하세요.`

    addMessage({
      agentId: 'hanJiho',
      name: TEAM_LEADER.name,
      role: 'HR전략실 팀장',
      color: TEAM_LEADER.color,
      text: '답변 준비 중...',
    })

    try {
      const result = await callClaude({
        password,
        systemPrompt: systemMsg,
        userMessage: question,
        onStream: (streaming) => updateLastMessage(streaming),
      })
      trackerRef.current.addTokens(result.inputTokens, result.outputTokens)
      setTokenSummary(trackerRef.current.getSummary())
    } catch (err) {
      updateLastMessage(`❌ 오류: ${err.message}`)
    }

    setIsRunning(false)
  }, [password, allData, isRunning, messages, addMessage, updateLastMessage])

  return {
    messages,
    isRunning,
    activeAgent,
    completedAgents,
    analysisComplete,
    tokenSummary,
    runAnalysis,
    sendFollowUp,
    resetMessages: () => {
      setMessages([])
      setCompletedAgents([])
      setAnalysisComplete(false)
      setTokenSummary(null)
    },
  }
}
