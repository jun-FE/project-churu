/**
 * 숫자를 원화 형식으로 포맷팅
 * @param amount 금액
 * @returns 포맷된 문자열 (예: "1,234,567원")
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '0원'
  return `${amount.toLocaleString('ko-KR')}원`
}

/**
 * 숫자를 위안화 형식으로 포맷팅
 * @param amount 금액
 * @returns 포맷된 문자열 (예: "1,234.56¥")
 */
export function formatCurrencyCNY(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '0¥'
  return `${amount.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}¥`
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param date 날짜 문자열 또는 Date 객체
 * @returns 포맷된 문자열 (예: "2024년 1월 1일")
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 날짜를 상대 시간으로 포맷팅 (예: "3일 전", "방금 전")
 * @param date 날짜 문자열 또는 Date 객체
 * @returns 포맷된 문자열
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`
  return formatDate(d)
}
