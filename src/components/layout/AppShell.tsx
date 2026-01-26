import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { APP_NAME } from '@/config/branding'

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
    <>
      {header ? (
        header
      ) : (
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
          <Container className="flex h-16 items-center justify-between">
            <div className="flex min-w-0 items-center gap-2 font-semibold text-slate-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/90 text-white shadow-sm shadow-indigo-500/30">
                FC
              </span>
              <span className="truncate">{APP_NAME}</span>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 text-sm text-slate-200 sm:flex">
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
    </>
  )
}
