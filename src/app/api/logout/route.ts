import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Replace with your specific origin in production
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST() {
  try {
    // Get cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (token) {
      console.log('Token being logged out:', token);
    }

    // Clear server-side cookies
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      {
        status: 200,
        headers: corsHeaders
      }
    );

    // Set cookies to expire (delete them)
    response.cookies.set('token', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    response.cookies.set('refreshToken', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    response.cookies.set('user', '', {
      expires: new Date(0),
    });

    response.cookies.set('session', '', {
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
