import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useCareerStore } from '@/store/careerStore'
import { usePlayerStore } from '@/store/playerStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Users, TrendingUp, Star, Award } from 'lucide-react'

export default function CareerOverview() {
  const { careerId } = useParams()
  const { currentCareer } = useCareerStore()
  const { players, fetchPlayers } = usePlayerStore()

  useEffect(() => {
    if (careerId) {
      fetchPlayers(careerId)
    }
  }, [careerId, fetchPlayers])

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalPlayers = players.length
    const academyPlayers = players.filter((p) => p.origin === 'Académie').length
    const academyPercentage = totalPlayers > 0 ? Math.round((academyPlayers / totalPlayers) * 100) : 0

    const averageOVR = totalPlayers > 0
      ? Math.round(players.reduce((sum, p) => sum + p.ovr, 0) / totalPlayers)
      : 0

    const playersWithManyPlayStyles = players.filter(
      (p) => (p.play_styles?.split(',').length || 0) >= 7
    ).length

    return {
      totalPlayers,
      academyPercentage,
      averageOVR,
      playersWithManyPlayStyles,
    }
  }, [players])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {currentCareer?.club_name || 'Career Overview'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Season {currentCareer?.current_season || 1} • {currentCareer?.league_name || ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Players */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Players
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {kpis.totalPlayers}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academy Players */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Academy Players
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {kpis.academyPercentage}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average OVR */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Average OVR
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {kpis.averageOVR}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Players with 7+ Play Styles */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  7+ Play Styles
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {kpis.playersWithManyPlayStyles}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Squad Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Squad Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Titulaire', 'Remplaçant', 'Réserve', 'À vendre', 'Prêt'].map((status) => {
                const count = players.filter((p) => p.status === status).length
                const percentage = kpis.totalPlayers > 0
                  ? Math.round((count / kpis.totalPlayers) * 100)
                  : 0

                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {status}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Player Origins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Académie', 'Initial', 'Acheté'].map((origin) => {
                const count = players.filter((p) => p.origin === origin).length
                const percentage = kpis.totalPlayers > 0
                  ? Math.round((count / kpis.totalPlayers) * 100)
                  : 0

                return (
                  <div key={origin}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {origin}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
