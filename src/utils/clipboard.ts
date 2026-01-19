/**
 * 클립보드에 텍스트 복사
 * @param text 복사할 텍스트
 * @returns 성공 여부
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * 배송대행지 포맷으로 텍스트 생성
 * @param productName 상품명
 * @param note 옵션/메모
 * @param quantity 수량
 * @param url 링크 URL
 * @returns 포맷된 텍스트
 */
export function formatForShippingAgent(
  productName: string,
  note: string | null,
  quantity: number = 1,
  url: string
): string {
  const optionText = note ? ` / ${note}` : ''
  return `[${productName}${optionText} / 수량 ${quantity}개 / ${url}]`
}
