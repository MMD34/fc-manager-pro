import { Outlet, useParams } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  const { careerId } = useParams()

  return (
    <AppShell header={<Topbar />} fullWidth>
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar careerId={careerId!} />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </AppShell>
  )
}
