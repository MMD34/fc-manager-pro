export type ProjectType = 'academie' | 'trophees' | 'budget' | 'custom'

export interface Career {
  id: string
  user_id: string
  club_name: string
  club_id?: string | null
  league_name: string
  country: string
  manager_name: string
  project_type: ProjectType
  current_season: number
  budget: number
  difficulty: string
  start_date: string
  is_active: boolean
  is_archived: boolean
  settings?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CreateCareerInput {
  club_name: string
  league_name: string
  country?: string
  manager_name: string
  project_type?: ProjectType
  current_season?: number
  budget?: number
  difficulty?: string
}

export interface UpdateCareerInput {
  club_name?: string
  league_name?: string
  country?: string
  project_type?: ProjectType
  current_season?: number
  is_active?: boolean
  is_archived?: boolean
}
