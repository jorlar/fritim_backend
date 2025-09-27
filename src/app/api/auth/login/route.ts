import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Simple demo authentication
    if (email === 'admin@fritim.no' && password === 'password123') {
      const user = {
        id: 1,
        email: 'admin@fritim.no',
        name: 'Admin User',
        role: 'admin',
        club_id: null
      };

      return NextResponse.json({
        message: 'Login successful',
        token: 'demo-token-123',
        user,
      });
    }

    if (email === 'club@fritim.no' && password === 'password123') {
      const user = {
        id: 2,
        email: 'club@fritim.no',
        name: 'Club Admin',
        role: 'club_admin',
        club_id: 1
      };

      return NextResponse.json({
        message: 'Login successful',
        token: 'demo-token-456',
        user,
      });
    }

    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
