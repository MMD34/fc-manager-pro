import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Moon, Sun, LogOut, ChevronDown } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useCareerStore } from '@/store/careerStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/common/Button'

export default function Topbar() {
  const { careerId } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useUIStore()
  const { careers, fetchCareers, currentCareer, setCurrentCareer } = useCareerStore()
  const [isCareerMenuOpen, setIsCareerMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    fetchCareers()
  }, [fetchCareers])

  useEffect(() => {
    if (careerId) {
      const career = careers.find((c) => c.id === careerId)
      if (career) {
        setCurrentCareer(career)
      }
    }
  }, [careerId, careers, setCurrentCareer])

  const handleCareerChange = (newCareerId: string) => {
    navigate(`/career/${newCareerId}/overview`)
    setIsCareerMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Career Selector */}
        {currentCareer && (
          <div className="relative">
            <button
              onClick={() => setIsCareerMenuOpen(!isCareerMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {currentCareer.club_name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Season {currentCareer.current_season}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {isCareerMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                {careers.map((career) => (
                  <button
                    key={career.id}
                    onClick={() => handleCareerChange(career.id)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {career.club_name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {career.league_name} • Season {career.current_season}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="w-9 h-9 p-0"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.username}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
