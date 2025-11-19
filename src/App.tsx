import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'

// Auth Pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Dashboard Pages
import Dashboard from '@/pages/dashboard/Dashboard'

// Career Pages
import CareerOverview from '@/pages/career/CareerOverview'
import Squad from '@/pages/career/Squad'

// Layout
import Layout from '@/components/layout/Layout'

function App() {
  const { user, loading, checkAuth } = useAuth()
  const { theme, setTheme } = useUIStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    // Apply theme on mount
    setTheme(theme)
  }, [theme, setTheme])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        {/* Career Routes (with layout) */}
        <Route
          path="/career/:careerId"
          element={user ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<CareerOverview />} />
          <Route path="squad" element={<Squad />} />
          {/* Placeholder routes for future features */}
          <Route path="transfers" element={<div className="p-6">Transfers - Coming Soon</div>} />
          <Route path="finances" element={<div className="p-6">Finances - Coming Soon</div>} />
          <Route path="journal" element={<div className="p-6">Journal - Coming Soon</div>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
