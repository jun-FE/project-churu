import { useUIStore } from '@/stores/uiStore'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useUIStore()

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="상품명, 태그, 메모 검색..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="min-h-[44px] pl-10 pr-10" // 터치 최적화
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
          onClick={() => setSearchQuery('')}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
