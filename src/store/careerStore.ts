import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Career, CreateCareerInput, UpdateCareerInput } from '@/types/career.types'

interface CareerState {
  careers: Career[]
  activeCareer: Career | null
  loading: boolean
  fetchCareers: () => Promise<void>
  createCareer: (input: CreateCareerInput) => Promise<Career>
  updateCareer: (id: string, input: UpdateCareerInput) => Promise<void>
  deleteCareer: (id: string) => Promise<void>
  setActiveCareer: (career: Career | null) => void
}

export const useCareerStore = create<CareerState>((set, get) => ({
  careers: [],
  activeCareer: null,
  loading: false,

  fetchCareers: async () => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ careers: data || [], loading: false })
    } catch (error) {
      console.error('Error fetching careers:', error)
      set({ loading: false })
      throw error
    }
  },

  createCareer: async (input: CreateCareerInput) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('careers')
        .insert({
          ...input,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        careers: [data, ...state.careers],
      }))

      return data
    } catch (error) {
      console.error('Error creating career:', error)
      throw error
    }
  },

  updateCareer: async (id: string, input: UpdateCareerInput) => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        careers: state.careers.map((c) => (c.id === id ? data : c)),
        activeCareer: state.activeCareer?.id === id ? data : state.activeCareer,
      }))
    } catch (error) {
      console.error('Error updating career:', error)
      throw error
    }
  },

  deleteCareer: async (id: string) => {
    try {
      const { error } = await supabase.from('careers').delete().eq('id', id)

      if (error) throw error

      set((state) => ({
        careers: state.careers.filter((c) => c.id !== id),
        activeCareer: state.activeCareer?.id === id ? null : state.activeCareer,
      }))
    } catch (error) {
      console.error('Error deleting career:', error)
      throw error
    }
  },

  setActiveCareer: (career: Career | null) => {
    set({ activeCareer: career })
  },
}))
