import { NextRequest, NextResponse } from 'next/server';
import { AmadeusService } from '@/services/amadeus.service';

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
    const cityName = searchParams.get('city');
    const countryCode = searchParams.get('countryCode') || undefined;
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : 10;
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
    if (!cityName) {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400 }
      );
    }

    console.log('🏨 City-based hotel search request:', {
      cityName,
      countryCode,
      radius,
      amenities,
      ratings
    });

    // Search for hotels by city name
    const hotels = await AmadeusService.searchHotelsByCity(
      cityName,
      countryCode,
      {
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
      }
    );

    return NextResponse.json({
      success: true,
      data: hotels.data,
      meta: hotels.meta,
      message: `Found ${hotels.meta.count} hotels in ${cityName}`
    });

  } catch (error) {
    console.error('❌ City-based hotel search error:', error);

    if (error instanceof Error) {
      // Handle specific validation errors
      if (error.message.includes('must be between')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      // Handle city not found errors
      if (error.message.includes('City not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }

      // Handle Amadeus API errors
      if (error.message.includes('Amadeus Hotel API error') || error.message.includes('Location API error')) {
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
