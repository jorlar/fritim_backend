import { NextRequest, NextResponse } from 'next/server';
import { getAllClubs, createClub } from '@/lib/auth-supabase';

export async function GET() {
  try {
    const clubs = await getAllClubs();
    return NextResponse.json({ clubs });
  } catch (error) {
    console.error('Get clubs error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clubData = await request.json();
    const club = await createClub(clubData);
    
    if (!club) {
      return NextResponse.json(
        { message: 'Failed to create club' },
        { status: 400 }
      );
    }

    return NextResponse.json({ club });
  } catch (error) {
    console.error('Create club error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
