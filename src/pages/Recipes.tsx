import { Search, Clock, Users, Plus } from 'lucide-react'
import { useRecipes } from '@/hooks/useRecipes'
import { useRecipeStore } from '@/stores/recipeStore'
import { RecipeCategory } from '@/types'
import { cn } from '@/lib/utils'

const categories = [
  { value: 'all' as const, label: 'All Recipes' },
  { value: RecipeCategory.BREAKFAST, label: 'Breakfast' },
  { value: RecipeCategory.LUNCH, label: 'Lunch' },
  { value: RecipeCategory.DINNER, label: 'Dinner' },
  { value: RecipeCategory.SNACK, label: 'Snacks' },
]

const filterTags = ['high-protein', 'high-carb', 'quick', 'vegetarian']

function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden animate-pulse">
      <div className="h-44 bg-brand-sage-light" />
      <div className="p-5">
        <div className="h-6 bg-muted rounded w-3/4 mb-4" />
        <div className="h-4 bg-muted rounded w-1/2 mb-3" />
        <div className="h-3 bg-muted rounded w-2/3 mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="h-7 bg-muted rounded-full w-20" />
          <div className="h-7 bg-muted rounded-full w-24" />
        </div>
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-3">
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-20">
      <div
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-brand-sage-light"
      >
        <Search className="w-10 h-10 text-brand-sage" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No recipes found</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We couldn't find any recipes matching your search and filters. Try adjusting your criteria.
      </p>
      <button
        onClick={onClear}
        className="px-6 py-2.5 rounded-lg font-medium transition-all bg-brand-sage text-white"
      >
        Clear all filters
      </button>
    </div>
  )
}

interface RecipeCardProps {
  recipe: {
    id?: number
    name: string
    category: string
    servings: number
    prepTime: number
    cookTime: number
    tags: string[]
    caloriesPerServing: number
    proteinPerServing: number
    carbsPerServing: number
    fatPerServing: number
  }
  onClick?: () => void
}

function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
    >
      {/* Recipe Image Placeholder - Sage gradient */}
      <div
        className="h-44 flex items-center justify-center bg-gradient-to-br from-brand-sage-light to-brand-sage-muted"
      >
        <svg
          className="w-16 h-16 text-brand-sage opacity-60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="text-lg font-semibold text-foreground leading-tight">{recipe.name}</h3>
          <span className="shrink-0 px-3 py-1 rounded-lg text-xs font-medium capitalize bg-brand-cream text-muted-foreground border border-border">
            {recipe.category}
          </span>
        </div>

        {/* Nutrition Summary */}
        <div className="flex items-center gap-3 text-sm mb-3">
          <span className="font-semibold text-foreground">{recipe.caloriesPerServing} cal</span>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-muted-foreground">{recipe.proteinPerServing}g protein</span>
        </div>

        {/* Time & Servings */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-muted-foreground/60" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-muted-foreground/60" />
            <span>{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground bg-brand-paper capitalize"
              >
                {tag.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Macro Distribution */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-muted-foreground/60 mb-1">Protein</div>
              <div className="text-base font-semibold text-foreground">{recipe.proteinPerServing}g</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground/60 mb-1">Carbs</div>
              <div className="text-base font-semibold text-foreground">{recipe.carbsPerServing}g</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground/60 mb-1">Fat</div>
              <div className="text-base font-semibold text-foreground">{recipe.fatPerServing}g</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Recipes() {
  const { filteredRecipes, isLoading } = useRecipes()
  const {
    searchQuery,
    selectedCategory,
    selectedTags,
    setSearchQuery,
    setCategory,
    toggleTag,
    clearFilters,
  } = useRecipeStore()

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedTags.length > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Recipes</h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Loading...' : `${filteredRecipes.length} recipes available`}
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white transition-all hover:opacity-90 bg-brand-sage"
            onClick={() => console.log('Add recipe')}
          >
            <Plus className="w-5 h-5" />
            <span>Add Recipe</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search recipes by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-border rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-sage/20 focus:border-transparent transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  'px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                  isActive
                    ? 'bg-brand-sage text-white shadow-sm'
                    : 'bg-white border border-border text-muted-foreground hover:bg-brand-cream hover:text-foreground'
                )}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">Filter by:</span>
          <div className="flex flex-wrap gap-2">
            {filterTags.map((tag) => {
              const isActive = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all',
                    isActive
                      ? 'bg-brand-sage text-white'
                      : 'bg-white border border-border text-muted-foreground hover:bg-brand-cream'
                  )}
                >
                  {tag.replace(/-/g, ' ')}
                </button>
              )
            })}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-sm font-medium transition-colors hover:opacity-80 text-brand-sage"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredRecipes.length === 0 && (
          <EmptyState onClear={clearFilters} />
        )}

        {/* Recipe Cards */}
        {!isLoading && filteredRecipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => console.log('Navigate to recipe:', recipe.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}