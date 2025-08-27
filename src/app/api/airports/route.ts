import { NextRequest, NextResponse } from 'next/server';
import { AirportSearchResponse, AirportSearchError } from '@/types';
import { AirportSearchService } from '@/services/airport-search.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const zipcode = searchParams.get('zipcode');
    const radius = searchParams.get('radius') || '100';

    // Validate required parameters
    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' } as AirportSearchError,
        { status: 400 }
      );
    }

    // Validate radius parameter
    const radiusKm = parseFloat(radius);
    if (isNaN(radiusKm)) {
      return NextResponse.json(
        { error: 'Invalid radius parameter' } as AirportSearchError,
        { status: 400 }
      );
    }

    // Use the airport search service
    const searchRequest = {
      city,
      country: country || undefined,
      zipcode: zipcode || undefined,
      radius: radiusKm,
    };

    const result = await AirportSearchService.searchAirports(searchRequest);

    // Transform the response to match our interface
    const transformedResponse: AirportSearchResponse = {
      data: result.airports,
      meta: {
        count: result.totalCount,
        links: {
          self: request.url,
        },
      },
    };

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('Airport search error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not available')) {
        return NextResponse.json(
          { error: error.message } as AirportSearchError,
          { status: 503 }
        );
      }
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message } as AirportSearchError,
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' } as AirportSearchError,
      { status: 500 }
    );
  }
}
