import { create } from 'zustand'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import type { AuthState, User } from '@/types/auth.types'

const mapFirebaseUser = (user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }): User => ({
  id: user.uid,
  email: user.email ?? '',
  displayName: user.displayName ?? undefined,
  avatarUrl: user.photoURL ?? undefined,
})

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  checkAuth: async () => {
    set({ loading: true })
    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          set({ user: mapFirebaseUser(firebaseUser), loading: false })
        } else {
          set({ user: null, loading: false })
        }
        unsubscribe()
        resolve()
      })
    })
  },

  signIn: async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    set({ user: mapFirebaseUser(credential.user) })
  },

  signUp: async (email: string, password: string, displayName?: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(credential.user, { displayName })
    }
    set({ user: mapFirebaseUser(credential.user) })
  },

  signOut: async () => {
    await firebaseSignOut(auth)
    set({ user: null })
  },
}))
