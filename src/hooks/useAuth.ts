import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, loading, signIn, signUp, signOut, checkAuth } = useAuthStore()

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    checkAuth,
  }
}
