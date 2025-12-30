import type { ActivityLevel, Gender } from '@/types'

/**
 * Activity level multipliers for TDEE calculation
 * Based on standard activity level definitions
 */
export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // Little/no exercise
  lightly_active: 1.375, // 1-3 days/week
  moderately_active: 1.55, // 3-5 days/week
  very_active: 1.725, // 6-7 days/week
  extremely_active: 1.9, // Athlete level
} as const

/**
 * Calculate Body Mass Index (BMI)
 * Formula: weight(kg) / height(m)²
 *
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimeters
 * @returns BMI value (0 if invalid inputs)
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return 0
  }

  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

/**
 * Calculate Basal Metabolic Rate (BMR)
 * Uses the Mifflin-St Jeor Equation
 * Male: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 * Female: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
 * Other: Uses male formula as default
 *
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimeters
 * @param age - Age in years
 * @param gender - Gender ('male', 'female', 'other')
 * @returns BMR in calories/day (0 if invalid inputs)
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender
): number {
  if (!weightKg || !heightCm || !age || weightKg <= 0 || heightCm <= 0 || age <= 0) {
    return 0
  }

  const base = (10 * weightKg) + (6.25 * heightCm) - (5 * age)

  if (gender === 'female') {
    return base - 161
  }

  // Male or Other (uses male formula)
  return base + 5
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 * Formula: BMR × activity_multiplier
 *
 * @param bmr - Basal Metabolic Rate
 * @param activityLevel - Activity level
 * @returns TDEE in calories/day
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  if (!bmr || bmr <= 0) {
    return 0
  }

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.sedentary
  return bmr * multiplier
}

/**
 * Get BMI category and corresponding badge variant
 *
 * @param bmi - BMI value
 * @returns Object with label and variant for Badge component
 */
export function getBMICategory(bmi: number): {
  label: 'Underweight' | 'Normal' | 'Overweight' | 'Obese'
  variant: 'default' | 'default' | 'secondary' | 'destructive'
} {
  if (bmi < 18.5) {
    return { label: 'Underweight', variant: 'default' } // Blue/info color
  }
  if (bmi < 25) {
    return { label: 'Normal', variant: 'default' } // Green/success (will use custom styling)
  }
  if (bmi < 30) {
    return { label: 'Overweight', variant: 'secondary' } // Yellow/warning
  }
  return { label: 'Obese', variant: 'destructive' } // Red/error
}

/**
 * Calculate default macro targets based on calorie target
 * Uses 30% protein, 40% carbs, 30% fat split
 * Protein: 4 cal/gram, Carbs: 4 cal/gram, Fat: 9 cal/gram
 *
 * @param calorieTarget - Target daily calories
 * @returns Object with protein, carbs, and fat in grams
 */
export function calculateDefaultMacros(calorieTarget: number): {
  protein: number
  carbs: number
  fat: number
} {
  if (!calorieTarget || calorieTarget <= 0) {
    return { protein: 0, carbs: 0, fat: 0 }
  }

  // 30% protein, 40% carbs, 30% fat
  const proteinCalories = calorieTarget * 0.3
  const carbsCalories = calorieTarget * 0.4
  const fatCalories = calorieTarget * 0.3

  return {
    protein: Math.round(proteinCalories / 4),
    carbs: Math.round(carbsCalories / 4),
    fat: Math.round(fatCalories / 9),
  }
}
