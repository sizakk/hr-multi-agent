import Papa from 'papaparse'

export function parseCSVText(text) {
  const cleaned = text.replace(/^\uFEFF/, '')
  const result = Papa.parse(cleaned, { header: true, skipEmptyLines: true })
  return result.data
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`))
    reader.readAsText(file, 'UTF-8')
  })
}

export function getCompanyData(allData, companyName) {
  const result = {}
  for (const [fileName, rows] of Object.entries(allData)) {
    const row = rows.find(
      (r) => (r['회사명'] || '').trim() === companyName.trim()
    )
    if (row) result[fileName] = row
  }
  return result
}

export function getSameIndustryData(allData, companyName) {
  let industry = null
  for (const [, rows] of Object.entries(allData)) {
    const row = rows.find(
      (r) => (r['회사명'] || '').trim() === companyName.trim()
    )
    if (row) {
      industry = row['산업군'] || row['업군']
      break
    }
  }
  if (!industry) return {}

  const result = {}
  for (const [fileName, rows] of Object.entries(allData)) {
    result[fileName] = rows.filter(
      (r) => (r['산업군'] || r['업군']) === industry
    )
  }
  return result
}

export function getIndustryName(allData, companyName) {
  for (const [, rows] of Object.entries(allData)) {
    const row = rows.find(
      (r) => (r['회사명'] || '').trim() === companyName.trim()
    )
    if (row) return row['산업군'] || row['업군'] || ''
  }
  return ''
}

export function extractCompanyList(allData) {
  const firstKey = Object.keys(allData)[0]
  if (!firstKey) return []
  const names = allData[firstKey]
    .map((r) => r['회사명'])
    .filter(Boolean)
  return [...new Set(names)].sort()
}
