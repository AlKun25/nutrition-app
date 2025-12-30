import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { goalSettingSchema, type GoalSettingFormData } from '@/schemas/goalSettingSchema'
import { getBMICategory, calculateDefaultMacros } from '@/lib/calculations'
import { createOrUpdateUserProfile } from '@/lib/db-helpers'
import { useUserStore } from '@/stores/userStore'
import type { UserProfile } from '@/types'

interface LocationState {
  physicalStats: {
    height: number
    weight: number
    age: number
    gender: string
    activityLevel: string
  }
  calculatedMetrics: {
    bmi: number
    bmr: number
    tdee: number
  }
}

const DIETARY_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'nut-allergy', label: 'Nut Allergy' },
  { id: 'shellfish-allergy', label: 'Shellfish Allergy' },
  { id: 'kosher', label: 'Kosher' },
  { id: 'halal', label: 'Halal' },
  { id: 'low-carb', label: 'Low-Carb' },
  { id: 'keto', label: 'Keto' },
]

export default function GoalSetting() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setProfile } = useUserStore()
  const [macrosManuallyEdited, setMacrosManuallyEdited] = useState(false)

  // Get data from ProfileSetup
  const state = location.state as LocationState | null

  // Route guard: redirect if no state
  useEffect(() => {
    if (!state?.calculatedMetrics || !state?.physicalStats) {
      navigate('/profile-setup')
    }
  }, [state, navigate])

  if (!state) {
    return null
  }

  const { physicalStats, calculatedMetrics } = state
  const { bmi, bmr, tdee } = calculatedMetrics
  const bmiCategory = getBMICategory(bmi)

  // Calculate default macros based on TDEE
  const defaultMacros = calculateDefaultMacros(tdee)

  const form = useForm({
    resolver: zodResolver(goalSettingSchema),
    defaultValues: {
      calorieTarget: tdee,
      proteinTarget: defaultMacros.protein,
      carbsTarget: defaultMacros.carbs,
      fatTarget: defaultMacros.fat,
      workoutCalorieGoal: 0,
      workoutDaysPerWeek: 0,
      dietaryRestrictions: [] as string[],
    },
  })

  // Auto-update macros when calorie target changes (unless manually edited)
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'calorieTarget' && value.calorieTarget && !macrosManuallyEdited) {
        const newMacros = calculateDefaultMacros(value.calorieTarget)
        form.setValue('proteinTarget', newMacros.protein)
        form.setValue('carbsTarget', newMacros.carbs)
        form.setValue('fatTarget', newMacros.fat)
      }

      // Mark as manually edited if user changes any macro
      if (name === 'proteinTarget' || name === 'carbsTarget' || name === 'fatTarget') {
        setMacrosManuallyEdited(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [form, macrosManuallyEdited])

  const onSubmit = async (goalData: GoalSettingFormData) => {
    try {
      // Combine all data into complete profile
      const completeProfile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> = {
        // Physical stats from ProfileSetup
        height: physicalStats.height,
        weight: physicalStats.weight,
        age: physicalStats.age,
        gender: physicalStats.gender as any,
        activityLevel: physicalStats.activityLevel as any,

        // Calculated metrics
        bmi,
        bmr,
        tdee,

        // Goal data from form
        calorieTarget: goalData.calorieTarget,
        proteinTarget: goalData.proteinTarget,
        carbsTarget: goalData.carbsTarget,
        fatTarget: goalData.fatTarget,
        workoutCalorieGoal: goalData.workoutCalorieGoal,
        workoutDaysPerWeek: goalData.workoutDaysPerWeek,
        dietaryRestrictions: goalData.dietaryRestrictions,
      }

      // Save to IndexedDB
      const profileId = await createOrUpdateUserProfile(completeProfile)

      // Update Zustand store
      const now = new Date().toISOString()
      setProfile({
        ...completeProfile,
        id: profileId,
        createdAt: now,
        updatedAt: now,
      })

      // Show success message
      toast.success('Profile created successfully!')

      // Navigate to profile view
      navigate('/profile')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Results Card */}
        <Card className="mb-8 shadow-soft-lg animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-sage-light rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-brand-sage" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-heading">
                Your Metabolic Profile
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* BMI Hero Card */}
            <div
              className="bg-gradient-to-br from-brand-sage-light to-brand-cream rounded-lg border border-brand-sage p-6 relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4 relative z-10">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Body Mass Index (BMI)
                </span>
                <Badge
                  variant={bmiCategory.variant}
                  className={
                    bmiCategory.label === 'Normal'
                      ? 'bg-success-light text-success border-success-border'
                      : ''
                  }
                >
                  {bmiCategory.label}
                </Badge>
              </div>
              <div className="text-5xl sm:text-6xl font-heading font-bold text-foreground relative z-10">
                {bmi.toFixed(1)}
              </div>
              {/* Decorative overlay */}
              <div
                className="absolute top-[-50%] right-[-20%] w-48 h-48 rounded-full opacity-20"
                style={{
                  background: 'radial-gradient(circle, var(--brand-sage-hex) 0%, transparent 70%)',
                }}
              />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-brand-cream border-brand-tan hover:shadow-soft-md transition-all hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Basal Metabolic Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
                    {bmr}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    calories/day at rest
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-cream border-brand-tan hover:shadow-soft-md transition-all hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Daily Energy Expenditure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
                    {tdee}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    total calories/day
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info Box */}
            <div className="bg-brand-sage-subtle border border-brand-sage border-l-4 rounded-lg p-5 flex gap-4">
              <Info className="w-6 h-6 text-brand-sage flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Next Steps
                </h3>
                <p className="text-sm text-muted-foreground">
                  Based on your TDEE of <strong className="text-foreground">{tdee}</strong> calories,
                  we'll help you create personalized meal plans that align with your fitness goals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal Setting Form */}
        <Card className="shadow-soft-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Set Your Goals</CardTitle>
            <p className="text-sm text-muted-foreground">
              Customize your daily targets based on your fitness goals
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Calorie Target */}
                <FormField
                  control={form.control}
                  name="calorieTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Calorie Target</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        Your TDEE is {tdee} calories. Reduce by 300-500 for weight loss, increase for muscle gain.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Macros Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Macronutrient Targets (grams)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="proteinTarget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Protein</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            {field.value ? `${field.value * 4} cal` : '0 cal'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="carbsTarget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carbs</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            {field.value ? `${field.value * 4} cal` : '0 cal'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fatTarget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fat</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            {field.value ? `${field.value * 9} cal` : '0 cal'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Macros auto-calculated as 30% protein, 40% carbs, 30% fat. Adjust as needed.
                  </p>
                </div>

                {/* Workout Goals */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Workout Goals</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="workoutCalorieGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekly Calorie Burn Goal</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2000"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription>Total calories to burn per week</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="workoutDaysPerWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workout Days Per Week</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="4"
                              min="0"
                              max="7"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription>How many days you plan to exercise</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <FormField
                  control={form.control}
                  name="dietaryRestrictions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Dietary Restrictions</FormLabel>
                        <FormDescription>
                          Select any dietary preferences or restrictions
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {DIETARY_OPTIONS.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="dietaryRestrictions"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), option.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== option.id
                                              ) || []
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-brand-sage hover:bg-brand-sage-dark text-white transition-all duration-200 hover:-translate-y-0.5 shadow-soft-md hover:shadow-soft-lg"
                  size="lg"
                >
                  Complete Profile Setup
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
