import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents, createEvent } from '@/lib/auth-supabase';

export async function GET() {
  try {
    const events = await getAllEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    const event = await createEvent(eventData);
    
    if (!event) {
      return NextResponse.json(
        { message: 'Failed to create event' },
        { status: 400 }
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
