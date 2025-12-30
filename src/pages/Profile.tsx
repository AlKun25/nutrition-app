import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, RotateCcw, User, Activity, Target, Utensils } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useUserStore } from '@/stores/userStore'
import { getBMICategory } from '@/lib/calculations'
import { db } from '@/lib/db'

export default function Profile() {
  const navigate = useNavigate()
  const { profile, loadProfile, clearProfile } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await loadProfile()
      setIsLoading(false)
    }
    loadData()
  }, [loadProfile])

  // Redirect to profile setup if no profile exists
  useEffect(() => {
    if (!isLoading && !profile) {
      navigate('/profile-setup')
    }
  }, [isLoading, profile, navigate])

  const handleEdit = () => {
    navigate('/profile-setup', {
      state: {
        existingProfile: profile,
        isEditing: true,
      },
    })
  }

  const handleReset = async () => {
    try {
      await db.userProfile.clear()
      clearProfile()
      toast.success('Profile reset successfully')
      navigate('/profile-setup')
    } catch (error) {
      console.error('Error resetting profile:', error)
      toast.error('Failed to reset profile')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-muted-foreground">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const bmiCategory = getBMICategory(profile.bmi)

  // Activity level labels
  const activityLabels = {
    sedentary: 'Sedentary',
    lightly_active: 'Lightly Active',
    moderately_active: 'Moderately Active',
    very_active: 'Very Active',
    extremely_active: 'Extremely Active',
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-1">
              Your Profile
            </h1>
            <p className="text-muted-foreground">
              View and manage your health information
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Profile?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all your profile data. You'll need to set up your profile again.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white hover:bg-gray-100">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    className="text-white hover:opacity-90"
                    style={{ backgroundColor: '#c77070' }}
                  >
                    Reset Profile
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-soft-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-sage-light rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-brand-sage" />
                </div>
                <CardTitle>Physical Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Height
                  </div>
                  <div className="text-2xl font-semibold">{profile.height} cm</div>
                  <div className="text-xs text-muted-foreground">
                    {(profile.height / 2.54 / 12).toFixed(1)} ft
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Weight
                  </div>
                  <div className="text-2xl font-semibold">{profile.weight} kg</div>
                  <div className="text-xs text-muted-foreground">
                    {(profile.weight * 2.20462).toFixed(1)} lbs
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Age
                  </div>
                  <div className="text-2xl font-semibold">{profile.age} years</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Gender
                  </div>
                  <div className="text-2xl font-semibold capitalize">{profile.gender}</div>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Activity Level
                </div>
                <div className="text-lg font-medium">
                  {activityLabels[profile.activityLevel]}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calculated Metrics */}
          <Card className="shadow-soft-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-blue-light rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-brand-blue" />
                </div>
                <CardTitle>Metabolic Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    BMI
                  </div>
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
                <div className="text-3xl font-heading font-bold">{profile.bmi.toFixed(1)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    BMR
                  </div>
                  <div className="text-2xl font-semibold">{profile.bmr}</div>
                  <div className="text-xs text-muted-foreground">cal/day at rest</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    TDEE
                  </div>
                  <div className="text-2xl font-semibold">{profile.tdee}</div>
                  <div className="text-xs text-muted-foreground">total cal/day</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Goals */}
        <Card className="shadow-soft-lg mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-terracotta-light rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-brand-terracotta" />
              </div>
              <CardTitle>Daily Goals</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Calories
                </div>
                <div className="text-3xl font-semibold text-brand-sage">
                  {profile.calorieTarget}
                </div>
                <div className="text-xs text-muted-foreground">cal/day</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Protein
                </div>
                <div className="text-3xl font-semibold text-brand-terracotta">
                  {profile.proteinTarget}
                </div>
                <div className="text-xs text-muted-foreground">grams</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Carbs
                </div>
                <div className="text-3xl font-semibold text-brand-blue">
                  {profile.carbsTarget}
                </div>
                <div className="text-xs text-muted-foreground">grams</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Fat
                </div>
                <div className="text-3xl font-semibold text-brand-sage-dark">
                  {profile.fatTarget}
                </div>
                <div className="text-xs text-muted-foreground">grams</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Workout Calorie Goal
                </div>
                <div className="text-xl font-semibold">{profile.workoutCalorieGoal}</div>
                <div className="text-xs text-muted-foreground">cal/week</div>
              </div>
              {profile.workoutDaysPerWeek !== undefined && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Workout Days
                  </div>
                  <div className="text-xl font-semibold">{profile.workoutDaysPerWeek}</div>
                  <div className="text-xs text-muted-foreground">days/week</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dietary Restrictions */}
        {profile.dietaryRestrictions && profile.dietaryRestrictions.length > 0 && (
          <Card className="shadow-soft-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-sage-light rounded-lg flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-brand-sage" />
                </div>
                <CardTitle>Dietary Restrictions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.dietaryRestrictions.map((restriction) => (
                  <Badge key={restriction} variant="secondary" className="capitalize">
                    {restriction.replace(/-/g, ' ')}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
