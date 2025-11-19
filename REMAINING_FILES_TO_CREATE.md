# Remaining Files to Complete Phase 1 MVP

## Current Status
✅ **Completed:** Auth system, stores, common components, routing setup
🚧 **Remaining:** Layout components, page components

## Critical Files Needed (create these in order):

### 1. Layout Components

#### `src/components/layout/Sidebar.tsx`
Create a sidebar with navigation links. Use Lucide React icons.

```typescript
import { Link, useLocation } from 'react-router-dom'
import { Home, Users, ArrowRightLeft, DollarSign, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Navigation items array
// Map through items, use useLocation to highlight active route
// Link to `/career/${careerId}/${path}`
```

#### `src/components/layout/Topbar.tsx`
Create topbar with:
- Career selector dropdown
- Dark mode toggle button
- User menu with logout

```typescript
import { Moon, Sun, LogOut } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/common/Button'
```

#### `src/components/layout/Layout.tsx`
Combine Sidebar + Topbar + Outlet:

```typescript
import { Outlet, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  const { careerId } = useParams()

  return (
    <div className="flex h-screen">
      <Sidebar careerId={careerId!} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

### 2. Dashboard Page

#### `src/pages/dashboard/Dashboard.tsx`
- Fetch and display user careers
- "Create Career" button/modal
- Career cards that link to `/career/{id}/overview`

```typescript
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCareerStore } from '@/store/careerStore'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Plus } from 'lucide-react'

// Fetch careers on mount
// Show loading state
// Map through careers and create clickable cards
// Modal for creating new career
```

### 3. Career Overview Page

#### `src/pages/career/CareerOverview.tsx`
Display KPIs for the career:

```typescript
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCareerStore } from '@/store/careerStore'
import { usePlayerStore } from '@/store/playerStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

// Calculate KPIs:
// - Total players
// - Academy players %
// - Average OVR
// - Players with 7+ play styles
// Display in grid of stat cards
```

### 4. Squad Management Page

#### `src/pages/career/Squad.tsx`
- Fetch and display players
- Add Player button
- Player table/list
- Edit/Delete actions

```typescript
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePlayerStore } from '@/store/playerStore'
import { Button } from '@/components/common/Button'
import { Plus } from 'lucide-react'

// Fetch players for career
// Table with columns: Name, Position, OVR, Potential, Origin, Status
// Modal for add/edit player
```

#### `src/components/squad/PlayerModal.tsx`
Form to create/edit player with React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'

const playerSchema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  position: z.string().min(1, 'Required'),
  ovr: z.number().min(40).max(99),
  potential: z.number().min(40).max(99),
  age: z.number().min(16).max(45),
  origin: z.enum(['Académie', 'Initial', 'Acheté']),
  status: z.enum(['Titulaire', 'Remplaçant', 'Réserve', 'À vendre', 'Prêt']),
  salary: z.number().min(0),
  value: z.number().min(0),
  // ... other fields
})
```

## Quick Implementation Tips

### For Sidebar Navigation:
```typescript
const navItems = [
  { path: 'overview', label: 'Overview', icon: Home },
  { path: 'squad', label: 'Squad', icon: Users },
  { path: 'transfers', label: 'Transfers', icon: ArrowRightLeft },
  { path: 'finances', label: 'Finances', icon: DollarSign },
  { path: 'journal', label: 'Journal', icon: BookOpen },
]
```

### For Career Card:
```typescript
<Card
  onClick={() => navigate(`/career/${career.id}/overview`)}
  className="cursor-pointer hover:shadow-md transition-shadow"
>
  <CardHeader>
    <CardTitle>{career.club_name}</CardTitle>
    <p className="text-sm text-gray-500">
      {career.league_name} • Season {career.current_season}
    </p>
  </CardHeader>
</Card>
```

### For Player Table:
```typescript
<table className="w-full">
  <thead>
    <tr className="border-b">
      <th className="text-left p-4">Name</th>
      <th className="text-left p-4">Position</th>
      <th className="text-left p-4">OVR</th>
      <th className="text-left p-4">Pot</th>
      <th className="text-left p-4">Origin</th>
      <th className="text-left p-4">Actions</th>
    </tr>
  </thead>
  <tbody>
    {players.map((player) => (
      <tr key={player.id} className="border-b hover:bg-gray-50">
        <td className="p-4">{player.first_name} {player.last_name}</td>
        <td className="p-4">{player.position}</td>
        <td className="p-4">{player.ovr}</td>
        <td className="p-4">{player.potential}</td>
        <td className="p-4">{player.origin}</td>
        <td className="p-4">
          <Button size="sm" onClick={() => handleEdit(player)}>Edit</Button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

## Testing Your MVP

Once you create these files:

1. **Run the dev server:**
   ```bash
   npm run dev
   ```

2. **Test the flow:**
   - Register a new account
   - Login
   - Create a career
   - Click on career to enter it
   - Add some players
   - View the overview page with KPIs

3. **Check for TypeScript errors:**
   ```bash
   npm run type-check
   ```

## Priority Order

1. **Layout components** (Sidebar, Topbar, Layout) - Without these, routing won't work
2. **Dashboard** - Entry point after login
3. **Squad page** - Core feature for MVP
4. **Career Overview** - Show useful stats

The rest (Transfers, Budget, Journal) can be added after the MVP is working.

## Need Help?

If you get stuck on any component, you can:
1. Use the existing components as templates (Button, Input, Card)
2. Reference the stores for data operations
3. Check React Hook Form + Zod documentation for complex forms
4. Use Tailwind CSS classes for styling (already configured)

Your foundation is solid - these remaining files will complete your MVP!
