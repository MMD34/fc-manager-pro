import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
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

  fetchBudgetEntries: async (careerId: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('budget_entries')
        .select('*')
        .eq('career_id', careerId)
        .order('season', { ascending: true })

      if (error) throw error
      set({ budgetEntries: data || [], loading: false })
    } catch (error) {
      console.error('Error fetching budget entries:', error)
      set({ loading: false })
      throw error
    }
  },

  updateBudgetEntry: async (id: string, input: UpdateBudgetInput) => {
    try {
      const { data, error } = await supabase
        .from('budget_entries')
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        budgetEntries: state.budgetEntries.map((entry) =>
          entry.id === id ? data : entry
        ),
      }))
    } catch (error) {
      console.error('Error updating budget entry:', error)
      throw error
    }
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
