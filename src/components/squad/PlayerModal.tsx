import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { usePlayerStore } from '@/store/playerStore'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import type { Player } from '@/types'

const playerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  position: z.string().min(1, 'Position is required'),
  ovr: z.coerce.number().min(40, 'Min 40').max(99, 'Max 99'),
  potential: z.coerce.number().min(40, 'Min 40').max(99, 'Max 99'),
  age: z.coerce.number().min(16, 'Min 16').max(45, 'Max 45'),
  origin: z.enum(['Académie', 'Initial', 'Acheté']),
  status: z.enum(['Titulaire', 'Remplaçant', 'Réserve', 'À vendre', 'Prêt']),
  salary: z.coerce.number().min(0, 'Must be positive'),
  value: z.coerce.number().min(0, 'Must be positive'),
  contract_years: z.coerce.number().min(0).max(10),
  nationality: z.string().optional(),
  weak_foot: z.coerce.number().min(1).max(5).optional(),
  skill_moves: z.coerce.number().min(1).max(5).optional(),
  work_rate_att: z.string().optional(),
  work_rate_def: z.string().optional(),
  play_styles: z.string().optional(),
  notes: z.string().optional(),
})

type PlayerFormData = z.infer<typeof playerSchema>

interface PlayerModalProps {
  careerId: string
  player?: Player | null
  onClose: () => void
}

export default function PlayerModal({ careerId, player, onClose }: PlayerModalProps) {
  const { createPlayer, updatePlayer } = usePlayerStore()
  const isEditing = !!player

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: player
      ? {
          first_name: player.first_name,
          last_name: player.last_name,
          position: player.position,
          ovr: player.ovr,
          potential: player.potential,
          age: player.age,
          origin: player.origin,
          status: player.status,
          salary: player.salary || 0,
          value: player.value || 0,
          contract_years: player.contract_years || 0,
          nationality: player.nationality || '',
          weak_foot: player.weak_foot || 3,
          skill_moves: player.skill_moves || 3,
          work_rate_att: player.work_rate_att || '',
          work_rate_def: player.work_rate_def || '',
          play_styles: player.play_styles || '',
          notes: player.notes || '',
        }
      : {
          first_name: '',
          last_name: '',
          position: 'ST',
          ovr: 70,
          potential: 80,
          age: 20,
          origin: 'Initial',
          status: 'Remplaçant',
          salary: 0,
          value: 0,
          contract_years: 3,
          nationality: '',
          weak_foot: 3,
          skill_moves: 3,
          work_rate_att: 'Medium',
          work_rate_def: 'Medium',
          play_styles: '',
          notes: '',
        },
  })

  const onSubmit = async (data: PlayerFormData) => {
    try {
      if (isEditing && player) {
        await updatePlayer(player.id, data)
      } else {
        await createPlayer({
          ...data,
          career_id: careerId,
        })
      }
      reset()
      onClose()
    } catch (error) {
      console.error('Error saving player:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Player' : 'Add New Player'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name *
                </label>
                <Input {...register('first_name')} />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name *
                </label>
                <Input {...register('last_name')} />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position *
                </label>
                <Input {...register('position')} placeholder="e.g., ST, CM, CB" />
                {errors.position && (
                  <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nationality
                </label>
                <Input {...register('nationality')} placeholder="e.g., France" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age *
                </label>
                <Input type="number" {...register('age')} />
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Stats</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Overall (OVR) *
                </label>
                <Input type="number" {...register('ovr')} />
                {errors.ovr && (
                  <p className="text-red-500 text-xs mt-1">{errors.ovr.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Potential *
                </label>
                <Input type="number" {...register('potential')} />
                {errors.potential && (
                  <p className="text-red-500 text-xs mt-1">{errors.potential.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weak Foot (1-5)
                </label>
                <Input type="number" {...register('weak_foot')} />
                {errors.weak_foot && (
                  <p className="text-red-500 text-xs mt-1">{errors.weak_foot.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skill Moves (1-5)
                </label>
                <Input type="number" {...register('skill_moves')} />
                {errors.skill_moves && (
                  <p className="text-red-500 text-xs mt-1">{errors.skill_moves.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Work Rate (ATT)
                  </label>
                  <select
                    {...register('work_rate_att')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Work Rate (DEF)
                  </label>
                  <select
                    {...register('work_rate_def')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Career Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Career Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Origin *
                </label>
                <select
                  {...register('origin')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="Académie">Académie</option>
                  <option value="Initial">Initial</option>
                  <option value="Acheté">Acheté</option>
                </select>
                {errors.origin && (
                  <p className="text-red-500 text-xs mt-1">{errors.origin.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status *
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="Titulaire">Titulaire</option>
                  <option value="Remplaçant">Remplaçant</option>
                  <option value="Réserve">Réserve</option>
                  <option value="À vendre">À vendre</option>
                  <option value="Prêt">Prêt</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary
                </label>
                <Input type="number" {...register('salary')} placeholder="0" />
                {errors.salary && (
                  <p className="text-red-500 text-xs mt-1">{errors.salary.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Market Value
                </label>
                <Input type="number" {...register('value')} placeholder="0" />
                {errors.value && (
                  <p className="text-red-500 text-xs mt-1">{errors.value.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Years
                </label>
                <Input type="number" {...register('contract_years')} />
                {errors.contract_years && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contract_years.message}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Additional Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Play Styles
                </label>
                <Input
                  {...register('play_styles')}
                  placeholder="e.g., Finesse Shot, Power Header"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma-separated list of play styles
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional notes about the player..."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Player' : 'Create Player'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
