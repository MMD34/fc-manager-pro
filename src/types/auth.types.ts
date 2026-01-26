import type { User as FirebaseUser } from 'firebase/auth'

export type User = FirebaseUser

export interface AuthState {
  user: User | null
  isLoading: boolean
  authError: string | null
  initAuthListener: () => () => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signOut: () => Promise<void>
}
