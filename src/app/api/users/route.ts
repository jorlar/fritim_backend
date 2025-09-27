import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, createUser } from '@/lib/auth-supabase';

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const user = await createUser(userData);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Failed to create user' },
        { status: 400 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
