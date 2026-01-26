# DEPRECATED — This project uses Firebase now

This guide is kept for historical reference only. Use FIREBASE_SETUP_GUIDE.md instead.

# ðŸ”§ Supabase Setup Guide - Step by Step

This guide will walk you through setting up Supabase for FC Manager Pro.

## âœ… What's Already Done

I've created the following files for you:
- âœ… [.env.local](./.env.local) - Environment variables template
- âœ… [.gitignore](./.gitignore) - Git ignore file
- âœ… [supabase/migrations/001_initial_schema.sql](./supabase/migrations/001_initial_schema.sql) - Complete database schema

## ðŸ”‘ What You Need To Do

### Step 1: Create a Supabase Account & Project

1. **Go to Supabase:**
   - Visit: https://app.supabase.com/
   - Sign up or log in

2. **Create a New Project:**
   - Click "New Project" button
   - Fill in the details:
     - **Name**: `fc-manager-pro` (or any name you prefer)
     - **Database Password**: Create a strong password and **SAVE IT SECURELY**
     - **Region**: Choose the region closest to you (e.g., `East US`, `Europe West`)
     - **Pricing Plan**: Select "Free" tier (sufficient for development)
   - Click "Create new project"
   - â° Wait ~2 minutes for project creation

### Step 2: Get Your Supabase Credentials

Once your project is created:

1. **Navigate to Project Settings:**
   - In your Supabase dashboard, click on the gear icon (âš™ï¸) at the bottom left
   - Click "Settings" â†’ "API"

2. **Copy Your Credentials:**
   - **Project URL**: Copy the URL shown under "Project URL"
     - Example: `https://abcdefghijklmnop.supabase.co`
   - **Anon/Public Key**: Copy the key under "Project API keys" â†’ "anon" "public"
     - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **Update `.env.local` File:**
   - Open the [.env.local](./.env.local) file in your project
   - Replace the placeholder values:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   VITE_APP_ENV=development
   ```

### Step 3: Run the Database Migration

Now you need to create all the database tables:

1. **Go to SQL Editor:**
   - In your Supabase dashboard, click "SQL Editor" in the left sidebar

2. **Create a New Query:**
   - Click "New Query" button

3. **Copy the Migration SQL:**
   - Open [supabase/migrations/001_initial_schema.sql](./supabase/migrations/001_initial_schema.sql)
   - Copy **ALL** the content (Ctrl+A, Ctrl+C)

4. **Paste and Run:**
   - Paste the SQL into the Supabase SQL Editor
   - Click "Run" button (or press Ctrl+Enter)
   - âœ… You should see "Success. No rows returned"

5. **Verify Tables Were Created:**
   - Click "Table Editor" in the left sidebar
   - You should see all these tables:
     - `profiles`
     - `careers`
     - `players`
     - `transfers`
     - `scouts`
     - `prospects`
     - `development_tracking`
     - `tactics`
     - `matches`
     - `budget_entries`
     - `journal_entries`

### Step 4: Enable Email Authentication

1. **Go to Authentication Settings:**
   - Click "Authentication" in the left sidebar
   - Click "Providers" tab

2. **Configure Email Provider:**
   - Find "Email" in the list
   - Make sure it's **enabled** (toggle should be ON)
   - For development, you can enable "Confirm email" OFF to skip email verification
   - Click "Save"

### Step 5: Verify Row Level Security (RLS)

The migration script already enabled RLS on all tables. To verify:

1. **Go to Authentication:**
   - Click "Authentication" â†’ "Policies"

2. **Check Policies:**
   - Each table should have RLS policies
   - You should see policies like "Users can view own careers", etc.

## ðŸŽ‰ Setup Complete!

Your Supabase backend is now ready! Here's what you have:

âœ… **11 Database Tables** with proper relationships
âœ… **Row Level Security (RLS)** enabled for data protection
âœ… **Indexes** for query performance
âœ… **Auto-updating timestamps** via triggers
âœ… **Views** for dashboard statistics
âœ… **Authentication** system ready

## ðŸš€ Next Steps

1. **Initialize the React Project:**
   ```bash
   npm create vite@latest . -- --template react-ts
   npm install
   ```

2. **Install Supabase Client:**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Start Development:**
   - Follow [docs/phases/PHASE_1.md](./docs/phases/PHASE_1.md) to begin building

## ðŸ” Testing Your Connection

To test if everything works, you can create a simple test in the SQL Editor:

```sql
-- Test query to check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see all 11 tables listed.

## ðŸ†˜ Troubleshooting

### Issue: "relation does not exist"
- **Solution**: Make sure you ran the migration SQL completely
- Check the SQL Editor for any error messages

### Issue: "permission denied for table"
- **Solution**: RLS policies are working correctly! You need to be authenticated to access data
- This is expected behavior for security

### Issue: Connection fails from app
- **Solution**:
  - Verify `.env.local` has correct URL and anon key
  - Restart your dev server after updating `.env.local`
  - Check there are no extra spaces in the credentials

### Issue: Can't find anon key
- **Solution**: Go to Settings â†’ API â†’ Look for "anon" under "Project API keys"
- Don't use the "service_role" key (that's for admin operations only)

## ðŸ“š Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## ðŸ” Security Reminders

- âœ… `.env.local` is in `.gitignore` - safe from Git
- âœ… Never commit your anon key to public repositories
- âœ… Never share your service_role key
- âœ… RLS policies protect your data automatically
- âœ… Always validate user input on both client and server

---

**Need help?** Open an issue on GitHub or consult the documentation files in `docs/`.


