import { create } from 'zustand'
import type { RecipeCategory } from '@/types'

type SortBy = 'name' | 'calories' | 'protein' | 'created'
type SortOrder = 'asc' | 'desc'

interface RecipeFilterState {
  searchQuery: string
  selectedCategory: RecipeCategory | 'all'
  selectedTags: string[]
  sortBy: SortBy
  sortOrder: SortOrder
}

interface RecipeFilterActions {
  setSearchQuery: (query: string) => void
  setCategory: (category: RecipeCategory | 'all') => void
  toggleTag: (tag: string) => void
  clearTags: () => void
  setSort: (sortBy: SortBy, order: SortOrder) => void
  clearFilters: () => void
}

type RecipeStore = RecipeFilterState & RecipeFilterActions

const initialState: RecipeFilterState = {
  searchQuery: '',
  selectedCategory: 'all',
  selectedTags: [],
  sortBy: 'name',
  sortOrder: 'asc',
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  ...initialState,

  setSearchQuery: (query) => set({ searchQuery: query }),

  setCategory: (category) => set({ selectedCategory: category }),

  toggleTag: (tag) => set((state) => ({
    selectedTags: state.selectedTags.includes(tag)
      ? state.selectedTags.filter((t) => t !== tag)
      : [...state.selectedTags, tag]
  })),

  clearTags: () => set({ selectedTags: [] }),

  setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder }),

  clearFilters: () => set(initialState),
}))