import { describe, it, expect, beforeEach } from 'vitest'
declare const require: (id: string) => any
import { db } from './db'
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getRecipesByCategory,
  getRecipesByTags,
  searchRecipes,
  updateRecipe,
  deleteRecipe,
  createPantryItem,
  getAllPantryItems,
  getPantryItemsByCategory,
  getExpiringPantryItems,
  getPantryItemByBarcode,
  updatePantryQuantity,
  deletePantryItem,
  createMealPlan,
  getAllMealPlans,
  getMealPlanById,
  getMealPlanByWeekStart,
  getCurrentMealPlan,
  updateMealPlan,
  deleteMealPlan,
  createGroceryList,
  getAllGroceryLists,
  getGroceryListById,
  getGroceryListByMealPlan,
  getActiveGroceryLists,
  markGroceryListComplete,
  deleteGroceryList,
  getUserProfile,
  createOrUpdateUserProfile,
  bulkCreateRecipes,
  bulkCreatePantryItems,
  clearAllData
} from './db-helpers'
import {
  RecipeCategory,
  Gender,
  ActivityLevel,
  type Recipe,
  type PantryItem,
  type MealPlan,
  type DayPlan
} from '@/types'

describe('Database Helpers', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  // ============================================
  // USER PROFILE TESTS
  // ============================================

  describe('UserProfile Helpers', () => {
    it('should create a new user profile', async () => {
      const profileId = await createOrUpdateUserProfile({
        height: 180,
        weight: 75,
        age: 30,
        gender: Gender.MALE,
        activityLevel: ActivityLevel.MODERATELY_ACTIVE,
        bmi: 23.1,
        bmr: 1700,
        tdee: 2380,
        calorieTarget: 2000,
        proteinTarget: 150,
        carbsTarget: 250,
        fatTarget: 67,
        workoutCalorieGoal: 2500,
        workoutDaysPerWeek: 4,
        dietaryRestrictions: []
      })

      expect(profileId).toBeDefined()
      const profile = await getUserProfile()
      expect(profile).toBeDefined()
      expect(profile?.height).toBe(180)
    })

    it('should update existing user profile', async () => {
      await createOrUpdateUserProfile({
        height: 180,
        weight: 75,
        age: 30,
        gender: Gender.MALE,
        activityLevel: ActivityLevel.MODERATELY_ACTIVE,
        bmi: 23.1,
        bmr: 1700,
        tdee: 2380,
        calorieTarget: 2000,
        proteinTarget: 150,
        carbsTarget: 250,
        fatTarget: 67,
        workoutCalorieGoal: 2500,
        workoutDaysPerWeek: 4,
        dietaryRestrictions: []
      })

      const updatedId = await createOrUpdateUserProfile({
        height: 180,
        weight: 80,
        age: 30,
        gender: Gender.MALE,
        activityLevel: ActivityLevel.MODERATELY_ACTIVE,
        bmi: 24.7,
        bmr: 1750,
        tdee: 2450,
        calorieTarget: 2100,
        proteinTarget: 160,
        carbsTarget: 263,
        fatTarget: 70,
        workoutCalorieGoal: 2500,
        workoutDaysPerWeek: 4,
        dietaryRestrictions: []
      })

      const profile = await getUserProfile()
      expect(profile?.weight).toBe(80)
      expect(profile?.id).toBe(updatedId)
    })

    it('should auto-generate timestamps on create', async () => {
      await createOrUpdateUserProfile({
        height: 180,
        weight: 75,
        age: 30,
        gender: Gender.MALE,
        activityLevel: ActivityLevel.MODERATELY_ACTIVE,
        bmi: 23.1,
        bmr: 1700,
        tdee: 2380,
        calorieTarget: 2000,
        proteinTarget: 150,
        carbsTarget: 250,
        fatTarget: 67,
        workoutCalorieGoal: 2500,
        workoutDaysPerWeek: 4,
        dietaryRestrictions: []
      })

      const profile = await getUserProfile()
      expect(profile?.createdAt).toBeDefined()
      expect(profile?.updatedAt).toBeDefined()
    })
  })

  // ============================================
  // RECIPE TESTS
  // ============================================

  describe('Recipe Helpers', () => {
    const sampleRecipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'Vegetable Salad',
      category: RecipeCategory.LUNCH,
      servings: 2,
      prepTime: 10,
      cookTime: 0,
      ingredients: [
        {
          name: 'Lettuce',
          quantity: 100,
          unit: 'g',
          calories: 15,
          protein: 1,
          carbs: 3,
          fat: 0
        }
      ],
      instructions: ['Mix all ingredients'],
      tags: ['vegetarian', 'healthy'],
      caloriesPerServing: 100,
      proteinPerServing: 5,
      carbsPerServing: 10,
      fatPerServing: 3,
      costPerServing: 2.50
    }

    it('should create a recipe', async () => {
      const recipeId = await createRecipe(sampleRecipe)
      expect(recipeId).toBeDefined()

      const recipe = await getRecipeById(recipeId)
      expect(recipe).toBeDefined()
      expect(recipe?.name).toBe('Vegetable Salad')
    })

    it('should get all recipes', async () => {
      await createRecipe(sampleRecipe)
      await createRecipe({
        ...sampleRecipe,
        name: 'Fruit Smoothie',
        category: RecipeCategory.BREAKFAST
      })

      const recipes = await getAllRecipes()
      expect(recipes).toHaveLength(2)
    })

    it('should filter recipes by category', async () => {
      await createRecipe(sampleRecipe)
      await createRecipe({
        ...sampleRecipe,
        name: 'Oatmeal',
        category: RecipeCategory.BREAKFAST
      })

      const breakfastRecipes = await getRecipesByCategory(RecipeCategory.BREAKFAST)
      expect(breakfastRecipes).toHaveLength(1)
      expect(breakfastRecipes[0].name).toBe('Oatmeal')
    })

    it('should filter recipes by tags', async () => {
      await createRecipe(sampleRecipe)
      await createRecipe({
        ...sampleRecipe,
        name: 'Chicken Dish',
        tags: ['high-protein']
      })

      const healthyRecipes = await getRecipesByTags(['healthy'])
      expect(healthyRecipes).toHaveLength(1)
      expect(healthyRecipes[0].name).toBe('Vegetable Salad')
    })

    it('should search recipes by name and tags', async () => {
      await createRecipe(sampleRecipe)
      await createRecipe({
        ...sampleRecipe,
        name: 'Fruit Smoothie',
        tags: ['quick']
      })

      const results = await searchRecipes('Salad')
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Vegetable Salad')

      const quickResults = await searchRecipes('quick')
      expect(quickResults).toHaveLength(1)
      expect(quickResults[0].name).toBe('Fruit Smoothie')
    })

    it('should update a recipe', async () => {
      const recipeId = await createRecipe(sampleRecipe)
      await updateRecipe(recipeId, {
        name: 'Updated Salad',
        caloriesPerServing: 150
      })

      const recipe = await getRecipeById(recipeId)
      expect(recipe?.name).toBe('Updated Salad')
      expect(recipe?.caloriesPerServing).toBe(150)
    })

    it('should delete a recipe', async () => {
      const recipeId = await createRecipe(sampleRecipe)
      await deleteRecipe(recipeId)

      const recipe = await getRecipeById(recipeId)
      expect(recipe).toBeUndefined()
    })

    it('should auto-generate timestamps', async () => {
      const recipeId = await createRecipe(sampleRecipe)
      const recipe = await getRecipeById(recipeId)

      expect(recipe?.createdAt).toBeDefined()
      expect(recipe?.updatedAt).toBeDefined()
    })

    it('should update the updatedAt timestamp on update', async () => {
      const recipeId = await createRecipe(sampleRecipe)
      const originalRecipe = await getRecipeById(recipeId)
      const originalUpdatedAt = originalRecipe?.updatedAt

      // Wait a bit to ensure timestamp differs
      await new Promise(resolve => setTimeout(resolve, 10))

      await updateRecipe(recipeId, { name: 'New Name' })
      const updatedRecipe = await getRecipeById(recipeId)

      expect(updatedRecipe?.updatedAt).not.toBe(originalUpdatedAt)
    })
  })

  // ============================================
  // PANTRY ITEM TESTS
  // ============================================

  describe('PantryItem Helpers', () => {
    const samplePantryItem: Omit<PantryItem, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'Flour',
      quantity: 500,
      unit: 'g',
      category: 'grain',
      costPerUnit: 0.01
    }

    it('should create a pantry item', async () => {
      const itemId = await createPantryItem(samplePantryItem)
      expect(itemId).toBeDefined()

      const item = await getAllPantryItems()
      expect(item).toHaveLength(1)
    })

    it('should filter pantry items by category', async () => {
      await createPantryItem(samplePantryItem)
      await createPantryItem({
        ...samplePantryItem,
        name: 'Milk',
        category: 'dairy'
      })

      const grainItems = await getPantryItemsByCategory('grain')
      expect(grainItems).toHaveLength(1)
      expect(grainItems[0].name).toBe('Flour')
    })

    it('should find expiring pantry items', async () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      const nextMonth = new Date()
      nextMonth.setDate(nextMonth.getDate() + 30)

      await createPantryItem({
        ...samplePantryItem,
        name: 'Milk',
        expirationDate: tomorrow.toISOString()
      })

      await createPantryItem({
        ...samplePantryItem,
        name: 'Cheese',
        expirationDate: nextMonth.toISOString()
      })

      const expiringItems = await getExpiringPantryItems(7)
      expect(expiringItems).toHaveLength(1)
      expect(expiringItems[0].name).toBe('Milk')
    })

    it('should find item by barcode', async () => {
      await createPantryItem({
        ...samplePantryItem,
        barcode: '123456789'
      })

      const item = await getPantryItemByBarcode('123456789')
      expect(item).toBeDefined()
      expect(item?.name).toBe('Flour')
    })

    it('should update pantry quantity', async () => {
      const itemId = await createPantryItem(samplePantryItem)
      await updatePantryQuantity(itemId, 250)

      const items = await getAllPantryItems()
      expect(items[0].quantity).toBe(250)
    })

    it('should delete pantry item', async () => {
      const itemId = await createPantryItem(samplePantryItem)
      await deletePantryItem(itemId)

      const items = await getAllPantryItems()
      expect(items).toHaveLength(0)
    })
  })

  // ============================================
  // MEAL PLAN TESTS
  // ============================================

  describe('MealPlan Helpers', () => {
    const baseDayPlan: DayPlan = {
      date: new Date().toISOString(),
      isWorkoutDay: false,
      calorieTarget: 2000,
      meals: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0
    }

    const sampleMealPlan: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'> = {
      weekStartDate: new Date().toISOString(),
      days: [baseDayPlan]
    }

    it('should create a meal plan', async () => {
      const planId = await createMealPlan(sampleMealPlan)
      expect(planId).toBeDefined()

      const plan = await getMealPlanById(planId)
      expect(plan).toBeDefined()
    })

    it('should get all meal plans', async () => {
      await createMealPlan(sampleMealPlan)

      const nextWeekStart = new Date()
      nextWeekStart.setDate(nextWeekStart.getDate() + 7)

      await createMealPlan({
        ...sampleMealPlan,
        weekStartDate: nextWeekStart.toISOString()
      })

      const plans = await getAllMealPlans()
      expect(plans).toHaveLength(2)
    })

    it('should get meal plan by week start date', async () => {
      const weekStart = new Date().toISOString()
      await createMealPlan({
        ...sampleMealPlan,
        weekStartDate: weekStart
      })

      const plan = await getMealPlanByWeekStart(weekStart)
      expect(plan).toBeDefined()
      expect(plan?.weekStartDate).toBe(weekStart)
    })

    it('should get current (most recent) meal plan', async () => {
      const oldDate = new Date()
      oldDate.setDate(oldDate.getDate() - 7)

      await createMealPlan({
        ...sampleMealPlan,
        weekStartDate: oldDate.toISOString()
      })

      await createMealPlan(sampleMealPlan)

      const current = await getCurrentMealPlan()
      expect(current?.weekStartDate).toBe(sampleMealPlan.weekStartDate)
    })

    it('should update a meal plan', async () => {
      const planId = await createMealPlan(sampleMealPlan)
      await updateMealPlan(planId, {
        totalWeeklyCost: 50
      })

      const plan = await getMealPlanById(planId)
      expect(plan?.totalWeeklyCost).toBe(50)
    })

    it('should delete a meal plan', async () => {
      const planId = await createMealPlan(sampleMealPlan)
      await deleteMealPlan(planId)

      const plan = await getMealPlanById(planId)
      expect(plan).toBeUndefined()
    })
  })

  // ============================================
  // GROCERY LIST TESTS
  // ============================================

  describe('GroceryList Helpers', () => {
    it('should create a grocery list', async () => {
      const listId = await createGroceryList({
        mealPlanId: 1,
        items: [],
        totalEstimatedCost: 50
      })

      expect(listId).toBeDefined()
      const list = await getGroceryListById(listId)
      expect(list?.mealPlanId).toBe(1)
    })

    it('should get all grocery lists', async () => {
      await createGroceryList({
        mealPlanId: 1,
        items: [],
        totalEstimatedCost: 50
      })

      await createGroceryList({
        mealPlanId: 2,
        items: [],
        totalEstimatedCost: 40
      })

      const lists = await getAllGroceryLists()
      expect(lists).toHaveLength(2)
    })

    it('should get grocery list by meal plan ID', async () => {
      const listId = await createGroceryList({
        mealPlanId: 1,
        items: [],
        totalEstimatedCost: 50
      })

      const list = await getGroceryListByMealPlan(1)
      expect(list?.id).toBe(listId)
    })

    it('should get active grocery lists', async () => {
      const listId1 = await createGroceryList({
        mealPlanId: 1,
        items: [],
        totalEstimatedCost: 50
      })

      const listId2 = await createGroceryList({
        mealPlanId: 2,
        items: [],
        totalEstimatedCost: 40
      })

      await markGroceryListComplete(listId1)

      const activeLists = await getActiveGroceryLists()
      expect(activeLists).toHaveLength(1)
      expect(activeLists[0].id).toBe(listId2)
    })

    it('should mark grocery list as complete', async () => {
      const listId = await createGroceryList({
        mealPlanId: 1,
        items: [],
        totalEstimatedCost: 50
      })

      await markGroceryListComplete(listId, 52)

      const list = await getGroceryListById(listId)
      expect(list?.completedAt).toBeDefined()
      expect(list?.actualCost).toBe(52)
    })

    it('should delete a grocery list', async () => {
      const listId = await createGroceryList({
        mealPlanId: 1,
        items: [],
        totalEstimatedCost: 50
      })

      await deleteGroceryList(listId)

      const list = await getGroceryListById(listId)
      expect(list).toBeUndefined()
    })
  })

  // ============================================
  // BULK OPERATIONS TESTS
  // ============================================

  describe('Bulk Operations', () => {
    it('should bulk create recipes', async () => {
      const recipes: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          name: 'Recipe 1',
          category: RecipeCategory.BREAKFAST,
          servings: 1,
          prepTime: 5,
          cookTime: 0,
          ingredients: [],
          instructions: [],
          tags: [],
          caloriesPerServing: 100,
          proteinPerServing: 5,
          carbsPerServing: 10,
          fatPerServing: 3
        },
        {
          name: 'Recipe 2',
          category: RecipeCategory.LUNCH,
          servings: 2,
          prepTime: 10,
          cookTime: 15,
          ingredients: [],
          instructions: [],
          tags: [],
          caloriesPerServing: 500,
          proteinPerServing: 25,
          carbsPerServing: 50,
          fatPerServing: 15
        }
      ]

      await bulkCreateRecipes(
        recipes.map(r => ({
          ...r,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }))
      )
      const allRecipes = await getAllRecipes()
      expect(allRecipes).toHaveLength(2)
    })

    it('should bulk create pantry items', async () => {
      const items: Omit<PantryItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          name: 'Item 1',
          quantity: 100,
          unit: 'g',
          category: 'grain'
        },
        {
          name: 'Item 2',
          quantity: 500,
          unit: 'ml',
          category: 'liquid'
        }
      ]

      await bulkCreatePantryItems(
        items.map(i => ({
          ...i,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }))
      )
      const allItems = await getAllPantryItems()
      expect(allItems).toHaveLength(2)
    })
  })

  // ============================================
  // DATABASE UTILITIES TESTS
  // ============================================

  describe('Database Utilities', () => {
    it('should clear all data', async () => {
      const recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Test',
        category: RecipeCategory.BREAKFAST,
        servings: 1,
        prepTime: 5,
        cookTime: 0,
        ingredients: [],
        instructions: [],
        tags: [],
        caloriesPerServing: 100,
        proteinPerServing: 5,
        carbsPerServing: 10,
        fatPerServing: 3,
        costPerServing: 0
      }
      await createRecipe(recipe)

      await createPantryItem({
        name: 'Item',
        quantity: 100,
        unit: 'g',
        category: 'test'
      })

      let recipes = await getAllRecipes()
      let items = await getAllPantryItems()
      expect(recipes).toHaveLength(1)
      expect(items).toHaveLength(1)

      await clearAllData()

      recipes = await getAllRecipes()
      items = await getAllPantryItems()
      expect(recipes).toHaveLength(0)
      expect(items).toHaveLength(0)
    })
  })
})
