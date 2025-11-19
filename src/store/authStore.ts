import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { AuthState, User } from '@/types/auth.types'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  checkAuth: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          displayName: session.user.user_metadata?.display_name,
          avatarUrl: session.user.user_metadata?.avatar_url,
        }
        set({ user, loading: false })
      } else {
        set({ user: null, loading: false })
      }
    } catch (error) {
      console.error('Auth check error:', error)
      set({ user: null, loading: false })
    }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        displayName: data.user.user_metadata?.display_name,
        avatarUrl: data.user.user_metadata?.avatar_url,
      }
      set({ user })
    }
  },

  signUp: async (email: string, password: string, displayName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    if (error) throw error

    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        displayName: displayName,
      }
      set({ user })
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
