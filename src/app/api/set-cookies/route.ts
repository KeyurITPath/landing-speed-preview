import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

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

export async function POST(request: NextRequest) {

  const cookieStore = await cookies();

  try {
    const body = await request.json();

    const {name, value} = body

    cookieStore.set({
      name,
      value,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    NextResponse.json({
      success: true,
      message: 'Cookie set successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error setting cookie'
    }, {
      status: 500
    });
  }
}
