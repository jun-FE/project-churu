import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { productLinksApi, ProductLink } from '@/lib/api/productLinks'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Trash2, ExternalLink } from 'lucide-react'
import { Loader2 } from 'lucide-react'

interface LinkManagerProps {
  productId: string | null
  onLinksChange?: (links: ProductLink[]) => void
}

const PLATFORMS = [
  { value: '1688', label: '1688' },
  { value: 'Taobao', label: '타오바오' },
  { value: 'Xiaohongshu', label: '샤오홍슈' },
  { value: 'Coupang', label: '쿠팡' },
  { value: 'Other', label: '기타' },
]

export const LinkManager = ({ productId, onLinksChange }: LinkManagerProps) => {
  const { toast } = useToast()
  const [links, setLinks] = useState<ProductLink[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [platform, setPlatform] = useState('1688')
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 링크 목록 불러오기
  useEffect(() => {
    if (productId) {
      loadLinks()
    } else {
      setLinks([])
    }
  }, [productId])

  const loadLinks = async () => {
    if (!productId) return

    setLoading(true)
    try {
      const data = await productLinksApi.getProductLinks(productId)
      setLinks(data)
      onLinksChange?.(data)
    } catch (error) {
      console.error('Failed to load links:', error)
      toast({
        title: '오류',
        description: '링크를 불러오는데 실패했습니다.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddLink = async () => {
    if (!productId || !url.trim()) {
      toast({
        title: '오류',
        description: 'URL을 입력해주세요.',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      const newLink = await productLinksApi.createProductLink({
        product_id: productId,
        platform,
        url: url.trim(),
        note: note.trim() || null,
      })

      setLinks([...links, newLink])
      onLinksChange?.([...links, newLink])
      
      // 폼 초기화
      setUrl('')
      setNote('')
      setPlatform('1688')
      setIsDialogOpen(false)

      toast({
        title: '성공',
        description: '링크가 추가되었습니다.',
      })
    } catch (error) {
      console.error('Failed to add link:', error)
      toast({
        title: '오류',
        description: '링크 추가에 실패했습니다.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('이 링크를 삭제하시겠습니까?')) return

    try {
      await productLinksApi.deleteProductLink(linkId)
      const updatedLinks = links.filter((link) => link.id !== linkId)
      setLinks(updatedLinks)
      onLinksChange?.(updatedLinks)

      toast({
        title: '성공',
        description: '링크가 삭제되었습니다.',
      })
    } catch (error) {
      console.error('Failed to delete link:', error)
      toast({
        title: '오류',
        description: '링크 삭제에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  const getPlatformLabel = (platformValue: string) => {
    return PLATFORMS.find((p) => p.value === platformValue)?.label || platformValue
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>구매 링크</Label>
        {productId && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            링크 추가
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : links.length === 0 ? (
        <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          {productId ? '등록된 링크가 없습니다' : '상품을 먼저 저장한 후 링크를 추가할 수 있습니다'}
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">{getPlatformLabel(link.platform)}</Badge>
                  {link.note && (
                    <span className="text-sm text-muted-foreground">{link.note}</span>
                  )}
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1 truncate"
                >
                  <span className="truncate">{link.url}</span>
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteLink(link.id)}
                className="ml-2 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* 링크 추가 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>링크 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-platform">플랫폼</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="link-platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link-note">옵션명/비고</Label>
              <Input
                id="link-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="옵션명 또는 비고를 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddLink} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
