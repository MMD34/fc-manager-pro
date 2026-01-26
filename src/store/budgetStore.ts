import { create } from 'zustand'
import type { BudgetEntry, UpdateBudgetInput } from '@/types/budget.types'

interface BudgetState {
  budgetEntries: BudgetEntry[]
  loading: boolean
  fetchBudgetEntries: (careerId: string) => Promise<void>
  updateBudgetEntry: (id: string, input: UpdateBudgetInput) => Promise<void>
  calculateBalance: (entry: BudgetEntry) => number
}

export const useBudgetStore = create<BudgetState>((set) => ({
  budgetEntries: [],
  loading: false,

  fetchBudgetEntries: async (_careerId: string) => {
    set({ loading: true })
    set({ budgetEntries: [], loading: false })
  },

  updateBudgetEntry: async (_id: string, _input: UpdateBudgetInput) => {
    throw new Error('Not implemented yet: Budget store will be migrated to Firestore next.')
  },

  calculateBalance: (entry: BudgetEntry) => {
    return (
      entry.initial_budget +
      (entry.transfer_sales || 0) -
      (entry.transfer_purchases || 0) +
      (entry.match_revenue || 0) -
      (entry.wage_expenses || 0) -
      (entry.other_expenses || 0)
    )
  },
}))
