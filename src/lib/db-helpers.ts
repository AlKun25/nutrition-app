import { db } from './db'
import type {
  UserProfile,
  Recipe,
  PantryItem,
  MealPlan,
  GroceryList,
  RecipeCategory
} from '@/types'

// ============================================
// USER PROFILE HELPERS
// ============================================

export async function getUserProfile(): Promise<UserProfile | undefined> {
  return db.userProfile.toCollection().first()
}

export async function createOrUpdateUserProfile(
  profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>
): Promise<number> {
  const existing = await getUserProfile()

  if (existing?.id) {
    await db.userProfile.update(existing.id, {
      ...profile,
      updatedAt: new Date().toISOString()
    })
    return existing.id
  }

  return (await db.userProfile.add({
    ...profile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })) as number
}

// ============================================
// RECIPE HELPERS
// ============================================

export async function getAllRecipes(): Promise<Recipe[]> {
  return db.recipes.toArray()
}

export async function getRecipeById(id: number): Promise<Recipe | undefined> {
  return db.recipes.get(id)
}

export async function getRecipesByCategory(
  category: RecipeCategory
): Promise<Recipe[]> {
  return db.recipes.where('category').equals(category).toArray()
}

export async function getRecipesByTags(tags: string[]): Promise<Recipe[]> {
  return db.recipes.where('tags').anyOf(tags).toArray()
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const lowerQuery = query.toLowerCase()
  return db.recipes
    .filter(recipe =>
      recipe.name.toLowerCase().includes(lowerQuery) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
    .toArray()
}

export async function createRecipe(
  recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>
): Promise<number> {
  return (await db.recipes.add({
    ...recipe,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })) as number
}

export async function updateRecipe(
  id: number,
  updates: Partial<Omit<Recipe, 'id' | 'createdAt'>>
): Promise<void> {
  await db.recipes.update(id, {
    ...updates,
    updatedAt: new Date().toISOString()
  })
}

export async function deleteRecipe(id: number): Promise<void> {
  await db.recipes.delete(id)
}

// ============================================
// PANTRY HELPERS
// ============================================

export async function getAllPantryItems(): Promise<PantryItem[]> {
  return db.pantryItems.toArray()
}

export async function getPantryItemsByCategory(
  category: string
): Promise<PantryItem[]> {
  return db.pantryItems.where('category').equals(category).toArray()
}

export async function getExpiringPantryItems(
  daysAhead: number = 7
): Promise<PantryItem[]> {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + daysAhead)
  const futureDateStr = futureDate.toISOString()

  return db.pantryItems
    .where('expirationDate')
    .below(futureDateStr)
    .toArray()
}

export async function getPantryItemByBarcode(
  barcode: string
): Promise<PantryItem | undefined> {
  return db.pantryItems.where('barcode').equals(barcode).first()
}

export async function createPantryItem(
  item: Omit<PantryItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<number> {
  return (await db.pantryItems.add({
    ...item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })) as number
}

export async function updatePantryItem(
  id: number,
  updates: Partial<Omit<PantryItem, 'id' | 'createdAt'>>
): Promise<void> {
  await db.pantryItems.update(id, {
    ...updates,
    updatedAt: new Date().toISOString()
  })
}

export async function deletePantryItem(id: number): Promise<void> {
  await db.pantryItems.delete(id)
}

export async function updatePantryQuantity(
  id: number,
  newQuantity: number
): Promise<void> {
  await db.pantryItems.update(id, {
    quantity: newQuantity,
    updatedAt: new Date().toISOString()
  })
}

// ============================================
// MEAL PLAN HELPERS
// ============================================

export async function getAllMealPlans(): Promise<MealPlan[]> {
  return db.mealPlans.orderBy('weekStartDate').reverse().toArray()
}

export async function getMealPlanById(id: number): Promise<MealPlan | undefined> {
  return db.mealPlans.get(id)
}

export async function getMealPlanByWeekStart(
  weekStartDate: string
): Promise<MealPlan | undefined> {
  return db.mealPlans.where('weekStartDate').equals(weekStartDate).first()
}

export async function getCurrentMealPlan(): Promise<MealPlan | undefined> {
  return db.mealPlans.orderBy('weekStartDate').reverse().first()
}

export async function createMealPlan(
  mealPlan: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>
): Promise<number> {
  return (await db.mealPlans.add({
    ...mealPlan,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })) as number
}

export async function updateMealPlan(
  id: number,
  updates: Partial<Omit<MealPlan, 'id' | 'createdAt'>>
): Promise<void> {
  await db.mealPlans.update(id, {
    ...updates,
    updatedAt: new Date().toISOString()
  })
}

export async function deleteMealPlan(id: number): Promise<void> {
  await db.mealPlans.delete(id)
}

// ============================================
// GROCERY LIST HELPERS
// ============================================

export async function getAllGroceryLists(): Promise<GroceryList[]> {
  return db.groceryLists.orderBy('createdAt').reverse().toArray()
}

export async function getGroceryListById(
  id: number
): Promise<GroceryList | undefined> {
  return db.groceryLists.get(id)
}

export async function getGroceryListByMealPlan(
  mealPlanId: number
): Promise<GroceryList | undefined> {
  return db.groceryLists.where('mealPlanId').equals(mealPlanId).first()
}

export async function getActiveGroceryLists(): Promise<GroceryList[]> {
  return db.groceryLists
    .filter(list => !list.completedAt)
    .toArray()
}

export async function createGroceryList(
  list: Omit<GroceryList, 'id' | 'createdAt'>
): Promise<number> {
  return (await db.groceryLists.add({
    ...list,
    createdAt: new Date().toISOString()
  })) as number
}

export async function updateGroceryList(
  id: number,
  updates: Partial<Omit<GroceryList, 'id' | 'createdAt'>>
): Promise<void> {
  await db.groceryLists.update(id, updates)
}

export async function markGroceryListComplete(
  id: number,
  actualCost?: number
): Promise<void> {
  await db.groceryLists.update(id, {
    completedAt: new Date().toISOString(),
    actualCost
  })
}

export async function deleteGroceryList(id: number): Promise<void> {
  await db.groceryLists.delete(id)
}

// ============================================
// BULK OPERATIONS
// ============================================

export async function bulkCreateRecipes(
  recipes: Omit<Recipe, 'id'>[]
): Promise<void> {
  await db.recipes.bulkAdd(recipes)
}

export async function bulkCreatePantryItems(
  items: Omit<PantryItem, 'id'>[]
): Promise<void> {
  await db.pantryItems.bulkAdd(items)
}

// ============================================
// DATABASE UTILITIES
// ============================================

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map(table => table.clear()))
  })
}

export async function exportDatabaseToJSON(): Promise<string> {
  const data = {
    userProfile: await db.userProfile.toArray(),
    recipes: await db.recipes.toArray(),
    pantryItems: await db.pantryItems.toArray(),
    mealPlans: await db.mealPlans.toArray(),
    groceryLists: await db.groceryLists.toArray(),
    exportedAt: new Date().toISOString()
  }

  return JSON.stringify(data, null, 2)
}
