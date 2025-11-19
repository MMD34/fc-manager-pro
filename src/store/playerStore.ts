import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Player, CreatePlayerInput, UpdatePlayerInput } from '@/types/player.types'

interface PlayerState {
  players: Player[]
  loading: boolean
  fetchPlayers: (careerId: string) => Promise<void>
  createPlayer: (careerId: string, input: CreatePlayerInput) => Promise<Player>
  updatePlayer: (id: string, input: UpdatePlayerInput) => Promise<void>
  deletePlayer: (id: string) => Promise<void>
}

export const usePlayerStore = create<PlayerState>((set) => ({
  players: [],
  loading: false,

  fetchPlayers: async (careerId: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('career_id', careerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ players: data || [], loading: false })
    } catch (error) {
      console.error('Error fetching players:', error)
      set({ loading: false })
      throw error
    }
  },

  createPlayer: async (careerId: string, input: CreatePlayerInput) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert({
          ...input,
          career_id: careerId,
        })
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        players: [data, ...state.players],
      }))

      return data
    } catch (error) {
      console.error('Error creating player:', error)
      throw error
    }
  },

  updatePlayer: async (id: string, input: UpdatePlayerInput) => {
    try {
      const { data, error} = await supabase
        .from('players')
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        players: state.players.map((p) => (p.id === id ? data : p)),
      }))
    } catch (error) {
      console.error('Error updating player:', error)
      throw error
    }
  },

  deletePlayer: async (id: string) => {
    try {
      const { error } = await supabase.from('players').delete().eq('id', id)

      if (error) throw error

      set((state) => ({
        players: state.players.filter((p) => p.id !== id),
      }))
    } catch (error) {
      console.error('Error deleting player:', error)
      throw error
    }
  },
}))
