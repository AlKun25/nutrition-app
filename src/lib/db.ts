// Polyfill IndexedDB for test environments (must be before Dexie import)
import 'fake-indexeddb/auto'

import Dexie, { type EntityTable } from 'dexie'
import type {
  UserProfile,
  Recipe,
  PantryItem,
  MealPlan,
  GroceryList
} from '@/types'

// For tests: explicitly pass fake-indexeddb if available
let dexieOptions: any = {}

if (typeof globalThis !== 'undefined' && 'indexedDB' in globalThis) {
  const fakeIndexedDB = globalThis.indexedDB
  const fakeIDBKeyRange = globalThis.IDBKeyRange
  // Accept both real IndexedDB (IDBFactory) and fake-indexeddb (FDBFactory)
  if (fakeIndexedDB && (fakeIndexedDB.constructor?.name === 'IDBFactory' || fakeIndexedDB.constructor?.name === 'FDBFactory')) {
    dexieOptions = { indexedDB: fakeIndexedDB, IDBKeyRange: fakeIDBKeyRange }
  }
}

// Extend Dexie class with typed tables
export class NutritionDB extends Dexie {
  // Typed tables - using EntityTable for auto-increment support
  userProfile!: EntityTable<UserProfile, 'id'>
  recipes!: EntityTable<Recipe, 'id'>
  pantryItems!: EntityTable<PantryItem, 'id'>
  mealPlans!: EntityTable<MealPlan, 'id'>
  groceryLists!: EntityTable<GroceryList, 'id'>

  constructor() {
    super('NutritionDB', dexieOptions)

    // Define schema version 1
    this.version(1).stores({
      userProfile: '++id',
      recipes: '++id, category, *tags',
      pantryItems: '++id, category, expirationDate, barcode',
      mealPlans: '++id, weekStartDate',
      groceryLists: '++id, mealPlanId, createdAt'
    })
  }
}

// Export singleton instance
export const db = new NutritionDB()

// Initialize database with persistent storage request
export async function initializeDatabase(): Promise<boolean> {
  try {
    // Request persistent storage to prevent eviction
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist()
      console.log(`IndexedDB storage persisted: ${isPersisted}`)
    }

    // Check storage quota
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate()
      const usageInMB = ((estimate.usage ?? 0) / (1024 * 1024)).toFixed(2)
      const quotaInMB = ((estimate.quota ?? 0) / (1024 * 1024)).toFixed(2)
      console.log(`Storage: ${usageInMB}MB / ${quotaInMB}MB`)
    }

    // Open the database to trigger initialization
    await db.open()

    return true
  } catch (error) {
    console.error('Failed to initialize database:', error)
    return false
  }
}
