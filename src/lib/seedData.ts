import { db } from './db'
import { bulkCreateRecipes, bulkCreatePantryItems, createOrUpdateUserProfile } from './db-helpers'
import type { Recipe, PantryItem } from '@/types'
import { RecipeCategory as RC } from '@/types'

const now = new Date().toISOString()

function createSeedRecipes(): Omit<Recipe, 'id'>[] {
  return [
    // BREAKFAST (4 recipes)
    {
      name: 'Classic Oatmeal with Banana & Almonds',
      category: RC.BREAKFAST,
      servings: 1,
      prepTime: 5,
      cookTime: 5,
      ingredients: [
        { name: 'Rolled Oats', quantity: 50, unit: 'g', calories: 185, protein: 6.5, carbs: 33, fat: 3.5 },
        { name: 'Banana', quantity: 1, unit: 'medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
        { name: 'Almonds', quantity: 15, unit: 'g', calories: 87, protein: 3.2, carbs: 3.2, fat: 7.5 },
        { name: 'Milk', quantity: 240, unit: 'ml', calories: 122, protein: 8, carbs: 12, fat: 5 }
      ],
      instructions: ['Cook oats in milk over medium heat for 5 minutes', 'Slice banana and add to oatmeal', 'Top with almonds'],
      tags: ['vegetarian', 'quick', 'high-fiber'],
      caloriesPerServing: 380,
      proteinPerServing: 14,
      carbsPerServing: 55,
      fatPerServing: 12,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Scrambled Eggs with Toast',
      category: RC.BREAKFAST,
      servings: 1,
      prepTime: 3,
      cookTime: 5,
      ingredients: [
        { name: 'Eggs', quantity: 2, unit: 'large', calories: 140, protein: 12, carbs: 1, fat: 10 },
        { name: 'Whole Wheat Bread', quantity: 2, unit: 'slices', calories: 160, protein: 8, carbs: 28, fat: 3 },
        { name: 'Butter', quantity: 10, unit: 'g', calories: 72, protein: 0.1, carbs: 0, fat: 8 }
      ],
      instructions: ['Scramble eggs in butter over medium heat', 'Toast bread slices', 'Serve together'],
      tags: ['vegetarian', 'high-protein', 'quick'],
      caloriesPerServing: 350,
      proteinPerServing: 18,
      carbsPerServing: 30,
      fatPerServing: 18,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Greek Yogurt Parfait',
      category: RC.BREAKFAST,
      servings: 1,
      prepTime: 5,
      cookTime: 0,
      ingredients: [
        { name: 'Greek Yogurt', quantity: 200, unit: 'g', calories: 130, protein: 20, carbs: 6, fat: 0 },
        { name: 'Mixed Berries', quantity: 100, unit: 'g', calories: 57, protein: 0.7, carbs: 14, fat: 0.3 },
        { name: 'Granola', quantity: 30, unit: 'g', calories: 120, protein: 3, carbs: 20, fat: 4 },
        { name: 'Honey', quantity: 1, unit: 'tbsp', calories: 64, protein: 0.1, carbs: 17, fat: 0 }
      ],
      instructions: ['Layer yogurt in a bowl', 'Add berries', 'Top with granola and honey'],
      tags: ['vegetarian', 'high-protein', 'no-cook'],
      caloriesPerServing: 320,
      proteinPerServing: 20,
      carbsPerServing: 45,
      fatPerServing: 6,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Protein Smoothie Bowl',
      category: RC.BREAKFAST,
      servings: 1,
      prepTime: 5,
      cookTime: 0,
      ingredients: [
        { name: 'Protein Powder', quantity: 30, unit: 'g', calories: 120, protein: 25, carbs: 3, fat: 1 },
        { name: 'Banana', quantity: 1, unit: 'medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
        { name: 'Almond Milk', quantity: 150, unit: 'ml', calories: 22, protein: 0.5, carbs: 1, fat: 1.5 },
        { name: 'Peanut Butter', quantity: 20, unit: 'g', calories: 118, protein: 5, carbs: 4, fat: 10 }
      ],
      instructions: ['Blend all ingredients until smooth', 'Pour into bowl', 'Add toppings'],
      tags: ['vegetarian', 'high-protein', 'no-cook'],
      caloriesPerServing: 420,
      proteinPerServing: 30,
      carbsPerServing: 45,
      fatPerServing: 14,
      createdAt: now,
      updatedAt: now
    },

    // LUNCH (5 recipes)
    {
      name: 'Chickpea Salad Sandwich',
      category: RC.LUNCH,
      servings: 1,
      prepTime: 10,
      cookTime: 0,
      ingredients: [
        { name: 'Chickpeas', quantity: 150, unit: 'g', calories: 164, protein: 8.9, carbs: 27, fat: 2.6 },
        { name: 'Whole Wheat Bread', quantity: 2, unit: 'slices', calories: 160, protein: 8, carbs: 28, fat: 3 },
        { name: 'Mayonnaise', quantity: 1, unit: 'tbsp', calories: 94, protein: 0.1, carbs: 0.1, fat: 10 }
      ],
      instructions: ['Mash chickpeas with fork', 'Mix with mayonnaise', 'Spread on bread'],
      tags: ['vegetarian', 'high-fiber', 'no-cook'],
      caloriesPerServing: 380,
      proteinPerServing: 16,
      carbsPerServing: 52,
      fatPerServing: 11,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Caprese Panini',
      category: RC.LUNCH,
      servings: 1,
      prepTime: 5,
      cookTime: 5,
      ingredients: [
        { name: 'Bread', quantity: 2, unit: 'slices', calories: 160, protein: 6, carbs: 30, fat: 2 },
        { name: 'Mozzarella', quantity: 100, unit: 'g', calories: 280, protein: 20, carbs: 2, fat: 20 },
        { name: 'Tomato', quantity: 80, unit: 'g', calories: 14, protein: 0.7, carbs: 3, fat: 0.2 },
        { name: 'Basil', quantity: 5, unit: 'g', calories: 1, protein: 0.1, carbs: 0.2, fat: 0 }
      ],
      instructions: ['Layer cheese, tomato, basil on bread', 'Grill until golden', 'Serve hot'],
      tags: ['vegetarian', 'high-protein', 'quick'],
      caloriesPerServing: 420,
      proteinPerServing: 24,
      carbsPerServing: 35,
      fatPerServing: 20,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Quinoa Buddha Bowl',
      category: RC.LUNCH,
      servings: 1,
      prepTime: 10,
      cookTime: 20,
      ingredients: [
        { name: 'Quinoa', quantity: 150, unit: 'g cooked', calories: 222, protein: 8, carbs: 39, fat: 3.5 },
        { name: 'Chickpeas', quantity: 100, unit: 'g', calories: 164, protein: 8.9, carbs: 27, fat: 2.6 },
        { name: 'Avocado', quantity: 50, unit: 'g', calories: 80, protein: 1, carbs: 4, fat: 7 },
        { name: 'Tahini', quantity: 15, unit: 'g', calories: 90, protein: 2.6, carbs: 4, fat: 8 }
      ],
      instructions: ['Cook quinoa', 'Roast chickpeas', 'Arrange in bowl with avocado', 'Drizzle tahini'],
      tags: ['vegetarian', 'high-fiber', 'balanced'],
      caloriesPerServing: 480,
      proteinPerServing: 18,
      carbsPerServing: 58,
      fatPerServing: 20,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Veggie Wrap with Hummus',
      category: RC.LUNCH,
      servings: 1,
      prepTime: 10,
      cookTime: 0,
      ingredients: [
        { name: 'Large Tortilla', quantity: 1, unit: 'piece', calories: 150, protein: 4, carbs: 28, fat: 3 },
        { name: 'Hummus', quantity: 60, unit: 'g', calories: 166, protein: 4.8, carbs: 10, fat: 12 },
        { name: 'Mixed Vegetables', quantity: 100, unit: 'g', calories: 25, protein: 1, carbs: 5, fat: 0.2 },
        { name: 'Feta Cheese', quantity: 30, unit: 'g', calories: 75, protein: 4, carbs: 1, fat: 6 }
      ],
      instructions: ['Spread hummus on tortilla', 'Add vegetables and feta', 'Roll tightly'],
      tags: ['vegetarian', 'no-cook', 'quick'],
      caloriesPerServing: 360,
      proteinPerServing: 14,
      carbsPerServing: 42,
      fatPerServing: 15,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Lentil Soup with Bread',
      category: RC.LUNCH,
      servings: 1,
      prepTime: 10,
      cookTime: 30,
      ingredients: [
        { name: 'Lentils', quantity: 100, unit: 'g dry', calories: 200, protein: 12, carbs: 35, fat: 2 },
        { name: 'Crusty Bread', quantity: 1, unit: 'slice', calories: 100, protein: 4, carbs: 18, fat: 1 },
        { name: 'Olive Oil', quantity: 5, unit: 'ml', calories: 40, protein: 0, carbs: 0, fat: 4.5 }
      ],
      instructions: ['Cook lentils until tender', 'Season to taste', 'Serve with bread drizzled with oil'],
      tags: ['vegetarian', 'high-protein', 'comfort-food'],
      caloriesPerServing: 340,
      proteinPerServing: 18,
      carbsPerServing: 54,
      fatPerServing: 6,
      createdAt: now,
      updatedAt: now
    },

    // DINNER (6 recipes)
    {
      name: 'Cheese Quesadilla with Black Beans',
      category: RC.DINNER,
      servings: 1,
      prepTime: 5,
      cookTime: 10,
      ingredients: [
        { name: 'Flour Tortillas', quantity: 2, unit: 'large', calories: 300, protein: 8, carbs: 48, fat: 6 },
        { name: 'Cheese', quantity: 80, unit: 'g', calories: 320, protein: 20, carbs: 0, fat: 26 },
        { name: 'Black Beans', quantity: 100, unit: 'g', calories: 132, protein: 8.9, carbs: 24, fat: 0.5 }
      ],
      instructions: ['Layer cheese and beans on tortilla', 'Top with second tortilla', 'Cook until golden on both sides'],
      tags: ['vegetarian', 'high-protein', 'quick'],
      caloriesPerServing: 520,
      proteinPerServing: 28,
      carbsPerServing: 52,
      fatPerServing: 22,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Pasta Primavera',
      category: RC.DINNER,
      servings: 1,
      prepTime: 10,
      cookTime: 15,
      ingredients: [
        { name: 'Pasta', quantity: 100, unit: 'g dry', calories: 360, protein: 12, carbs: 72, fat: 2 },
        { name: 'Mixed Vegetables', quantity: 200, unit: 'g', calories: 50, protein: 2, carbs: 10, fat: 0.4 },
        { name: 'Parmesan', quantity: 30, unit: 'g', calories: 120, protein: 11, carbs: 1, fat: 8 },
        { name: 'Olive Oil', quantity: 15, unit: 'ml', calories: 120, protein: 0, carbs: 0, fat: 14 }
      ],
      instructions: ['Cook pasta al dente', 'Sauté vegetables in olive oil', 'Toss together with parmesan'],
      tags: ['vegetarian', 'high-carb', 'comfort-food'],
      caloriesPerServing: 540,
      proteinPerServing: 18,
      carbsPerServing: 68,
      fatPerServing: 22,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Veggie Stir-Fry with Tofu & Rice',
      category: RC.DINNER,
      servings: 1,
      prepTime: 15,
      cookTime: 15,
      ingredients: [
        { name: 'Firm Tofu', quantity: 150, unit: 'g', calories: 144, protein: 15, carbs: 3, fat: 8 },
        { name: 'Mixed Vegetables', quantity: 200, unit: 'g', calories: 50, protein: 2, carbs: 10, fat: 0.4 },
        { name: 'White Rice', quantity: 150, unit: 'g cooked', calories: 195, protein: 4, carbs: 42, fat: 0.4 },
        { name: 'Soy Sauce', quantity: 15, unit: 'ml', calories: 8, protein: 1.3, carbs: 0.8, fat: 0 }
      ],
      instructions: ['Press and cube tofu', 'Stir-fry tofu until golden', 'Add vegetables and soy sauce', 'Serve over rice'],
      tags: ['vegetarian', 'high-protein', 'balanced'],
      caloriesPerServing: 480,
      proteinPerServing: 24,
      carbsPerServing: 62,
      fatPerServing: 14,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Spinach & Paneer Curry with Naan',
      category: RC.DINNER,
      servings: 1,
      prepTime: 15,
      cookTime: 25,
      ingredients: [
        { name: 'Paneer', quantity: 150, unit: 'g', calories: 300, protein: 18, carbs: 6, fat: 24 },
        { name: 'Spinach', quantity: 200, unit: 'g', calories: 46, protein: 5.8, carbs: 7, fat: 0.8 },
        { name: 'Naan Bread', quantity: 1, unit: 'piece', calories: 120, protein: 4, carbs: 20, fat: 2 }
      ],
      instructions: ['Sauté paneer until golden', 'Add spinach and spices', 'Simmer until thick', 'Serve with warm naan'],
      tags: ['vegetarian', 'high-protein', 'comfort-food'],
      caloriesPerServing: 510,
      proteinPerServing: 26,
      carbsPerServing: 48,
      fatPerServing: 24,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Margherita Flatbread Pizza',
      category: RC.DINNER,
      servings: 1,
      prepTime: 5,
      cookTime: 12,
      ingredients: [
        { name: 'Flatbread', quantity: 1, unit: 'large', calories: 200, protein: 6, carbs: 36, fat: 4 },
        { name: 'Mozzarella', quantity: 100, unit: 'g', calories: 280, protein: 20, carbs: 2, fat: 20 },
        { name: 'Tomato Sauce', quantity: 60, unit: 'g', calories: 30, protein: 1, carbs: 6, fat: 0.2 },
        { name: 'Basil', quantity: 5, unit: 'g', calories: 1, protein: 0.1, carbs: 0.2, fat: 0 }
      ],
      instructions: ['Spread sauce on flatbread', 'Top with cheese', 'Bake at 425°F for 10-12 min', 'Add fresh basil'],
      tags: ['vegetarian', 'quick', 'comfort-food'],
      caloriesPerServing: 460,
      proteinPerServing: 22,
      carbsPerServing: 42,
      fatPerServing: 22,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Mushroom Risotto',
      category: RC.DINNER,
      servings: 1,
      prepTime: 10,
      cookTime: 30,
      ingredients: [
        { name: 'Arborio Rice', quantity: 80, unit: 'g dry', calories: 280, protein: 6, carbs: 60, fat: 0.5 },
        { name: 'Mushrooms', quantity: 150, unit: 'g', calories: 33, protein: 3, carbs: 5, fat: 0.5 },
        { name: 'Parmesan', quantity: 30, unit: 'g', calories: 120, protein: 11, carbs: 1, fat: 8 },
        { name: 'Butter', quantity: 15, unit: 'g', calories: 108, protein: 0.1, carbs: 0, fat: 12 }
      ],
      instructions: ['Sauté mushrooms in butter', 'Add rice and toast', 'Add broth gradually, stirring', 'Finish with parmesan'],
      tags: ['vegetarian', 'high-carb', 'comfort-food'],
      caloriesPerServing: 420,
      proteinPerServing: 14,
      carbsPerServing: 58,
      fatPerServing: 14,
      createdAt: now,
      updatedAt: now
    },

    // SNACKS (3 recipes)
    {
      name: 'Protein Shake',
      category: RC.SNACK,
      servings: 1,
      prepTime: 3,
      cookTime: 0,
      ingredients: [
        { name: 'Protein Powder', quantity: 30, unit: 'g', calories: 120, protein: 25, carbs: 3, fat: 1 },
        { name: 'Milk', quantity: 300, unit: 'ml', calories: 153, protein: 10, carbs: 15, fat: 6 },
        { name: 'Banana', quantity: 1, unit: 'medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 }
      ],
      instructions: ['Add all ingredients to blender', 'Blend until smooth', 'Serve immediately'],
      tags: ['vegetarian', 'high-protein', 'quick'],
      caloriesPerServing: 320,
      proteinPerServing: 32,
      carbsPerServing: 38,
      fatPerServing: 6,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Apple with Peanut Butter',
      category: RC.SNACK,
      servings: 1,
      prepTime: 2,
      cookTime: 0,
      ingredients: [
        { name: 'Apple', quantity: 1, unit: 'medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
        { name: 'Peanut Butter', quantity: 32, unit: 'g', calories: 188, protein: 8, carbs: 6, fat: 16 }
      ],
      instructions: ['Slice apple', 'Serve with peanut butter for dipping'],
      tags: ['vegetarian', 'quick', 'no-cook'],
      caloriesPerServing: 280,
      proteinPerServing: 8,
      carbsPerServing: 32,
      fatPerServing: 16,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Trail Mix',
      category: RC.SNACK,
      servings: 1,
      prepTime: 2,
      cookTime: 0,
      ingredients: [
        { name: 'Almonds', quantity: 30, unit: 'g', calories: 174, protein: 6.4, carbs: 6.4, fat: 15 },
        { name: 'Dried Cranberries', quantity: 20, unit: 'g', calories: 65, protein: 0.2, carbs: 17, fat: 0.1 },
        { name: 'Dark Chocolate Chips', quantity: 15, unit: 'g', calories: 75, protein: 0.9, carbs: 8, fat: 4.5 }
      ],
      instructions: ['Mix all ingredients together', 'Store in airtight container'],
      tags: ['vegetarian', 'quick', 'no-cook'],
      caloriesPerServing: 280,
      proteinPerServing: 7,
      carbsPerServing: 26,
      fatPerServing: 18,
      createdAt: now,
      updatedAt: now
    }
  ]
}

function createSamplePantryItems(): Omit<PantryItem, 'id'>[] {
  const futureDate = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString()
  }

  return [
    { name: 'Rolled Oats', quantity: 500, unit: 'g', category: 'grain', expirationDate: futureDate(180), createdAt: now, updatedAt: now },
    { name: 'Eggs', quantity: 12, unit: 'large', category: 'protein', expirationDate: futureDate(14), createdAt: now, updatedAt: now },
    { name: 'Greek Yogurt', quantity: 500, unit: 'g', category: 'dairy', expirationDate: futureDate(7), createdAt: now, updatedAt: now },
    { name: 'Whole Wheat Bread', quantity: 1, unit: 'loaf', category: 'grain', expirationDate: futureDate(5), createdAt: now, updatedAt: now },
    { name: 'Chickpeas', quantity: 400, unit: 'g', category: 'protein', expirationDate: futureDate(365), createdAt: now, updatedAt: now },
    { name: 'Quinoa', quantity: 500, unit: 'g', category: 'grain', expirationDate: futureDate(365), createdAt: now, updatedAt: now },
    { name: 'Olive Oil', quantity: 500, unit: 'ml', category: 'condiment', expirationDate: futureDate(365), createdAt: now, updatedAt: now }
  ]
}

const SEEDED_FLAG_KEY = 'nutrition_app_seeded'

export async function isSeeded(): Promise<boolean> {
  try {
    const flag = localStorage.getItem(SEEDED_FLAG_KEY)
    if (flag === 'true') {
      const recipeCount = await db.recipes.count()
      return recipeCount >= 18
    }
    return false
  } catch {
    return false
  }
}

export async function seedDatabase(): Promise<void> {
  try {
    const alreadySeeded = await isSeeded()
    if (alreadySeeded) {
      console.log('Database already seeded, skipping...')
      return
    }

    console.log('Seeding database with initial data...')

    const recipes = createSeedRecipes()
    await bulkCreateRecipes(recipes)
    console.log(`✓ Seeded ${recipes.length} recipes`)

    const pantryItems = createSamplePantryItems()
    await bulkCreatePantryItems(pantryItems)
    console.log(`✓ Seeded ${pantryItems.length} pantry items`)

    const existingProfile = await db.userProfile.toCollection().first()
    if (!existingProfile) {
      await createOrUpdateUserProfile({
        height: 175,
        weight: 70,
        age: 30,
        gender: 'male',
        activityLevel: 'moderately_active',
        bmi: 22.9,
        bmr: 1680,
        tdee: 2604,
        calorieTarget: 2600,
        proteinTarget: 126,
        carbsTarget: 325,
        fatTarget: 87,
        workoutCalorieGoal: 2000,
        workoutDaysPerWeek: 4,
        dietaryRestrictions: ['vegetarian']
      })
      console.log('✓ Created default user profile')
    }

    localStorage.setItem(SEEDED_FLAG_KEY, 'true')
    console.log('✓ Database seeding complete!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

export function clearSeedFlag(): void {
  localStorage.removeItem(SEEDED_FLAG_KEY)
}