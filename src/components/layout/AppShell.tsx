import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import Container from '@/components/ui/Container'

interface AppShellProps {
  children: ReactNode
  header?: ReactNode
  fullWidth?: boolean
}

export default function AppShell({ children, header, fullWidth = false }: AppShellProps) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {header ? (
        header
      ) : (
        <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <Container className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
                FC
              </span>
              FC Manager Pro
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 text-sm text-gray-600 dark:text-gray-300 sm:flex">
                  <User className="h-4 w-4" />
                  <span>{user.displayName || user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </Container>
        </header>
      )}
      <main className={fullWidth ? 'flex-1' : 'py-8'}>
        {fullWidth ? children : <Container>{children}</Container>}
      </main>
    </div>
  )
}
