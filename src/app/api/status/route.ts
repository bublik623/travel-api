import { NextResponse } from 'next/server';
import { AirportSearchService } from '@/services/airport-search.service';

export async function GET() {
  try {
    const serviceStatus = AirportSearchService.getServiceStatus();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      services: serviceStatus,
      version: '1.0.0',
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check service status' },
      { status: 500 }
    );
  }
}
