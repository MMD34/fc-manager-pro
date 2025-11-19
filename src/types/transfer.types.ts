export type TransferType = 'sale' | 'purchase'

export interface Transfer {
  id: string
  career_id: string
  player_id?: string | null
  player_name: string
  type: TransferType
  amount: number
  season: number
  transfer_date?: string | null
  from_club?: string | null
  to_club?: string | null
  notes?: string | null
  created_at: string
}

export interface CreateTransferInput {
  player_name: string
  type: TransferType
  amount: number
  season: number
  transfer_date?: string
  from_club?: string
  to_club?: string
  notes?: string
  player_id?: string
}
