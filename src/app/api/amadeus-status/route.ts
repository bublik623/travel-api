import { NextResponse } from 'next/server';
import { AmadeusService } from '@/services/amadeus.service';

export async function GET() {
  try {
    // Check if service is available
    const isAvailable = AmadeusService.isAvailable();
    
    if (!isAvailable) {
      return NextResponse.json({
        success: false,
        error: 'Amadeus service not available - credentials not configured',
        recommendations: [
          'Check AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET environment variables',
          'Make sure you have a valid Amadeus for Developers account'
        ]
      }, { status: 500 });
    }

    // Check API availability
    const apiStatus = await AmadeusService.checkApiAvailability();
    
    return NextResponse.json({
      success: true,
      serviceAvailable: isAvailable,
      apis: {
        airports: {
          available: apiStatus.airports,
          description: 'Reference Data API - Airport Search'
        },
        flights: {
          available: apiStatus.flights,
          description: 'Flight Offers Search API'
        }
      },
      errors: apiStatus.errors,
      recommendations: apiStatus.errors.length > 0 ? [
        'Check your Amadeus for Developers account',
        'Verify that Flight Offers Search API is activated',
        'Check API usage limits and quotas',
        'Ensure your account is approved for the required APIs'
      ] : [],
      message: apiStatus.errors.length === 0 
        ? 'All APIs are working correctly' 
        : 'Some APIs are not available - check errors and recommendations'
    });

  } catch (error) {
    console.error('API status check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      recommendations: [
        'Check your Amadeus credentials',
        'Verify your account status on Amadeus for Developers',
        'Contact Amadeus support if the issue persists'
      ]
    }, { status: 500 });
  }
}
