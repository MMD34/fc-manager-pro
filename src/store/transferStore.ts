import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Transfer, CreateTransferInput } from '@/types/transfer.types'

interface TransferState {
  transfers: Transfer[]
  loading: boolean
  fetchTransfers: (careerId: string) => Promise<void>
  createTransfer: (careerId: string, input: CreateTransferInput) => Promise<Transfer>
  deleteTransfer: (id: string) => Promise<void>
}

export const useTransferStore = create<TransferState>((set) => ({
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
      throw error
    }
  },

  createTransfer: async (careerId: string, input: CreateTransferInput) => {
    try {
      const { data, error } = await supabase
        .from('transfers')
        .insert({
          ...input,
          career_id: careerId,
        })
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        transfers: [data, ...state.transfers],
      }))

      return data
    } catch (error) {
      console.error('Error creating transfer:', error)
      throw error
    }
  },

  deleteTransfer: async (id: string) => {
    try {
      const { error } = await supabase.from('transfers').delete().eq('id', id)

      if (error) throw error

      set((state) => ({
        transfers: state.transfers.filter((t) => t.id !== id),
      }))
    } catch (error) {
      console.error('Error deleting transfer:', error)
      throw error
    }
  },
}))
