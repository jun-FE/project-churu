import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'

type ProductStatus = 'IDEA' | 'SAMPLE_ORDERED' | 'SAMPLE_CONFIRMED' | 'ORDERED' | 'SELLING' | 'DROP'

interface StatusBadgeProps {
  status: ProductStatus
  className?: string
}

const statusConfig: Record<ProductStatus, { 
  label: string
  bgColor: string
  textColor: string
  borderColor: string
}> = {
  IDEA: { 
    label: '아이디어', 
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300'
  },
  SAMPLE_ORDERED: { 
    label: '샘플 주문', 
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300'
  },
  SAMPLE_CONFIRMED: { 
    label: '샘플 확인', 
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300'
  },
  ORDERED: { 
    label: '주문 완료', 
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-300'
  },
  SELLING: { 
    label: '판매 중', 
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300'
  },
  DROP: { 
    label: '중단', 
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-300'
  },
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status]
  
  return (
    <Badge 
      variant="outline"
      className={cn(
        'text-xs font-semibold border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      {config.label}
    </Badge>
  )
}
