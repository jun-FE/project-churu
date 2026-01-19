import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ImageDownloaderProps {
  imageUrl: string
  fileName?: string
}

export const ImageDownloader = ({ imageUrl, fileName }: ImageDownloaderProps) => {
  const { toast } = useToast()

  const handleDownload = async () => {
    try {
      // 이미지 URL에서 파일명 추출
      const urlParts = imageUrl.split('/')
      const defaultFileName = fileName || urlParts[urlParts.length - 1] || 'image.jpg'

      // 이미지 가져오기
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error('이미지를 가져올 수 없습니다.')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // 다운로드 트리거
      const link = document.createElement('a')
      link.href = url
      link.download = defaultFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 메모리 정리
      window.URL.revokeObjectURL(url)

      toast({
        title: '성공',
        description: '이미지가 다운로드되었습니다.',
      })
    } catch (error) {
      console.error('Image download failed:', error)
      toast({
        title: '오류',
        description: '이미지 다운로드에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2">
      <Download className="h-4 w-4" />
      이미지 다운로드
    </Button>
  )
}
