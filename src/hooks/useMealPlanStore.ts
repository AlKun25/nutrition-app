import { useMealPlanStore } from '@/stores/mealPlanStore'
import type { MealPlan, DayPlan } from '@/types'

/**
 * Hook to get the current meal plan
 */
export function useCurrentMealPlan(): MealPlan | null {
  return useMealPlanStore((state) => state.currentMealPlan)
}

/**
 * Hook to get the selected week start date
 */
export function useSelectedWeekStart(): string | null {
  return useMealPlanStore((state) => state.selectedWeekStart)
}

/**
 * Hook to get meal plan loading state
 */
export function useMealPlanLoading(): boolean {
  return useMealPlanStore((state) => state.isLoading)
}

/**
 * Hook to get meal plan error state
 */
export function useMealPlanError(): string | null {
  return useMealPlanStore((state) => state.error)
}

/**
 * Hook to get all meal plan actions
 */
export function useMealPlanActions() {
  return useMealPlanStore((state) => ({
    setMealPlan: state.setMealPlan,
    loadMealPlan: state.loadMealPlan,
    updateDayPlan: state.updateDayPlan,
    clearMealPlan: state.clearMealPlan,
    setSelectedWeek: state.setSelectedWeek,
  }))
}

/**
 * Hook to get specific meal plan actions
 */
export function useSetMealPlan() {
  return useMealPlanStore((state) => state.setMealPlan)
}

export function useLoadMealPlan() {
  return useMealPlanStore((state) => state.loadMealPlan)
}

export function useUpdateDayPlan() {
  return useMealPlanStore((state) => state.updateDayPlan)
}

export function useClearMealPlan() {
  return useMealPlanStore((state) => state.clearMealPlan)
}

export function useSetSelectedWeek() {
  return useMealPlanStore((state) => state.setSelectedWeek)
}

