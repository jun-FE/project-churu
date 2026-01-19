/**
 * 원화 원가 계산
 * @param costCny 위안화 원가
 * @param exchangeRate 환율
 * @param shippingFeeKrw 배송비/관세 (원화)
 * @returns 원화 원가
 */
export function calculateCostKrw(
  costCny: number,
  exchangeRate: number,
  shippingFeeKrw: number = 0
): number {
  return costCny * exchangeRate + shippingFeeKrw
}

/**
 * 마진금액 계산
 * @param sellingPrice 판매 예정가
 * @param costKrw 원화 원가
 * @returns 마진금액
 */
export function calculateMargin(sellingPrice: number, costKrw: number): number {
  return sellingPrice - costKrw
}

/**
 * 마진율 계산 (%)
 * @param sellingPrice 판매 예정가
 * @param costKrw 원화 원가
 * @returns 마진율 (%)
 */
export function calculateMarginRate(sellingPrice: number, costKrw: number): number {
  if (sellingPrice === 0) return 0
  return ((sellingPrice - costKrw) / sellingPrice) * 100
}

/**
 * 마진율에 따른 색상 클래스 반환
 * @param marginRate 마진율 (%)
 * @returns Tailwind CSS 색상 클래스
 */
export function getMarginColorClass(marginRate: number): string {
  if (marginRate < 30) return 'text-red-600'
  if (marginRate < 50) return 'text-yellow-600'
  return 'text-green-600'
}
