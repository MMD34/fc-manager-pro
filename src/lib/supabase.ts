type SupabaseError = Error

type SupabaseResponse<T> = {
  data: T
  error: SupabaseError | null
}

type AuthSession = {
  user: null
}

type AuthUser = {
  id: string
  email: string
  user_metadata?: Record<string, string>
}

interface QueryBuilder<T> extends PromiseLike<SupabaseResponse<T>> {
  select: (...args: unknown[]) => QueryBuilder<unknown>
  insert: (...args: unknown[]) => QueryBuilder<unknown>
  update: (...args: unknown[]) => QueryBuilder<unknown>
  delete: (...args: unknown[]) => QueryBuilder<unknown>
  order: (...args: unknown[]) => QueryBuilder<unknown>
  eq: (...args: unknown[]) => QueryBuilder<unknown>
  single: () => QueryBuilder<unknown>
}

const disabledError = (action: string) =>
  new Error(`Supabase is disabled. Firebase is the active backend (${action}).`)

const createDisabledQuery = (): QueryBuilder<unknown> => {
  const result: SupabaseResponse<unknown> = {
    data: null,
    error: disabledError('query'),
  }

  const builder: QueryBuilder<unknown> = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    order: () => builder,
    eq: () => builder,
    single: () => builder,
    then: (onfulfilled, onrejected) =>
      Promise.resolve(result).then(onfulfilled, onrejected),
  }

  return builder
}

export const supabase = {
  auth: {
    getSession: async (): Promise<SupabaseResponse<{ session: AuthSession | null }>> => ({
      data: { session: null },
      error: null,
    }),
    getUser: async (): Promise<SupabaseResponse<{ user: AuthUser | null }>> => ({
      data: { user: null },
      error: null,
    }),
    signInWithPassword: async (): Promise<SupabaseResponse<{ user: AuthUser | null }>> => ({
      data: { user: null },
      error: disabledError('auth.signInWithPassword'),
    }),
    signUp: async (): Promise<SupabaseResponse<{ user: AuthUser | null }>> => ({
      data: { user: null },
      error: disabledError('auth.signUp'),
    }),
    signOut: async (): Promise<SupabaseResponse<null>> => ({
      data: null,
      error: disabledError('auth.signOut'),
    }),
  },
  from: () => createDisabledQuery(),
}
