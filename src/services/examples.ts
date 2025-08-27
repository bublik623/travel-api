// Examples of how to use the services in different scenarios

import { GeocodingService } from './geocoding.service';
import { AmadeusService, FlightOffersSearchRequest, CityFlightSearchRequest } from './amadeus.service';
import { AirportSearchService } from './airport-search.service';

/**
 * Example 1: Using GeocodingService for a travel planning feature
 */
export async function getCityCoordinates(city: string, country?: string) {
  try {
    const result = await GeocodingService.geocode({ city, country });
    
    // Use coordinates for map display, distance calculations, etc.
    return {
      coordinates: { lat: result.latitude, lng: result.longitude },
      displayName: result.displayName,
      address: result.address,
    };
  } catch (error) {
    console.error('Failed to get city coordinates:', error);
    throw error;
  }
}

/**
 * Example 2: Using AmadeusService for flight search integration
 */
export async function findNearbyAirports(latitude: number, longitude: number, radius: number = 100) {
  try {
    const result = await AmadeusService.searchAirports({
      latitude,
      longitude,
      radius,
    });

    // Filter airports by type, sort by distance, etc.
    const majorAirports = result.data.filter(airport => 
      airport.type === 'location' && airport.subType === 'airport'
    );

    return majorAirports.map(airport => ({
      name: airport.name,
      code: airport.iataCode,
      distance: airport.distance,
      location: airport.geoCode,
    }));
  } catch (error) {
    console.error('Failed to find nearby airports:', error);
    throw error;
  }
}

/**
 * Example 3: Using AirportSearchService for a complete travel search
 */
export async function searchTravelDestinations(city: string, country?: string) {
  try {
    const result = await AirportSearchService.searchAirports({
      city,
      country,
      radius: 150, // Larger radius for more options
    });

    // Combine with other travel data
    return {
      destination: {
        city: result.geocodingInfo.address.city,
        country: result.geocodingInfo.address.country,
        coordinates: {
          lat: result.geocodingInfo.latitude,
          lng: result.geocodingInfo.longitude,
        },
      },
      airports: result.airports.map(airport => ({
        name: airport.name,
        code: airport.iataCode,
        distance: airport.distance,
        type: airport.type,
      })),
      totalAirports: result.totalCount,
    };
  } catch (error) {
    console.error('Failed to search travel destinations:', error);
    throw error;
  }
}

/**
 * Example 4: Service health check for monitoring
 */
export function checkServiceHealth() {
  const status = AirportSearchService.getServiceStatus();
  
  const healthReport = {
    timestamp: new Date().toISOString(),
    services: {
      geocoding: {
        available: status.geocoding,
        description: 'OpenStreetMap Nominatim API',
      },
      amadeus: {
        available: status.amadeus,
        description: 'Amadeus Flight Search API',
      },
      fullSearch: {
        available: status.fullSearch,
        description: 'Combined airport search',
      },
    },
    overall: status.geocoding && status.amadeus,
  };

  return healthReport;
}

/**
 * Example 5: Fallback strategy when services are unavailable
 */
export async function searchWithFallback(city: string, country?: string) {
  try {
    // Try full search first
    const result = await AirportSearchService.searchAirports({
      city,
      country,
      radius: 100,
    });
    
    return {
      type: 'full',
      data: result,
    };
  } catch (error) {
    // Fallback to geocoding only
    try {
      const geocodingResult = await GeocodingService.geocode({
        city,
        country,
      });
      
      return {
        type: 'geocoding_only',
        data: geocodingResult,
        message: 'Airport search unavailable, showing location only',
      };
    } catch (geocodingError) {
      throw new Error('Both services are unavailable');
    }
  }
}

// Flight Search Examples
export const flightSearchExamples = {
  // Basic one-way flight search
  basicOneWay: async () => {
    const searchRequest: FlightOffersSearchRequest = {
      originLocationCode: 'NYC',
      destinationLocationCode: 'LAX',
      departureDate: '2024-06-15',
      adults: 1,
      currencyCode: 'USD',
      max: 10
    };

    try {
      const result = await AmadeusService.searchFlightOffers(searchRequest);
      console.log('Basic one-way flight search result:', result);
      return result;
    } catch (error) {
      console.error('Flight search error:', error);
      throw error;
    }
  },

  // Round-trip flight search
  roundTrip: async () => {
    const searchRequest: FlightOffersSearchRequest = {
      originLocationCode: 'JFK',
      destinationLocationCode: 'SFO',
      departureDate: '2024-07-01',
      returnDate: '2024-07-15',
      adults: 2,
      children: 1,
      travelClass: 'ECONOMY',
      currencyCode: 'USD',
      max: 20
    };

    try {
      const result = await AmadeusService.searchFlightOffers(searchRequest);
      console.log('Round-trip flight search result:', result);
      return result;
    } catch (error) {
      console.error('Flight search error:', error);
      throw error;
    }
  },

  // Business class flight search
  businessClass: async () => {
    const searchRequest: FlightOffersSearchRequest = {
      originLocationCode: 'LHR',
      destinationLocationCode: 'CDG',
      departureDate: '2024-08-10',
      adults: 1,
      travelClass: 'BUSINESS',
      currencyCode: 'EUR',
      max: 15
    };

    try {
      const result = await AmadeusService.searchFlightOffers(searchRequest);
      console.log('Business class flight search result:', result);
      return result;
    } catch (error) {
      console.error('Flight search error:', error);
      throw error;
    }
  },

  // Flight search with specific airlines
  specificAirlines: async () => {
    const searchRequest: FlightOffersSearchRequest = {
      originLocationCode: 'ORD',
      destinationLocationCode: 'MIA',
      departureDate: '2024-09-05',
      adults: 1,
      includedAirlineCodes: ['AA', 'UA'],
      excludedAirlineCodes: ['DL'],
      nonStop: true,
      currencyCode: 'USD',
      max: 10
    };

    try {
      const result = await AmadeusService.searchFlightOffers(searchRequest);
      console.log('Specific airlines flight search result:', result);
      return result;
    } catch (error) {
      console.error('Flight search error:', error);
      throw error;
    }
  },

  // Flight search with price limit
  priceLimited: async () => {
    const searchRequest: FlightOffersSearchRequest = {
      originLocationCode: 'BOS',
      destinationLocationCode: 'SEA',
      departureDate: '2024-10-20',
      adults: 1,
      maxPrice: 500,
      currencyCode: 'USD',
      max: 25
    };

    try {
      const result = await AmadeusService.searchFlightOffers(searchRequest);
      console.log('Price-limited flight search result:', result);
      return result;
    } catch (error) {
      console.error('Flight search error:', error);
      throw error;
    }
  },

  // Flight search with price prediction
  withPrediction: async () => {
    const searchRequest: FlightOffersSearchRequest = {
      originLocationCode: 'ATL',
      destinationLocationCode: 'DEN',
      departureDate: '2024-11-15',
      adults: 1,
      currencyCode: 'USD',
      max: 10
    };

    try {
      const result = await AmadeusService.searchFlightOffersWithPrediction(searchRequest);
      console.log('Flight search with prediction result:', result);
      return result;
    } catch (error) {
      console.error('Flight search error:', error);
      throw error;
    }
  },

  // Get specific flight offer by ID
  getFlightOffer: async (offerId: string) => {
    try {
      const result = await AmadeusService.getFlightOffer(offerId);
      console.log('Flight offer details:', result);
      return result;
    } catch (error) {
      console.error('Get flight offer error:', error);
      throw error;
    }
  }
};

// City-based Flight Search Examples
export const cityFlightSearchExamples = {
  // Basic city search
  basicCitySearch: async () => {
    const searchRequest: CityFlightSearchRequest = {
      originCity: 'Київ',
      destinationCity: 'Лондон',
      departureDate: '2024-06-15',
      adults: 1,
      currencyCode: 'USD',
      max: 10
    };

    try {
      const result = await AmadeusService.searchFlightOffersByCity(searchRequest);
      console.log('Basic city flight search result:', result);
      return result;
    } catch (error) {
      console.error('City flight search error:', error);
      throw error;
    }
  },

  // City search with countries
  citySearchWithCountries: async () => {
    const searchRequest: CityFlightSearchRequest = {
      originCity: 'Київ',
      destinationCity: 'Лондон',
      originCountry: 'Україна',
      destinationCountry: 'Великобританія',
      departureDate: '2024-07-01',
      returnDate: '2024-07-15',
      adults: 2,
      children: 1,
      travelClass: 'ECONOMY',
      currencyCode: 'USD',
      max: 20,
      airportSearchRadius: 150
    };

    try {
      const result = await AmadeusService.searchFlightOffersByCity(searchRequest);
      console.log('City search with countries result:', result);
      return result;
    } catch (error) {
      console.error('City flight search error:', error);
      throw error;
    }
  },

  // International city search
  internationalCitySearch: async () => {
    const searchRequest: CityFlightSearchRequest = {
      originCity: 'New York',
      destinationCity: 'Paris',
      originCountry: 'United States',
      destinationCountry: 'France',
      departureDate: '2024-08-10',
      adults: 1,
      travelClass: 'BUSINESS',
      currencyCode: 'EUR',
      max: 15,
      airportSearchRadius: 200
    };

    try {
      const result = await AmadeusService.searchFlightOffersByCity(searchRequest);
      console.log('International city search result:', result);
      return result;
    } catch (error) {
      console.error('City flight search error:', error);
      throw error;
    }
  }
};

// Example usage functions
export const runFlightSearchExamples = async () => {
  console.log('=== Flight Search Examples ===\n');

  try {
    // Check if Amadeus service is available
    if (!AmadeusService.isAvailable()) {
      console.log('Amadeus service is not configured. Please set AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET environment variables.');
      return;
    }

    // Run basic one-way search
    console.log('1. Basic one-way flight search:');
    await flightSearchExamples.basicOneWay();
    console.log('\n');

    // Run round-trip search
    console.log('2. Round-trip flight search:');
    await flightSearchExamples.roundTrip();
    console.log('\n');

    // Run business class search
    console.log('3. Business class flight search:');
    await flightSearchExamples.businessClass();
    console.log('\n');

    // Run specific airlines search
    console.log('4. Specific airlines flight search:');
    await flightSearchExamples.specificAirlines();
    console.log('\n');

    // Run price-limited search
    console.log('5. Price-limited flight search:');
    await flightSearchExamples.priceLimited();
    console.log('\n');

    // Run search with prediction
    console.log('6. Flight search with price prediction:');
    await flightSearchExamples.withPrediction();
    console.log('\n');

  } catch (error) {
    console.error('Error running flight search examples:', error);
  }
};

export const runCityFlightSearchExamples = async () => {
  console.log('=== City-based Flight Search Examples ===\n');

  try {
    // Check if Amadeus service is available
    if (!AmadeusService.isAvailable()) {
      console.log('Amadeus service is not configured. Please set AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET environment variables.');
      return;
    }

    // Run basic city search
    console.log('1. Basic city flight search:');
    await cityFlightSearchExamples.basicCitySearch();
    console.log('\n');

    // Run city search with countries
    console.log('2. City search with countries:');
    await cityFlightSearchExamples.citySearchWithCountries();
    console.log('\n');

    // Run international city search
    console.log('3. International city search:');
    await cityFlightSearchExamples.internationalCitySearch();
    console.log('\n');

  } catch (error) {
    console.error('Error running city flight search examples:', error);
  }
};
