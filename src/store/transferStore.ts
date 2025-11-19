import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Transfer, CreateTransferInput } from '@/types/transfer.types'

interface TransferState {
  transfers: Transfer[]
  loading: boolean
  fetchTransfers: (careerId: string) => Promise<void>
  createTransfer: (input: CreateTransferInput) => Promise<Transfer | null>
  updateTransfer: (id: string, input: Partial<CreateTransferInput>) => Promise<void>
  deleteTransfer: (id: string) => Promise<void>
}

export const useTransferStore = create<TransferState>((set, get) => ({
  transfers: [],
  loading: false,

  fetchTransfers: async (careerId: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('transfers')
        .select('*')
        .eq('career_id', careerId)
        .order('transfer_date', { ascending: false })

      if (error) throw error
      set({ transfers: data || [], loading: false })
    } catch (error) {
      console.error('Error fetching transfers:', error)
      set({ loading: false })
    }
  },

  createTransfer: async (input: CreateTransferInput) => {
    try {
      const { data, error } = await supabase
        .from('transfers')
        .insert([input])
        .select()
        .single()

      if (error) throw error

      // Add to local state
      set({ transfers: [data, ...get().transfers] })
      return data
    } catch (error) {
      console.error('Error creating transfer:', error)
      return null
    }
  },

  updateTransfer: async (id: string, input: Partial<CreateTransferInput>) => {
    try {
      const { error } = await supabase
        .from('transfers')
        .update(input)
        .eq('id', id)

      if (error) throw error

      // Update local state
      set({
        transfers: get().transfers.map((t) =>
          t.id === id ? { ...t, ...input } : t
        ),
      })
    } catch (error) {
      console.error('Error updating transfer:', error)
    }
  },

  deleteTransfer: async (id: string) => {
    try {
      const { error } = await supabase.from('transfers').delete().eq('id', id)

      if (error) throw error

      // Remove from local state
      set({
        transfers: get().transfers.filter((t) => t.id !== id),
      })
    } catch (error) {
      console.error('Error deleting transfer:', error)
    }
  },
}))
