-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types (without IF NOT EXISTS)
CREATE TYPE user_role AS ENUM ('admin', 'club_admin', 'user');
CREATE TYPE event_response AS ENUM ('kommer', 'kan_ikke', 'frivillig_time', 'frys_betaling');
CREATE TYPE transaction_type AS ENUM ('donation', 'expense', 'dugnad_income');

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
