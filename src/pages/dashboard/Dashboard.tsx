import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCareerStore } from '@/store/careerStore'
import { Button } from '@/components/common/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Plus, X } from 'lucide-react'

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
      difficulty: 'Intermédiaire',
    })

    if (newCareer) {
      setShowModal(false)
      setFormData({ club_name: '', league_name: '', manager_name: '' })
      navigate(`/career/${newCareer.id}/overview`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading careers...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Careers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your FC Manager Pro careers
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Career
          </Button>
        </div>

        {careers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No careers yet. Create your first career to get started!
            </p>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Career
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((career) => (
              <Card
                key={career.id}
                onClick={() => navigate(`/career/${career.id}/overview`)}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle>{career.club_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {career.league_name}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Season</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {career.current_season}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Manager</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {career.manager_name}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Career Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create New Career
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
                  Club Name
                </label>
                <Input
                  value={formData.club_name}
                  onChange={(e) =>
                    setFormData({ ...formData, club_name: e.target.value })
                  }
                  placeholder="e.g., Manchester United"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  League Name
                </label>
                <Input
                  value={formData.league_name}
                  onChange={(e) =>
                    setFormData({ ...formData, league_name: e.target.value })
                  }
                  placeholder="e.g., Premier League"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Manager Name
                </label>
                <Input
                  value={formData.manager_name}
                  onChange={(e) =>
                    setFormData({ ...formData, manager_name: e.target.value })
                  }
                  placeholder="e.g., John Doe"
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
