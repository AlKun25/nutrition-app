// src/stores/recipeStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useRecipeStore } from './recipeStore'
import { RecipeCategory } from '@/types'

describe('RecipeStore', () => {
  beforeEach(() => {
    useRecipeStore.setState({
      searchQuery: '',
      selectedCategory: 'all',
      selectedTags: [],
      sortBy: 'name',
      sortOrder: 'asc',
    })
  })

  describe('setSearchQuery', () => {
    it('should update search query', () => {
      useRecipeStore.getState().setSearchQuery('pasta')
      expect(useRecipeStore.getState().searchQuery).toBe('pasta')
    })
  })

  describe('setCategory', () => {
    it('should set category filter', () => {
      useRecipeStore.getState().setCategory(RecipeCategory.BREAKFAST)
      expect(useRecipeStore.getState().selectedCategory).toBe(RecipeCategory.BREAKFAST)
    })

    it('should allow "all" category', () => {
      useRecipeStore.getState().setCategory('all')
      expect(useRecipeStore.getState().selectedCategory).toBe('all')
    })
  })

  describe('toggleTag', () => {
    it('should add tag when not selected', () => {
      useRecipeStore.getState().toggleTag('vegetarian')
      expect(useRecipeStore.getState().selectedTags).toContain('vegetarian')
    })

    it('should remove tag when already selected', () => {
      useRecipeStore.setState({ selectedTags: ['vegetarian'] })
      useRecipeStore.getState().toggleTag('vegetarian')
      expect(useRecipeStore.getState().selectedTags).not.toContain('vegetarian')
    })

    it('should handle multiple tags', () => {
      useRecipeStore.getState().toggleTag('vegetarian')
      useRecipeStore.getState().toggleTag('high-protein')
      expect(useRecipeStore.getState().selectedTags).toHaveLength(2)
    })
  })

  describe('setSort', () => {
    it('should update sort configuration', () => {
      useRecipeStore.getState().setSort('calories', 'desc')
      const state = useRecipeStore.getState()
      expect(state.sortBy).toBe('calories')
      expect(state.sortOrder).toBe('desc')
    })
  })

  describe('clearFilters', () => {
    it('should reset all filters to initial state', () => {
      useRecipeStore.setState({
        searchQuery: 'test',
        selectedCategory: RecipeCategory.LUNCH,
        selectedTags: ['vegetarian'],
        sortBy: 'calories',
        sortOrder: 'desc',
      })

      useRecipeStore.getState().clearFilters()
      
      const state = useRecipeStore.getState()
      expect(state.searchQuery).toBe('')
      expect(state.selectedCategory).toBe('all')
      expect(state.selectedTags).toHaveLength(0)
      expect(state.sortBy).toBe('name')
      expect(state.sortOrder).toBe('asc')
    })
  })
})