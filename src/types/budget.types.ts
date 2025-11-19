export interface BudgetEntry {
  id: string
  career_id: string
  season: number
  initial_budget: number
  transfer_sales: number
  transfer_purchases: number
  match_revenue: number
  wage_expenses: number
  other_revenue: number
  other_expenses: number
  final_balance: number
  created_at: string
  updated_at: string
}

export interface UpdateBudgetInput {
  initial_budget?: number
  match_revenue?: number
  wage_expenses?: number
  other_revenue?: number
  other_expenses?: number
}
