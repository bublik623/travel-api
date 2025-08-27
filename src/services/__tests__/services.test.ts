// This file demonstrates how to use the services independently
// In a real project, you would use a testing framework like Jest

import { GeocodingService } from '../geocoding.service';
import { AmadeusService } from '../amadeus.service';
import { AirportSearchService } from '../airport-search.service';

// Example: Using GeocodingService independently
export async function testGeocodingService() {
  try {
    const result = await GeocodingService.geocode({
      city: 'New York',
      country: 'United States',
    });

    console.log('Geocoding result:', result);
    return result;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

// Example: Using AmadeusService independently (requires credentials)
export async function testAmadeusService() {
  try {
    const result = await AmadeusService.searchAirports({
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100,
    });

    console.log('Amadeus result:', result);
    return result;
  } catch (error) {
    console.error('Amadeus error:', error);
    throw error;
  }
}

// Example: Using AirportSearchService (combines both)
export async function testAirportSearchService() {
  try {
    const result = await AirportSearchService.searchAirports({
      city: 'New York',
      country: 'United States',
      radius: 100,
    });

    console.log('Airport search result:', result);
    return result;
  } catch (error) {
    console.error('Airport search error:', error);
    throw error;
  }
}

// Example: Check service availability
export function checkServiceStatus() {
  const status = AirportSearchService.getServiceStatus();
  console.log('Service status:', status);
  return status;
}
