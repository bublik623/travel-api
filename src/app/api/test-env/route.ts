import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      AMADEUS_CLIENT_ID: process.env.AMADEUS_CLIENT_ID ? 'SET' : 'NOT SET',
      AMADEUS_CLIENT_SECRET: process.env.AMADEUS_CLIENT_SECRET ? 'SET' : 'NOT SET',
    },
    message: 'Environment variables check'
  });
}
