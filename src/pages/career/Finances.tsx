import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBudgetStore } from '@/store/budgetStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { formatCurrency } from '@/lib/utils/format'
import { DollarSign, TrendingUp, TrendingDown, Edit2, X, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function Finances() {
  const { careerId } = useParams()
  const { budgetEntries, loading, fetchBudgetEntries, updateBudgetEntry, calculateBalance } = useBudgetStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({
    match_revenue: 0,
    wage_expenses: 0,
    other_expenses: 0,
  })

  useEffect(() => {
    if (careerId) {
      fetchBudgetEntries(careerId)
    }
  }, [careerId, fetchBudgetEntries])

  const handleEdit = (entryId: string, entry: any) => {
    setEditingId(entryId)
    setEditData({
      match_revenue: entry.match_revenue || 0,
      wage_expenses: entry.wage_expenses || 0,
      other_expenses: entry.other_expenses || 0,
    })
  }

  const handleSave = async (entryId: string) => {
    try {
      await updateBudgetEntry(entryId, editData)
      toast.success('Budget updated successfully')
      setEditingId(null)
    } catch (error) {
      toast.error('Failed to update budget')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  // Calculate overall financial summary
  const totalBalance = budgetEntries.reduce((sum, entry) => sum + calculateBalance(entry), 0)
  const totalRevenue = budgetEntries.reduce(
    (sum, entry) => sum + (entry.transfer_sales || 0) + (entry.match_revenue || 0),
    0
  )
  const totalExpenses = budgetEntries.reduce(
    (sum, entry) =>
      sum + (entry.transfer_purchases || 0) + (entry.wage_expenses || 0) + (entry.other_expenses || 0),
    0
  )

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-600 dark:text-gray-400">Loading finances...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Finances
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your club's budget and finances
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Current Balance
                </p>
                <p className={`text-3xl font-bold ${
                  totalBalance >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalRevenue)}
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
                  Total Expenses
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Entries by Season */}
      <Card>
        <CardHeader>
          <CardTitle>Budget by Season</CardTitle>
        </CardHeader>
        <CardContent>
          {budgetEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No budget entries yet. Budget entries are created automatically.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Season
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Initial Budget
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Transfer Sales
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Transfer Purchases
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Match Revenue
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Wage Expenses
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Other Expenses
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Balance
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {budgetEntries.map((entry) => {
                    const balance = calculateBalance(entry)
                    const isEditing = editingId === entry.id

                    return (
                      <tr
                        key={entry.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="p-3 font-medium text-gray-900 dark:text-white">
                          Season {entry.season}
                        </td>
                        <td className="p-3 text-right text-gray-600 dark:text-gray-400">
                          {formatCurrency(entry.initial_budget)}
                        </td>
                        <td className="p-3 text-right text-green-600 dark:text-green-400">
                          {formatCurrency(entry.transfer_sales || 0)}
                        </td>
                        <td className="p-3 text-right text-red-600 dark:text-red-400">
                          {formatCurrency(entry.transfer_purchases || 0)}
                        </td>
                        <td className="p-3 text-right">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editData.match_revenue}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  match_revenue: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-32 text-right"
                            />
                          ) : (
                            <span className="text-gray-600 dark:text-gray-400">
                              {formatCurrency(entry.match_revenue || 0)}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editData.wage_expenses}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  wage_expenses: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-32 text-right"
                            />
                          ) : (
                            <span className="text-gray-600 dark:text-gray-400">
                              {formatCurrency(entry.wage_expenses || 0)}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editData.other_expenses}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  other_expenses: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-32 text-right"
                            />
                          ) : (
                            <span className="text-gray-600 dark:text-gray-400">
                              {formatCurrency(entry.other_expenses || 0)}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={`font-bold ${
                              balance >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {formatCurrency(balance)}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSave(entry.id)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancel}
                                  className="text-gray-600 hover:text-gray-700"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(entry.id, entry)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            About Budget Management
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              • <strong>Transfer Sales & Purchases</strong> are automatically calculated from your transfer records
            </p>
            <p>
              • <strong>Match Revenue, Wage Expenses, and Other Expenses</strong> can be manually edited by clicking the edit button
            </p>
            <p>
              • <strong>Balance</strong> is automatically calculated: Initial Budget + Sales - Purchases + Revenue - Expenses
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
