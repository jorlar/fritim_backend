// Type definitions for the Fritim backend

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'club_admin' | 'user';
  club_id?: string;
  club?: Club;
  created_at: string;
  updated_at: string;
}

export interface Club {
  id: string;
  name: string;
  short_name: string;
  sport: string;
  location: string;
  member_count: number;
  established: number;
  description?: string;
  primary_color: string;
  secondary_color: string;
  logo?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  club_id: string;
  club?: Club;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  created_by: string;
  created_by_user?: User;
  created_at: string;
  updated_at: string;
}

export interface EventResponse {
  id: string;
  event_id: string;
  user_id: string;
  response: 'kommer' | 'kan_ikke' | 'frivillig_time' | 'frys_betaling';
  notes?: string;
  responded_at: string;
}

export interface EquipmentListing {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  condition: 'Ny' | 'Brukt - som ny' | 'Brukt - god stand' | 'Brukt - brukbar stand';
  category: string;
  seller_id: string;
  seller?: User;
  club_id?: string;
  club?: Club;
  is_for_sale: boolean;
  images?: string;
  contact_info?: string;
  created_at: string;
  updated_at: string;
}

export interface Fund {
  id: string;
  club_id: string;
  club?: Club;
  current_amount: number;
  monthly_goal: number;
  yearly_goal: number;
  last_updated: string;
}

export interface FundTransaction {
  id: string;
  fund_id: string;
  amount: number;
  transaction_type: 'donation' | 'expense' | 'dugnad_income';
  description: string;
  created_by?: string;
  created_at: string;
}

export interface FrikjopTransaction {
  id: string;
  user_id: string;
  user?: User;
  event_id: string;
  event?: Event;
  amount: number;
  club_contribution: number;
  status: 'completed' | 'pending' | 'cancelled';
  created_at: string;
}
