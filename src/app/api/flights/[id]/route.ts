import { NextRequest, NextResponse } from 'next/server';
import { AmadeusService } from '@/services/amadeus.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if Amadeus service is available
    if (!AmadeusService.isAvailable()) {
      return NextResponse.json(
        { error: 'Amadeus service not configured' },
        { status: 503 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Flight offer ID is required' },
        { status: 400 }
      );
    }

    const flightOffer = await AmadeusService.getFlightOffer(id);

    return NextResponse.json({
      success: true,
      data: flightOffer,
      message: 'Flight offer retrieved successfully'
    });

  } catch (error) {
    console.error('Flight offer retrieval error:', error);
    
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
