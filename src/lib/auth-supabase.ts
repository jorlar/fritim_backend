import { supabase } from './supabase';
import { User, Club, Event, EventResponse, EquipmentListing, Fund, FundTransaction, FrikjopTransaction } from './types';

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return null;
    }

    // Get user profile with club information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        clubs (
          id,
          name,
          short_name,
          sport,
          location
        )
      `)
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      club_id: profile.club_id,
      club: profile.clubs,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'club_admin' | 'user';
  club_id?: string;
}): Promise<User | null> {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw authError;
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        club_id: userData.club_id || null,
      })
      .select(`
        *,
        clubs (
          id,
          name,
          short_name,
          sport,
          location
        )
      `)
      .single();

    if (profileError || !profile) {
      throw profileError;
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      club_id: profile.club_id,
      club: profile.clubs,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };
  } catch (error) {
    console.error('User creation error:', error);
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        clubs (
          id,
          name,
          short_name,
          sport,
          location
        )
      `)
      .eq('id', id)
      .single();

    if (error || !profile) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      club_id: profile.club_id,
      club: profile.clubs,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        *,
        clubs (
          id,
          name,
          short_name,
          sport,
          location
        )
      `)
      .order('created_at', { ascending: false });

    if (error || !profiles) {
      return [];
    }

    return profiles.map(profile => ({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      club_id: profile.club_id,
      club: profile.clubs,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }));
  } catch (error) {
    console.error('Get all users error:', error);
    return [];
  }
}

// Club management functions
export async function getAllClubs(): Promise<Club[]> {
  try {
    const { data: clubs, error } = await supabase
      .from('clubs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !clubs) {
      return [];
    }

    return clubs.map(club => ({
      id: club.id,
      name: club.name,
      short_name: club.short_name,
      sport: club.sport,
      location: club.location,
      member_count: club.member_count,
      established: club.established,
      description: club.description,
      primary_color: club.primary_color,
      secondary_color: club.secondary_color,
      logo: club.logo,
      created_at: club.created_at,
      updated_at: club.updated_at,
    }));
  } catch (error) {
    console.error('Get all clubs error:', error);
    return [];
  }
}

export async function createClub(clubData: {
  name: string;
  short_name: string;
  sport: string;
  location: string;
  established: number;
  description?: string;
  primary_color?: string;
  secondary_color?: string;
  logo?: string;
}): Promise<Club | null> {
  try {
    const { data: club, error } = await supabase
      .from('clubs')
      .insert(clubData)
      .select('*')
      .single();

    if (error || !club) {
      throw error;
    }

    return {
      id: club.id,
      name: club.name,
      short_name: club.short_name,
      sport: club.sport,
      location: club.location,
      member_count: club.member_count,
      established: club.established,
      description: club.description,
      primary_color: club.primary_color,
      secondary_color: club.secondary_color,
      logo: club.logo,
      created_at: club.created_at,
      updated_at: club.updated_at,
    };
  } catch (error) {
    console.error('Create club error:', error);
    return null;
  }
}

// Event management functions
export async function getAllEvents(): Promise<Event[]> {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        clubs (
          id,
          name,
          short_name,
          sport,
          location
        ),
        profiles!events_created_by_fkey (
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error || !events) {
      return [];
    }

    return events.map(event => ({
      id: event.id,
      club_id: event.club_id,
      club: event.clubs,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      created_by: event.created_by,
      created_by_user: event.profiles,
      created_at: event.created_at,
      updated_at: event.updated_at,
    }));
  } catch (error) {
    console.error('Get all events error:', error);
    return [];
  }
}

export async function createEvent(eventData: {
  club_id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  created_by: string;
}): Promise<Event | null> {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .insert(eventData)
      .select(`
        *,
        clubs (
          id,
          name,
          short_name,
          sport,
          location
        ),
        profiles!events_created_by_fkey (
          id,
          name,
          email
        )
      `)
      .single();

    if (error || !event) {
      throw error;
    }

    return {
      id: event.id,
      club_id: event.club_id,
      club: event.clubs,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      created_by: event.created_by,
      created_by_user: event.profiles,
      created_at: event.created_at,
      updated_at: event.updated_at,
    };
  } catch (error) {
    console.error('Create event error:', error);
    return null;
  }
}

// Equipment listings functions
export async function getAllEquipmentListings(): Promise<EquipmentListing[]> {
  try {
    const { data: listings, error } = await supabase
      .from('equipment_listings')
      .select(`
        *,
        profiles!equipment_listings_seller_id_fkey (
          id,
          name,
          email
        ),
        clubs (
          id,
          name,
          short_name,
          sport,
          location
        )
      `)
      .order('created_at', { ascending: false });

    if (error || !listings) {
      return [];
    }

    return listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      original_price: listing.original_price,
      condition: listing.condition,
      category: listing.category,
      seller_id: listing.seller_id,
      seller: listing.profiles,
      club_id: listing.club_id,
      club: listing.clubs,
      is_for_sale: listing.is_for_sale,
      images: listing.images,
      contact_info: listing.contact_info,
      created_at: listing.created_at,
      updated_at: listing.updated_at,
    }));
  } catch (error) {
    console.error('Get all equipment listings error:', error);
    return [];
  }
}

// Fund management functions
export async function getAllFunds(): Promise<Fund[]> {
  try {
    const { data: funds, error } = await supabase
      .from('funds')
      .select(`
        *,
        clubs (
          id,
          name,
          short_name,
          sport,
          location
        )
      `)
      .order('created_at', { ascending: false });

    if (error || !funds) {
      return [];
    }

    return funds.map(fund => ({
      id: fund.id,
      club_id: fund.club_id,
      club: fund.clubs,
      current_amount: fund.current_amount,
      monthly_goal: fund.monthly_goal,
      yearly_goal: fund.yearly_goal,
      last_updated: fund.last_updated,
    }));
  } catch (error) {
    console.error('Get all funds error:', error);
    return [];
  }
}

// Frikjøp transactions functions
export async function getFrikjopTransactions(userId?: string): Promise<FrikjopTransaction[]> {
  try {
    let query = supabase
      .from('frikjop_transactions')
      .select(`
        *,
        profiles!frikjop_transactions_user_id_fkey (
          id,
          name,
          email
        ),
        events (
          id,
          title,
          date,
          location
        )
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: transactions, error } = await query;

    if (error || !transactions) {
      return [];
    }

    return transactions.map(transaction => ({
      id: transaction.id,
      user_id: transaction.user_id,
      event_id: transaction.event_id,
      amount: transaction.amount,
      club_contribution: transaction.club_contribution,
      status: transaction.status,
      created_at: transaction.created_at,
      user: transaction.profiles,
      event: transaction.events,
    }));
  } catch (error) {
    console.error('Get frikjop transactions error:', error);
    return [];
  }
}
