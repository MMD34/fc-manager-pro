import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FolderOpen } from 'lucide-react'
import { useCareerStore } from '@/store/careerStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import { APP_NAME } from '@/config/branding'

export default function Dashboard() {
  const navigate = useNavigate()
  const { careers, loading, fetchCareers, createCareer } = useCareerStore()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    club_name: '',
    league_name: '',
    manager_name: '',
  })

  useEffect(() => {
    fetchCareers()
  }, [fetchCareers])

  const handleCreateCareer = async () => {
    if (!formData.club_name || !formData.league_name || !formData.manager_name) {
      return
    }

    const newCareer = await createCareer({
      ...formData,
      current_season: 1,
      budget: 10000000,
      difficulty: 'IntermÃ©diaire',
    })

    if (newCareer) {
      setShowModal(false)
      setFormData({ club_name: '', league_name: '', manager_name: '' })
      navigate(`/career/${newCareer.id}/overview`)
    }
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
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Career
          </Button>
        }
      />

      {careers.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="No careers yet"
          description="Create your first career to start tracking seasons, squads, and transfers."
          action={
            <Button onClick={() => setShowModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Career
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {careers.map((career) => (
            <Card
              key={career.id}
              onClick={() => navigate(`/career/${career.id}/overview`)}
              className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">
                    {career.club_name}
                  </h2>
                  <p className="text-sm text-slate-300">{career.league_name}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Season</span>
                  <span className="font-semibold text-slate-100">
                    {career.current_season}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Manager</span>
                  <span className="font-semibold text-slate-100">
                    {career.manager_name}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-100">Create New Career</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full px-2 py-1 text-slate-300 hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Club Name"
                value={formData.club_name}
                onChange={(e) => setFormData({ ...formData, club_name: e.target.value })}
                placeholder="e.g., Manchester United"
              />
              <Input
                label="League Name"
                value={formData.league_name}
                onChange={(e) => setFormData({ ...formData, league_name: e.target.value })}
                placeholder="e.g., Premier League"
              />
              <Input
                label="Manager Name"
                value={formData.manager_name}
                onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                placeholder="e.g., John Doe"
              />

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateCareer} className="flex-1">
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
