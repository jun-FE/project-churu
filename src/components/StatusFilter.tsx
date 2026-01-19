import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type ProductStatus = 'IDEA' | 'SAMPLE_ORDERED' | 'SAMPLE_CONFIRMED' | 'ORDERED' | 'SELLING' | 'DROP' | 'ALL'

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'IDEA', label: '아이디어' },
  { value: 'SAMPLE_ORDERED', label: '샘플 주문' },
  { value: 'SAMPLE_CONFIRMED', label: '샘플 확인' },
  { value: 'ORDERED', label: '주문 완료' },
  { value: 'SELLING', label: '판매 중' },
  { value: 'DROP', label: '중단' },
]

export const StatusFilter = () => {
  const { statusFilter, setStatusFilter } = useUIStore()

  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={statusFilter === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(option.value)}
          className={cn(
            'min-h-[44px]', // 터치 최적화
            statusFilter === option.value && 'font-semibold'
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
