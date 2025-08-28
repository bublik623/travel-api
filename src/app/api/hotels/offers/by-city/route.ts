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
    const cityName = searchParams.get('cityName');
    const countryCode = searchParams.get('countryCode') || undefined;
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const adults = searchParams.get('adults') ? parseInt(searchParams.get('adults')!) : 1;
    
    // Hotel search options
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : 5;
    const radiusUnit = (searchParams.get('radiusUnit') as 'KM' | 'MILE') || 'KM';
    const chainCodes = searchParams.get('chainCodes')?.split(',') || undefined;
    const amenities = searchParams.get('amenities')?.split(',') || undefined;
    const ratings = searchParams.get('ratings')?.split(',').map(r => parseInt(r)) || undefined;
    const hotelSource = (searchParams.get('hotelSource') as 'ALL' | 'BEST_UNRATED' | 'VIRTUOSO' | 'EXPEDIA' | 'AMADEUS') || 'ALL';
    const currency = searchParams.get('currency') || 'USD';
    const bestRateOnly = searchParams.get('bestRateOnly') === 'true';
    const view = (searchParams.get('view') as 'FULL' | 'LIGHT' | 'LONG') || 'FULL';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // Offer search options
    const priceRange = searchParams.get('priceRange') || undefined;
    const paymentPolicy = searchParams.get('paymentPolicy') || undefined;
    const boardType = searchParams.get('boardType') || undefined;
    const includedCheckedBagsOnly = searchParams.get('includedCheckedBagsOnly') === 'true';

    // Validate required parameters
    if (!cityName) {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400 }
      );
    }

    if (!checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: 'Check-in and check-out dates are required' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(checkInDate)) {
      return NextResponse.json(
        { error: 'Check-in date must be in YYYY-MM-DD format' },
        { status: 400 }
      );
    }

    if (!dateRegex.test(checkOutDate)) {
      return NextResponse.json(
        { error: 'Check-out date must be in YYYY-MM-DD format' },
        { status: 400 }
      );
    }

    // Validate adults parameter
    if (adults < 1 || adults > 9) {
      return NextResponse.json(
        { error: 'Adults must be between 1 and 9' },
        { status: 400 }
      );
    }

    console.log('🏨 Hotel offers search by city:', { 
      cityName, 
      countryCode, 
      checkInDate, 
      checkOutDate, 
      adults 
    });

    // Build hotel search options
    const hotelSearchOptions = {
      radius,
      radiusUnit,
      chainCodes,
      amenities,
      ratings,
      hotelSource,
      currency,
      bestRateOnly,
      view,
      page: {
        limit,
        offset
      }
    };

    // Build offer search options
    const offerSearchOptions = {
      priceRange,
      currency,
      paymentPolicy,
      boardType,
      includedCheckedBagsOnly,
      bestRateOnly,
      view,
      page: {
        limit,
        offset
      }
    };

    // Search for hotel offers by city
    const hotelOffers = await AmadeusService.searchHotelsOffersByCity(
      cityName,
      checkInDate,
      checkOutDate,
      adults,
      countryCode,
      hotelSearchOptions,
      offerSearchOptions
    );

    return NextResponse.json({
      success: true,
      data: hotelOffers.data,
      meta: hotelOffers.meta,
      message: `Found ${hotelOffers.meta.count} hotel offers in ${cityName}`
    });

  } catch (error) {
    console.error('❌ Hotel offers search by city error:', error);

    if (error instanceof Error) {
      // Handle specific validation errors
      if (error.message.includes('must be between')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      // Handle Amadeus API errors
      if (error.message.includes('Amadeus Hotel API error') || 
          error.message.includes('Amadeus Hotel Offers API error')) {
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
