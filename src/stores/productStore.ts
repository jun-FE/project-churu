import { create } from 'zustand'
import { Product, productsApi } from '@/lib/api/products'

interface ProductState {
  products: Product[]
  currentProduct: Product | null
  loading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  fetchProduct: (id: string) => Promise<void>
  createProduct: (product: Parameters<typeof productsApi.createProduct>[0]) => Promise<Product>
  updateProduct: (id: string, product: Parameters<typeof productsApi.updateProduct>[1]) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
  clearCurrentProduct: () => void
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const products = await productsApi.getProducts()
      set({ products, loading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch products', loading: false })
    }
  },

  fetchProduct: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const product = await productsApi.getProduct(id)
      set({ currentProduct: product, loading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch product', loading: false })
    }
  },

  createProduct: async (product) => {
    set({ loading: true, error: null })
    try {
      const newProduct = await productsApi.createProduct(product)
      set((state) => ({ 
        products: [newProduct, ...state.products],
        loading: false 
      }))
      return newProduct
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create product', loading: false })
      throw error
    }
  },

  updateProduct: async (id: string, product) => {
    set({ loading: true, error: null })
    try {
      const updatedProduct = await productsApi.updateProduct(id, product)
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        currentProduct: state.currentProduct?.id === id ? updatedProduct : state.currentProduct,
        loading: false,
      }))
      return updatedProduct
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update product', loading: false })
      throw error
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await productsApi.deleteProduct(id)
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        currentProduct: state.currentProduct?.id === id ? null : state.currentProduct,
        loading: false,
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete product', loading: false })
      throw error
    }
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null })
  },
}))
