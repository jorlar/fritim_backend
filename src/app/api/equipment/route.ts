import { NextRequest, NextResponse } from 'next/server';
import { getAllEquipmentListings } from '@/lib/auth-supabase';

export async function GET() {
  try {
    const listings = await getAllEquipmentListings();
    return NextResponse.json({ listings });
  } catch (error) {
    console.error('Get equipment listings error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
