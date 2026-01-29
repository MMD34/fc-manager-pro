import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FolderOpen, Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import { useCareerStore } from '@/store/careerStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import CreateCareerModal from '@/components/careers/CreateCareerModal'
import EditCareerModal from '@/components/careers/EditCareerModal'
import ConfirmDialog from '@/components/careers/ConfirmDialog'
import { APP_NAME } from '@/config/branding'
import type { Career } from '@/types/career.types'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    careers,
    activeCareerId,
    loading,
    error,
    loadCareers,
    createCareer,
    updateCareer,
    deleteCareer,
    setActiveCareer,
  } = useCareerStore()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCareer, setEditingCareer] = useState<Career | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Career | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      loadCareers()
    }
  }, [user, loadCareers])
  const handleCreateCareer = async (input: Parameters<typeof createCareer>[0]) => {
    setIsSubmitting(true)
    try {
      const career = await createCareer(input)
      setShowCreateModal(false)
      navigate(`/career/${career.id}/overview`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCareer = async (id: string, patch: Parameters<typeof updateCareer>[1]) => {
    setIsSubmitting(true)
    try {
      await updateCareer(id, patch)
      setEditingCareer(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCareer = async () => {
    if (!deleteTarget) return
    setIsSubmitting(true)
    try {
      await deleteCareer(deleteTarget.id)
      setDeleteTarget(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectCareer = (career: Career) => {
    setActiveCareer(career.id)
    navigate(`/career/${career.id}/overview`)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-slate-300">Loading careers...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Careers"
        subtitle={`Manage your ${APP_NAME} careers`}
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Career
          </Button>
        }
      />

      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {careers.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="No careers yet"
          description="Create your first career to start tracking seasons, squads, and transfers."
          action={
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Career
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {careers.map((career) => {
            const isActive = activeCareerId === career.id
            return (
              <Card key={career.id} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">
                      {career.club_name}
                    </h2>
                    <p className="text-sm text-slate-300">{career.league_name}</p>
                  </div>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Active
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Season</span>
                    <span className="font-semibold text-slate-100">{career.current_season}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Manager</span>
                    <span className="font-semibold text-slate-100">{career.manager_name}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => handleSelectCareer(career)}>
                    {isActive ? 'Open' : 'Select'}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditingCareer(career)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-300 hover:text-red-200"
                    onClick={() => setDeleteTarget(career)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <CreateCareerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCareer}
        isSubmitting={isSubmitting}
      />

      <EditCareerModal
        isOpen={!!editingCareer}
        career={editingCareer}
        onClose={() => setEditingCareer(null)}
        onSubmit={handleEditCareer}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete career?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="ghost"
        confirmClassName="text-red-300 hover:text-red-200"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteCareer}
        icon={<Trash2 className="h-5 w-5" />}
      />
    </div>
  )
}


