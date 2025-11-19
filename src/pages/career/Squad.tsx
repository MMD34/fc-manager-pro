import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePlayerStore } from '@/store/playerStore'
import { Button } from '@/components/common/Button'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import PlayerModal from '@/components/squad/PlayerModal'
import type { Player } from '@/types'

export default function Squad() {
  const { careerId } = useParams()
  const { players, loading, fetchPlayers, deletePlayer } = usePlayerStore()
  const [showModal, setShowModal] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)

  useEffect(() => {
    if (careerId) {
      fetchPlayers(careerId)
    }
  }, [careerId, fetchPlayers])

  const handleEdit = (player: Player) => {
    setEditingPlayer(player)
    setShowModal(true)
  }

  const handleDelete = async (playerId: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      await deletePlayer(playerId)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPlayer(null)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-600 dark:text-gray-400">Loading players...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Squad Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {players.length} players in squad
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Player
        </Button>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No players in squad. Add your first player to get started!
          </p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Player
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Name
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Position
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    OVR
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Pot
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Age
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Origin
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr
                    key={player.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {player.first_name} {player.last_name}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {player.position}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold">
                        {player.ovr}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold">
                        {player.potential}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {player.age}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          player.origin === 'Académie'
                            ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                            : player.origin === 'Acheté'
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {player.origin}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          player.status === 'Titulaire'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : player.status === 'Remplaçant'
                            ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                            : player.status === 'À vendre'
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {player.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(player)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(player.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <PlayerModal
          careerId={careerId!}
          player={editingPlayer}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
