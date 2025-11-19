import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { JournalEntry, CreateJournalInput, UpdateJournalInput } from '@/types/journal.types'

interface JournalState {
  entries: JournalEntry[]
  loading: boolean
  fetchEntries: (careerId: string) => Promise<void>
  createEntry: (input: CreateJournalInput) => Promise<JournalEntry | null>
  updateEntry: (id: string, input: UpdateJournalInput) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
}

export const useJournalStore = create<JournalState>((set, get) => ({
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
    }
  },

  createEntry: async (input: CreateJournalInput) => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([input])
        .select()
        .single()

      if (error) throw error

      // Add to local state (at the beginning since we sort by date desc)
      set({ entries: [data, ...get().entries] })
      return data
    } catch (error) {
      console.error('Error creating journal entry:', error)
      return null
    }
  },

  updateEntry: async (id: string, input: UpdateJournalInput) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .update(input)
        .eq('id', id)

      if (error) throw error

      // Update local state
      set({
        entries: get().entries.map((e) =>
          e.id === id ? { ...e, ...input } : e
        ),
      })
    } catch (error) {
      console.error('Error updating journal entry:', error)
    }
  },

  deleteEntry: async (id: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Remove from local state
      set({
        entries: get().entries.filter((e) => e.id !== id),
      })
    } catch (error) {
      console.error('Error deleting journal entry:', error)
    }
  },
}))
