import { NextResponse } from 'next/server';
import { AmadeusService, AmadeusAirportSearchResponse, FlightOffersSearchResponse } from '@/services/amadeus.service';

export async function GET() {
  try {
    const results = {
      airports: null as AmadeusAirportSearchResponse | null,
      flights: null as FlightOffersSearchResponse | null,
      errors: [] as string[]
    };

    // Test airports search (should work)
    try {
      console.log('🧪 Testing airports search...');
      results.airports = await AmadeusService.searchAirports({
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 100
      });
      console.log('✅ Airports search successful');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Airports search failed: ${errorMsg}`);
      console.error('❌ Airports search failed:', error);
    }

    // Test flights search (might fail with 401)
    try {
      console.log('🧪 Testing flights search...');
      results.flights = await AmadeusService.searchFlightOffers({
        originLocationCode: 'DUS',
        destinationLocationCode: 'CDG',
        departureDate: '2025-09-15',
        adults: 1
      });
      console.log('✅ Flights search successful');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Flights search failed: ${errorMsg}`);
      console.error('❌ Flights search failed:', error);
    }

    return NextResponse.json({
      success: results.errors.length === 0,
      results: {
        airports: results.airports ? {
          count: results.airports.data?.length || 0,
          hasData: !!results.airports.data
        } : null,
        flights: results.flights ? {
          count: results.flights.data?.length || 0,
          hasData: !!results.flights.data
        } : null
      },
      errors: results.errors,
      message: results.errors.length === 0 
        ? 'Both APIs working correctly' 
        : 'Some APIs failed - check errors array'
    });

  } catch (error) {
    console.error('Comparison test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
