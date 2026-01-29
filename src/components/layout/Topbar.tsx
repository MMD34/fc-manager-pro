import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Moon, Sun, LogOut, ChevronDown } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useCareerStore } from '@/store/careerStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export default function Topbar() {
  const { careerId } = useParams()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useUIStore()
  const { careers, loadCareers, activeCareer, setActiveCareer } = useCareerStore()
  const [isCareerMenuOpen, setIsCareerMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    if (user) {
      loadCareers()
    }
  }, [user, loadCareers])

  useEffect(() => {
    if (careerId) {
      const career = careers.find((c) => c.id === careerId)
      if (career) {
        setActiveCareer(career.id)
      }
    }
  }, [careerId, careers, setActiveCareer])

  const handleCareerChange = (newCareerId: string) => {
    navigate(`/career/${newCareerId}/overview`)
    setIsCareerMenuOpen(false)
  }

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {activeCareer && (
          <div className="relative">
            <button
              onClick={() => setIsCareerMenuOpen(!isCareerMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="text-left">
                <div className="font-semibold text-slate-100">{activeCareer.club_name}</div>
                <div className="text-xs text-slate-300">Season {activeCareer.current_season}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-300" />
            </button>

            {isCareerMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-white/10 bg-slate-900/80 shadow-xl backdrop-blur-xl py-2 z-50">
                {careers.map((career) => (
                  <button
                    key={career.id}
                    onClick={() => handleCareerChange(career.id)}
                    className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors"
                  >
                    <div className="font-medium text-slate-100">{career.club_name}</div>
                    <div className="text-xs text-slate-300">
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
        <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-9 h-9 p-0">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500/90 flex items-center justify-center text-white font-semibold">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-slate-100">{user?.displayName || user?.email}</span>
            <ChevronDown className="w-4 h-4 text-slate-300" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-white/10 bg-slate-900/80 shadow-xl backdrop-blur-xl py-2 z-50">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-white/10 transition-colors text-red-300"
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
