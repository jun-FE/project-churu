import { create } from 'zustand'

type ProductStatus = 'IDEA' | 'SAMPLE_ORDERED' | 'SAMPLE_CONFIRMED' | 'ORDERED' | 'SELLING' | 'DROP' | 'ALL'

interface UIState {
  statusFilter: ProductStatus
  searchQuery: string
  isModalOpen: boolean
  modalType: string | null
  setStatusFilter: (status: ProductStatus) => void
  setSearchQuery: (query: string) => void
  openModal: (type: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  statusFilter: 'ALL',
  searchQuery: '',
  isModalOpen: false,
  modalType: null,

  setStatusFilter: (status) => set({ statusFilter: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  openModal: (type) => set({ isModalOpen: true, modalType: type }),
  closeModal: () => set({ isModalOpen: false, modalType: null }),
}))
