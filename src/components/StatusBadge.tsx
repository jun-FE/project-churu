import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'

type ProductStatus = 'IDEA' | 'SAMPLE_ORDERED' | 'SAMPLE_CONFIRMED' | 'ORDERED' | 'SELLING' | 'DROP'

interface StatusBadgeProps {
  status: ProductStatus
  className?: string
}

const statusConfig: Record<ProductStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  IDEA: { label: '아이디어', variant: 'outline' },
  SAMPLE_ORDERED: { label: '샘플 주문', variant: 'secondary' },
  SAMPLE_CONFIRMED: { label: '샘플 확인', variant: 'secondary' },
  ORDERED: { label: '주문 완료', variant: 'default' },
  SELLING: { label: '판매 중', variant: 'default' },
  DROP: { label: '중단', variant: 'destructive' },
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status]
  
  return (
    <Badge variant={config.variant} className={cn('text-xs', className)}>
      {config.label}
    </Badge>
  )
}
