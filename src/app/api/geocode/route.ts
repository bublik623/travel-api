import { NextRequest, NextResponse } from 'next/server';
import { GeocodeResponse } from '@/types';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const country = searchParams.get('country');

    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      );
    }

    // Формуємо запит до Nominatim API
    let query = city;
    if (country) {
      query += `, ${country}`;
    }

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=1`;

    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'TravelAPI/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data: NominatimResult[] = await response.json();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      );
    }

    const result = data[0];
    const geocodeResponse: GeocodeResponse = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      display_name: result.display_name,
    };

    return NextResponse.json(geocodeResponse);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
