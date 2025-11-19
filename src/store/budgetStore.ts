import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { BudgetEntry, UpdateBudgetInput } from '@/types/budget.types'

interface BudgetState {
  budgetEntries: BudgetEntry[]
  loading: boolean
  fetchBudgetEntries: (careerId: string) => Promise<void>
  fetchBudgetBySeason: (careerId: string, season: number) => Promise<BudgetEntry | null>
  updateBudgetEntry: (id: string, input: UpdateBudgetInput) => Promise<void>
  createBudgetEntry: (careerId: string, season: number) => Promise<BudgetEntry | null>
  calculateBalance: (entry: BudgetEntry) => number
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
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
    }
  },

  fetchBudgetBySeason: async (careerId: string, season: number) => {
    try {
      const { data, error } = await supabase
        .from('budget_entries')
        .select('*')
        .eq('career_id', careerId)
        .eq('season', season)
        .single()

      if (error) {
        // If not found, return null (entry doesn't exist yet)
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching budget by season:', error)
      return null
    }
  },

  createBudgetEntry: async (careerId: string, season: number) => {
    try {
      const { data, error } = await supabase
        .from('budget_entries')
        .insert([
          {
            career_id: careerId,
            season,
            initial_budget: 0,
            transfer_sales: 0,
            transfer_purchases: 0,
            match_revenue: 0,
            wage_expenses: 0,
            other_income: 0,
            other_expenses: 0,
            final_balance: 0,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Add to local state
      set({ budgetEntries: [...get().budgetEntries, data] })
      return data
    } catch (error) {
      console.error('Error creating budget entry:', error)
      return null
    }
  },

  updateBudgetEntry: async (id: string, input: UpdateBudgetInput) => {
    try {
      // Calculate final balance
      const entry = get().budgetEntries.find((e) => e.id === id)
      if (!entry) return

      const updatedEntry = { ...entry, ...input }
      const finalBalance = get().calculateBalance(updatedEntry)

      const { error } = await supabase
        .from('budget_entries')
        .update({ ...input, final_balance: finalBalance })
        .eq('id', id)

      if (error) throw error

      // Update local state
      set({
        budgetEntries: get().budgetEntries.map((e) =>
          e.id === id ? { ...e, ...input, final_balance: finalBalance } : e
        ),
      })
    } catch (error) {
      console.error('Error updating budget entry:', error)
    }
  },

  calculateBalance: (entry: BudgetEntry) => {
    const income =
      entry.initial_budget +
      entry.transfer_sales +
      entry.match_revenue +
      (entry.other_income || 0)

    const expenses =
      entry.transfer_purchases +
      entry.wage_expenses +
      (entry.other_expenses || 0)

    return income - expenses
  },
}))
