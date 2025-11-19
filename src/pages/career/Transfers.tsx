import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTransferStore } from '@/store/transferStore'
import { usePlayerStore } from '@/store/playerStore'
import { Button } from '@/components/common/Button'
import { Card, CardContent } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Plus, X, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'
import { toast } from 'sonner'

export default function Transfers() {
  const { careerId } = useParams()
  const { transfers, loading, fetchTransfers, createTransfer, deleteTransfer } = useTransferStore()
  const { fetchPlayers } = usePlayerStore()
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'sales' | 'purchases'>('sales')
  const [formData, setFormData] = useState({
    player_name: '',
    type: 'sale' as 'sale' | 'purchase',
    amount: '',
    season: 1,
    from_club: '',
    to_club: '',
    notes: '',
  })

  useEffect(() => {
    if (careerId) {
      fetchTransfers(careerId)
      fetchPlayers(careerId)
    }
  }, [careerId, fetchTransfers, fetchPlayers])

  const handleSubmit = async () => {
    if (!formData.player_name || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await createTransfer(careerId!, {
        player_name: formData.player_name,
        type: formData.type,
        amount: parseFloat(formData.amount),
        season: formData.season,
        from_club: formData.from_club || undefined,
        to_club: formData.to_club || undefined,
        notes: formData.notes || undefined,
        transfer_date: new Date().toISOString(),
      })

      toast.success('Transfer recorded successfully')
      setShowModal(false)
      setFormData({
        player_name: '',
        type: 'sale',
        amount: '',
        season: 1,
        from_club: '',
        to_club: '',
        notes: '',
      })
    } catch (error) {
      toast.error('Failed to record transfer')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transfer?')) {
      try {
        await deleteTransfer(id)
        toast.success('Transfer deleted')
      } catch (error) {
        toast.error('Failed to delete transfer')
      }
    }
  }

  const sales = transfers.filter((t) => t.type === 'sale')
  const purchases = transfers.filter((t) => t.type === 'purchase')

  const totalSales = sales.reduce((sum, t) => sum + t.amount, 0)
  const totalPurchases = purchases.reduce((sum, t) => sum + t.amount, 0)
  const netSpend = totalPurchases - totalSales

  const displayTransfers = activeTab === 'sales' ? sales : purchases

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
            Transfers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your transfer activity
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Record Transfer
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
                  {formatCurrency(totalSales)}
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
                  {formatCurrency(totalPurchases)}
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
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Net Spend
                </p>
                <p className={`text-2xl font-bold ${netSpend > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {formatCurrency(Math.abs(netSpend))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'sales'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Sales ({sales.length})
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'purchases'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Purchases ({purchases.length})
        </button>
      </div>

      {/* Transfers List */}
      {displayTransfers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No {activeTab} recorded yet.
          </p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Record Transfer
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Player
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Amount
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    {activeTab === 'sales' ? 'To Club' : 'From Club'}
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Season
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayTransfers.map((transfer) => (
                  <tr
                    key={transfer.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {transfer.player_name}
                      </div>
                      {transfer.notes && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {transfer.notes}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${
                        activeTab === 'sales'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(transfer.amount)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {activeTab === 'sales' ? transfer.to_club || '-' : transfer.from_club || '-'}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      Season {transfer.season}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {transfer.transfer_date
                        ? new Date(transfer.transfer_date).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transfer.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Record Transfer
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transfer Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sale' | 'purchase' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="sale">Sale</option>
                  <option value="purchase">Purchase</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Player Name *
                </label>
                <Input
                  value={formData.player_name}
                  onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                  placeholder="e.g., Cristiano Ronaldo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount (€) *
                </label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g., 50000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Season
                </label>
                <Input
                  type="number"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: parseInt(e.target.value) || 1 })}
                />
              </div>

              {formData.type === 'sale' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    To Club
                  </label>
                  <Input
                    value={formData.to_club}
                    onChange={(e) => setFormData({ ...formData, to_club: e.target.value })}
                    placeholder="e.g., Real Madrid"
                  />
                </div>
              )}

              {formData.type === 'purchase' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    From Club
                  </label>
                  <Input
                    value={formData.from_club}
                    onChange={(e) => setFormData({ ...formData, from_club: e.target.value })}
                    placeholder="e.g., Manchester United"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Record Transfer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
