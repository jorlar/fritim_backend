import { NextRequest, NextResponse } from 'next/server';
import { getAllFunds } from '@/lib/auth-supabase';

export async function GET() {
  try {
    const funds = await getAllFunds();
    return NextResponse.json({ funds });
  } catch (error) {
    console.error('Get funds error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
