import { create } from 'zustand'
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

  fetchEntries: async (_careerId: string) => {
    set({ loading: true })
    set({ entries: [], loading: false })
  },

  createEntry: async (_careerId: string, _input: CreateJournalInput) => {
    throw new Error('Not implemented yet: Journal store will be migrated to Firestore next.')
  },

  updateEntry: async (_id: string, _input: UpdateJournalInput) => {
    throw new Error('Not implemented yet: Journal store will be migrated to Firestore next.')
  },

  deleteEntry: async (_id: string) => {
    throw new Error('Not implemented yet: Journal store will be migrated to Firestore next.')
  },
}))
