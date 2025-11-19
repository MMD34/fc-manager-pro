import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTransferStore } from '@/store/transferStore'
import { usePlayerStore } from '@/store/playerStore'
import { Button } from '@/components/common/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Plus, X, TrendingUp, TrendingDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CreateTransferInput } from '@/types/transfer.types'

const transferSchema = z.object({
  player_name: z.string().min(1, 'Player name is required'),
  type: z.enum(['sale', 'purchase']),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  season: z.coerce.number().min(1, 'Season is required'),
  from_club: z.string().optional(),
  to_club: z.string().optional(),
  transfer_date: z.string().optional(),
  notes: z.string().optional(),
})

type TransferFormData = z.infer<typeof transferSchema>

export default function Transfers() {
  const { careerId } = useParams()
  const { transfers, loading, fetchTransfers, createTransfer, deleteTransfer } =
    useTransferStore()
  const { players, fetchPlayers } = usePlayerStore()
  const [showModal, setShowModal] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'purchase'>('all')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      type: 'purchase',
      season: 1,
      amount: 0,
    },
  })

  const transferType = watch('type')

  useEffect(() => {
    if (careerId) {
      fetchTransfers(careerId)
      fetchPlayers(careerId)
    }
  }, [careerId, fetchTransfers, fetchPlayers])

  const onSubmit = async (data: TransferFormData) => {
    if (!careerId) return

    const input: CreateTransferInput = {
      career_id: careerId,
      player_name: data.player_name,
      type: data.type,
      amount: data.amount,
      season: data.season,
      from_club: data.from_club,
      to_club: data.to_club,
      transfer_date: data.transfer_date,
      notes: data.notes,
    }

    const result = await createTransfer(input)
    if (result) {
      reset()
      setShowModal(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transfer?')) {
      await deleteTransfer(id)
    }
  }

  const filteredTransfers =
    filterType === 'all'
      ? transfers
      : transfers.filter((t) => t.type === filterType)

  const totalSales = transfers
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalPurchases = transfers
    .filter((t) => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0)

  const netSpend = totalPurchases - totalSales

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-600 dark:text-gray-400">Loading transfers...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transfer Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your transfer activity
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Transfer
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Sales
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${totalSales.toFixed(1)}M
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Purchases
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ${totalPurchases.toFixed(1)}M
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Spend</p>
                <p
                  className={`text-2xl font-bold ${
                    netSpend > 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  ${Math.abs(netSpend).toFixed(1)}M
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={filterType === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilterType('all')}
        >
          All ({transfers.length})
        </Button>
        <Button
          variant={filterType === 'sale' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilterType('sale')}
        >
          Sales ({transfers.filter((t) => t.type === 'sale').length})
        </Button>
        <Button
          variant={filterType === 'purchase' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilterType('purchase')}
        >
          Purchases ({transfers.filter((t) => t.type === 'purchase').length})
        </Button>
      </div>

      {/* Transfers List */}
      {filteredTransfers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No transfers recorded yet.
            </p>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transfer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Player
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Type
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Amount
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Season
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Clubs
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransfers.map((transfer) => (
                    <tr
                      key={transfer.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900 dark:text-white">
                        {transfer.player_name}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            transfer.type === 'sale'
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          }`}
                        >
                          {transfer.type === 'sale' ? 'Sale' : 'Purchase'}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-gray-900 dark:text-white">
                        ${transfer.amount}M
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">
                        Season {transfer.season}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                        {transfer.type === 'sale'
                          ? `To: ${transfer.to_club || 'N/A'}`
                          : `From: ${transfer.from_club || 'N/A'}`}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transfer.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Transfer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Add Transfer
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Player Name *
                </label>
                <Input {...register('player_name')} placeholder="e.g., Cristiano Ronaldo" />
                {errors.player_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.player_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type *
                </label>
                <select
                  {...register('type')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="purchase">Purchase</option>
                  <option value="sale">Sale</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount (in millions) *
                </label>
                <Input type="number" step="0.1" {...register('amount')} placeholder="0.0" />
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Season *
                </label>
                <Input type="number" {...register('season')} placeholder="1" />
                {errors.season && (
                  <p className="text-red-500 text-xs mt-1">{errors.season.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {transferType === 'sale' ? 'To Club' : 'From Club'}
                </label>
                <Input
                  {...register(transferType === 'sale' ? 'to_club' : 'from_club')}
                  placeholder="e.g., Real Madrid"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transfer Date
                </label>
                <Input type="date" {...register('transfer_date')} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Adding...' : 'Add Transfer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
