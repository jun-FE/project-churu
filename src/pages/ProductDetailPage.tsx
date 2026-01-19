import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProductStore } from '@/stores/productStore'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/StatusBadge'
import { ImageDownloader } from '@/components/ImageDownloader'
import { LinkManager } from '@/components/LinkManager'
import { calculateCostKrw, calculateMargin, calculateMarginRate, getMarginColorClass } from '@/utils/calculator'
import { formatCurrency, formatCurrencyCNY, formatRelativeTime } from '@/utils/formatter'
import { formatForShippingAgent, copyToClipboard } from '@/utils/clipboard'
import { ArrowLeft, Edit, Trash2, Copy } from 'lucide-react'
import { Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { productLinksApi, ProductLink } from '@/lib/api/productLinks'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { currentProduct, loading, error, fetchProduct, deleteProduct } = useProductStore()
  const [productLinks, setProductLinks] = useState<ProductLink[]>([])

  useEffect(() => {
    if (id) {
      fetchProduct(id)
      loadLinks()
    }
  }, [id, fetchProduct])

  const loadLinks = async () => {
    if (!id) return
    try {
      const links = await productLinksApi.getProductLinks(id)
      setProductLinks(links)
    } catch (error) {
      console.error('Failed to load links:', error)
    }
  }

  const handleDelete = async () => {
    if (!id || !currentProduct) return

    if (!confirm(`"${currentProduct.name}" 상품을 삭제하시겠습니까?`)) {
      return
    }

    try {
      await deleteProduct(id)
      toast({
        title: '성공',
        description: '상품이 삭제되었습니다.',
      })
      navigate('/')
    } catch (error) {
      toast({
        title: '오류',
        description: '상품 삭제에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  const handleCopyShippingAgent = async () => {
    if (!currentProduct) return

    // 첫 번째 링크 사용, 없으면 이미지 URL 사용
    const link = productLinks.length > 0 ? productLinks[0].url : currentProduct.image_url || ''
    const formatted = formatForShippingAgent(
      currentProduct.name,
      currentProduct.memo,
      1,
      link
    )

    const success = await copyToClipboard(formatted)
    if (success) {
      toast({
        title: '성공',
        description: '배송대행지 포맷이 복사되었습니다.',
      })
    } else {
      toast({
        title: '오류',
        description: '복사에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !currentProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-semibold">상품을 불러올 수 없습니다</p>
            <p className="text-sm text-muted-foreground">{error || '상품을 찾을 수 없습니다.'}</p>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  // 가격 계산
  const costKrw = currentProduct.cost_cny && currentProduct.exchange_rate
    ? calculateCostKrw(
        currentProduct.cost_cny,
        currentProduct.exchange_rate,
        currentProduct.shipping_fee_krw || 0
      )
    : null

  const margin = currentProduct.selling_price_krw && costKrw
    ? calculateMargin(currentProduct.selling_price_krw, costKrw)
    : null

  const marginRate = currentProduct.selling_price_krw && costKrw
    ? calculateMarginRate(currentProduct.selling_price_krw, costKrw)
    : null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* 헤더 */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{currentProduct.name}</h1>
            <p className="text-sm text-muted-foreground">
              {formatRelativeTime(currentProduct.created_at)}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/products/${id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">수정</span>
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">삭제</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 이미지 영역 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>이미지</CardTitle>
                {currentProduct.image_url && (
                  <ImageDownloader imageUrl={currentProduct.image_url} fileName={currentProduct.name} />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentProduct.image_url ? (
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                  <img
                    src={currentProduct.image_url}
                    alt={currentProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <p>이미지 없음</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">상태</p>
                <StatusBadge status={currentProduct.status} className="mt-1" />
              </div>

              {currentProduct.tags && currentProduct.tags.length > 0 && (
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">태그</p>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {currentProduct.memo && (
                <div>
                  <p className="text-sm text-muted-foreground">메모</p>
                  <p className="mt-1 whitespace-pre-wrap">{currentProduct.memo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 가격 정보 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>가격 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {currentProduct.cost_cny && (
                <div>
                  <p className="text-sm text-muted-foreground">위안화 원가</p>
                  <p className="text-lg font-semibold">{formatCurrencyCNY(currentProduct.cost_cny)}</p>
                </div>
              )}

              {currentProduct.exchange_rate && (
                <div>
                  <p className="text-sm text-muted-foreground">환율</p>
                  <p className="text-lg font-semibold">{currentProduct.exchange_rate}</p>
                </div>
              )}

              {currentProduct.shipping_fee_krw && (
                <div>
                  <p className="text-sm text-muted-foreground">배송비/관세</p>
                  <p className="text-lg font-semibold">{formatCurrency(currentProduct.shipping_fee_krw)}</p>
                </div>
              )}

              {costKrw && (
                <div>
                  <p className="text-sm text-muted-foreground">원화 원가</p>
                  <p className="text-lg font-semibold">{formatCurrency(costKrw)}</p>
                </div>
              )}

              {currentProduct.selling_price_krw && (
                <div>
                  <p className="text-sm text-muted-foreground">판매 예정가</p>
                  <p className="text-lg font-semibold text-primary">
                    {formatCurrency(currentProduct.selling_price_krw)}
                  </p>
                </div>
              )}
            </div>

            {/* 마진 정보 */}
            {margin !== null && marginRate !== null && (
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">마진금액</span>
                  <span className="font-semibold">{formatCurrency(margin)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">마진율</span>
                  <span className={cn('text-xl font-bold', getMarginColorClass(marginRate))}>
                    {marginRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 링크 관리 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>구매 링크</CardTitle>
          </CardHeader>
          <CardContent>
            <LinkManager productId={id || null} onLinksChange={setProductLinks} />
          </CardContent>
        </Card>

        {/* 배송대행지 복사 */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <Button onClick={handleCopyShippingAgent} variant="outline" className="w-full gap-2">
              <Copy className="h-4 w-4" />
              배송대행지 포맷 복사
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProductDetailPage
