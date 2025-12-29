import { create } from 'zustand'
import type { MealPlan, DayPlan } from '@/types'
import { db } from '@/lib/db'

interface MealPlanState {
  currentMealPlan: MealPlan | null
  selectedWeekStart: string | null
  isLoading: boolean
  error: string | null
}

interface MealPlanActions {
  setMealPlan: (plan: MealPlan) => void
  loadMealPlan: (weekStart: string) => Promise<void>
  updateDayPlan: (date: string, dayPlan: DayPlan) => void
  clearMealPlan: () => void
  setSelectedWeek: (weekStart: string | null) => void
}

type MealPlanStore = MealPlanState & MealPlanActions

export const useMealPlanStore = create<MealPlanStore>((set, get) => ({
  // Initial state
  currentMealPlan: null,
  selectedWeekStart: null,
  isLoading: false,
  error: null,

  // Actions
  setMealPlan: (plan) => {
    set({ currentMealPlan: plan, error: null })
  },

  loadMealPlan: async (weekStart) => {
    set({ isLoading: true, error: null, selectedWeekStart: weekStart })
    try {
      const mealPlan = await db.mealPlans
        .where('weekStartDate')
        .equals(weekStart)
        .first()

      if (mealPlan) {
        set({ currentMealPlan: mealPlan, isLoading: false, error: null })
      } else {
        set({ currentMealPlan: null, isLoading: false, error: null })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load meal plan'
      set({ error: errorMessage, isLoading: false })
    }
  },

  updateDayPlan: (date, dayPlan) => {
    const currentPlan = get().currentMealPlan
    if (currentPlan) {
      const updatedDays = currentPlan.days.map((day) =>
        day.date === date ? dayPlan : day
      )
      const updatedPlan: MealPlan = {
        ...currentPlan,
        days: updatedDays,
        updatedAt: new Date().toISOString(),
      }
      set({ currentMealPlan: updatedPlan, error: null })
    }
  },

  clearMealPlan: () => {
    set({ currentMealPlan: null, selectedWeekStart: null, error: null })
  },

  setSelectedWeek: (weekStart) => {
    set({ selectedWeekStart: weekStart })
  },
}))

