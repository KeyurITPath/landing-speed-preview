import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { COUNTRY_COOKIE } from '@/utils/cookies';
import { fetchCountryCodeHandler } from '@/services/course-service';
import { fetchIP } from '@/utils/domain';

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

export async function GET() {
  try {
    const IP = await fetchIP()
    const country_code = await fetchCountryCodeHandler(IP);

    if (!country_code) {
      return NextResponse.json({
        success: false,
        message: 'Could not determine country code'
      });
    }

    // Set the cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: COUNTRY_COOKIE,
      value: country_code,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      country_code,
     headers: corsHeaders
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error setting country code'
    }, {
      status: 500
    });
  }
}
