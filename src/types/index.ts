// Const objects for constant values (erasable syntax compatible)
export const Gender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
} as const

export type Gender = typeof Gender[keyof typeof Gender]

export const ActivityLevel = {
  SEDENTARY: 'sedentary',
  LIGHTLY_ACTIVE: 'lightly_active',
  MODERATELY_ACTIVE: 'moderately_active',
  VERY_ACTIVE: 'very_active',
  EXTREMELY_ACTIVE: 'extremely_active'
} as const

export type ActivityLevel = typeof ActivityLevel[keyof typeof ActivityLevel]

export const RecipeCategory = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack'
} as const

export type RecipeCategory = typeof RecipeCategory[keyof typeof RecipeCategory]

export const MealSlotValue = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack'
} as const

export type MealSlotValue = typeof MealSlotValue[keyof typeof MealSlotValue]

// User Profile Interface
export interface UserProfile {
  id?: number

  // Physical stats
  height: number // cm
  weight: number // kg
  age: number
  gender: Gender
  activityLevel: ActivityLevel

  // Calculated values
  bmi: number
  bmr: number // Basal Metabolic Rate
  tdee: number // Total Daily Energy Expenditure

  // Daily goals
  calorieTarget: number
  proteinTarget: number // grams
  carbsTarget: number // grams
  fatTarget: number // grams

  // Workout goals
  workoutCalorieGoal: number // weekly total
  workoutDaysPerWeek?: number

  // Preferences
  dietaryRestrictions: string[]

  // Timestamps
  createdAt: string // ISO date
  updatedAt: string
}

// Recipe Interfaces
export interface Ingredient {
  name: string
  quantity: number
  unit: string
  calories: number
  protein: number // grams
  carbs: number // grams
  fat: number // grams
  costPerUnit?: number
  barcode?: string
}

export interface Recipe {
  id?: number

  // Basic info
  name: string
  category: RecipeCategory
  servings: number
  prepTime: number // minutes
  cookTime: number // minutes

  // Content
  ingredients: Ingredient[]
  instructions: string[]
  tags: string[]
  tips?: string

  // Calculated per serving
  caloriesPerServing: number
  proteinPerServing: number
  carbsPerServing: number
  fatPerServing: number
  costPerServing?: number

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Pantry Item Interface
export interface PantryItem {
  id?: number

  // Item details
  name: string
  quantity: number
  unit: string
  category: string

  // Optional tracking
  expirationDate?: string // ISO date
  barcode?: string
  costPerUnit?: number
  purchaseDate?: string // ISO date

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Meal Plan Interfaces
export interface MealSlot {
  slot: MealSlotValue
  recipeId: number
  servings: number
}

export interface DayPlan {
  date: string // ISO date
  isWorkoutDay: boolean
  calorieTarget: number
  meals: MealSlot[]

  // Calculated totals
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  estimatedCost?: number
}

export interface MealPlan {
  id?: number

  // Week tracking
  weekStartDate: string // ISO date (Monday)
  days: DayPlan[] // 7 days

  // Summary
  totalWeeklyCost?: number

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Grocery List Interfaces
export interface GroceryItem {
  name: string
  quantity: number
  unit: string
  category: string
  checked: boolean

  // Cost and tracking
  estimatedCost?: number
  barcode?: string
  neededForRecipes?: number[] // Recipe IDs
}

export interface GroceryList {
  id?: number

  // Reference to meal plan
  mealPlanId: number

  // Items
  items: GroceryItem[]

  // Cost tracking
  totalEstimatedCost: number
  actualCost?: number

  // Status tracking
  completedAt?: string // ISO date when shopping completed

  // Timestamps
  createdAt: string
}
