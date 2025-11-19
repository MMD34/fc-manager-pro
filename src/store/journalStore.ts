import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { JournalEntry, CreateJournalInput, UpdateJournalInput } from '@/types/journal.types'

interface JournalState {
  entries: JournalEntry[]
  loading: boolean
  fetchEntries: (careerId: string) => Promise<void>
  createEntry: (careerId: string, input: CreateJournalInput) => Promise<JournalEntry>
  updateEntry: (id: string, input: UpdateJournalInput) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  loading: false,

  fetchEntries: async (careerId: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('career_id', careerId)
        .order('entry_date', { ascending: false })

      if (error) throw error
      set({ entries: data || [], loading: false })
    } catch (error) {
      console.error('Error fetching journal entries:', error)
      set({ loading: false })
      throw error
    }
  },

  createEntry: async (careerId: string, input: CreateJournalInput) => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          ...input,
          career_id: careerId,
        })
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        entries: [data, ...state.entries],
      }))

      return data
    } catch (error) {
      console.error('Error creating journal entry:', error)
      throw error
    }
  },

  updateEntry: async (id: string, input: UpdateJournalInput) => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        entries: state.entries.map((entry) => (entry.id === id ? data : entry)),
      }))
    } catch (error) {
      console.error('Error updating journal entry:', error)
      throw error
    }
  },

  deleteEntry: async (id: string) => {
    try {
      const { error } = await supabase.from('journal_entries').delete().eq('id', id)

      if (error) throw error

      set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
      }))
    } catch (error) {
      console.error('Error deleting journal entry:', error)
      throw error
    }
  },
}))
