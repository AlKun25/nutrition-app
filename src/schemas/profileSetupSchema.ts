import { z } from 'zod'
import { Gender, ActivityLevel } from '@/types'

/**
 * Zod validation schema for ProfileSetup form
 * Handles both metric and imperial unit systems with conditional validation
 */
export const profileSetupSchema = z.object({
  // Unit system toggle
  unitSystem: z.enum(['metric', 'imperial']),

  // Metric height field
  heightCm: z.number()
    .min(100, 'Height must be at least 100 cm')
    .max(250, 'Height must be at most 250 cm')
    .optional(),

  // Imperial height fields
  heightFeet: z.number()
    .int('Feet must be a whole number')
    .min(3, 'Height must be at least 3 feet')
    .max(8, 'Height must be at most 8 feet')
    .optional(),

  heightInches: z.number()
    .min(0, 'Inches must be at least 0')
    .max(11, 'Inches must be at most 11')
    .optional(),

  // Weight (value depends on unit system)
  weight: z.number()
    .positive('Weight must be positive'),

  // Age
  age: z.number()
    .int('Age must be a whole number')
    .min(13, 'Age must be at least 13')
    .max(100, 'Age must be at most 100'),

  // Gender
  gender: z.nativeEnum(Gender),

  // Activity level
  activityLevel: z.nativeEnum(ActivityLevel),
}).superRefine((data, ctx) => {
  // Validate height based on unit system
  if (data.unitSystem === 'metric') {
    if (!data.heightCm || data.heightCm <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Height is required',
        path: ['heightCm'],
      })
    }
  } else {
    // Imperial system
    if (!data.heightFeet || data.heightFeet <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Height is required',
        path: ['heightFeet'],
      })
    }

    // Validate total imperial height range (3'3" - 8'2")
    if (data.heightFeet && data.heightInches !== undefined) {
      const totalInches = (data.heightFeet * 12) + data.heightInches
      const totalCm = totalInches * 2.54

      if (totalCm < 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Height must be at least 3\'3"',
          path: ['heightFeet'],
        })
      }
      if (totalCm > 250) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Height must be at most 8\'2"',
          path: ['heightFeet'],
        })
      }
    }
  }

  // Validate weight based on unit system
  if (data.unitSystem === 'metric') {
    if (data.weight < 30 || data.weight > 200) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Weight must be between 30-200 kg',
        path: ['weight'],
      })
    }
  } else {
    // Imperial system (66-440 lbs)
    if (data.weight < 66 || data.weight > 440) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Weight must be between 66-440 lbs',
        path: ['weight'],
      })
    }
  }
})

export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>
