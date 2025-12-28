import { useUserStore } from '@/stores/userStore'
import type { UserProfile } from '@/types'

/**
 * Hook to get the current user profile
 */
export function useUserProfile(): UserProfile | null {
  return useUserStore((state) => state.profile)
}

/**
 * Hook to get user profile loading state
 */
export function useUserLoading(): boolean {
  return useUserStore((state) => state.isLoading)
}

/**
 * Hook to get user profile error state
 */
export function useUserError(): string | null {
  return useUserStore((state) => state.error)
}

/**
 * Hook to get all user actions
 */
export function useUserActions() {
  return useUserStore((state) => ({
    setProfile: state.setProfile,
    loadProfile: state.loadProfile,
    updateProfile: state.updateProfile,
    clearProfile: state.clearProfile,
  }))
}

/**
 * Hook to get a specific user action
 */
export function useSetProfile() {
  return useUserStore((state) => state.setProfile)
}

export function useLoadProfile() {
  return useUserStore((state) => state.loadProfile)
}

export function useUpdateProfile() {
  return useUserStore((state) => state.updateProfile)
}

export function useClearProfile() {
  return useUserStore((state) => state.clearProfile)
}

