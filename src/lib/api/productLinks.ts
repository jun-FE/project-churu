import { supabase } from '../supabase'

export interface ProductLink {
  id: string
  product_id: string
  platform: string
  url: string
  note: string | null
  created_at: string
}

export interface CreateProductLinkData {
  product_id: string
  platform: string
  url: string
  note?: string | null
}

export const productLinksApi = {
  async getProductLinks(productId: string) {
    const { data, error } = await supabase
      .from('product_links')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as ProductLink[]
  },

  async createProductLink(link: CreateProductLinkData) {
    const { data, error } = await supabase
      .from('product_links')
      .insert(link)
      .select()
      .single()

    if (error) throw error
    return data as ProductLink
  },

  async deleteProductLink(id: string) {
    const { error } = await supabase
      .from('product_links')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
