import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useJournalStore } from '@/store/journalStore'
import { Button } from '@/components/common/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Plus, X, Edit2, Trash2, Calendar, FileText } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CreateJournalInput, JournalEntry } from '@/types/journal.types'

const journalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  season: z.coerce.number().min(1, 'Season is required'),
  entry_date: z.string().optional(),
  tags: z.string().optional(),
})

type JournalFormData = z.infer<typeof journalSchema>

export default function Journal() {
  const { careerId } = useParams()
  const { entries, loading, fetchEntries, createEntry, updateEntry, deleteEntry } =
    useJournalStore()
  const [showModal, setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [selectedSeason, setSelectedSeason] = useState<number | 'all'>('all')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: editingEntry
      ? {
          title: editingEntry.title,
          content: editingEntry.content,
          season: editingEntry.season,
          entry_date: editingEntry.entry_date,
          tags: editingEntry.tags?.join(', '),
        }
      : {
          season: 1,
          entry_date: new Date().toISOString().split('T')[0],
        },
  })

  useEffect(() => {
    if (careerId) {
      fetchEntries(careerId)
    }
  }, [careerId, fetchEntries])

  useEffect(() => {
    if (editingEntry) {
      reset({
        title: editingEntry.title,
        content: editingEntry.content,
        season: editingEntry.season,
        entry_date: editingEntry.entry_date,
        tags: editingEntry.tags?.join(', '),
      })
    } else {
      reset({
        title: '',
        content: '',
        season: 1,
        entry_date: new Date().toISOString().split('T')[0],
        tags: '',
      })
    }
  }, [editingEntry, reset])

  const onSubmit = async (data: JournalFormData) => {
    if (!careerId) return

    const tags = data.tags
      ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : []

    if (editingEntry) {
      await updateEntry(editingEntry.id, {
        title: data.title,
        content: data.content,
        season: data.season,
        entry_date: data.entry_date,
        tags,
      })
    } else {
      const input: CreateJournalInput = {
        career_id: careerId,
        title: data.title,
        content: data.content,
        season: data.season,
        entry_date: data.entry_date,
        tags,
      }
      await createEntry(input)
    }

    setShowModal(false)
    setEditingEntry(null)
    reset()
  }

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      await deleteEntry(id)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingEntry(null)
    reset()
  }

  const filteredEntries =
    selectedSeason === 'all'
      ? entries
      : entries.filter((e) => e.season === selectedSeason)

  const seasons = Array.from(new Set(entries.map((e) => e.season))).sort((a, b) => a - b)

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
            Career Journal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Document your journey and memorable moments
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Season Filter */}
      {seasons.length > 0 && (
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={selectedSeason === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeason('all')}
          >
            All Seasons ({entries.length})
          </Button>
          {seasons.map((season) => (
            <Button
              key={season}
              variant={selectedSeason === season ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedSeason(season)}
            >
              Season {season} ({entries.filter((e) => e.season === season).length})
            </Button>
          ))}
        </div>
      )}

      {/* Journal Entries */}
      {filteredEntries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No journal entries yet. Start documenting your career!
            </p>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Write First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{entry.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {entry.entry_date
                            ? new Date(entry.entry_date).toLocaleDateString()
                            : 'No date'}
                        </span>
                      </div>
                      <span>Season {entry.season}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(entry)}>
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
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
                  {entry.content}
                </p>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <Input {...register('title')} placeholder="e.g., First Season Victory" />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    Date
                  </label>
                  <Input type="date" {...register('entry_date')} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content *
                </label>
                <textarea
                  {...register('content')}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write about your career journey, memorable moments, decisions made..."
                />
                {errors.content && (
                  <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <Input
                  {...register('tags')}
                  placeholder="e.g., victory, transfer, milestone (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate tags with commas
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting
                    ? 'Saving...'
                    : editingEntry
                    ? 'Update Entry'
                    : 'Create Entry'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
