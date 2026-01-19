import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProductStore } from '@/stores/productStore'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PriceCalculator } from '@/components/PriceCalculator'
import { ImageUploader } from '@/components/ImageUploader'
import { TagInput } from '@/components/TagInput'
import { LinkManager } from '@/components/LinkManager'
import { storageApi } from '@/lib/api/storage'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Product } from '@/lib/api/products'

const ProductFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEdit = !!id

  const { currentProduct, loading, fetchProduct, createProduct, updateProduct } = useProductStore()

  // 폼 상태
  const [name, setName] = useState('')
  const [status, setStatus] = useState<Product['status']>('IDEA')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [costCny, setCostCny] = useState<number | null>(null)
  const [exchangeRate, setExchangeRate] = useState(200)
  const [shippingFeeKrw, setShippingFeeKrw] = useState<number | null>(null)
  const [sellingPriceKrw, setSellingPriceKrw] = useState<number | null>(null)
  const [memo, setMemo] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [savedProductId, setSavedProductId] = useState<string | null>(id || null)

  // 수정 모드일 때 상품 데이터 로드
  useEffect(() => {
    if (isEdit && id) {
      fetchProduct(id)
    }
  }, [isEdit, id, fetchProduct])

  // 상품 데이터를 폼에 채우기
  useEffect(() => {
    if (isEdit && currentProduct) {
      setName(currentProduct.name)
      setStatus(currentProduct.status)
      setImageUrl(currentProduct.image_url)
      setCostCny(currentProduct.cost_cny)
      setExchangeRate(currentProduct.exchange_rate)
      setShippingFeeKrw(currentProduct.shipping_fee_krw)
      setSellingPriceKrw(currentProduct.selling_price_krw)
      setMemo(currentProduct.memo || '')
      setTags(currentProduct.tags || [])
    }
  }, [isEdit, currentProduct])

  const handleImageUpload = async (file: File): Promise<string> => {
    // 임시 ID 생성 (새 상품인 경우)
    const tempId = id || `temp-${Date.now()}`
    return await storageApi.uploadImage(file, tempId)
  }

  const [productSaved, setProductSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: '오류',
        description: '상품명을 입력해주세요.',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      const productData = {
        name: name.trim(),
        status,
        image_url: imageUrl,
        cost_cny: costCny,
        exchange_rate: exchangeRate,
        shipping_fee_krw: shippingFeeKrw,
        selling_price_krw: sellingPriceKrw,
        memo: memo.trim() || null,
        tags,
      }

      let savedProduct: Product
      if (isEdit && id) {
        savedProduct = await updateProduct(id, productData)
        toast({
          title: '성공',
          description: '상품이 수정되었습니다.',
        })
        setSavedProductId(id)
      } else {
        savedProduct = await createProduct(productData)
        toast({
          title: '성공',
          description: '상품이 등록되었습니다. 링크를 추가할 수 있습니다.',
        })
        setSavedProductId(savedProduct.id)
        setProductSaved(true)
      }

      // 수정 모드일 때는 저장 후 목록으로 이동
      if (isEdit) {
        navigate('/')
      }
    } catch (error) {
      console.error('Product save failed:', error)
      toast({
        title: '오류',
        description: error instanceof Error ? error.message : '상품 저장에 실패했습니다.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleFinish = () => {
    navigate('/')
  }

  if (isEdit && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-6">
        {/* 헤더 */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{isEdit ? '상품 수정' : '상품 등록'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">상품명 *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="상품명을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Product['status'])}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDEA">아이디어</SelectItem>
                  <SelectItem value="SAMPLE_ORDERED">샘플 주문</SelectItem>
                  <SelectItem value="SAMPLE_CONFIRMED">샘플 확인</SelectItem>
                  <SelectItem value="ORDERED">주문 완료</SelectItem>
                  <SelectItem value="SELLING">판매 중</SelectItem>
                  <SelectItem value="DROP">중단</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ImageUploader
              imageUrl={imageUrl}
              onImageChange={setImageUrl}
              onFileSelect={handleImageUpload}
              disabled={submitting}
            />

            <TagInput tags={tags} onChange={setTags} />

            <div className="space-y-2">
              <Label htmlFor="memo">메모</Label>
              <Textarea
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="간단한 메모를 입력하세요"
                rows={3}
              />
            </div>
          </div>

          {/* 가격 정보 */}
          <PriceCalculator
            costCny={costCny}
            exchangeRate={exchangeRate}
            shippingFeeKrw={shippingFeeKrw}
            sellingPriceKrw={sellingPriceKrw}
            onCostCnyChange={setCostCny}
            onExchangeRateChange={setExchangeRate}
            onShippingFeeKrwChange={setShippingFeeKrw}
            onSellingPriceKrwChange={setSellingPriceKrw}
          />

          {/* 링크 관리 */}
          <LinkManager productId={savedProductId || id || null} />

          {/* 버튼 */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/')} disabled={submitting}>
              취소
            </Button>
            {productSaved && !isEdit ? (
              <Button type="button" onClick={handleFinish} className="flex-1">
                완료
              </Button>
            ) : (
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? '수정하기' : '등록하기'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormPage
