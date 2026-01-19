import { supabase } from '../supabase'

export interface Product {
  id: string
  created_at: string
  name: string
  status: 'IDEA' | 'SAMPLE_ORDERED' | 'SAMPLE_CONFIRMED' | 'ORDERED' | 'SELLING' | 'DROP'
  image_url: string | null
  cost_cny: number | null
  exchange_rate: number
  shipping_fee_krw: number | null
  selling_price_krw: number | null
  memo: string | null
  tags: string[]
  user_id: string
}

export interface CreateProductData {
  name: string
  status: Product['status']
  image_url?: string | null
  cost_cny?: number | null
  exchange_rate?: number
  shipping_fee_krw?: number | null
  selling_price_krw?: number | null
  memo?: string | null
  tags?: string[]
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export const productsApi = {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Product[]
  },

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Product
  },

  async createProduct(product: CreateProductData) {
    // 개인용 앱: 인증 없이도 작동하도록 임시 UUID 사용
    const { data: { user } } = await supabase.auth.getUser()
    // UUID 형식의 고정된 임시 사용자 ID (개인용 앱)
    const userId = user?.id || '00000000-0000-0000-0000-000000000000'

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...product,
        user_id: userId,
        exchange_rate: product.exchange_rate ?? 200,
      })
      .select()
      .single()

    if (error) throw error
    return data as Product
  },

  async updateProduct(id: string, product: UpdateProductData) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Product
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
