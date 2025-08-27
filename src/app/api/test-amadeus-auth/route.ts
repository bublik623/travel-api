import { NextRequest, NextResponse } from 'next/server';
import { AmadeusService } from '@/services/amadeus.service';

export async function GET(request: NextRequest) {
  try {
    // Test if Amadeus service is available
    const isAvailable = AmadeusService.isAvailable();
    
    if (!isAvailable) {
      return NextResponse.json({
        success: false,
        error: 'Amadeus service not available - credentials not configured'
      }, { status: 500 });
    }

    // Test getting access token
    const accessToken = await AmadeusService['getAccessToken']();
    
    return NextResponse.json({
      success: true,
      tokenInfo: {
        length: accessToken.length,
        preview: accessToken.substring(0, 20) + '...',
        isValid: accessToken.length > 0
      },
      message: 'Amadeus authentication successful'
    });

  } catch (error) {
    console.error('Amadeus auth test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
