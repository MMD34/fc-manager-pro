# 🏗️ Project Structure

Detailed architecture and folder structure for FC Manager Pro.

## 📁 Complete Directory Structure

```
fc-manager-pro/
├── .vscode/                      # VS Code configuration
│   ├── settings.json
│   └── extensions.json
├── docs/                         # Documentation
│   ├── SETUP.md
│   ├── VSCODE_SETUP.md
│   ├── PROJECT_STRUCTURE.md
│   ├── DATABASE_SCHEMA.md
│   └── phases/
│       ├── PHASE_1.md
│       ├── PHASE_2.md
│       ├── PHASE_3.md
│       └── PHASE_4.md
├── public/                       # Static assets
│   ├── logo.svg
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── assets/                   # Images, fonts, etc.
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── components/               # Reusable components
│   │   ├── common/               # Generic components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── index.ts
│   │   ├── layout/               # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── index.ts
│   │   ├── career/               # Career-specific components
│   │   │   ├── CareerCard.tsx
│   │   │   ├── CareerSelector.tsx
│   │   │   ├── CreateCareerModal.tsx
│   │   │   └── index.ts
│   │   ├── dashboard/            # Dashboard components
│   │   │   ├── StatCard.tsx
│   │   │   ├── KPIGrid.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   └── index.ts
│   │   ├── squad/                # Squad management components
│   │   │   ├── PlayerCard.tsx
│   │   │   ├── PlayerList.tsx
│   │   │   ├── PlayerModal.tsx
│   │   │   ├── FormationView.tsx
│   │   │   ├── PlayerDetailModal.tsx
│   │   │   └── index.ts
│   │   ├── transfers/            # Transfer components
│   │   │   ├── TransferList.tsx
│   │   │   ├── TransferModal.tsx
│   │   │   ├── PlayerComparison.tsx
│   │   │   └── index.ts
│   │   ├── scouting/             # Scouting components
│   │   │   ├── ScoutCard.tsx
│   │   │   ├── ProspectCard.tsx
│   │   │   ├── ProspectModal.tsx
│   │   │   └── index.ts
│   │   ├── development/          # Youth development components
│   │   │   ├── DevelopmentCard.tsx
│   │   │   ├── ProgressionChart.tsx
│   │   │   └── index.ts
│   │   ├── tactics/              # Tactics components
│   │   │   ├── FormationPitch.tsx
│   │   │   ├── TacticCard.tsx
│   │   │   └── index.ts
│   │   ├── calendar/             # Calendar components
│   │   │   ├── CalendarView.tsx
│   │   │   ├── MatchCard.tsx
│   │   │   ├── MatchModal.tsx
│   │   │   └── index.ts
│   │   ├── budget/               # Budget components
│   │   │   ├── BudgetOverview.tsx
│   │   │   ├── BudgetChart.tsx
│   │   │   └── index.ts
│   │   └── journal/              # Journal components
│   │       ├── JournalEntry.tsx
│   │       ├── Timeline.tsx
│   │       ├── EntryModal.tsx
│   │       └── index.ts
│   ├── pages/                    # Page components
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ResetPassword.tsx
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx
│   │   ├── career/
│   │   │   ├── CareerOverview.tsx
│   │   │   ├── Squad.tsx
│   │   │   ├── Transfers.tsx
│   │   │   ├── Scouting.tsx
│   │   │   ├── Development.tsx
│   │   │   ├── Tactics.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── Results.tsx
│   │   │   ├── Finances.tsx
│   │   │   └── Journal.tsx
│   │   ├── settings/
│   │   │   ├── Profile.tsx
│   │   │   └── Preferences.tsx
│   │   └── NotFound.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCareer.ts
│   │   ├── usePlayers.ts
│   │   ├── useTransfers.ts
│   │   ├── useScouts.ts
│   │   ├── useDevelopment.ts
│   │   ├── useTactics.ts
│   │   ├── useMatches.ts
│   │   ├── useBudget.ts
│   │   ├── useJournal.ts
│   │   ├── useTheme.ts
│   │   └── useToast.ts
│   ├── store/                    # Zustand state management
│   │   ├── authStore.ts
│   │   ├── careerStore.ts
│   │   ├── playerStore.ts
│   │   ├── transferStore.ts
│   │   ├── scoutStore.ts
│   │   ├── developmentStore.ts
│   │   ├── tacticStore.ts
│   │   ├── matchStore.ts
│   │   ├── budgetStore.ts
│   │   ├── journalStore.ts
│   │   └── uiStore.ts
│   ├── lib/                      # Utilities and helpers
│   │   ├── supabase.ts          # Supabase client
│   │   ├── constants.ts         # App constants
│   │   ├── utils.ts             # General utilities
│   │   ├── validations.ts       # Zod schemas
│   │   ├── calculations.ts      # Budget/stats calculations
│   │   └── formatters.ts        # Data formatters
│   ├── types/                    # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── career.types.ts
│   │   ├── player.types.ts
│   │   ├── transfer.types.ts
│   │   ├── scout.types.ts
│   │   ├── development.types.ts
│   │   ├── tactic.types.ts
│   │   ├── match.types.ts
│   │   ├── budget.types.ts
│   │   ├── journal.types.ts
│   │   └── index.ts
│   ├── styles/                   # Global styles
│   │   ├── index.css
│   │   └── tailwind.css
│   ├── App.tsx                   # Main App component
│   ├── main.tsx                  # Entry point
│   └── vite-env.d.ts            # Vite types
├── supabase/                     # Supabase configuration
│   ├── migrations/               # Database migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_rls_policies.sql
│   │   └── ...
│   └── functions/                # Edge functions (if needed)
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Example env file
├── .gitignore
├── .prettierrc                   # Prettier config
├── .prettierignore
├── .eslintrc.cjs                 # ESLint config
├── tsconfig.json                 # TypeScript config
├── tsconfig.node.json
├── vite.config.ts                # Vite config
├── tailwind.config.js            # Tailwind config
├── postcss.config.js             # PostCSS config
├── package.json
├── package-lock.json
└── README.md
```

## 🧩 Architecture Patterns

### Component Organization

Components are organized by feature/domain:
- **common/** - Generic, reusable UI components
- **layout/** - App layout structure
- **[feature]/** - Feature-specific components

### Naming Conventions

- **Components**: PascalCase (e.g., `PlayerCard.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuth.ts`)
- **Stores**: camelCase with "Store" suffix (e.g., `careerStore.ts`)
- **Types**: PascalCase for interfaces/types, camelCase for files (e.g., `career.types.ts`)
- **Utils**: camelCase (e.g., `formatters.ts`)

### File Structure Pattern

Each component folder should have:
```
feature/
├── ComponentName.tsx    # Main component
├── SubComponent.tsx     # Sub-components if needed
└── index.ts            # Barrel export
```

Example:
```typescript
// squad/index.ts
export { PlayerCard } from './PlayerCard';
export { PlayerList } from './PlayerList';
export { PlayerModal } from './PlayerModal';
```

## 🔧 Tech Stack Details

### Core Technologies

**React 18+**
- Functional components with hooks
- No class components
- TypeScript for type safety

**Routing**
- React Router v6
- Nested routes
- Protected routes

**State Management**
- Zustand for global state
- React Query (TanStack Query) for server state
- Local component state for UI state

**Styling**
- Tailwind CSS for utility classes
- CSS Modules for component-specific styles (if needed)
- Dark mode support

**Forms**
- React Hook Form for form state
- Zod for validation schemas
- Type-safe forms

**Data Visualization**
- Recharts for charts and graphs
- Custom SVG for formations

**Icons**
- Lucide React (consistent icon set)

**Animations**
- Framer Motion for smooth transitions

### Backend (Supabase)

**Database**
- PostgreSQL (via Supabase)
- Row Level Security (RLS)
- Real-time subscriptions

**Authentication**
- Email/password
- Magic links (optional)
- Social auth (future)

**Storage**
- Image uploads (player photos, journal images)
- Organized by user/career

**Edge Functions** (if needed)
- Complex calculations
- Scheduled tasks

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@supabase/supabase-js": "^2.38.0",
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.12.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "recharts": "^2.10.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "prettier": "^3.1.0",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

## 🗄️ Data Flow

### Authentication Flow
```
User → Login Page → Supabase Auth → Auth Store → Protected Routes → App
```

### Career Data Flow
```
User Action → Component → Hook → Store → Supabase → Real-time Update → UI
```

### Example: Adding a Player
```
1. User fills PlayerModal form
2. React Hook Form validates with Zod schema
3. On submit → usePlayer hook called
4. Hook updates Zustand store
5. Store calls Supabase client
6. Supabase inserts player → DB
7. Real-time subscription updates store
8. Component re-renders with new data
```

## 🎯 Code Organization Principles

### DRY (Don't Repeat Yourself)
- Reusable components in `common/`
- Shared logic in custom hooks
- Utilities in `lib/`

### Single Responsibility
- Each component has one purpose
- Separate concerns (UI, logic, data)

### Type Safety
- TypeScript everywhere
- No `any` types
- Strict mode enabled

### Performance
- Code splitting with React.lazy
- Memoization with React.memo
- Optimized re-renders

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

## 📝 File Naming Examples

```
✅ Good:
- PlayerCard.tsx
- useAuth.ts
- careerStore.ts
- player.types.ts
- formatters.ts

❌ Bad:
- playercard.tsx
- Auth.ts
- CareerStore.ts
- PlayerTypes.ts
- Formatter.ts
```

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env.local`
- Use `VITE_` prefix for exposed vars
- Keep service keys server-side only

### Supabase RLS
- Enable Row Level Security on all tables
- Users can only access their own data
- Validate permissions on every query

### Input Validation
- Validate on client (UX)
- Validate on server (Security)
- Use Zod schemas for both

### XSS Protection
- React escapes by default
- Never use `dangerouslySetInnerHTML` without sanitization
- Validate URLs before rendering

## 🚀 Performance Optimization

### Code Splitting
```typescript
// Lazy load pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Squad = lazy(() => import('./pages/career/Squad'));
```

### Image Optimization
- Use WebP format
- Lazy load images
- Responsive images

### Bundle Size
- Tree shaking enabled (Vite)
- Import only what you need
- Monitor with Import Cost extension

### Database Queries
- Select only needed columns
- Use pagination
- Index frequently queried fields

## 🎯 Next Steps

Now that you understand the structure:
1. Review [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for data models
2. Start with [Phase 1 TODO](phases/PHASE_1.md)
3. Follow the structure when creating new files
