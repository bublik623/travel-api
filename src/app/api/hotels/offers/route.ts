import { NextRequest, NextResponse } from 'next/server';
import { AmadeusService, HotelOffersSearchRequest } from '@/services/amadeus.service';

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
    const hotelIds = searchParams.get('hotelIds')?.split(',') || undefined;
    const cityCode = searchParams.get('cityCode') || undefined;
    const latitude = searchParams.get('latitude') ? parseFloat(searchParams.get('latitude')!) : undefined;
    const longitude = searchParams.get('longitude') ? parseFloat(searchParams.get('longitude')!) : undefined;
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : 5;
    const radiusUnit = (searchParams.get('radiusUnit') as 'KM' | 'MILE') || 'KM';
    const chainCodes = searchParams.get('chainCodes')?.split(',') || undefined;
    const amenities = searchParams.get('amenities')?.split(',') || undefined;
    const ratings = searchParams.get('ratings')?.split(',').map(r => parseInt(r)) || undefined;
    const hotelSource = (searchParams.get('hotelSource') as 'ALL' | 'BEST_UNRATED' | 'VIRTUOSO' | 'EXPEDIA' | 'AMADEUS') || 'ALL';
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const roomQuantity = searchParams.get('roomQuantity') ? parseInt(searchParams.get('roomQuantity')!) : 1;
    const priceRange = searchParams.get('priceRange') || undefined;
    const currency = searchParams.get('currency') || 'USD';
    const paymentPolicy = searchParams.get('paymentPolicy') || undefined;
    const boardType = searchParams.get('boardType') || undefined;
    const includedCheckedBagsOnly = searchParams.get('includedCheckedBagsOnly') === 'true';
    const bestRateOnly = searchParams.get('bestRateOnly') === 'true';
    const view = (searchParams.get('view') as 'FULL' | 'LIGHT' | 'LONG') || 'FULL';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // Validate required parameters
    if (!checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: 'Check-in and check-out dates are required' },
        { status: 400 }
      );
    }

    if (!hotelIds && !cityCode && (!latitude || !longitude)) {
      return NextResponse.json(
        { error: 'Either hotelIds, cityCode, or both latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Build hotel offers search request
    const hotelOffersRequest: HotelOffersSearchRequest = {
      hotelIds,
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
      roomQuantity,
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

    console.log('🏨 Hotel offers search request:', hotelOffersRequest);

    // Search for hotel offers
    const hotelOffers = await AmadeusService.searchHotelOffers(hotelOffersRequest);

    return NextResponse.json({
      success: true,
      data: hotelOffers.data,
      meta: hotelOffers.meta,
      message: `Found ${hotelOffers.meta.count} hotel offers`
    });

  } catch (error) {
    console.error('❌ Hotel offers search error:', error);

    if (error instanceof Error) {
      // Handle specific validation errors
      if (error.message.includes('must be between')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      // Handle Amadeus API errors
      if (error.message.includes('Amadeus Hotel Offers API error')) {
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
