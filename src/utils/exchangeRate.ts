/**
 * 환율 API 유틸리티
 * 무료 API 사용: ExchangeRate-API (https://www.exchangerate-api.com)
 * 
 * 무료 플랜:
 * - 하루에 한 번 업데이트
 * - 월 1,500 요청
 * - API 키 필요 (무료 가입)
 */

const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/CNY'

interface ExchangeRateResponse {
  rates: {
    KRW: number
    [key: string]: number
  }
  base: string
  date: string
}

/**
 * 실시간 환율 가져오기 (CNY -> KRW)
 * @returns 환율 (1 CNY = X KRW)
 */
export async function fetchExchangeRate(): Promise<number> {
  try {
    const response = await fetch(EXCHANGE_RATE_API_URL)
    
    if (!response.ok) {
      throw new Error('환율 정보를 가져올 수 없습니다.')
    }

    const data: ExchangeRateResponse = await response.json()
    const krwRate = data.rates.KRW

    if (!krwRate) {
      throw new Error('KRW 환율 정보를 찾을 수 없습니다.')
    }

    return Math.round(krwRate * 100) / 100 // 소수점 2자리로 반올림
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error)
    throw error
  }
}

/**
 * 캐시된 환율 가져오기 (로컬 스토리지)
 */
export function getCachedExchangeRate(): number | null {
  try {
    const cached = localStorage.getItem('exchange_rate')
    const cachedDate = localStorage.getItem('exchange_rate_date')
    
    if (cached && cachedDate) {
      const date = new Date(cachedDate)
      const now = new Date()
      // 24시간 이내면 캐시 사용
      if (now.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
        return parseFloat(cached)
      }
    }
  } catch (error) {
    console.error('Failed to get cached exchange rate:', error)
  }
  
  return null
}

/**
 * 환율 캐시 저장
 */
export function cacheExchangeRate(rate: number): void {
  try {
    localStorage.setItem('exchange_rate', rate.toString())
    localStorage.setItem('exchange_rate_date', new Date().toISOString())
  } catch (error) {
    console.error('Failed to cache exchange rate:', error)
  }
}
