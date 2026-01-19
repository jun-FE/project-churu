import { useMemo, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { calculateCostKrw, calculateMargin, calculateMarginRate, getMarginColorClass } from '@/utils/calculator'
import { formatCurrency } from '@/utils/formatter'
import { cn } from '@/utils/cn'
import { fetchExchangeRate, getCachedExchangeRate, cacheExchangeRate } from '@/utils/exchangeRate'
import { useToast } from '@/components/ui/use-toast'
import { RefreshCw, Loader2 } from 'lucide-react'

interface PriceCalculatorProps {
  costCny: number | null
  exchangeRate: number
  shippingFeeKrw: number | null
  sellingPriceKrw: number | null
  onCostCnyChange: (value: number | null) => void
  onExchangeRateChange: (value: number) => void
  onShippingFeeKrwChange: (value: number | null) => void
  onSellingPriceKrwChange: (value: number | null) => void
}

export const PriceCalculator = ({
  costCny,
  exchangeRate,
  shippingFeeKrw,
  sellingPriceKrw,
  onCostCnyChange,
  onExchangeRateChange,
  onShippingFeeKrwChange,
  onSellingPriceKrwChange,
}: PriceCalculatorProps) => {
  const { toast } = useToast()
  const [loadingRate, setLoadingRate] = useState(false)

  // 컴포넌트 마운트 시 캐시된 환율 확인
  useEffect(() => {
    const cachedRate = getCachedExchangeRate()
    if (cachedRate && exchangeRate === 200) {
      // 기본값(200)일 때만 캐시된 환율 적용
      onExchangeRateChange(cachedRate)
    }
  }, [])

  const handleFetchExchangeRate = async () => {
    setLoadingRate(true)
    try {
      const rate = await fetchExchangeRate()
      cacheExchangeRate(rate)
      onExchangeRateChange(rate)
      toast({
        title: '성공',
        description: `환율이 업데이트되었습니다: ${rate.toFixed(2)}`,
      })
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error)
      toast({
        title: '오류',
        description: '환율을 가져오는데 실패했습니다. 수동으로 입력해주세요.',
        variant: 'destructive',
      })
    } finally {
      setLoadingRate(false)
    }
  }
  // 원화 원가 계산
  const costKrw = useMemo(() => {
    if (costCny === null || costCny === 0) return null
    return calculateCostKrw(costCny, exchangeRate, shippingFeeKrw || 0)
  }, [costCny, exchangeRate, shippingFeeKrw])

  // 마진 계산
  const margin = useMemo(() => {
    if (!sellingPriceKrw || !costKrw) return null
    return calculateMargin(sellingPriceKrw, costKrw)
  }, [sellingPriceKrw, costKrw])

  // 마진율 계산
  const marginRate = useMemo(() => {
    if (!sellingPriceKrw || !costKrw) return null
    return calculateMarginRate(sellingPriceKrw, costKrw)
  }, [sellingPriceKrw, costKrw])

  return (
    <Card>
      <CardHeader>
        <CardTitle>가격 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 위안화 원가 */}
        <div className="space-y-2">
          <Label htmlFor="costCny">위안화 원가 (¥)</Label>
          <Input
            id="costCny"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={costCny ?? ''}
            onChange={(e) => onCostCnyChange(e.target.value ? parseFloat(e.target.value) : null)}
          />
        </div>

        {/* 환율 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="exchangeRate">환율</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleFetchExchangeRate}
              disabled={loadingRate}
              className="h-8 gap-1 text-xs"
            >
              {loadingRate ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="hidden sm:inline">가져오는 중...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3" />
                  <span className="hidden sm:inline">실시간 환율</span>
                </>
              )}
            </Button>
          </div>
          <Input
            id="exchangeRate"
            type="number"
            step="0.01"
            placeholder="200"
            value={exchangeRate}
            onChange={(e) => onExchangeRateChange(parseFloat(e.target.value) || 200)}
          />
          <p className="text-xs text-muted-foreground">
            실시간 환율 버튼을 클릭하면 최신 환율을 가져옵니다
          </p>
        </div>

        {/* 배송비/관세 */}
        <div className="space-y-2">
          <Label htmlFor="shippingFeeKrw">배송비/관세 (원)</Label>
          <Input
            id="shippingFeeKrw"
            type="number"
            step="100"
            placeholder="0"
            value={shippingFeeKrw ?? ''}
            onChange={(e) => onShippingFeeKrwChange(e.target.value ? parseFloat(e.target.value) : null)}
          />
        </div>

        {/* 원화 원가 (자동 계산) */}
        {costKrw !== null && (
          <div className="rounded-lg bg-muted p-3">
            <div className="text-sm text-muted-foreground">원화 원가</div>
            <div className="text-lg font-semibold">{formatCurrency(costKrw)}</div>
          </div>
        )}

        {/* 판매 예정가 */}
        <div className="space-y-2">
          <Label htmlFor="sellingPriceKrw">판매 예정가 (원)</Label>
          <Input
            id="sellingPriceKrw"
            type="number"
            step="100"
            placeholder="0"
            value={sellingPriceKrw ?? ''}
            onChange={(e) => onSellingPriceKrwChange(e.target.value ? parseFloat(e.target.value) : null)}
          />
        </div>

        {/* 마진 정보 */}
        {margin !== null && marginRate !== null && (
          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">마진금액</span>
              <span className="font-semibold">{formatCurrency(margin)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">마진율</span>
              <span className={cn('text-lg font-bold', getMarginColorClass(marginRate))}>
                {marginRate.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
