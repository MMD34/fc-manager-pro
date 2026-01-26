import { create } from 'zustand'
import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import type { AuthState } from '@/types/auth.types'

const mapAuthError = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/user-not-found':
        return 'No account found with this email.'
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.'
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.'
      default:
        return 'Authentication failed. Please try again.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Authentication failed. Please try again.'
}

let authListenerUnsubscribe: (() => void) | null = null

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  authError: null,

  initAuthListener: () => {
    if (authListenerUnsubscribe) {
      return authListenerUnsubscribe
    }

    set({ isLoading: true })
    authListenerUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      set({ user: firebaseUser, isLoading: false })
    })

    return authListenerUnsubscribe
  },

  signIn: async (email: string, password: string) => {
    set({ authError: null })
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      set({ user: credential.user })
    } catch (error) {
      set({ authError: mapAuthError(error) })
      throw error
    }
  },

  signUp: async (email: string, password: string, displayName?: string) => {
    set({ authError: null })
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(credential.user, { displayName })
      }
      set({ user: credential.user })
    } catch (error) {
      set({ authError: mapAuthError(error) })
      throw error
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth)
    set({ user: null, authError: null })
  },
}))
