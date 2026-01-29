import { create } from 'zustand'
import type { Career, CreateCareerInput, UpdateCareerInput } from '@/types/career.types'
import { useAuthStore } from '@/store/authStore'
import {
  listCareers,
  createCareer as createCareerDoc,
  updateCareer as updateCareerDoc,
  deleteCareer as deleteCareerDoc,
  getCareer as getCareerDoc,
} from '@/services/firestore/careers'

interface CareerState {
  careers: Career[]
  activeCareerId: string | null
  activeCareer: Career | null
  loading: boolean
  error: string | null
  loadCareers: () => Promise<void>
  createCareer: (input: CreateCareerInput) => Promise<Career>
  updateCareer: (id: string, patch: UpdateCareerInput) => Promise<Career>
  deleteCareer: (id: string) => Promise<void>
  setActiveCareer: (id: string | null) => void
  hydrateActiveCareer: (careers?: Career[]) => void
  fetchCareerById: (id: string) => Promise<void>
}

const ACTIVE_CAREER_KEY = 'fc_active_career_id'

const getUserId = () => {
  const user = useAuthStore.getState().user
  if (!user) throw new Error('Not authenticated')
  return user.uid
}

export const useCareerStore = create<CareerState>((set, get) => ({
  careers: [],
  activeCareerId: null,
  activeCareer: null,
  loading: false,
  error: null,

  loadCareers: async () => {
    set({ loading: true, error: null })
    try {
      const uid = getUserId()
      const careers = await listCareers(uid)
      set({ careers, loading: false })
      get().hydrateActiveCareer(careers)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load careers'
      set({ loading: false, error: message })
    }
  },

  createCareer: async (input: CreateCareerInput) => {
    set({ loading: true, error: null })
    try {
      const uid = getUserId()
      const career = await createCareerDoc(uid, input)
      set((state) => ({
        careers: [career, ...state.careers],
        loading: false,
      }))
      get().setActiveCareer(career.id)
      return career
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create career'
      set({ loading: false, error: message })
      throw error
    }
  },

  updateCareer: async (id: string, patch: UpdateCareerInput) => {
    set({ loading: true, error: null })
    try {
      const uid = getUserId()
      const updated = await updateCareerDoc(uid, id, patch)
      set((state) => ({
        careers: state.careers.map((career) =>
          career.id === id ? updated : career
        ),
        activeCareer: state.activeCareer?.id === id ? updated : state.activeCareer,
        loading: false,
      }))
      return updated
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update career'
      set({ loading: false, error: message })
      throw error
    }
  },

  deleteCareer: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const uid = getUserId()
      await deleteCareerDoc(uid, id)
      set((state) => ({
        careers: state.careers.filter((career) => career.id !== id),
        loading: false,
      }))
      if (get().activeCareerId === id) {
        get().setActiveCareer(null)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete career'
      set({ loading: false, error: message })
      throw error
    }
  },

  setActiveCareer: (id: string | null) => {
    if (id) {
      localStorage.setItem(ACTIVE_CAREER_KEY, id)
    } else {
      localStorage.removeItem(ACTIVE_CAREER_KEY)
    }
    const career = id ? get().careers.find((item) => item.id === id) ?? null : null
    set({ activeCareerId: id, activeCareer: career })
  },

  hydrateActiveCareer: (careers = get().careers) => {
    const storedId = localStorage.getItem(ACTIVE_CAREER_KEY)
    if (!storedId) {
      set({ activeCareerId: null, activeCareer: null })
      return
    }
    const career = careers.find((item) => item.id === storedId)
    if (career) {
      set({ activeCareerId: storedId, activeCareer: career })
    } else {
      localStorage.removeItem(ACTIVE_CAREER_KEY)
      set({ activeCareerId: null, activeCareer: null })
    }
  },

  fetchCareerById: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const uid = getUserId()
      const career = await getCareerDoc(uid, id)
      set({
        activeCareer: career,
        activeCareerId: career?.id ?? null,
        loading: false,
      })
      if (career) {
        localStorage.setItem(ACTIVE_CAREER_KEY, career.id)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load career'
      set({ loading: false, error: message })
      throw error
    }
  },
}))
