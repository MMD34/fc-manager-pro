import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import PublicOnlyRoute from '@/components/auth/PublicOnlyRoute'

// Auth Pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Dashboard Pages
import Dashboard from '@/pages/dashboard/Dashboard'

// Career Pages
import CareerOverview from '@/pages/career/CareerOverview'
import Squad from '@/pages/career/Squad'
import Transfers from '@/pages/career/Transfers'
import Finances from '@/pages/career/Finances'
import Journal from '@/pages/career/Journal'

// Layout
import Layout from '@/components/layout/Layout'

function App() {
  const { user, isLoading, initAuthListener } = useAuth()
  const { theme, setTheme } = useUIStore()

  useEffect(() => {
    initAuthListener()
  }, [initAuthListener])

  useEffect(() => {
    // Apply theme on mount
    setTheme(theme)
  }, [theme, setTheme])

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Career Routes (with layout) */}
        <Route
          path="/career/:careerId"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<CareerOverview />} />
          <Route path="squad" element={<Squad />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="finances" element={<Finances />} />
          <Route path="journal" element={<Journal />} />
        </Route>

        {/* Catch all */}
        <Route
          path="*"
          element={
            isLoading ? (
              <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
              </div>
            ) : (
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
