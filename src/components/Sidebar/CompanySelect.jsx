import React from 'react'
import { colors } from '../../styles/theme'

export default function CompanySelect({ companies, value, onChange, allData }) {
  if (companies.length === 0) return null

  const getIndustry = (name) => {
    const firstKey = Object.keys(allData)[0]
    if (!firstKey) return ''
    const row = allData[firstKey].find((r) => r['회사명'] === name)
    return row?.['산업군'] || row?.['업군'] || ''
  }

  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, color: colors.textSecondary,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6,
      }}>
        분석 대상 회사
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', background: colors.cardBg,
          border: `1px solid ${colors.border}`, borderRadius: 6,
          padding: '8px 10px', color: colors.textPrimary,
          fontSize: 12, outline: 'none',
        }}
      >
        <option value="">회사를 선택하세요</option>
        {companies.map((c) => (
          <option key={c} value={c}>
            {c} ({getIndustry(c)})
          </option>
        ))}
      </select>
    </div>
  )
}
