// Database type definitions for FC Manager Pro
// These types match the Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      careers: {
        Row: {
          id: string
          user_id: string
          club_name: string
          club_id: string | null
          league_name: string
          country: string
          project_type: 'academie' | 'trophees' | 'budget' | 'custom'
          current_season: number
          start_date: string
          is_active: boolean
          is_archived: boolean
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          club_name: string
          club_id?: string | null
          league_name: string
          country: string
          project_type: 'academie' | 'trophees' | 'budget' | 'custom'
          current_season?: number
          start_date?: string
          is_active?: boolean
          is_archived?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          club_name?: string
          club_id?: string | null
          league_name?: string
          country?: string
          project_type?: 'academie' | 'trophees' | 'budget' | 'custom'
          current_season?: number
          start_date?: string
          is_active?: boolean
          is_archived?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: string
          career_id: string
          first_name: string
          last_name: string
          position: string
          ovr: number
          potential: number
          age: number
          origin: 'Académie' | 'Initial' | 'Acheté'
          salary: number
          value: number
          status: 'Titulaire' | 'Remplaçant' | 'Réserve' | 'À vendre' | 'Prêt'
          play_styles: number
          play_styles_plus: number
          matches_played: number
          minutes_played: number
          goals: number
          assists: number
          clean_sheets: number
          contract_expiry: string | null
          jersey_number: number | null
          nationality: string | null
          photo_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          career_id: string
          first_name: string
          last_name: string
          position: string
          ovr: number
          potential: number
          age: number
          origin: 'Académie' | 'Initial' | 'Acheté'
          salary?: number
          value?: number
          status: 'Titulaire' | 'Remplaçant' | 'Réserve' | 'À vendre' | 'Prêt'
          play_styles?: number
          play_styles_plus?: number
          matches_played?: number
          minutes_played?: number
          goals?: number
          assists?: number
          clean_sheets?: number
          contract_expiry?: string | null
          jersey_number?: number | null
          nationality?: string | null
          photo_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          career_id?: string
          first_name?: string
          last_name?: string
          position?: string
          ovr?: number
          potential?: number
          age?: number
          origin?: 'Académie' | 'Initial' | 'Acheté'
          salary?: number
          value?: number
          status?: 'Titulaire' | 'Remplaçant' | 'Réserve' | 'À vendre' | 'Prêt'
          play_styles?: number
          play_styles_plus?: number
          matches_played?: number
          minutes_played?: number
          goals?: number
          assists?: number
          clean_sheets?: number
          contract_expiry?: string | null
          jersey_number?: number | null
          nationality?: string | null
          photo_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add more table types as needed
    }
    Views: {
      career_dashboard_stats: {
        Row: {
          career_id: string
          club_name: string
          current_season: number
          total_players: number
          academy_players: number
          avg_ovr: number
          players_7plus_playstyles: number
          current_budget: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
