import { create } from 'zustand'
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

  fetchTransfers: async (_careerId: string) => {
    set({ loading: true })
    set({ transfers: [], loading: false })
  },

  createTransfer: async (_careerId: string, _input: CreateTransferInput) => {
    throw new Error('Not implemented yet: Transfer store will be migrated to Firestore next.')
  },

  deleteTransfer: async (_id: string) => {
    throw new Error('Not implemented yet: Transfer store will be migrated to Firestore next.')
  },
}))
