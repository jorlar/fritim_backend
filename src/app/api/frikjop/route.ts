import { NextRequest, NextResponse } from 'next/server';
import { getFrikjopTransactions } from '@/lib/auth-supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const transactions = await getFrikjopTransactions(userId || undefined);
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Get frikjop transactions error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
