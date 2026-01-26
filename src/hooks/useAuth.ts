import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, isLoading, authError, signIn, signUp, signOut, initAuthListener } = useAuthStore()

  return {
    user,
    isLoading,
    authError,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    initAuthListener,
  }
}
