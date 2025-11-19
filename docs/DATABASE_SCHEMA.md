# 🗄️ Database Schema

Complete database schema for FC Manager Pro using Supabase (PostgreSQL).

## 📊 Database Overview

The database is organized around users and their careers, with all data scoped to individual careers.

### Entity Relationship Diagram

```
users (auth.users from Supabase)
  ↓
careers (1:N)
  ↓
├── players (1:N)
├── transfers (1:N)
├── scouts (1:N)
├── prospects (1:N)
├── tactics (1:N)
├── matches (1:N)
├── budget_entries (1:N)
└── journal_entries (1:N)
```

## 📋 Tables

### 1. **profiles** (extends Supabase auth.users)

Stores additional user information.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 2. **careers**

Main career save data.

```sql
CREATE TABLE careers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  club_name TEXT NOT NULL,
  club_id TEXT, -- For future club database integration
  league_name TEXT NOT NULL,
  country TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('academie', 'trophees', 'budget', 'custom')),
  current_season INTEGER NOT NULL DEFAULT 1,
  start_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  is_archived BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_careers_user_id ON careers(user_id);
CREATE INDEX idx_careers_is_active ON careers(is_active);

-- Enable RLS
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own careers"
  ON careers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own careers"
  ON careers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own careers"
  ON careers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own careers"
  ON careers FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. **players**

Player roster for each career.

```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  position TEXT NOT NULL,
  ovr INTEGER NOT NULL CHECK (ovr >= 40 AND ovr <= 99),
  potential INTEGER NOT NULL CHECK (potential >= 40 AND potential <= 99),
  age INTEGER NOT NULL CHECK (age >= 16 AND age <= 45),
  origin TEXT NOT NULL CHECK (origin IN ('Académie', 'Initial', 'Acheté')),
  salary INTEGER NOT NULL DEFAULT 0, -- Weekly salary in thousands
  value INTEGER NOT NULL DEFAULT 0, -- Market value in thousands
  status TEXT NOT NULL CHECK (status IN ('Titulaire', 'Remplaçant', 'Réserve', 'À vendre', 'Prêt')),
  play_styles INTEGER NOT NULL DEFAULT 0 CHECK (play_styles >= 0 AND play_styles <= 7),
  play_styles_plus INTEGER NOT NULL DEFAULT 0 CHECK (play_styles_plus >= 0 AND play_styles_plus <= 2),
  
  -- Stats
  matches_played INTEGER DEFAULT 0,
  minutes_played INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  clean_sheets INTEGER DEFAULT 0,
  
  -- Additional data
  contract_expiry DATE,
  jersey_number INTEGER CHECK (jersey_number >= 1 AND jersey_number <= 99),
  nationality TEXT,
  photo_url TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_players_career_id ON players(career_id);
CREATE INDEX idx_players_origin ON players(origin);
CREATE INDEX idx_players_status ON players(status);
CREATE INDEX idx_players_position ON players(position);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view players from own careers"
  ON players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = players.career_id
      AND careers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert players to own careers"
  ON players FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = players.career_id
      AND careers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update players from own careers"
  ON players FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = players.career_id
      AND careers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete players from own careers"
  ON players FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = players.career_id
      AND careers.user_id = auth.uid()
    )
  );
```

### 4. **transfers**

Transfer history (sales and purchases).

```sql
CREATE TABLE transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL, -- Stored in case player is deleted
  type TEXT NOT NULL CHECK (type IN ('sale', 'purchase')),
  amount DECIMAL(10, 2) NOT NULL, -- In millions
  season INTEGER NOT NULL,
  transfer_date DATE,
  from_club TEXT,
  to_club TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transfers_career_id ON transfers(career_id);
CREATE INDEX idx_transfers_season ON transfers(season);
CREATE INDEX idx_transfers_type ON transfers(type);

-- Enable RLS
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view transfers from own careers"
  ON transfers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = transfers.career_id
      AND careers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert transfers to own careers"
  ON transfers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = transfers.career_id
      AND careers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update transfers from own careers"
  ON transfers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = transfers.career_id
      AND careers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete transfers from own careers"
  ON transfers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = transfers.career_id
      AND careers.user_id = auth.uid()
    )
  );
```

### 5. **scouts**

Scouting network management.

```sql
CREATE TABLE scouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE NOT NULL,
  country TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  search_type TEXT NOT NULL,
  start_date DATE,
  findings TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_scouts_career_id ON scouts(career_id);
CREATE INDEX idx_scouts_country ON scouts(country);

-- Enable RLS
ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (same pattern as above)
CREATE POLICY "Users can manage scouts from own careers"
  ON scouts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = scouts.career_id
      AND careers.user_id = auth.uid()
    )
  );
```

### 6. **prospects**

Scouted youth players (not yet signed).

```sql
CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE NOT NULL,
  scout_id UUID REFERENCES scouts(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  position TEXT NOT NULL,
  country TEXT NOT NULL,
  ovr INTEGER NOT NULL CHECK (ovr >= 40 AND ovr <= 99),
  potential INTEGER NOT NULL CHECK (potential >= 40 AND potential <= 99),
  play_styles INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('watching', 'signed', 'rejected')) DEFAULT 'watching',
  priority INTEGER CHECK (priority >= 1 AND priority <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_prospects_career_id ON prospects(career_id);
CREATE INDEX idx_prospects_status ON prospects(status);

-- Enable RLS
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage prospects from own careers"
  ON prospects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = prospects.career_id
      AND careers.user_id = auth.uid()
    )
  );
```

### 7. **development_tracking**

Youth player development tracking.

```sql
CREATE TABLE development_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  season_joined INTEGER NOT NULL,
  ovr_on_arrival INTEGER NOT NULL,
  current_ovr INTEGER NOT NULL,
  target_ovr INTEGER,
  is_on_loan BOOLEAN DEFAULT false,
  loan_club TEXT,
  development_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(career_id, player_id)
);

-- Indexes
CREATE INDEX idx_development_career_id ON development_tracking(career_id);
CREATE INDEX idx_development_player_id ON development_tracking(player_id);

-- Enable RLS
ALTER TABLE development_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage development tracking from own careers"
  ON development_tracking FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = development_tracking.career_id
      AND careers.user_id = auth.uid()
    )
  );
```

### 8. **tactics**

Tactical setups and formations.

```sql
CREATE TABLE tactics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  formation TEXT NOT NULL, -- e.g., "4-2-3-1"
  style TEXT, -- e.g., "Possession", "Counter"
  instructions JSONB DEFAULT '{}',
  player_roles JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tactics_career_id ON tactics(career_id);

-- Enable RLS
ALTER TABLE tactics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage tactics from own careers"
  ON tactics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = tactics.career_id
      AND careers.user_id = auth.uid()
    )
  );
```

### 9. **matches**

Match results and statistics.

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE NOT NULL,
  season INTEGER NOT NULL,
  competition TEXT NOT NULL,
  opponent TEXT NOT NULL,
  match_date DATE NOT NULL,
  is_home BOOLEAN DEFAULT true,
  result TEXT CHECK (result IN ('W', 'D', 'L')),
  goals_for INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  possession INTEGER CHECK (possession >= 0 AND possession <= 100),
  shots INTEGER DEFAULT 0,
  shots_on_target INTEGER DEFAULT 0,
  passes_completed INTEGER DEFAULT 0,
  pass_accuracy INTEGER CHECK (pass_accuracy >= 0 AND pass_accuracy <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_matches_career_id ON matches(career_id);
CREATE INDEX idx_matches_season ON matches(season);
CREATE INDEX idx_matches_date ON matches(match_date);

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage matches from own careers"
  ON matches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = matches.career_id
      AND careers.user_id = auth.uid()
    )
  );
```

### 10. **budget_entries**

Financial tracking per season.

```sql
CREATE TABLE budget_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE NOT NULL,
  season INTEGER NOT NULL,
  initial_budget DECIMAL(10, 2) NOT NULL DEFAULT 0,
  transfer_sales DECIMAL(10, 2) NOT NULL DEFAULT 0,
  transfer_purchases DECIMAL(10, 2) NOT NULL DEFAULT 0,
  match_revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
  wage_expenses DECIMAL(10, 2) NOT NULL DEFAULT 0,
  other_revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
  other_expenses DECIMAL(10, 2) NOT NULL DEFAULT 0,
  final_balance DECIMAL(10, 2) GENERATED ALWAYS AS (
    initial_budget + transfer_sales + match_revenue + other_revenue 
    - transfer_purchases - wage_expenses - other_expenses
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(career_id, season)
);

-- Indexes
CREATE INDEX idx_budget_career_id ON budget_entries(career_id);
CREATE INDEX idx_budget_season ON budget_entries(season);

-- Enable RLS
ALTER TABLE budget_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage budget entries from own careers"
  ON budget_entries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = budget_entries.career_id
      AND careers.user_id = auth.uid()
    )
  );
```

### 11. **journal_entries**

Career journal/notes.

```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_id UUID REFERENCES careers(id) ON DELETE CASCADE NOT NULL,
  season INTEGER NOT NULL,
  entry_date DATE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_journal_career_id ON journal_entries(career_id);
CREATE INDEX idx_journal_season ON journal_entries(season);
CREATE INDEX idx_journal_date ON journal_entries(entry_date);
CREATE INDEX idx_journal_tags ON journal_entries USING GIN(tags);

-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage journal entries from own careers"
  ON journal_entries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM careers
      WHERE careers.id = journal_entries.career_id
      AND careers.user_id = auth.uid()
    )
  );
```

## 🔧 Database Functions

### Function: Update timestamp on row update

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON careers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scouts_updated_at BEFORE UPDATE ON scouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_development_tracking_updated_at BEFORE UPDATE ON development_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tactics_updated_at BEFORE UPDATE ON tactics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_entries_updated_at BEFORE UPDATE ON budget_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 📊 Views (Optional - For Complex Queries)

### View: Career Dashboard Stats

```sql
CREATE OR REPLACE VIEW career_dashboard_stats AS
SELECT 
  c.id AS career_id,
  c.club_name,
  c.current_season,
  COUNT(DISTINCT p.id) AS total_players,
  COUNT(DISTINCT CASE WHEN p.origin = 'Académie' THEN p.id END) AS academy_players,
  ROUND(AVG(p.ovr), 1) AS avg_ovr,
  COUNT(DISTINCT CASE WHEN p.play_styles >= 7 THEN p.id END) AS players_7plus_playstyles,
  COALESCE(b.final_balance, 0) AS current_budget
FROM careers c
LEFT JOIN players p ON c.id = p.career_id
LEFT JOIN budget_entries b ON c.id = b.career_id AND b.season = c.current_season
WHERE c.is_active = true
GROUP BY c.id, c.club_name, c.current_season, b.final_balance;
```

## 🔐 Security

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- All operations (SELECT, INSERT, UPDATE, DELETE) are scoped to user_id
- Cascading deletes protect data integrity

### Best Practices

1. **Never expose service_role key** - Use anon key in frontend
2. **Always validate input** - Both client and server side
3. **Use prepared statements** - Supabase handles this automatically
4. **Enable MFA** - For admin accounts
5. **Regular backups** - Supabase provides automatic backups

## 📝 Migration Script

See `supabase/migrations/001_initial_schema.sql` for the complete migration script to create all tables, indexes, and policies.

## 🚀 Next Steps

1. Run the migration script in Supabase SQL Editor
2. Test RLS policies
3. Set up Supabase client in the app
4. Start implementing CRUD operations
5. Begin Phase 1 development

---

For implementation details, see [docs/phases/PHASE_1.md](phases/PHASE_1.md)
