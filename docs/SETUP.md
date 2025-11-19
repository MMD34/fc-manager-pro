# 🛠️ Setup Guide - FC Manager Pro

Complete installation and configuration guide for the FC Manager Pro project.

## Prerequisites

Before starting, ensure you have:
- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** installed
- **VS Code** (recommended) or any code editor
- **Supabase account** ([Sign up](https://supabase.com/))

## 📦 Initial Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/fc-manager-pro.git
cd fc-manager-pro
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For development
VITE_APP_ENV=development
```

**How to get Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (or create one)
3. Go to Settings → API
4. Copy `Project URL` → Use as `VITE_SUPABASE_URL`
5. Copy `anon` `public` key → Use as `VITE_SUPABASE_ANON_KEY`

### 4. Supabase Setup

#### A. Create Supabase Project

1. Go to https://app.supabase.com/
2. Click "New Project"
3. Choose a name (e.g., "fc-manager-pro")
4. Set a strong database password (save it!)
5. Select a region close to you
6. Click "Create new project" (takes ~2 minutes)

#### B. Run Database Migrations

After the project is created, go to SQL Editor in Supabase dashboard and run the initial schema:

```sql
-- This will be provided in docs/DATABASE_SCHEMA.md
-- For now, you'll create tables as you progress through Phase 1
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The app should open at `http://localhost:5173`

## 🔧 VS Code Setup

See [VSCODE_SETUP.md](VSCODE_SETUP.md) for recommended extensions and configuration.

## 📁 Project Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed architecture information.

## 🗄️ Database Schema

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for complete database design.

## 🚀 Development Workflow

### Starting Development

1. Create a new branch for your feature:
   ```bash
   git checkout -b phase-1/feature-name
   ```

2. Follow the TODO checklist in `docs/phases/PHASE_X.md`

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Test your changes

5. Commit and push:
   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push origin phase-1/feature-name
   ```

### Building for Production

```bash
npm run build
# or
yarn build
```

Preview production build:
```bash
npm run preview
# or
yarn preview
```

## 🔍 Troubleshooting

### Common Issues

**Issue: "Cannot find module '@supabase/supabase-js'"**
- Solution: Run `npm install @supabase/supabase-js`

**Issue: "VITE_SUPABASE_URL is not defined"**
- Solution: Check your `.env.local` file exists and has correct values
- Restart the dev server after adding env variables

**Issue: Supabase connection fails**
- Solution: Verify your Supabase project is active
- Check the URL and anon key are correct
- Ensure your IP is not blocked (check Supabase dashboard → Database → Connection pooling)

**Issue: TypeScript errors**
- Solution: Run `npm run type-check` to see all errors
- Ensure all dependencies are installed

### Getting Help

1. Check existing issues on GitHub
2. Review the documentation files
3. Create a new issue with detailed information

## 📝 Next Steps

Once setup is complete:
1. Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) to understand the architecture
2. Review [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) to understand data models
3. Start with [Phase 1 TODO](phases/PHASE_1.md)

## 🔐 Security Notes

- Never commit `.env.local` to Git (it's in `.gitignore`)
- Never share your Supabase service_role key publicly
- Use Row Level Security (RLS) policies in Supabase for data protection
- Always validate user input on both client and server

## 🎯 Ready to Start?

You're all set! Head to [docs/phases/PHASE_1.md](phases/PHASE_1.md) to begin development.
