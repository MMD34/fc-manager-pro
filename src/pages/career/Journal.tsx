import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useJournalStore } from '@/store/journalStore'
import { Button } from '@/components/common/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Plus, X, Edit2, Trash2, BookOpen } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { JournalEntry } from '@/types/journal.types'

export default function Journal() {
  const { careerId } = useParams()
  const { entries, loading, fetchEntries, createEntry, updateEntry, deleteEntry } = useJournalStore()
  const [showModal, setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    season: 1,
    entry_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (careerId) {
      fetchEntries(careerId)
    }
  }, [careerId, fetchEntries])

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, formData)
        toast.success('Entry updated successfully')
      } else {
        await createEntry(careerId!, formData)
        toast.success('Entry created successfully')
      }

      setShowModal(false)
      setEditingEntry(null)
      setFormData({
        title: '',
        content: '',
        season: 1,
        entry_date: new Date().toISOString().split('T')[0],
      })
    } catch (error) {
      toast.error(editingEntry ? 'Failed to update entry' : 'Failed to create entry')
    }
  }

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setFormData({
      title: entry.title,
      content: entry.content,
      season: entry.season,
      entry_date: entry.entry_date ? new Date(entry.entry_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await deleteEntry(id)
        toast.success('Entry deleted')
      } catch (error) {
        toast.error('Failed to delete entry')
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingEntry(null)
    setFormData({
      title: '',
      content: '',
      season: 1,
      entry_date: new Date().toISOString().split('T')[0],
    })
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-600 dark:text-gray-400">Loading journal...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Journal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Document your career journey
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No journal entries yet. Start documenting your career!
          </p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Write Your First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{entry.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        {entry.entry_date
                          ? format(new Date(entry.entry_date), 'MMMM dd, yyyy')
                          : format(new Date(entry.created_at), 'MMMM dd, yyyy')}
                      </span>
                      <span>•</span>
                      <span>Season {entry.season}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(entry)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Amazing comeback win against rivals"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={formData.entry_date}
                    onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-[300px]"
                  placeholder="Write your thoughts, match highlights, transfer decisions, or any memorable moments..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  {editingEntry ? 'Update Entry' : 'Create Entry'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
