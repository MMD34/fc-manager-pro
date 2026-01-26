import { create } from 'zustand'
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

  fetchPlayers: async (_careerId: string) => {
    set({ loading: true })
    set({ players: [], loading: false })
  },

  createPlayer: async (_careerId: string, _input: CreatePlayerInput) => {
    throw new Error('Not implemented yet: Player store will be migrated to Firestore next.')
  },

  updatePlayer: async (_id: string, _input: UpdatePlayerInput) => {
    throw new Error('Not implemented yet: Player store will be migrated to Firestore next.')
  },

  deletePlayer: async (_id: string) => {
    throw new Error('Not implemented yet: Player store will be migrated to Firestore next.')
  },
}))
