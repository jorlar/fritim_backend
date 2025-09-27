# Manual Database Setup Guide

Since the automated script might have issues, here's how to set up the database manually in your Supabase dashboard.

## Step 1: Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your project: `lffrdsaxkcdiqdvajuhh`
4. Go to **SQL Editor** in the left sidebar

## Step 2: Run Schema Creation

Copy and paste this entire SQL script into the SQL Editor and click "Run":

```sql
-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types
CREATE TYPE IF NOT EXISTS user_role AS ENUM ('admin', 'club_admin', 'user');
CREATE TYPE IF NOT EXISTS event_response AS ENUM ('kommer', 'kan_ikke', 'frivillig_time', 'frys_betaling');
CREATE TYPE IF NOT EXISTS transaction_type AS ENUM ('donation', 'expense', 'dugnad_income');

-- Clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  sport TEXT NOT NULL,
  location TEXT NOT NULL,
  member_count INTEGER DEFAULT 0,
  established INTEGER NOT NULL,
  description TEXT,
  primary_color TEXT DEFAULT '#1a365d',
  secondary_color TEXT DEFAULT '#2d5a87',
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'user',
  club_id UUID REFERENCES clubs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID NOT NULL REFERENCES clubs(id),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event responses table
CREATE TABLE IF NOT EXISTS event_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  response event_response NOT NULL,
  notes TEXT,
  responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Equipment listings table
CREATE TABLE IF NOT EXISTS equipment_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  condition TEXT NOT NULL CHECK (condition IN ('Ny', 'Brukt - som ny', 'Brukt - god stand', 'Brukt - brukbar stand')),
  category TEXT NOT NULL,
  seller_id UUID NOT NULL REFERENCES profiles(id),
  club_id UUID REFERENCES clubs(id),
  is_for_sale BOOLEAN DEFAULT TRUE,
  images TEXT,
  contact_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funds table
CREATE TABLE IF NOT EXISTS funds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID NOT NULL REFERENCES clubs(id),
  current_amount INTEGER NOT NULL DEFAULT 0,
  monthly_goal INTEGER DEFAULT 150000,
  yearly_goal INTEGER DEFAULT 2000000,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fund transactions table
CREATE TABLE IF NOT EXISTS fund_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fund_id UUID NOT NULL REFERENCES funds(id),
  amount INTEGER NOT NULL,
  transaction_type transaction_type NOT NULL,
  description TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Frikjøp transactions table
CREATE TABLE IF NOT EXISTS frikjop_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  event_id UUID NOT NULL REFERENCES events(id),
  amount INTEGER NOT NULL,
  club_contribution INTEGER NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE frikjop_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Clubs: Everyone can read, only admins can modify
CREATE POLICY "Clubs are viewable by everyone" ON clubs FOR SELECT USING (true);
CREATE POLICY "Only admins can modify clubs" ON clubs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles: Users can view their own and club members, admins can view all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view club members" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.club_id = profiles.club_id)
);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Events: Everyone can read, club admins can modify their club's events
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Club admins can manage their club's events" ON events FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND (p.role = 'admin' OR (p.role = 'club_admin' AND p.club_id = events.club_id))
  )
);

-- Event responses: Users can manage their own responses
CREATE POLICY "Users can manage own responses" ON event_responses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Everyone can view responses" ON event_responses FOR SELECT USING (true);

-- Equipment listings: Everyone can read, users can manage their own
CREATE POLICY "Equipment listings are viewable by everyone" ON equipment_listings FOR SELECT USING (true);
CREATE POLICY "Users can manage own listings" ON equipment_listings FOR ALL USING (auth.uid() = seller_id);

-- Funds: Everyone can read, club admins can modify their club's fund
CREATE POLICY "Funds are viewable by everyone" ON funds FOR SELECT USING (true);
CREATE POLICY "Club admins can manage their club's fund" ON funds FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND (p.role = 'admin' OR (p.role = 'club_admin' AND p.club_id = funds.club_id))
  )
);

-- Fund transactions: Everyone can read, fund owners can add transactions
CREATE POLICY "Fund transactions are viewable by everyone" ON fund_transactions FOR SELECT USING (true);
CREATE POLICY "Fund owners can add transactions" ON fund_transactions FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p 
    JOIN funds f ON f.club_id = p.club_id
    WHERE p.id = auth.uid() 
    AND f.id = fund_transactions.fund_id
    AND (p.role = 'admin' OR p.role = 'club_admin')
  )
);

-- Frikjøp transactions: Users can manage their own
CREATE POLICY "Users can manage own frikjop transactions" ON frikjop_transactions FOR ALL USING (auth.uid() = user_id);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_listings_updated_at BEFORE UPDATE ON equipment_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 3: Insert Mock Data

After the schema is created, run this script to insert sample data:

```sql
-- Insert sample clubs
INSERT INTO clubs (id, name, short_name, sport, location, member_count, established, description, primary_color, secondary_color, logo) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Fritim Idrettslag', 'Fritim', 'Fotball & Idrett', 'Oslo, Norge', 245, 1985, 'Et aktivt idrettslag med fokus på fotball, håndball og allidrett for alle aldre.', '#1a365d', '#2d5a87', '⚽'),
('550e8400-e29b-41d4-a716-446655440002', 'Fjellkameratene SK', 'Fjellkameratene', 'Ski & Friidrett', 'Lillehammer, Norge', 180, 1972, 'Skiklubb med tradisjoner innen langrenn, hopp og friidrett i hjertet av Gudbrandsdalen.', '#2d5016', '#4a7c59', '🎿'),
('550e8400-e29b-41d4-a716-446655440003', 'Kysten Fotballklubb', 'Kysten FK', 'Fotball', 'Bergen, Norge', 320, 1990, 'Bergens største fotballklubb med lag fra 6-års alderen opp til seniornivå.', '#7c2d12', '#dc2626', '⚽');

-- Insert funds for each club
INSERT INTO funds (id, club_id, current_amount, monthly_goal, yearly_goal) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 125000, 150000, 2000000),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 98000, 120000, 1500000),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 156000, 180000, 2200000);

-- Insert sample equipment listings
INSERT INTO equipment_listings (id, title, description, price, original_price, condition, category, seller_id, club_id, is_for_sale, contact_info) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Nike Mercurial Vapor 14', 'Profesjonelle fotballsko i størrelse 42. Brukt i 3 måneder, perfekt tilstand.', 800, 1200, 'Brukt - som ny', 'Fotball', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', true, 'erik.hansen@email.com'),
('770e8400-e29b-41d4-a716-446655440002', 'Håndballsko - Adidas Stabil', 'Håndballsko i størrelse 41. Brukt i 6 måneder, god stand.', 0, null, 'Brukt - god stand', 'Håndball', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', false, 'maria.olsen@email.com'),
('770e8400-e29b-41d4-a716-446655440003', 'Langrennsski - Fischer', 'Profesjonelle langrennsski, 180cm. Brukt i 2 sesonger, god stand.', 1500, 2500, 'Brukt - god stand', 'Ski', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', true, 'lars.andersen@email.com'),
('770e8400-e29b-41d4-a716-446655440004', 'Tennissett - Wilson', 'Komplett tennissett med racket, baller og net. Perfekt for begynnere.', 0, null, 'Brukt - brukbar stand', 'Tennis', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', false, 'anna.berg@email.com'),
('770e8400-e29b-41d4-a716-446655440005', 'Svømmebriller - Speedo', 'Profesjonelle svømmebriller, brukt i 2 måneder. Perfekt tilstand.', 200, 350, 'Brukt - som ny', 'Svømming', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', true, 'tommy.larsen@email.com'),
('770e8400-e29b-41d4-a716-446655440006', 'Friidrettssko - Asics', 'Spikesko for friidrett, størrelse 43. Brukt i 1 sesong, god stand.', 600, 900, 'Brukt - god stand', 'Friidrett', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', true, 'sofia.johansen@email.com');

-- Insert sample fund transactions
INSERT INTO fund_transactions (id, fund_id, amount, transaction_type, description, created_by) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 5000, 'donation', 'Donasjon mottatt', '550e8400-e29b-41d4-a716-446655440004'),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', -12000, 'expense', 'Utstyr kjøpt', '550e8400-e29b-41d4-a716-446655440004'),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 8500, 'dugnad_income', 'Dugnad inntekt', '550e8400-e29b-41d4-a716-446655440004'),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440002', 3200, 'donation', 'Donasjon mottatt', '550e8400-e29b-41d4-a716-446655440005'),
('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440003', 7800, 'dugnad_income', 'Dugnad inntekt', '550e8400-e29b-41d4-a716-446655440005');
```

## Step 4: Create Test Users (Optional)

To test authentication, you can create users in the Supabase dashboard:

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Create these test users:

**Admin User:**
- Email: `admin@fritim.no`
- Password: `password123`
- Email Confirm: ✓ (checked)

**Club Admin:**
- Email: `club@fritim.no` 
- Password: `password123`
- Email Confirm: ✓ (checked)

**Regular User:**
- Email: `user@fritim.no`
- Password: `password123`
- Email Confirm: ✓ (checked)

## Step 5: Verify Setup

After running the scripts, you should see:

1. **Tables**: 8 tables created (clubs, profiles, events, event_responses, equipment_listings, funds, fund_transactions, frikjop_transactions)
2. **Data**: Sample clubs, funds, equipment listings, and transactions
3. **Policies**: Row Level Security policies active
4. **Users**: Test users created (if you created them)

You can verify this by going to **Table Editor** in your Supabase dashboard and checking that the tables exist with data.

## Troubleshooting

If you encounter errors:

1. **Permission Errors**: Make sure you're using the service role key
2. **Type Errors**: Run the type creation commands first
3. **Foreign Key Errors**: Make sure you insert clubs before other data
4. **RLS Errors**: The policies might need adjustment based on your authentication setup

Once this is complete, your database will be ready for the app to use!
