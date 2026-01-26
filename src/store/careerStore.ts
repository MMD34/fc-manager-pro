import { create } from 'zustand'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import type { Career, CreateCareerInput, UpdateCareerInput, ProjectType } from '@/types/career.types'

interface CareerState {
  careers: Career[]
  activeCareer: Career | null
  currentCareer: Career | null
  loading: boolean
  error: string | null
  fetchCareers: () => Promise<void>
  createCareer: (input: CreateCareerInput) => Promise<Career>
  updateCareer: (id: string, input: UpdateCareerInput) => Promise<void>
  deleteCareer: (id: string) => Promise<void>
  setActiveCareer: (career: Career | null) => void
  fetchCareerById: (id: string) => Promise<void>
}

const DEFAULT_PROJECT_TYPE: ProjectType = 'custom'

const getUserId = () => {
  const user = useAuthStore.getState().user
  if (!user) throw new Error('Not authenticated')
  return user.uid
}

const toIsoString = (value?: Timestamp | string) => {
  if (!value) return new Date().toISOString()
  if (value instanceof Timestamp) return value.toDate().toISOString()
  return value
}

const normalizeCareer = (
  id: string,
  data: Partial<Career> & { created_at?: Timestamp | string; updated_at?: Timestamp | string },
  uid: string
): Career => {
  const nowIso = new Date().toISOString()
  return {
    id,
    user_id: data.user_id ?? uid,
    club_name: data.club_name ?? 'Unknown Club',
    club_id: data.club_id ?? null,
    league_name: data.league_name ?? 'Unknown League',
    country: data.country ?? 'Unknown',
    manager_name: data.manager_name ?? 'Unknown Manager',
    project_type: data.project_type ?? DEFAULT_PROJECT_TYPE,
    current_season: data.current_season ?? 1,
    budget: data.budget ?? 0,
    difficulty: data.difficulty ?? 'Normal',
    start_date: data.start_date ?? nowIso,
    is_active: data.is_active ?? true,
    is_archived: data.is_archived ?? false,
    settings: data.settings,
    created_at: toIsoString(data.created_at),
    updated_at: toIsoString(data.updated_at),
  }
}

export const useCareerStore = create<CareerState>((set) => ({
  careers: [],
  activeCareer: null,
  currentCareer: null,
  loading: false,
  error: null,

  fetchCareers: async () => {
    set({ loading: true, error: null })
    try {
      const uid = getUserId()
      const careersRef = collection(db, 'users', uid, 'careers')
      const careersQuery = query(careersRef, orderBy('created_at', 'desc'))
      const snapshot = await getDocs(careersQuery)
      const careers = snapshot.docs.map((docSnap) =>
        normalizeCareer(docSnap.id, docSnap.data() as Partial<Career>, uid)
      )
      set({ careers, loading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load careers'
      set({ loading: false, error: message })
    }
  },

  createCareer: async (input: CreateCareerInput) => {
    set({ loading: true, error: null })
    try {
      const uid = getUserId()
      const nowIso = new Date().toISOString()
      const payload = {
        user_id: uid,
        club_name: input.club_name,
        league_name: input.league_name,
        country: input.country ?? 'Unknown',
        manager_name: input.manager_name,
        project_type: input.project_type ?? DEFAULT_PROJECT_TYPE,
        current_season: input.current_season ?? 1,
        budget: input.budget ?? 0,
        difficulty: input.difficulty ?? 'Normal',
        start_date: nowIso,
        is_active: true,
        is_archived: false,
        settings: {},
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, 'users', uid, 'careers'), payload)
      const career = normalizeCareer(
        docRef.id,
        { ...payload, created_at: nowIso, updated_at: nowIso },
        uid
      )

      set((state) => ({
        careers: [career, ...state.careers],
        loading: false,
      }))

      return career
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create career'
      set({ loading: false, error: message })
      throw error
    }
  },

  updateCareer: async (id: string, input: UpdateCareerInput) => {
    set({ loading: true, error: null })
    try {
      const uid = getUserId()
      const careerRef = doc(db, 'users', uid, 'careers', id)
      const updatedAt = new Date().toISOString()
      await updateDoc(careerRef, {
        ...input,
        updated_at: serverTimestamp(),
      })

      set((state) => ({
        careers: state.careers.map((career) =>
          career.id === id ? { ...career, ...input, updated_at: updatedAt } : career
        ),
        activeCareer:
          state.activeCareer?.id === id
            ? { ...state.activeCareer, ...input, updated_at: updatedAt }
            : state.activeCareer,
        currentCareer:
          state.currentCareer?.id === id
            ? { ...state.currentCareer, ...input, updated_at: updatedAt }
            : state.currentCareer,
        loading: false,
      }))
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
      await deleteDoc(doc(db, 'users', uid, 'careers', id))
      set((state) => ({
        careers: state.careers.filter((career) => career.id !== id),
        activeCareer: state.activeCareer?.id === id ? null : state.activeCareer,
        currentCareer: state.currentCareer?.id === id ? null : state.currentCareer,
        loading: false,
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete career'
      set({ loading: false, error: message })
      throw error
    }
  },

  setActiveCareer: (career: Career | null) => {
    set({ activeCareer: career, currentCareer: career })
  },

  fetchCareerById: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const uid = getUserId()
      const snapshot = await getDoc(doc(db, 'users', uid, 'careers', id))
      if (!snapshot.exists()) {
        set({ loading: false, currentCareer: null, activeCareer: null })
        return
      }
      const career = normalizeCareer(snapshot.id, snapshot.data() as Partial<Career>, uid)
      set({ currentCareer: career, activeCareer: career, loading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load career'
      set({ loading: false, error: message })
      throw error
    }
  },
}))
