import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBudgetStore } from '@/store/budgetStore'
import { Button } from '@/components/common/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { DollarSign, TrendingUp, TrendingDown, Edit2, X, Check } from 'lucide-react'
import type { BudgetEntry } from '@/types/budget.types'

export default function Finances() {
  const { careerId } = useParams()
  const {
    budgetEntries,
    loading,
    fetchBudgetEntries,
    updateBudgetEntry,
    createBudgetEntry,
    calculateBalance,
  } = useBudgetStore()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<BudgetEntry>>({})

  useEffect(() => {
    if (careerId) {
      fetchBudgetEntries(careerId)
    }
  }, [careerId, fetchBudgetEntries])

  const handleEdit = (entry: BudgetEntry) => {
    setEditingId(entry.id)
    setEditForm({
      initial_budget: entry.initial_budget,
      match_revenue: entry.match_revenue,
      wage_expenses: entry.wage_expenses,
      other_income: entry.other_income || 0,
      other_expenses: entry.other_expenses || 0,
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    await updateBudgetEntry(editingId, {
      initial_budget: editForm.initial_budget || 0,
      match_revenue: editForm.match_revenue || 0,
      wage_expenses: editForm.wage_expenses || 0,
      other_income: editForm.other_income || 0,
      other_expenses: editForm.other_expenses || 0,
    })

    setEditingId(null)
    setEditForm({})
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleAddSeason = async () => {
    if (!careerId) return

    const maxSeason = budgetEntries.length > 0
      ? Math.max(...budgetEntries.map((e) => e.season))
      : 0

    await createBudgetEntry(careerId, maxSeason + 1)
  }

  const totalIncome = budgetEntries.reduce((sum, entry) => {
    return (
      sum +
      entry.initial_budget +
      entry.transfer_sales +
      entry.match_revenue +
      (entry.other_income || 0)
    )
  }, 0)

  const totalExpenses = budgetEntries.reduce((sum, entry) => {
    return (
      sum +
      entry.transfer_purchases +
      entry.wage_expenses +
      (entry.other_expenses || 0)
    )
  }, 0)

  const currentBalance = totalIncome - totalExpenses

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-600 dark:text-gray-400">Loading finances...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Financial Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your club's budget and finances
          </p>
        </div>
        <Button onClick={handleAddSeason}>Add Season</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${totalIncome.toFixed(1)}M
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
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ${totalExpenses.toFixed(1)}M
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
                  Current Balance
                </p>
                <p
                  className={`text-2xl font-bold ${
                    currentBalance >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  ${Math.abs(currentBalance).toFixed(1)}M
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Entries Table */}
      {budgetEntries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No budget entries yet. Add your first season to get started.
            </p>
            <Button onClick={handleAddSeason}>Add Season</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Budget by Season</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Season
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Initial Budget
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Transfer Sales
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Transfer Purchases
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Match Revenue
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Wage Expenses
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Final Balance
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {budgetEntries.map((entry) => {
                    const isEditing = editingId === entry.id
                    const balance = calculateBalance(entry)

                    return (
                      <tr
                        key={entry.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="p-4 font-semibold text-gray-900 dark:text-white">
                          Season {entry.season}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.1"
                              value={editForm.initial_budget || 0}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  initial_budget: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-24"
                            />
                          ) : (
                            <span className="text-gray-900 dark:text-white">
                              ${entry.initial_budget}M
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-green-600 dark:text-green-400 font-medium">
                          +${entry.transfer_sales}M
                        </td>
                        <td className="p-4 text-red-600 dark:text-red-400 font-medium">
                          -${entry.transfer_purchases}M
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.1"
                              value={editForm.match_revenue || 0}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  match_revenue: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-24"
                            />
                          ) : (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              +${entry.match_revenue}M
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.1"
                              value={editForm.wage_expenses || 0}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  wage_expenses: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-24"
                            />
                          ) : (
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              -${entry.wage_expenses}M
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-bold ${
                              balance >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            ${balance.toFixed(1)}M
                          </span>
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSave}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(entry)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                • <strong>Transfer Sales/Purchases</strong> are automatically calculated from
                your transfer records
              </li>
              <li>
                • <strong>Initial Budget</strong>, <strong>Match Revenue</strong>, and{' '}
                <strong>Wage Expenses</strong> can be manually edited
              </li>
              <li>
                • <strong>Final Balance</strong> is automatically calculated as: Initial
                Budget + Sales + Revenue - Purchases - Wages
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
