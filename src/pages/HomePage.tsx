import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ProductList } from '@/components/ProductList'
import { StatusFilter } from '@/components/StatusFilter'
import { SearchBar } from '@/components/SearchBar'
import { Plus } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">상품 목록</h1>
          <Link to="/products/new">
            <Button size="sm" className="gap-2 min-h-[44px]">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">상품 등록</span>
              <span className="sm:hidden">등록</span>
            </Button>
          </Link>
        </div>

        {/* 검색 바 */}
        <div className="mb-4">
          <SearchBar />
        </div>

        {/* 상태 필터 */}
        <div className="mb-6">
          <StatusFilter />
        </div>

        {/* 상품 리스트 */}
        <ProductList />
      </div>
    </div>
  )
}

export default HomePage
