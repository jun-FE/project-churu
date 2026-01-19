import { useEffect, useMemo } from 'react'
import { useProductStore } from '@/stores/productStore'
import { useUIStore } from '@/stores/uiStore'
import { ProductCard } from './ProductCard'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, Package } from 'lucide-react'
import { Link } from 'react-router-dom'

export const ProductList = () => {
  const { products, loading, error, fetchProducts } = useProductStore()
  const { statusFilter, searchQuery } = useUIStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // 필터링 및 검색 적용
  const filteredProducts = useMemo(() => {
    let filtered = products

    // 상태 필터링
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((product) => product.status === statusFilter)
    }

    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(query)
        const memoMatch = product.memo?.toLowerCase().includes(query)
        const tagMatch = product.tags.some((tag) => tag.toLowerCase().includes(query))
        return nameMatch || memoMatch || tagMatch
      })
    }

    return filtered
  }, [products, statusFilter, searchQuery])

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">상품을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-semibold">오류가 발생했습니다</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => fetchProducts()} variant="outline">
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  // 빈 상태
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Package className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="font-semibold">등록된 상품이 없습니다</p>
            <p className="text-sm text-muted-foreground">
              첫 번째 상품을 등록해보세요
            </p>
          </div>
          <Link to="/products/new">
            <Button>상품 등록하기</Button>
          </Link>
        </div>
      </div>
    )
  }

  // 필터링 결과가 없을 때
  if (filteredProducts.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Package className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="font-semibold">검색 결과가 없습니다</p>
            <p className="text-sm text-muted-foreground">
              다른 검색어나 필터를 시도해보세요
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 상품 리스트
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
