import { supabase } from '../supabase'

const BUCKET_NAME = 'product-images'

export const storageApi = {
  async uploadImage(file: File, productId: string): Promise<string> {
    // 개인용 앱: 인증 없이도 작동하도록 임시 UUID 사용
    const { data: { user } } = await supabase.auth.getUser()
    // UUID 형식의 고정된 임시 사용자 ID (개인용 앱)
    const userId = user?.id || '00000000-0000-0000-0000-000000000000'

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${productId}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return publicUrl
  },

  async deleteImage(url: string) {
    // URL에서 파일 경로 추출
    const urlParts = url.split('/')
    const fileName = urlParts.slice(-3).join('/') // user_id/product_id/filename

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName])

    if (error) throw error
  },
}
