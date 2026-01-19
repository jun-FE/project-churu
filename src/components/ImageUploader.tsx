import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ImageUploaderProps {
  imageUrl: string | null
  onImageChange: (url: string | null) => void
  onFileSelect: (file: File) => Promise<string>
  disabled?: boolean
}

export const ImageUploader = ({
  imageUrl,
  onImageChange,
  onFileSelect,
  disabled = false,
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(imageUrl)

  const handleFileSelect = async (file: File) => {
    // 파일 형식 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    setUploading(true)
    try {
      // 미리보기 생성
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // 업로드
      const uploadedUrl = await onFileSelect(file)
      onImageChange(uploadedUrl)
      
      // 미리보기 정리
      URL.revokeObjectURL(previewUrl)
      setPreview(uploadedUrl)
    } catch (error) {
      console.error('Image upload failed:', error)
      alert('이미지 업로드에 실패했습니다.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = () => {
    onImageChange(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <Label>대표 이미지</Label>
      
      {preview ? (
        <div className="relative">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRemove}
            disabled={disabled || uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 transition-colors',
            !disabled && !uploading && 'hover:bg-muted',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        >
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {uploading ? '업로드 중...' : '이미지를 클릭하거나 드래그하여 업로드'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            최대 5MB (JPEG, PNG, WebP)
          </p>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        disabled={disabled || uploading}
        className="hidden"
      />

      {!preview && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          파일 선택
        </Button>
      )}
    </div>
  )
}
