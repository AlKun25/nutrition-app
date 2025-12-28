import { create } from 'zustand'
import type { RecipeCategory } from '@/types'

type SortBy = 'name' | 'calories' | 'protein' | 'created'
type SortOrder = 'asc' | 'desc'

interface RecipeState {
  searchQuery: string
  selectedCategory: RecipeCategory | 'all'
  selectedTags: string[]
  sortBy: SortBy
  sortOrder: SortOrder
}

interface RecipeActions {
  setSearchQuery: (query: string) => void
  setCategory: (category: RecipeCategory | 'all') => void
  toggleTag: (tag: string) => void
  setSort: (sortBy: SortBy, order: SortOrder) => void
  clearFilters: () => void
}

type RecipeStore = RecipeState & RecipeActions

const initialState: RecipeState = {
  searchQuery: '',
  selectedCategory: 'all',
  selectedTags: [],
  sortBy: 'name',
  sortOrder: 'asc',
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  ...initialState,

  setSearchQuery: (query) => {
    set({ searchQuery: query })
  },

  setCategory: (category) => {
    set({ selectedCategory: category })
  },

  toggleTag: (tag) => {
    set((state) => {
      const isSelected = state.selectedTags.includes(tag)
      return {
        selectedTags: isSelected
          ? state.selectedTags.filter((t) => t !== tag)
          : [...state.selectedTags, tag],
      }
    })
  },

  setSort: (sortBy, order) => {
    set({ sortBy, sortOrder: order })
  },

  clearFilters: () => {
    set(initialState)
  },
}))

