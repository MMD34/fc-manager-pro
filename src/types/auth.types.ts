export interface User {
  id: string
  email: string
  displayName?: string
  avatarUrl?: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}
