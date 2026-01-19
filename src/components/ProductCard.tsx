import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from './StatusBadge'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/formatter'
import { Product } from '@/lib/api/products'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/products/${product.id}`} className="block">
      <Card className="overflow-hidden transition-all hover:shadow-md active:scale-[0.98]">
        {/* 이미지 영역 */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* 정보 영역 */}
        <CardContent className="p-4">
          {/* 상태 배지 */}
          <div className="mb-2">
            <StatusBadge status={product.status} />
          </div>

          {/* 상품명 */}
          <h3 className="mb-2 line-clamp-2 font-semibold leading-tight">
            {product.name}
          </h3>

          {/* 가격 정보 */}
          {product.selling_price_krw && (
            <div className="mb-2 text-lg font-bold text-primary">
              {formatCurrency(product.selling_price_krw)}
            </div>
          )}

          {/* 태그 */}
          {product.tags && product.tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* 메모 미리보기 */}
          {product.memo && (
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {product.memo}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
