import { NextRequest, NextResponse } from 'next/server';
import { AmadeusService, FlightOffersSearchRequest, CityFlightSearchRequest } from '@/services/amadeus.service';
import { GeocodingService } from '@/services/geocoding.service';

export async function GET(request: NextRequest) {
  console.log('🚀 Flight search GET request started');
  
  try {
    // Check if Amadeus service is available
    if (!AmadeusService.isAvailable()) {
      console.log('❌ Amadeus service not configured');
      return NextResponse.json(
        { error: 'Amadeus service not configured' },
        { status: 503 }
      );
    }
    console.log('✅ Amadeus service is available');

    const { searchParams } = new URL(request.url);
    
    // Check if this is a city-based search or airport code search
    const originCity = searchParams.get('originCity');
    const destinationCity = searchParams.get('destinationCity');
    const originLocationCode = searchParams.get('originLocationCode');
    const destinationLocationCode = searchParams.get('destinationLocationCode');
    const departureDate = searchParams.get('departureDate');

    console.log('📋 Request parameters:');
    console.log('  - originCity:', originCity);
    console.log('  - destinationCity:', destinationCity);
    console.log('  - originLocationCode:', originLocationCode);
    console.log('  - destinationLocationCode:', destinationLocationCode);
    console.log('  - departureDate:', departureDate);

    // Validate required parameters
    if (!departureDate) {
      console.log('❌ Missing required parameter: departureDate');
      return NextResponse.json(
        { error: 'Missing required parameter: departureDate' },
        { status: 400 }
      );
    }
    console.log('✅ Required parameters validated');

    // City-based search
    if (originCity && destinationCity) {

      const citySearchRequest: CityFlightSearchRequest = {
        originCity,
        destinationCity,
        originCountry: searchParams.get('originCountry') || undefined,
        destinationCountry: searchParams.get('destinationCountry') || undefined,
        departureDate,
        returnDate: searchParams.get('returnDate') || undefined,
        adults: searchParams.get('adults') ? parseInt(searchParams.get('adults')!) : undefined,
        children: searchParams.get('children') ? parseInt(searchParams.get('children')!) : undefined,
        infants: searchParams.get('infants') ? parseInt(searchParams.get('infants')!) : undefined,
        travelClass: searchParams.get('travelClass') as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST' | undefined,
        includedAirlineCodes: searchParams.get('includedAirlineCodes')?.split(',') || undefined,
        excludedAirlineCodes: searchParams.get('excludedAirlineCodes')?.split(',') || undefined,
        nonStop: searchParams.get('nonStop') ? searchParams.get('nonStop') === 'true' : undefined,
        currencyCode: searchParams.get('currencyCode') || undefined,
        maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
        max: searchParams.get('max') ? parseInt(searchParams.get('max')!) : undefined,
        airportSearchRadius: searchParams.get('airportSearchRadius') ? parseInt(searchParams.get('airportSearchRadius')!) : undefined,
      };

      console.log('🔍 City search request:', JSON.stringify(citySearchRequest, null, 2));
      console.log('🛫 Searching flight offers by city...');
      
      const flightOffers = await AmadeusService.searchFlightOffersByCity(citySearchRequest);
      console.log('✅ Flight offers found:', flightOffers.data?.length || 0, 'offers');
      console.log('📊 Response summary:', {
        totalOffers: flightOffers.data?.length || 0,
        hasData: !!flightOffers.data,
        hasDictionaries: !!flightOffers.dictionaries
      });

      return NextResponse.json({
        success: true,
        data: flightOffers,
        message: 'Flight offers retrieved successfully by city search'
      });
    }

    // Airport code-based search
    if (originLocationCode && destinationLocationCode) {
      console.log('✈️ Starting airport code-based search for:', originLocationCode, '→', destinationLocationCode);
      
      const searchRequest: FlightOffersSearchRequest = {
        originLocationCode,
        destinationLocationCode,
        departureDate,
        returnDate: searchParams.get('returnDate') || undefined,
        adults: searchParams.get('adults') ? parseInt(searchParams.get('adults')!) : undefined,
        children: searchParams.get('children') ? parseInt(searchParams.get('children')!) : undefined,
        infants: searchParams.get('infants') ? parseInt(searchParams.get('infants')!) : undefined,
        travelClass: searchParams.get('travelClass') as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST' | undefined,
        includedAirlineCodes: searchParams.get('includedAirlineCodes')?.split(',') || undefined,
        excludedAirlineCodes: searchParams.get('excludedAirlineCodes')?.split(',') || undefined,
        nonStop: searchParams.get('nonStop') ? searchParams.get('nonStop') === 'true' : undefined,
        currencyCode: searchParams.get('currencyCode') || undefined,
        maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
        max: searchParams.get('max') ? parseInt(searchParams.get('max')!) : undefined,
      };

      console.log('🔍 Airport search request:', JSON.stringify(searchRequest, null, 2));

      // Check if price prediction is requested
      const includePrediction = searchParams.get('includePrediction') === 'true';
      console.log('🔮 Price prediction requested:', includePrediction);

      let flightOffers;
      if (includePrediction) {
        console.log('🛫 Searching flight offers with price prediction...');
        flightOffers = await AmadeusService.searchFlightOffersWithPrediction(searchRequest);
      } else {
        console.log('🛫 Searching flight offers...');
        flightOffers = await AmadeusService.searchFlightOffers(searchRequest);
      }
      
      console.log('✅ Flight offers found:', flightOffers.data?.length || 0, 'offers');
      console.log('📊 Response summary:', {
        totalOffers: flightOffers.data?.length || 0,
        hasData: !!flightOffers.data,
        hasDictionaries: !!flightOffers.dictionaries,
        hasPrediction: includePrediction
      });

      return NextResponse.json({
        success: true,
        data: flightOffers,
        message: 'Flight offers retrieved successfully by airport code search'
      });
    }

    // Neither city nor airport code search
    console.log('❌ Missing required parameters: neither city nor airport codes provided');
    return NextResponse.json(
      { error: 'Missing required parameters: either (originCity, destinationCity) or (originLocationCode, destinationLocationCode)' },
      { status: 400 }
    );

  } catch (error) {
    console.error('💥 Flight search error:', error);
    console.error('📋 Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 Flight search POST request started');
  
  try {
    // Check if Amadeus service is available
    if (!AmadeusService.isAvailable()) {
      console.log('❌ Amadeus service not configured');
      return NextResponse.json(
        { error: 'Amadeus service not configured' },
        { status: 503 }
      );
    }
    console.log('✅ Amadeus service is available');

    const body = await request.json();
    console.log('📋 Request body:', JSON.stringify(body, null, 2));
    
    // Validate required parameters
    const { departureDate } = body;

    if (!departureDate) {
      console.log('❌ Missing required parameter: departureDate');
      return NextResponse.json(
        { error: 'Missing required parameter: departureDate' },
        { status: 400 }
      );
    }
    console.log('✅ Required parameters validated');

    // City-based search
    if (body.originCity && body.destinationCity) {
      console.log('🏙️ Starting city-based search for:', body.originCity, '→', body.destinationCity);
      
      const citySearchRequest: CityFlightSearchRequest = body;
      console.log('🔍 City search request:', JSON.stringify(citySearchRequest, null, 2));
      console.log('🛫 Searching flight offers by city...');
      
      const flightOffers = await AmadeusService.searchFlightOffersByCity(citySearchRequest);
      console.log('✅ Flight offers found:', flightOffers.data?.length || 0, 'offers');
      console.log('📊 Response summary:', {
        totalOffers: flightOffers.data?.length || 0,
        hasData: !!flightOffers.data,
        hasDictionaries: !!flightOffers.dictionaries
      });

      return NextResponse.json({
        success: true,
        data: flightOffers,
        message: 'Flight offers retrieved successfully by city search'
      });
    }

    // Airport code-based search
    if (body.originLocationCode && body.destinationLocationCode) {
      console.log('✈️ Starting airport code-based search for:', body.originLocationCode, '→', body.destinationLocationCode);
      
      const searchRequest: FlightOffersSearchRequest = body;
      console.log('🔍 Airport search request:', JSON.stringify(searchRequest, null, 2));
      
      const includePrediction = body.includePrediction === true;
      console.log('🔮 Price prediction requested:', includePrediction);

      let flightOffers;
      if (includePrediction) {
        console.log('🛫 Searching flight offers with price prediction...');
        flightOffers = await AmadeusService.searchFlightOffersWithPrediction(searchRequest);
      } else {
        console.log('🛫 Searching flight offers...');
        flightOffers = await AmadeusService.searchFlightOffers(searchRequest);
      }
      
      console.log('✅ Flight offers found:', flightOffers.data?.length || 0, 'offers');
      console.log('📊 Response summary:', {
        totalOffers: flightOffers.data?.length || 0,
        hasData: !!flightOffers.data,
        hasDictionaries: !!flightOffers.dictionaries,
        hasPrediction: includePrediction
      });

      return NextResponse.json({
        success: true,
        data: flightOffers,
        message: 'Flight offers retrieved successfully by airport code search'
      });
    }

    // Neither city nor airport code search
    console.log('❌ Missing required parameters: neither city nor airport codes provided');
    return NextResponse.json(
      { error: 'Missing required parameters: either (originCity, destinationCity) or (originLocationCode, destinationLocationCode)' },
      { status: 400 }
    );

  } catch (error) {
    console.error('💥 Flight search error:', error);
    console.error('📋 Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
