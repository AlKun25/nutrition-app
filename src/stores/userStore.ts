import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile } from '@/types'
import { db } from '@/lib/db'

interface UserState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
}

interface UserActions {
  setProfile: (profile: UserProfile) => void
  loadProfile: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => void
  clearProfile: () => void
}

type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      isLoading: false,
      error: null,

      // Actions
      setProfile: (profile) => {
        set({ profile, error: null })
      },

      loadProfile: async () => {
        set({ isLoading: true, error: null })
        try {
          const profile = await db.userProfile.toCollection().first()
          if (profile) {
            set({ profile, isLoading: false, error: null })
          } else {
            set({ profile: null, isLoading: false, error: null })
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load profile'
          set({ error: errorMessage, isLoading: false })
        }
      },

      updateProfile: (updates) => {
        const currentProfile = get().profile
        if (currentProfile) {
          const updatedProfile: UserProfile = {
            ...currentProfile,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
          set({ profile: updatedProfile, error: null })
        }
      },

      clearProfile: () => {
        set({ profile: null, error: null })
      },
    }),
    {
      name: 'nutrition-app-user-profile',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
)

