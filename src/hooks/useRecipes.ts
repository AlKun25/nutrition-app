import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { useRecipeStore } from '@/stores/recipeStore'
import type { Recipe, RecipeCategory } from '@/types'

interface UseRecipesResult {
  recipes: Recipe[]
  filteredRecipes: Recipe[]
  isLoading: boolean
  allTags: string[]
}

export function useRecipes(): UseRecipesResult {
  const { searchQuery, selectedCategory, selectedTags, sortBy, sortOrder } = useRecipeStore()

  // Fetch all recipes with live updates from IndexedDB
  const recipes = useLiveQuery(
    () => db.recipes.toArray(),
    []
  )

  const isLoading = recipes === undefined

  // Extract all unique tags from recipes
  const allTags = recipes
    ? [...new Set(recipes.flatMap((r) => r.tags))].sort()
    : []

  // Apply filters and sorting
  const filteredRecipes = (recipes ?? [])
    .filter((recipe) => {
      // Category filter
      if (selectedCategory !== 'all' && recipe.category !== selectedCategory) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = recipe.name.toLowerCase().includes(query)
        const matchesTags = recipe.tags.some((tag) => tag.toLowerCase().includes(query))
        if (!matchesName && !matchesTags) {
          return false
        }
      }

      // Tag filter - must have ALL selected tags
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((tag) => recipe.tags.includes(tag))
        if (!hasAllTags) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'calories':
          comparison = a.caloriesPerServing - b.caloriesPerServing
          break
        case 'protein':
          comparison = a.proteinPerServing - b.proteinPerServing
          break
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

  return {
    recipes: recipes ?? [],
    filteredRecipes,
    isLoading,
    allTags,
  }
}

export function useRecipeById(id: number | undefined): Recipe | undefined {
  return useLiveQuery(
    () => (id ? db.recipes.get(id) : undefined),
    [id]
  )
}

export function useRecipesByCategory(category: RecipeCategory): Recipe[] {
  const recipes = useLiveQuery(
    () => db.recipes.where('category').equals(category).toArray(),
    [category]
  )
  return recipes ?? []
}