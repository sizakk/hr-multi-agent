# HR Multi-Agent Analysis

## 프로젝트 요약
그룹 지주회사 HR담당자용 멀티에이전트 HR 분석 웹앱.
5명의 AI 분석관이 계열사 HR 데이터를 순차 분석하고, 팀장이 회의록 형식으로 종합 보고.

## 기술 스택
- Vite + React 18 (JSX, no TypeScript)
- Anthropic Claude API (Sonnet 4, SSE 스트리밍)
- PapaParse (CSV 파싱)
- Vercel 배포

## 핵심 파일
- `src/agents/agentConfig.js` — 에이전트 정의 및 시스템 프롬프트
- `src/hooks/useAnalysis.js` — 분석 실행 로직
- `src/services/claudeApi.js` — API 호출
- `src/utils/csvParser.js` — 데이터 파싱

## 개발 명령어
```bash
npm run dev      # 개발 서버 (localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 에이전트 수정
에이전트 추가/수정/프롬프트 튜닝은 `.claude/skills/hr-agent-dev/SKILL.md`를 참조.

## 주의사항
- API 키는 사용자가 브라우저에서 직접 입력 (하드코딩 금지)
- `생산성지표.csv`의 산업군 컬럼명이 `업군`으로 다름
- 팀장 페르소나: 위기경영/생산성 중심, 구조조정 지지 (한국 노동법 범위 내)
