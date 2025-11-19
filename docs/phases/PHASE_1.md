# 🔵 PHASE 1: MVP - TODO List

**Duration:** 3-4 weeks  
**Goal:** Create a functional MVP with core features

**Status:** 🚧 In Progress

---

## 📦 SETUP & INITIALIZATION (Week 1 - Days 1-2)

### [] 1.1 Project Initialization

- [ ] Create Vite + React + TypeScript project
  ```bash
  npm create vite@latest fc-manager-pro -- --template react-ts
  cd fc-manager-pro
  npm install
  ```

- [ ] Install core dependencies
  ```bash
  npm install @supabase/supabase-js zustand react-router-dom
  npm install react-hook-form zod @hookform/resolvers
  npm install lucide-react clsx tailwind-merge
  npm install date-fns
  ```

- [ ] Install dev dependencies
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npm install -D @types/node
  npx tailwindcss init -p
  ```

- [ ] Configure Tailwind CSS
  - Update `tailwind.config.js` with content paths
  - Add dark mode support: `darkMode: 'class'`
  - Import Tailwind in `src/styles/index.css`

- [ ] Setup path aliases in `vite.config.ts`
  ```typescript
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
  ```

- [ ] Create `.env.local` file with Supabase credentials
  ```env
  VITE_SUPABASE_URL=your_url
  VITE_SUPABASE_ANON_KEY=your_key
  ```

- [ ] Create `.env.example` for reference

- [ ] Setup `.gitignore` (ensure .env.local is included)

- [ ] Create initial folder structure as per PROJECT_STRUCTURE.md

### [] 1.2 Supabase Setup

- [ ] Create Supabase project at app.supabase.com

- [ ] Copy Project URL and anon key to `.env.local`

- [ ] Run initial database migration from DATABASE_SCHEMA.md
  - Go to SQL Editor in Supabase dashboard
  - Create `profiles` table
  - Create `careers` table with RLS policies
  - Create update_updated_at_column() function and triggers

- [ ] Test database connection

- [ ] Create Supabase client in `src/lib/supabase.ts`
  ```typescript
  import { createClient } from '@supabase/supabase-js';
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  ```

---

## 🔐 AUTHENTICATION (Week 1 - Days 3-5)

### [] 2.1 Auth Types & Store

- [ ] Create `src/types/auth.types.ts`
  ```typescript
  export interface User {
    id: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
  }
  
  export interface AuthState {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    checkAuth: () => Promise<void>;
  }
  ```

- [ ] Create `src/store/authStore.ts` with Zustand
  ```typescript
  import { create } from 'zustand';
  import { supabase } from '@/lib/supabase';
  import type { AuthState } from '@/types/auth.types';
  
  export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    
    checkAuth: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user || null, loading: false });
    },
    
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    },
    
    signUp: async (email, password) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    },
    
    signOut: async () => {
      await supabase.auth.signOut();
      set({ user: null });
    },
  }));
  ```

- [ ] Create `src/hooks/useAuth.ts` custom hook

### [] 2.2 Auth UI Components

- [ ] Create base components in `src/components/common/`:
  - [ ] `Button.tsx` - Reusable button with variants
  - [ ] `Input.tsx` - Form input with label and error
  - [ ] `Card.tsx` - Container card component

- [ ] Create `src/pages/auth/Login.tsx`
  - Use React Hook Form + Zod validation
  - Email and password fields
  - Link to Register page
  - Handle login with authStore
  - Show error messages
  - Loading state

- [ ] Create `src/pages/auth/Register.tsx`
  - Similar to Login
  - Confirm password field
  - Link to Login page

- [ ] Create `src/pages/auth/ResetPassword.tsx` (optional for MVP)

### [] 2.3 Auth Routes & Protection

- [ ] Install React Router v6
  ```bash
  npm install react-router-dom
  ```

- [ ] Create `src/App.tsx` with router setup
  ```typescript
  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  import { useEffect } from 'react';
  import { useAuthStore } from '@/store/authStore';
  
  // Pages
  import Login from '@/pages/auth/Login';
  import Register from '@/pages/auth/Register';
  import Dashboard from '@/pages/dashboard/Dashboard';
  
  function App() {
    const { checkAuth, loading, user } = useAuthStore();
    
    useEffect(() => {
      checkAuth();
    }, [checkAuth]);
    
    if (loading) return <div>Loading...</div>;
    
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </BrowserRouter>
    );
  }
  
  export default App;
  ```

- [ ] Create ProtectedRoute component (optional wrapper)

- [ ] Test auth flow completely:
  - [ ] Register new user
  - [ ] Login with credentials
  - [ ] Redirect to dashboard when authenticated
  - [ ] Logout functionality
  - [ ] Redirect to login when not authenticated

---

## 🎯 CAREERS MANAGEMENT (Week 2 - Days 1-3)

### [] 3.1 Career Types & Database

- [ ] Run migration for `careers` table (if not done)

- [ ] Create `src/types/career.types.ts`
  ```typescript
  export interface Career {
    id: string;
    user_id: string;
    club_name: string;
    club_id?: string;
    league_name: string;
    country: string;
    project_type: 'academie' | 'trophees' | 'budget' | 'custom';
    current_season: number;
    start_date: string;
    is_active: boolean;
    is_archived: boolean;
    settings?: Record<string, any>;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreateCareerInput {
    club_name: string;
    league_name: string;
    country: string;
    project_type: Career['project_type'];
  }
  ```

- [ ] Create `src/store/careerStore.ts`
  - fetchCareers() - Get all user careers
  - createCareer() - Create new career
  - updateCareer() - Update career details
  - deleteCareer() - Soft delete (archive)
  - setActiveCareer() - Set current active career
  - State: careers[], activeCareer, loading

### [] 3.2 Dashboard - Careers List

- [ ] Create `src/pages/dashboard/Dashboard.tsx`
  - Fetch and display user's careers
  - Show career cards (club name, season, project type)
  - "Create New Career" button
  - Stats: total careers, active careers

- [ ] Create `src/components/career/CareerCard.tsx`
  - Display career info
  - Edit, Delete, Archive buttons
  - Click to enter career

### [] 3.3 Create Career Flow

- [ ] Create `src/components/career/CreateCareerModal.tsx`
  - Form with React Hook Form + Zod
  - Fields:
    - Club name (text input)
    - League name (text input)
    - Country (select or text)
    - Project type (radio buttons: Académie 100%, Trophées, Budget limité, Custom)
  - Submit to create career
  - Close modal after creation

- [ ] Create validation schema with Zod

- [ ] Test full flow:
  - [ ] Open modal
  - [ ] Fill form
  - [ ] Submit
  - [ ] Career appears in dashboard
  - [ ] Can delete/archive career

### [] 3.4 Career Selection

- [ ] Create `src/components/career/CareerSelector.tsx`
  - Dropdown to switch between active careers
  - Display in topbar when inside a career

- [ ] Update routing to support career context
  ```typescript
  <Route path="/career/:careerId/*" element={<CareerLayout />}>
    <Route path="overview" element={<CareerOverview />} />
    <Route path="squad" element={<Squad />} />
    {/* ... other routes */}
  </Route>
  ```

---

## 👥 SQUAD MANAGEMENT (Week 2 - Days 4-5 & Week 3 - Days 1-2)

### [] 4.1 Players Database & Types

- [ ] Run migration for `players` table

- [ ] Create `src/types/player.types.ts`
  ```typescript
  export interface Player {
    id: string;
    career_id: string;
    first_name: string;
    last_name: string;
    position: string;
    ovr: number;
    potential: number;
    age: number;
    origin: 'Académie' | 'Initial' | 'Acheté';
    salary: number;
    value: number;
    status: 'Titulaire' | 'Remplaçant' | 'Réserve' | 'À vendre' | 'Prêt';
    play_styles: number;
    play_styles_plus: number;
    matches_played: number;
    minutes_played: number;
    goals: number;
    assists: number;
    clean_sheets: number;
    contract_expiry?: string;
    jersey_number?: number;
    nationality?: string;
    photo_url?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreatePlayerInput {
    first_name: string;
    last_name: string;
    position: string;
    ovr: number;
    potential: number;
    age: number;
    origin: Player['origin'];
    salary: number;
    value: number;
    status: Player['status'];
    // ... other optional fields
  }
  ```

- [ ] Create `src/store/playerStore.ts`
  - fetchPlayers(careerId) - Get all players for a career
  - createPlayer(careerId, data) - Add new player
  - updatePlayer(id, data) - Update player
  - deletePlayer(id) - Remove player
  - State: players[], loading

### [] 4.2 Squad Page - List View

- [ ] Create `src/pages/career/Squad.tsx`
  - Fetch players when entering page
  - Display loading skeleton
  - Show empty state if no players
  - "Add Player" button
  - Player list/table

- [ ] Create `src/components/squad/PlayerList.tsx`
  - Table with columns: Name, Position, OVR, Potential, Origin, Status, Actions
  - Sortable columns
  - Filter by position, origin, status
  - Search by name

- [ ] Create `src/components/squad/PlayerCard.tsx`
  - Compact card view of player
  - Show key stats
  - Click to view details

- [ ] Create `src/components/common/Table.tsx`
  - Reusable table component
  - Support for sorting, filtering
  - Pagination (optional for MVP)

### [] 4.3 Add/Edit Player

- [ ] Create `src/components/squad/PlayerModal.tsx`
  - Form to create or edit player
  - All required fields from player schema
  - Validation with Zod
  - Submit to create/update player

- [ ] Create Zod validation schema for player
  ```typescript
  import { z } from 'zod';
  
  export const playerSchema = z.object({
    first_name: z.string().min(1, 'First name required'),
    last_name: z.string().min(1, 'Last name required'),
    position: z.string().min(1, 'Position required'),
    ovr: z.number().min(40).max(99),
    potential: z.number().min(40).max(99),
    age: z.number().min(16).max(45),
    origin: z.enum(['Académie', 'Initial', 'Acheté']),
    status: z.enum(['Titulaire', 'Remplaçant', 'Réserve', 'À vendre', 'Prêt']),
    salary: z.number().min(0),
    value: z.number().min(0),
    // ... other fields
  });
  ```

- [ ] Test full CRUD:
  - [ ] Create player
  - [ ] Edit player
  - [ ] Delete player
  - [ ] Validate form errors

### [] 4.4 Player Detail View

- [ ] Create `src/components/squad/PlayerDetailModal.tsx`
  - Full player information
  - Stats section
  - Edit and Delete buttons
  - Notes section

- [ ] Show player progression (if from academy)
  - OVR history
  - Simple line chart (optional for MVP, can be Phase 2)

---

## 💰 TRANSFERS & BUDGET (Week 3 - Days 3-5)

### [] 5.1 Transfers Database & Types

- [ ] Run migration for `transfers` table

- [ ] Create `src/types/transfer.types.ts`
  ```typescript
  export interface Transfer {
    id: string;
    career_id: string;
    player_id?: string;
    player_name: string;
    type: 'sale' | 'purchase';
    amount: number; // in millions
    season: number;
    transfer_date?: string;
    from_club?: string;
    to_club?: string;
    notes?: string;
    created_at: string;
  }
  ```

- [ ] Create `src/store/transferStore.ts`

### [] 5.2 Transfers Page

- [ ] Create `src/pages/career/Transfers.tsx`
  - Tabs: Sales | Purchases
  - List of transfers per tab
  - "Add Transfer" button
  - Filter by season

- [ ] Create `src/components/transfers/TransferList.tsx`
  - Table with: Player, Amount, Date, Season, From/To
  - Total sales/purchases at bottom

- [ ] Create `src/components/transfers/TransferModal.tsx`
  - Form to record transfer
  - Player selection (from squad)
  - Type: Sale or Purchase
  - Amount in millions
  - Season dropdown
  - Notes

### [] 5.3 Budget System

- [ ] Run migration for `budget_entries` table

- [ ] Create `src/types/budget.types.ts`

- [ ] Create `src/store/budgetStore.ts`
  - fetchBudgetBySeason(careerId, season)
  - updateBudgetEntry(id, data)
  - calculateBalance()

- [ ] Create `src/pages/career/Finances.tsx`
  - Budget overview card (current budget)
  - Table by season:
    - Initial Budget
    - Transfer Sales (auto-calculated from transfers)
    - Transfer Purchases (auto-calculated)
    - Match Revenue (manual input)
    - Wage Expenses (manual input)
    - Final Balance (auto-calculated)
  - Edit button for manual fields

- [ ] Create auto-calculation logic
  - When transfer is added, update budget_entries
  - Transfer sales → increase transfer_sales
  - Transfer purchases → increase transfer_purchases
  - Recalculate final_balance

- [ ] Test budget flow:
  - [ ] Record sale → Budget increases
  - [ ] Record purchase → Budget decreases
  - [ ] Manual input for revenue/wages
  - [ ] Balance updates correctly

---

## 📊 DASHBOARD & KPIs (Week 3 - Day 5 & Week 4 - Days 1-2)

### [] 6.1 Career Overview Dashboard

- [ ] Create `src/pages/career/CareerOverview.tsx`
  - Hero section with club name, logo, season
  - KPI grid
  - Recent activity timeline (optional for MVP)
  - Quick actions

- [ ] Create `src/components/dashboard/StatCard.tsx`
  - Icon, label, value, trend (optional)
  - Reusable for all KPIs

- [ ] Implement KPI calculations:
  - [ ] % Players from Academy
    ```typescript
    const academyPercentage = (academyPlayers / totalPlayers) * 100;
    ```
  - [ ] Average OVR
    ```typescript
    const avgOVR = players.reduce((sum, p) => sum + p.ovr, 0) / players.length;
    ```
  - [ ] Players with 7+ PlayStyles
    ```typescript
    const players7Plus = players.filter(p => p.play_styles >= 7).length;
    ```
  - [ ] Current Budget (from budget_entries)
  - [ ] Titulaires from Academy
    ```typescript
    const academyStarters = players.filter(
      p => p.origin === 'Académie' && p.status === 'Titulaire'
    ).length;
    ```

- [ ] Create `src/components/dashboard/KPIGrid.tsx`
  - Display all KPI cards
  - Responsive grid layout

### [] 6.2 Basic Charts (Optional for MVP)

- [ ] Install Recharts
  ```bash
  npm install recharts
  ```

- [ ] Create `src/components/dashboard/ProgressChart.tsx`
  - Line chart showing OVR progression
  - Bar chart for budget evolution
  - Use sample data for MVP

---

## 📝 NOTES & JOURNAL (Week 4 - Days 3-4)

### [] 7.1 Journal Database & Types

- [ ] Run migration for `journal_entries` table

- [ ] Create `src/types/journal.types.ts`

- [ ] Create `src/store/journalStore.ts`

### [] 7.2 Journal Page

- [ ] Create `src/pages/career/Journal.tsx`
  - List of journal entries (newest first)
  - "New Entry" button
  - Filter by season
  - Search entries

- [ ] Create `src/components/journal/Timeline.tsx`
  - Vertical timeline of entries
  - Date, title, preview of content

- [ ] Create `src/components/journal/EntryModal.tsx`
  - Form to create/edit entry
  - Title, content (textarea), season
  - Optional: tags (array of strings)
  - Optional: date picker

- [ ] Create `src/components/journal/JournalEntry.tsx`
  - Display single entry
  - Edit/Delete buttons
  - Markdown support (optional for MVP)

---

## 🎨 UI/UX POLISH (Week 4 - Day 5)

### [] 8.1 Layout Components

- [ ] Create `src/components/layout/Sidebar.tsx`
  - Navigation links:
    - Overview
    - Squad
    - Transfers
    - Finances
    - Journal
  - Active link highlighting
  - Collapsible on mobile

- [ ] Create `src/components/layout/Topbar.tsx`
  - Career selector dropdown
  - User avatar/menu
  - Logout button
  - Dark mode toggle (optional)

- [ ] Create `src/components/layout/Layout.tsx`
  - Combines Sidebar + Topbar + main content
  - Responsive layout

- [ ] Apply layout to all career pages

### [] 8.2 Dark Mode

- [ ] Create `src/store/uiStore.ts`
  - theme: 'light' | 'dark'
  - toggleTheme()
  - Save preference to localStorage

- [ ] Create `src/hooks/useTheme.ts`

- [ ] Add dark mode toggle button in Topbar

- [ ] Test dark mode on all pages

### [] 8.3 Loading States & Skeletons

- [ ] Create `src/components/common/LoadingSkeleton.tsx`
  - Reusable skeleton component
  - Variants: card, table, list

- [ ] Add loading states to all pages:
  - Dashboard
  - Squad list
  - Transfer list
  - Journal

### [] 8.4 Empty States

- [ ] Create `src/components/common/EmptyState.tsx`
  - Icon, message, CTA button
  - Reusable for all empty lists

- [ ] Add empty states:
  - No careers → "Create your first career"
  - No players → "Add your first player"
  - No transfers → "Record your first transfer"
  - No journal entries → "Write your first entry"

### [] 8.5 Error Handling & Toasts

- [ ] Install sonner or react-hot-toast
  ```bash
  npm install sonner
  ```

- [ ] Create `src/hooks/useToast.ts`

- [ ] Add toast notifications for:
  - Success: "Player added successfully"
  - Error: "Failed to add player"
  - Info: "Career archived"

- [ ] Add error boundaries (optional for MVP)

---

## ✅ TESTING & FINAL CHECKS (Week 4 - End)

### [] 9.1 Manual Testing

- [ ] Test full user flow:
  - [ ] Register account
  - [ ] Create career
  - [ ] Add players
  - [ ] Record transfers
  - [ ] Update budget
  - [ ] Write journal entry
  - [ ] View dashboard KPIs
  - [ ] Switch between careers
  - [ ] Logout

- [ ] Test edge cases:
  - [ ] Empty states
  - [ ] Invalid form inputs
  - [ ] Long text inputs
  - [ ] Large numbers
  - [ ] Special characters in names

- [ ] Test responsiveness:
  - [ ] Desktop (1920x1080)
  - [ ] Laptop (1366x768)
  - [ ] Tablet (768x1024)
  - [ ] Mobile (375x667)

### [] 9.2 Performance Check

- [ ] Check initial load time
- [ ] Optimize images (if any)
- [ ] Check bundle size
  ```bash
  npm run build
  # Check dist folder size
  ```

### [] 9.3 Accessibility (Basic)

- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Alt text on images
- [ ] Semantic HTML used
- [ ] Color contrast sufficient

### [] 9.4 Code Cleanup

- [ ] Remove console.logs
- [ ] Remove unused imports
- [ ] Format code with Prettier
- [ ] Fix ESLint warnings
- [ ] Add TypeScript strict checks
- [ ] Remove commented-out code

---

## 🚀 DEPLOYMENT (Week 4 - End)

### [] 10.1 Build & Deploy

- [ ] Create production build
  ```bash
  npm run build
  ```

- [ ] Deploy to Vercel:
  - Connect GitHub repo
  - Add environment variables in Vercel dashboard
  - Deploy

- [ ] Test production deployment:
  - [ ] Auth works
  - [ ] Database queries work
  - [ ] All features functional

### [] 10.2 Documentation

- [ ] Update README.md with:
  - Live demo link
  - Screenshots
  - How to run locally
  - Tech stack

- [ ] Create CHANGELOG.md
  - Document Phase 1 features

---

## 📋 PHASE 1 CHECKLIST SUMMARY

**Core Features:**
- [x] Authentication (Login/Register/Logout)
- [ ] Career Creation & Management
- [ ] Squad Management (CRUD players)
- [ ] Transfers Tracking
- [ ] Budget System with auto-calculations
- [ ] Journal/Notes
- [ ] Dashboard with KPIs
- [ ] Dark Mode
- [ ] Responsive Design

**Pages Created:**
- [ ] Login / Register
- [ ] Dashboard (Careers list)
- [ ] Career Overview
- [ ] Squad
- [ ] Transfers  
- [ ] Finances
- [ ] Journal

**Database Tables:**
- [ ] profiles
- [ ] careers
- [ ] players
- [ ] transfers
- [ ] budget_entries
- [ ] journal_entries

---

## 🎯 PHASE 1 COMPLETION CRITERIA

Phase 1 is complete when:
1. ✅ User can register, login, and logout
2. ✅ User can create and manage multiple careers
3. ✅ User can add, edit, delete players
4. ✅ User can record transfers (sales/purchases)
5. ✅ Budget automatically updates with transfers
6. ✅ User can write journal entries
7. ✅ Dashboard shows accurate KPIs
8. ✅ App is responsive on mobile/desktop
9. ✅ Dark mode works
10. ✅ App is deployed and accessible online

---

## 🚀 NEXT: PHASE 2

Once Phase 1 is complete, move to [PHASE_2.md](PHASE_2.md) for enhanced features:
- Scouting system
- Youth development tracking
- Match calendar & results
- Visual tactics creator
- Advanced analytics

---

**Current Status:** Ready to begin development!  
**Start Date:** ___________  
**Target Completion:** ___________
