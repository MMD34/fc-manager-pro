export type PlayerOrigin = 'Académie' | 'Initial' | 'Acheté'
export type PlayerStatus = 'Titulaire' | 'Remplaçant' | 'Réserve' | 'À vendre' | 'Prêt'

export interface Player {
  id: string
  career_id: string
  first_name: string
  last_name: string
  position: string
  ovr: number
  potential: number
  age: number
  origin: PlayerOrigin
  salary: number
  value: number
  status: PlayerStatus
  play_styles: number
  play_styles_plus: number
  matches_played: number
  minutes_played: number
  goals: number
  assists: number
  clean_sheets: number
  contract_expiry?: string | null
  jersey_number?: number | null
  nationality?: string | null
  photo_url?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface CreatePlayerInput {
  first_name: string
  last_name: string
  position: string
  ovr: number
  potential: number
  age: number
  origin: PlayerOrigin
  salary: number
  value: number
  status: PlayerStatus
  play_styles?: number
  play_styles_plus?: number
  jersey_number?: number | null
  nationality?: string | null
  contract_expiry?: string | null
  notes?: string | null
}

export interface UpdatePlayerInput extends Partial<CreatePlayerInput> {
  matches_played?: number
  minutes_played?: number
  goals?: number
  assists?: number
  clean_sheets?: number
}
