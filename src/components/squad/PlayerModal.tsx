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
  ovr: z.number().min(40, 'Min 40').max(99, 'Max 99'),
  potential: z.number().min(40, 'Min 40').max(99, 'Max 99'),
  age: z.number().min(16, 'Min 16').max(45, 'Max 45'),
  origin: z.enum(['Académie', 'Initial', 'Acheté']),
  status: z.enum(['Titulaire', 'Remplaçant', 'Réserve', 'À vendre', 'Prêt']),
  salary: z.number().min(0, 'Must be positive'),
  value: z.number().min(0, 'Must be positive'),
  nationality: z.string().optional(),
  play_styles: z.number().min(0).optional(),
  play_styles_plus: z.number().min(0).optional(),
  jersey_number: z.number().min(1).max(99).optional(),
  contract_expiry: z.string().optional(),
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
          nationality: player.nationality || '',
          play_styles: player.play_styles || 0,
          play_styles_plus: player.play_styles_plus || 0,
          jersey_number: player.jersey_number || undefined,
          contract_expiry: player.contract_expiry || '',
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
          nationality: '',
          play_styles: 0,
          play_styles_plus: 0,
          jersey_number: undefined,
          contract_expiry: '',
          notes: '',
        },
  })

  const onSubmit = async (data: PlayerFormData) => {
    try {
      if (isEditing && player) {
        await updatePlayer(player.id, data)
      } else {
        await createPlayer(careerId, data)
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
                <Input type="number" {...register('age', { valueAsNumber: true })} />
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
                <Input type="number" {...register('ovr', { valueAsNumber: true })} />
                {errors.ovr && (
                  <p className="text-red-500 text-xs mt-1">{errors.ovr.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Potential *
                </label>
                <Input type="number" {...register('potential', { valueAsNumber: true })} />
                {errors.potential && (
                  <p className="text-red-500 text-xs mt-1">{errors.potential.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Play Styles
                  </label>
                  <Input type="number" {...register('play_styles', { valueAsNumber: true })} />
                  {errors.play_styles && (
                    <p className="text-red-500 text-xs mt-1">{errors.play_styles.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Play Styles Plus
                  </label>
                  <Input type="number" {...register('play_styles_plus', { valueAsNumber: true })} />
                  {errors.play_styles_plus && (
                    <p className="text-red-500 text-xs mt-1">{errors.play_styles_plus.message}</p>
                  )}
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
                <Input type="number" {...register('salary', { valueAsNumber: true })} placeholder="0" />
                {errors.salary && (
                  <p className="text-red-500 text-xs mt-1">{errors.salary.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Market Value
                </label>
                <Input type="number" {...register('value', { valueAsNumber: true })} placeholder="0" />
                {errors.value && (
                  <p className="text-red-500 text-xs mt-1">{errors.value.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jersey Number
                </label>
                <Input type="number" {...register('jersey_number', { valueAsNumber: true })} placeholder="1-99" />
                {errors.jersey_number && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.jersey_number.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Expiry
                </label>
                <Input type="date" {...register('contract_expiry')} />
                {errors.contract_expiry && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contract_expiry.message}
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
