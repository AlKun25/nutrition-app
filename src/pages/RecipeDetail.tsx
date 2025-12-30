import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Clock, Flame, Users, Printer, Edit, Trash2, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import { useRecipeById } from '@/hooks/useRecipes'
import { deleteRecipe } from '@/lib/db-helpers'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-sage-light mb-4 animate-pulse">
          <svg className="w-8 h-8 text-brand-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <p className="text-muted-foreground">Loading recipe...</p>
      </div>
    </div>
  )
}

function NotFoundState() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive-light mb-6">
          <svg className="w-10 h-10 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Recipe Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The recipe you're looking for doesn't exist or may have been deleted.
        </p>
        <Button onClick={() => navigate('/recipes')} className="bg-brand-sage hover:opacity-90">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Recipes
        </Button>
      </div>
    </div>
  )
}

export default function RecipeDetail() {
  const { recipeId } = useParams<{ recipeId: string }>()
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const id = recipeId ? parseInt(recipeId) : undefined
  const recipe = useRecipeById(id)

  if (recipe === undefined) return <LoadingState />
  if (!recipe) return <NotFoundState />

  const totalMacros = recipe.proteinPerServing + recipe.carbsPerServing + recipe.fatPerServing
  const proteinPercent = (recipe.proteinPerServing / totalMacros) * 100
  const carbsPercent = (recipe.carbsPerServing / totalMacros) * 100
  const fatPercent = (recipe.fatPerServing / totalMacros) * 100

  const handleDelete = async () => {
    if (!recipe.id) return
    const recipeName = recipe.name
    await deleteRecipe(recipe.id)
    setShowDeleteDialog(false)
    toast.success(`Recipe "${recipeName}" deleted successfully`)
    navigate('/recipes')
  }

  const handlePrint = () => window.print()
  const handleEdit = () => navigate(`/recipes/${recipe.id}/edit`)

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Navigation */}
      <div className="bg-card border-b border-border sticky top-0 z-20 shadow-soft print-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/recipes')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-brand-cream transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back to Recipes</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-brand-cream transition-all"
              title="Print Recipe"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 recipe-content">
        {/* Hero Section */}
        <div className="animate-fade-in mb-8">
          {/* Recipe Image */}
          <div className="h-64 sm:h-80 lg:h-96 bg-brand-sage-light rounded-xl mb-6 flex items-center justify-center overflow-hidden shadow-soft-md">
            <svg className="w-24 h-24 text-brand-sage/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>

          {/* Title & Meta */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{recipe.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <Badge className="px-3 py-1 rounded-md bg-brand-cream text-muted-foreground font-medium capitalize border border-border">
                    {recipe.category}
                  </Badge>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Prep: {recipe.prepTime} min</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    <span>Cook: {recipe.cookTime} min</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 print-hidden">
                <Button
                  onClick={handleEdit}
                  variant="secondary"
                  className="bg-brand-cream hover:bg-muted shadow-soft hover:shadow-soft-md"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  className="shadow-soft hover:shadow-soft-md"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Tags */}
            {recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-md text-xs font-medium border border-border text-muted-foreground capitalize"
                  >
                    {tag.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Ingredients & Nutrition */}
          <div className="lg:col-span-1 space-y-6">
            {/* Nutrition Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-soft animate-slide-in">
              <h2 className="text-lg font-semibold text-foreground mb-4">Nutrition Facts</h2>
              <div className="space-y-4">
                {/* Calories */}
                <div className="pb-4 border-b border-border">
                  <div className="text-sm text-muted-foreground mb-1">Calories per serving</div>
                  <div className="text-3xl font-bold text-foreground">
                    {recipe.caloriesPerServing}
                    <span className="text-lg text-muted-foreground ml-1">kcal</span>
                  </div>
                </div>

                {/* Macros */}
                <div className="space-y-3">
                  {/* Protein */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Protein</span>
                    <span className="text-sm font-semibold text-foreground">
                      {recipe.proteinPerServing}g
                    </span>
                  </div>
                  <div className="h-2 bg-brand-cream rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full transition-all duration-500"
                      style={{ width: `${proteinPercent}%` }}
                    />
                  </div>

                  {/* Carbs */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Carbohydrates</span>
                    <span className="text-sm font-semibold text-foreground">
                      {recipe.carbsPerServing}g
                    </span>
                  </div>
                  <div className="h-2 bg-brand-cream rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${carbsPercent}%` }}
                    />
                  </div>

                  {/* Fat */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Fat</span>
                    <span className="text-sm font-semibold text-foreground">
                      {recipe.fatPerServing}g
                    </span>
                  </div>
                  <div className="h-2 bg-brand-cream rounded-full overflow-hidden">
                    <div
                      className="h-full bg-warning rounded-full transition-all duration-500"
                      style={{ width: `${fatPercent}%` }}
                    />
                  </div>
                </div>

                {/* Cost */}
                {recipe.costPerServing && (
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Cost per serving</span>
                      <span className="text-lg font-bold text-brand-sage">
                        ${recipe.costPerServing.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-soft animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Ingredients</h2>
                <span className="text-xs text-muted-foreground">
                  {recipe.ingredients.length} items
                </span>
              </div>

              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg hover:bg-brand-cream transition-colors"
                  >
                    <div className="text-sm font-medium text-foreground">
                      {ingredient.quantity} {ingredient.unit} {ingredient.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-soft animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-semibold text-foreground mb-6">Instructions</h2>

              <div className="space-y-6">
                {recipe.instructions.map((step, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-brand-sage-light flex items-center justify-center shadow-soft">
                        <span className="text-lg font-bold text-brand-sage">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-base text-foreground leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips Section */}
              {recipe.tips && (
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-brand-sage" />
                    Pro Tips
                  </h3>
                  <div className="bg-success-light border border-success/20 rounded-lg p-4">
                    <p className="text-sm text-foreground leading-relaxed">{recipe.tips}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white border-border shadow-soft-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Recipe?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{recipe.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-2 border-border hover:bg-brand-cream">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-white hover:opacity-90"
              style={{ backgroundColor: '#c77070' }}
            >
              Delete Recipe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
