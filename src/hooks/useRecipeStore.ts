import { useRecipeStore } from '@/stores/recipeStore'
import type { RecipeCategory } from '@/types'

type SortBy = 'name' | 'calories' | 'protein' | 'created'
type SortOrder = 'asc' | 'desc'

/**
 * Hook to get the current search query
 */
export function useSearchQuery(): string {
  return useRecipeStore((state) => state.searchQuery)
}

/**
 * Hook to get the selected category filter
 */
export function useSelectedCategory(): RecipeCategory | 'all' {
  return useRecipeStore((state) => state.selectedCategory)
}

/**
 * Hook to get the selected tags
 */
export function useSelectedTags(): string[] {
  return useRecipeStore((state) => state.selectedTags)
}

/**
 * Hook to get the current sort configuration
 */
export function useSortConfig(): { sortBy: SortBy; sortOrder: SortOrder } {
  return useRecipeStore((state) => ({
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  }))
}

/**
 * Hook to get all recipe filter actions
 */
export function useRecipeActions() {
  return useRecipeStore((state) => ({
    setSearchQuery: state.setSearchQuery,
    setCategory: state.setCategory,
    toggleTag: state.toggleTag,
    setSort: state.setSort,
    clearFilters: state.clearFilters,
  }))
}

/**
 * Hook to get specific recipe actions
 */
export function useSetSearchQuery() {
  return useRecipeStore((state) => state.setSearchQuery)
}

export function useSetCategory() {
  return useRecipeStore((state) => state.setCategory)
}

export function useToggleTag() {
  return useRecipeStore((state) => state.toggleTag)
}

export function useSetSort() {
  return useRecipeStore((state) => state.setSort)
}

export function useClearFilters() {
  return useRecipeStore((state) => state.clearFilters)
}

