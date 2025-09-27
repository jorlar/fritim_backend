const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://lffrdsaxkcdiqdvajuhh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZnJkc2F4a2NkaXFkdmFqdWhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODk4MzU1OCwiZXhwIjoyMDc0NTU5NTU4fQ.G0mwYZ_ZrWNz7-1o7yvZKwBb7cnqoZRbE-qWCzP0Fkg';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  console.log('🚀 Starting database setup...');

  try {
    // Step 1: Create custom types
    console.log('📝 Creating custom types...');
    
    const types = [
      `CREATE TYPE IF NOT EXISTS user_role AS ENUM ('admin', 'club_admin', 'user');`,
      `CREATE TYPE IF NOT EXISTS event_response AS ENUM ('kommer', 'kan_ikke', 'frivillig_time', 'frys_betaling');`,
      `CREATE TYPE IF NOT EXISTS transaction_type AS ENUM ('donation', 'expense', 'dugnad_income');`
    ];

    for (const typeQuery of types) {
      const { error } = await supabase.rpc('exec_sql', { sql: typeQuery });
      if (error && !error.message.includes('already exists')) {
        console.error('Error creating type:', error);
      }
    }

    // Step 2: Create clubs table
    console.log('🏢 Creating clubs table...');
    const { error: clubsError } = await supabase.rpc('exec_sql', { 
      sql: `
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
      `
    });

    if (clubsError) {
      console.error('Error creating clubs table:', clubsError);
    }

    // Step 3: Create profiles table
    console.log('👤 Creating profiles table...');
    const { error: profilesError } = await supabase.rpc('exec_sql', { 
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          role user_role DEFAULT 'user',
          club_id UUID REFERENCES clubs(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (profilesError) {
      console.error('Error creating profiles table:', profilesError);
    }

    // Step 4: Create events table
    console.log('📅 Creating events table...');
    const { error: eventsError } = await supabase.rpc('exec_sql', { 
      sql: `
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
      `
    });

    if (eventsError) {
      console.error('Error creating events table:', eventsError);
    }

    // Step 5: Create other tables
    console.log('📊 Creating remaining tables...');
    const tables = [
      `CREATE TABLE IF NOT EXISTS event_responses (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES profiles(id),
        response event_response NOT NULL,
        notes TEXT,
        responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(event_id, user_id)
      );`,
      `CREATE TABLE IF NOT EXISTS equipment_listings (
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
      );`,
      `CREATE TABLE IF NOT EXISTS funds (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        club_id UUID NOT NULL REFERENCES clubs(id),
        current_amount INTEGER NOT NULL DEFAULT 0,
        monthly_goal INTEGER DEFAULT 150000,
        yearly_goal INTEGER DEFAULT 2000000,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE TABLE IF NOT EXISTS fund_transactions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        fund_id UUID NOT NULL REFERENCES funds(id),
        amount INTEGER NOT NULL,
        transaction_type transaction_type NOT NULL,
        description TEXT NOT NULL,
        created_by UUID REFERENCES profiles(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE TABLE IF NOT EXISTS frikjop_transactions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES profiles(id),
        event_id UUID NOT NULL REFERENCES events(id),
        amount INTEGER NOT NULL,
        club_contribution INTEGER NOT NULL,
        status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`
    ];

    for (const tableQuery of tables) {
      const { error } = await supabase.rpc('exec_sql', { sql: tableQuery });
      if (error) {
        console.error('Error creating table:', error);
      }
    }

    console.log('✅ Database schema created successfully!');
    console.log('🌱 Now seeding with mock data...');

    // Step 6: Insert mock data
    await seedDatabase();

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

async function seedDatabase() {
  try {
    // Insert clubs
    console.log('🏢 Inserting clubs...');
    const { data: clubs, error: clubsError } = await supabase
      .from('clubs')
      .insert([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Fritim Idrettslag',
          short_name: 'Fritim',
          sport: 'Fotball & Idrett',
          location: 'Oslo, Norge',
          member_count: 245,
          established: 1985,
          description: 'Et aktivt idrettslag med fokus på fotball, håndball og allidrett for alle aldre.',
          primary_color: '#1a365d',
          secondary_color: '#2d5a87',
          logo: '⚽'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Fjellkameratene SK',
          short_name: 'Fjellkameratene',
          sport: 'Ski & Friidrett',
          location: 'Lillehammer, Norge',
          member_count: 180,
          established: 1972,
          description: 'Skiklubb med tradisjoner innen langrenn, hopp og friidrett i hjertet av Gudbrandsdalen.',
          primary_color: '#2d5016',
          secondary_color: '#4a7c59',
          logo: '🎿'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Kysten Fotballklubb',
          short_name: 'Kysten FK',
          sport: 'Fotball',
          location: 'Bergen, Norge',
          member_count: 320,
          established: 1990,
          description: 'Bergens største fotballklubb med lag fra 6-års alderen opp til seniornivå.',
          primary_color: '#7c2d12',
          secondary_color: '#dc2626',
          logo: '⚽'
        }
      ])
      .select();

    if (clubsError) {
      console.error('Error inserting clubs:', clubsError);
    } else {
      console.log(`✅ Inserted ${clubs?.length || 0} clubs`);
    }

    // Insert funds
    console.log('💰 Inserting funds...');
    const { data: funds, error: fundsError } = await supabase
      .from('funds')
      .insert([
        {
          id: '880e8400-e29b-41d4-a716-446655440001',
          club_id: '550e8400-e29b-41d4-a716-446655440001',
          current_amount: 125000,
          monthly_goal: 150000,
          yearly_goal: 2000000
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440002',
          club_id: '550e8400-e29b-41d4-a716-446655440002',
          current_amount: 98000,
          monthly_goal: 120000,
          yearly_goal: 1500000
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440003',
          club_id: '550e8400-e29b-41d4-a716-446655440003',
          current_amount: 156000,
          monthly_goal: 180000,
          yearly_goal: 2200000
        }
      ])
      .select();

    if (fundsError) {
      console.error('Error inserting funds:', fundsError);
    } else {
      console.log(`✅ Inserted ${funds?.length || 0} funds`);
    }

    // Insert equipment listings
    console.log('🏓 Inserting equipment listings...');
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment_listings')
      .insert([
        {
          id: '770e8400-e29b-41d4-a716-446655440001',
          title: 'Nike Mercurial Vapor 14',
          description: 'Profesjonelle fotballsko i størrelse 42. Brukt i 3 måneder, perfekt tilstand.',
          price: 800,
          original_price: 1200,
          condition: 'Brukt - som ny',
          category: 'Fotball',
          seller_id: '550e8400-e29b-41d4-a716-446655440004',
          club_id: '550e8400-e29b-41d4-a716-446655440001',
          is_for_sale: true,
          contact_info: 'erik.hansen@email.com'
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440002',
          title: 'Håndballsko - Adidas Stabil',
          description: 'Håndballsko i størrelse 41. Brukt i 6 måneder, god stand.',
          price: 0,
          condition: 'Brukt - god stand',
          category: 'Håndball',
          seller_id: '550e8400-e29b-41d4-a716-446655440005',
          club_id: '550e8400-e29b-41d4-a716-446655440002',
          is_for_sale: false,
          contact_info: 'maria.olsen@email.com'
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440003',
          title: 'Langrennsski - Fischer',
          description: 'Profesjonelle langrennsski, 180cm. Brukt i 2 sesonger, god stand.',
          price: 1500,
          original_price: 2500,
          condition: 'Brukt - god stand',
          category: 'Ski',
          seller_id: '550e8400-e29b-41d4-a716-446655440006',
          club_id: '550e8400-e29b-41d4-a716-446655440002',
          is_for_sale: true,
          contact_info: 'lars.andersen@email.com'
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440004',
          title: 'Tennissett - Wilson',
          description: 'Komplett tennissett med racket, baller og net. Perfekt for begynnere.',
          price: 0,
          condition: 'Brukt - brukbar stand',
          category: 'Tennis',
          seller_id: '550e8400-e29b-41d4-a716-446655440007',
          club_id: '550e8400-e29b-41d4-a716-446655440003',
          is_for_sale: false,
          contact_info: 'anna.berg@email.com'
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440005',
          title: 'Svømmebriller - Speedo',
          description: 'Profesjonelle svømmebriller, brukt i 2 måneder. Perfekt tilstand.',
          price: 200,
          original_price: 350,
          condition: 'Brukt - som ny',
          category: 'Svømming',
          seller_id: '550e8400-e29b-41d4-a716-446655440008',
          club_id: '550e8400-e29b-41d4-a716-446655440001',
          is_for_sale: true,
          contact_info: 'tommy.larsen@email.com'
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440006',
          title: 'Friidrettssko - Asics',
          description: 'Spikesko for friidrett, størrelse 43. Brukt i 1 sesong, god stand.',
          price: 600,
          original_price: 900,
          condition: 'Brukt - god stand',
          category: 'Friidrett',
          seller_id: '550e8400-e29b-41d4-a716-446655440009',
          club_id: '550e8400-e29b-41d4-a716-446655440002',
          is_for_sale: true,
          contact_info: 'sofia.johansen@email.com'
        }
      ])
      .select();

    if (equipmentError) {
      console.error('Error inserting equipment:', equipmentError);
    } else {
      console.log(`✅ Inserted ${equipment?.length || 0} equipment listings`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 You can now view the data in your Supabase dashboard');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  }
}

// Run the setup
setupDatabase();
