// Ensure fake-indexeddb is loaded in test environments before db instance creation
// test-setup.ts also imports it, but this ensures it's available when db.ts executes
// Type declaration for require (used in test environments)
declare const require: (id: string) => any

if (typeof globalThis !== 'undefined' && !globalThis.indexedDB) {
  // Only load if indexedDB doesn't exist (test environment)
  // Use require for test environments (available in Node.js/test environments)
  try {
    // @ts-ignore - require is available in test environments
    require('fake-indexeddb/auto')
  } catch {
    // Ignore - test-setup.ts should handle it via vite.config.ts setupFiles
  }
}

import Dexie, { type EntityTable } from 'dexie'
import type {
  UserProfile,
  Recipe,
  PantryItem,
  MealPlan,
  GroceryList
} from '@/types'

// Configure Dexie to use the appropriate IndexedDB implementation
// - In tests: fake-indexeddb (loaded above or via test-setup.ts)
// - In browser: native IndexedDB
let dexieOptions: any = {}

if (typeof globalThis !== 'undefined' && 'indexedDB' in globalThis) {
  const indexedDB = globalThis.indexedDB
  const IDBKeyRange = globalThis.IDBKeyRange
  
  // Always pass indexedDB if available - Dexie will use what's provided
  // In tests: fake-indexeddb, In browser: native IndexedDB
  if (indexedDB && IDBKeyRange) {
    dexieOptions = { indexedDB, IDBKeyRange }
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
    // Request persistent storage to prevent eviction (optional)
    // Note: This may return false in development (localhost) or if user denies permission
    // Data will still be stored, but may be evicted under storage pressure
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist()
      if (isPersisted) {
        console.log('✓ IndexedDB storage is persistent (protected from eviction)')
      } else {
        // Not critical - data is still stored, just not guaranteed to persist under storage pressure
        console.debug('IndexedDB storage is not persistent (this is normal for localhost)')
      }
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
