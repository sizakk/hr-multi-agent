import React, { useRef } from 'react'
import { colors } from '../../styles/theme'

export default function FileUpload({ uploadedFiles, onUpload, onReset }) {
  const fileRef = useRef(null)

  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, color: colors.textSecondary,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6,
      }}>
        데이터 업로드
      </div>

      {uploadedFiles.length === 0 ? (
        <div
          style={{
            border: `2px dashed ${colors.border}`, borderRadius: 10,
            padding: '28px 16px', textAlign: 'center',
            cursor: 'pointer', background: colors.cardBg,
            transition: 'border-color 0.2s',
          }}
          onClick={() => fileRef.current?.click()}
        >
          <div style={{ fontSize: 24, marginBottom: 6 }}>📂</div>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>
            CSV 파일을 클릭하여 업로드
          </div>
          <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>
            5개 파일 (인원현황, 정규직비율추이, 생산성지표, 인당효율, 인력구조)
          </div>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".csv"
            style={{ display: 'none' }}
            onChange={(e) => onUpload(e.target.files)}
          />
        </div>
      ) : (
        <div>
          {uploadedFiles.map((f, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: '#2a2a40', borderRadius: 6,
              padding: '4px 10px', fontSize: 11,
              color: colors.textPrimary, margin: 2,
            }}>
              📄 {f}
            </div>
          ))}
          <div
            style={{ fontSize: 11, color: colors.accent, cursor: 'pointer', marginTop: 6 }}
            onClick={onReset}
          >
            ↻ 다시 업로드
          </div>
        </div>
      )}
    </div>
  )
}
