import { z } from 'zod'

/**
 * Zod validation schema for GoalSetting form
 * Validates calorie targets, macros, workout goals, and dietary restrictions
 */
export const goalSettingSchema = z.object({
  // Daily calorie target
  calorieTarget: z.number()
    .int('Calorie target must be a whole number')
    .min(1000, 'Calorie target must be at least 1000')
    .max(5000, 'Calorie target must be at most 5000'),

  // Macro targets (in grams)
  proteinTarget: z.number()
    .int('Protein must be a whole number')
    .min(0, 'Protein must be non-negative')
    .max(500, 'Protein target seems too high'),

  carbsTarget: z.number()
    .int('Carbs must be a whole number')
    .min(0, 'Carbs must be non-negative')
    .max(1000, 'Carbs target seems too high'),

  fatTarget: z.number()
    .int('Fat must be a whole number')
    .min(0, 'Fat must be non-negative')
    .max(300, 'Fat target seems too high'),

  // Workout goals
  workoutCalorieGoal: z.number()
    .int('Workout calories must be a whole number')
    .min(0, 'Workout calories must be non-negative')
    .max(10000, 'Weekly workout calories seem too high'),

  workoutDaysPerWeek: z.number()
    .int('Workout days must be a whole number')
    .min(0, 'Workout days must be at least 0')
    .max(7, 'Cannot workout more than 7 days per week')
    .optional(),

  // Dietary restrictions
  dietaryRestrictions: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
  // Validate that macro totals roughly match calorie target
  // Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
  const macroCalories = (data.proteinTarget * 4) + (data.carbsTarget * 4) + (data.fatTarget * 9)
  const tolerance = data.calorieTarget * 0.1 // 10% tolerance

  const difference = Math.abs(macroCalories - data.calorieTarget)

  if (difference > tolerance) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Macro totals (${Math.round(macroCalories)} cal) should roughly equal calorie target (${data.calorieTarget} cal)`,
      path: ['calorieTarget'],
    })
  }
})

export type GoalSettingFormData = z.infer<typeof goalSettingSchema>
