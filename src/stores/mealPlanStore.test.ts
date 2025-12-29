// src/stores/mealPlanStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useMealPlanStore } from './mealPlanStore'
import { db } from '@/lib/db'
import type { MealPlan, DayPlan } from '@/types'

describe('MealPlanStore', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    
    useMealPlanStore.setState({
      currentMealPlan: null,
      selectedWeekStart: null,
      isLoading: false,
      error: null,
    })
  })

  describe('setMealPlan', () => {
    it('should set the current meal plan', () => {
      const mealPlan: MealPlan = {
        weekStartDate: '2025-01-01',
        days: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      useMealPlanStore.getState().setMealPlan(mealPlan)
      
      expect(useMealPlanStore.getState().currentMealPlan).toEqual(mealPlan)
      expect(useMealPlanStore.getState().error).toBeNull()
    })
  })

  describe('loadMealPlan', () => {
    it('should load meal plan from database', async () => {
      const weekStart = '2025-01-01'
      const mealPlan: MealPlan = {
        weekStartDate: weekStart,
        days: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await db.mealPlans.add(mealPlan)
      
      await useMealPlanStore.getState().loadMealPlan(weekStart)
      
      const state = useMealPlanStore.getState()
      expect(state.currentMealPlan).toBeDefined()
      expect(state.currentMealPlan?.weekStartDate).toBe(weekStart)
      expect(state.selectedWeekStart).toBe(weekStart)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle meal plan not found', async () => {
      await useMealPlanStore.getState().loadMealPlan('2025-01-01')
      
      const state = useMealPlanStore.getState()
      expect(state.currentMealPlan).toBeNull()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('updateDayPlan', () => {
    it('should update a specific day in the meal plan', async () => {
      const dayPlan: DayPlan = {
        date: '2025-01-01',
        isWorkoutDay: false,
        calorieTarget: 2000,
        meals: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      }

      const mealPlan: MealPlan = {
        weekStartDate: '2025-01-01',
        days: [dayPlan],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      useMealPlanStore.getState().setMealPlan(mealPlan)
      const originalUpdatedAt = useMealPlanStore.getState().currentMealPlan?.updatedAt
      
      const updatedDay: DayPlan = {
        ...dayPlan,
        isWorkoutDay: true,
        calorieTarget: 2500,
      }

      // Small delay to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10))

      useMealPlanStore.getState().updateDayPlan('2025-01-01', updatedDay)
      
      const updated = useMealPlanStore.getState().currentMealPlan
      expect(updated?.days[0].isWorkoutDay).toBe(true)
      expect(updated?.days[0].calorieTarget).toBe(2500)
      expect(updated?.updatedAt).toBeDefined()
      expect(updated?.updatedAt).not.toBe(originalUpdatedAt)
    })
  })

  describe('clearMealPlan', () => {
    it('should clear the meal plan', () => {
      const mealPlan: MealPlan = {
        weekStartDate: '2025-01-01',
        days: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      useMealPlanStore.getState().setMealPlan(mealPlan)
      useMealPlanStore.getState().clearMealPlan()
      
      const state = useMealPlanStore.getState()
      expect(state.currentMealPlan).toBeNull()
      expect(state.selectedWeekStart).toBeNull()
      expect(state.error).toBeNull()
    })
  })

  describe('setSelectedWeek', () => {
    it('should set the selected week start date', () => {
      useMealPlanStore.getState().setSelectedWeek('2025-01-01')
      expect(useMealPlanStore.getState().selectedWeekStart).toBe('2025-01-01')
    })
  })
})