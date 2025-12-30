import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { profileSetupSchema, type ProfileSetupFormData } from '@/schemas/profileSetupSchema'
import { calculateBMI, calculateBMR, calculateTDEE } from '@/lib/calculations'
import {
  cmToFeetAndInches,
  feetAndInchesToCm,
  kgToLbs,
  lbsToKg,
  type UnitSystem
} from '@/lib/unit-conversions'
import { Gender, ActivityLevel } from '@/types'

export default function ProfileSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')

  // Check if we're editing an existing profile
  const existingProfile = location.state?.existingProfile
  const isEditing = location.state?.isEditing

  const form = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      unitSystem: 'metric',
      heightCm: existingProfile?.height || undefined,
      heightFeet: undefined,
      heightInches: undefined,
      weight: existingProfile?.weight || undefined,
      age: existingProfile?.age || undefined,
      gender: existingProfile?.gender || Gender.MALE,
      activityLevel: existingProfile?.activityLevel || ActivityLevel.MODERATELY_ACTIVE,
    },
  })

  // Update form unitSystem when toggle changes
  useEffect(() => {
    form.setValue('unitSystem', unitSystem)
  }, [unitSystem, form])

  // Convert units when toggle changes (if fields have values)
  const handleUnitToggle = (newSystem: UnitSystem) => {
    const currentWeight = form.getValues('weight')
    const currentHeightCm = form.getValues('heightCm')
    const currentHeightFeet = form.getValues('heightFeet')
    const currentHeightInches = form.getValues('heightInches')

    if (newSystem === 'imperial' && unitSystem === 'metric') {
      // Convert metric to imperial
      if (currentWeight) {
        form.setValue('weight', Math.round(kgToLbs(currentWeight) * 10) / 10)
      }
      if (currentHeightCm) {
        const { feet, inches } = cmToFeetAndInches(currentHeightCm)
        form.setValue('heightFeet', feet)
        form.setValue('heightInches', inches)
        form.setValue('heightCm', undefined)
      }
    } else if (newSystem === 'metric' && unitSystem === 'imperial') {
      // Convert imperial to metric
      if (currentWeight) {
        form.setValue('weight', Math.round(lbsToKg(currentWeight) * 10) / 10)
      }
      if (currentHeightFeet !== undefined) {
        const cm = feetAndInchesToCm(currentHeightFeet, currentHeightInches || 0)
        form.setValue('heightCm', Math.round(cm * 10) / 10)
        form.setValue('heightFeet', undefined)
        form.setValue('heightInches', undefined)
      }
    }

    setUnitSystem(newSystem)
  }

  const onSubmit = (data: ProfileSetupFormData) => {
    // Convert all to metric for calculations
    let heightCm: number
    let weightKg: number

    if (data.unitSystem === 'metric') {
      heightCm = data.heightCm!
      weightKg = data.weight
    } else {
      heightCm = feetAndInchesToCm(data.heightFeet!, data.heightInches || 0)
      weightKg = lbsToKg(data.weight)
    }

    // Calculate metrics
    const bmi = calculateBMI(weightKg, heightCm)
    const bmr = calculateBMR(weightKg, heightCm, data.age, data.gender)
    const tdee = calculateTDEE(bmr, data.activityLevel)

    // Navigate to GoalSetting with calculated metrics
    navigate('/profile-setup/goals', {
      state: {
        physicalStats: {
          height: heightCm,
          weight: weightKg,
          age: data.age,
          gender: data.gender,
          activityLevel: data.activityLevel,
        },
        calculatedMetrics: {
          bmi: Math.round(bmi * 10) / 10,
          bmr: Math.round(bmr),
          tdee: Math.round(tdee),
        },
      },
    })
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-2">
            {isEditing ? 'Edit Your Profile' : 'Set Up Your Profile'}
          </h1>
          <p className="text-lg text-muted-foreground">
            Let's get to know you better to create personalized meal plans
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="relative overflow-hidden shadow-soft-lg animate-slide-up">
          {/* Gradient top border */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{
              background: 'linear-gradient(90deg, var(--brand-sage-hex), var(--brand-terracotta-hex), var(--brand-blue-hex))',
              opacity: 0.6,
            }}
          />

          <div className="p-6 sm:p-8">
            {/* Unit Toggle */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Scale className="w-5 h-5 text-brand-sage" />
                <label className="text-sm font-semibold uppercase tracking-wide">
                  Unit System
                </label>
              </div>
              <div className="inline-flex bg-brand-cream border border-border rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => handleUnitToggle('metric')}
                  className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                    unitSystem === 'metric'
                      ? 'bg-white text-foreground shadow-soft'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Metric
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitToggle('imperial')}
                  className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                    unitSystem === 'imperial'
                      ? 'bg-white text-foreground shadow-soft'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Imperial
                </button>
              </div>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Height */}
                <div className="form-group animate-slide-up" style={{ animationDelay: '0.15s' }}>
                  {unitSystem === 'metric' ? (
                    <FormField
                      control={form.control}
                      name="heightCm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="175"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div>
                      <FormLabel>Height (ft/in)</FormLabel>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <FormField
                          control={form.control}
                          name="heightFeet"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div>
                                  <Input
                                    type="number"
                                    placeholder="5"
                                    min="3"
                                    max="8"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                  />
                                  <span className="text-xs text-muted-foreground mt-1 block">feet</span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="heightInches"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div>
                                  <Input
                                    type="number"
                                    placeholder="9"
                                    min="0"
                                    max="11"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                  />
                                  <span className="text-xs text-muted-foreground mt-1 block">inches</span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Weight */}
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                      <FormLabel>Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder={unitSystem === 'metric' ? '70' : '154'}
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Age */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="30"
                          min="13"
                          max="100"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Gender.MALE}>Male</SelectItem>
                          <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                          <SelectItem value={Gender.OTHER}>Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Activity Level */}
                <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
                      <FormLabel>Activity Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ActivityLevel.SEDENTARY}>
                            Sedentary (little/no exercise)
                          </SelectItem>
                          <SelectItem value={ActivityLevel.LIGHTLY_ACTIVE}>
                            Lightly Active (1-3 days/week)
                          </SelectItem>
                          <SelectItem value={ActivityLevel.MODERATELY_ACTIVE}>
                            Moderately Active (3-5 days/week)
                          </SelectItem>
                          <SelectItem value={ActivityLevel.VERY_ACTIVE}>
                            Very Active (6-7 days/week)
                          </SelectItem>
                          <SelectItem value={ActivityLevel.EXTREMELY_ACTIVE}>
                            Extremely Active (athlete)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-brand-sage hover:bg-brand-sage-dark text-white transition-all duration-200 hover:-translate-y-0.5 shadow-soft-md hover:shadow-soft-lg mt-4"
                  size="lg"
                >
                  Calculate My Metrics
                </Button>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  )
}
