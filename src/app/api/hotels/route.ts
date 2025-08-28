import { NextRequest, NextResponse } from 'next/server';
import { AmadeusService, HotelSearchRequest } from '@/services/amadeus.service';

export async function GET(request: NextRequest) {
  try {
    // Check if Amadeus service is available
    if (!AmadeusService.isAvailable()) {
      return NextResponse.json(
        { error: 'Amadeus API credentials not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const cityCode = searchParams.get('cityCode') || undefined;
    const latitude = searchParams.get('latitude') ? parseFloat(searchParams.get('latitude')!) : undefined;
    const longitude = searchParams.get('longitude') ? parseFloat(searchParams.get('longitude')!) : undefined;
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : 5;
    const radiusUnit = (searchParams.get('radiusUnit') as 'KM' | 'MILE') || 'KM';
    const chainCodes = searchParams.get('chainCodes')?.split(',') || undefined;
    const amenities = searchParams.get('amenities')?.split(',') || undefined;
    const ratings = searchParams.get('ratings')?.split(',').map(r => parseInt(r)) || undefined;
    const hotelSource = (searchParams.get('hotelSource') as 'ALL' | 'BEST_UNRATED' | 'VIRTUOSO' | 'EXPEDIA' | 'AMADEUS') || 'ALL';
    const checkInDate = searchParams.get('checkInDate') || undefined;
    const checkOutDate = searchParams.get('checkOutDate') || undefined;
    const currency = searchParams.get('currency') || 'USD';
    const bestRateOnly = searchParams.get('bestRateOnly') === 'true';
    const view = (searchParams.get('view') as 'FULL' | 'LIGHT' | 'LONG') || 'FULL';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // Validate required parameters
    if (!cityCode && (!latitude || !longitude)) {
      return NextResponse.json(
        { error: 'Either cityCode or both latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Build hotel search request
    const hotelRequest: HotelSearchRequest = {
      cityCode,
      latitude,
      longitude,
      radius,
      radiusUnit,
      chainCodes,
      amenities,
      ratings,
      hotelSource,
      checkInDate,
      checkOutDate,
      currency,
      bestRateOnly,
      view,
      page: {
        limit,
        offset
      }
    };

    console.log('🏨 Hotel search request:', hotelRequest);

    // Search for hotels
    const hotels = await AmadeusService.searchHotels(hotelRequest);

    return NextResponse.json({
      success: true,
      data: hotels.data,
      meta: hotels.meta,
      message: `Found ${hotels.meta.count} hotels`
    });

  } catch (error) {
    console.error('❌ Hotel search error:', error);

    if (error instanceof Error) {
      // Handle specific validation errors
      if (error.message.includes('must be between')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      // Handle Amadeus API errors
      if (error.message.includes('Amadeus Hotel API error')) {
        return NextResponse.json(
          { error: error.message },
          { status: 502 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
