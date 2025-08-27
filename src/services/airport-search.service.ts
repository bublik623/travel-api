import { GeocodingService, GeocodingRequest, GeocodingResult } from './geocoding.service';
import { AmadeusService, AmadeusAirportSearchRequest } from './amadeus.service';
import { Airport } from '@/types';

export interface AirportSearchRequest {
  city: string;
  country?: string;
  zipcode?: string;
  radius?: number;
}

export interface AirportSearchResult {
  airports: Airport[];
  geocodingInfo: GeocodingResult;
  totalCount: number;
}

export class AirportSearchService {
  /**
   * Search for airports by city name
   */
  static async searchAirports(request: AirportSearchRequest): Promise<AirportSearchResult> {
    const { city, country, zipcode, radius = 100 } = request;

    // Step 1: Geocode the city to get coordinates
    const geocodingRequest: GeocodingRequest = {
      city,
      country,
      zipcode,
    };

    const geocodingResult = await GeocodingService.geocode(geocodingRequest);

    // Step 2: Check if Amadeus service is available
    if (!AmadeusService.isAvailable()) {
      throw new Error('Airport search service not available');
    }

    // Step 3: Search for airports using coordinates
    const amadeusRequest: AmadeusAirportSearchRequest = {
      latitude: geocodingResult.latitude,
      longitude: geocodingResult.longitude,
      radius,
    };

    const amadeusResponse = await AmadeusService.searchAirports(amadeusRequest);

    // Step 4: Transform and return results
    const airports: Airport[] = amadeusResponse.data.map((amadeusAirport) => ({
      type: amadeusAirport.type,
      subType: amadeusAirport.subType,
      name: amadeusAirport.name,
      detailedName: amadeusAirport.detailedName,
      id: amadeusAirport.id,
      self: amadeusAirport.self,
      timeZoneOffset: amadeusAirport.timeZoneOffset,
      iataCode: amadeusAirport.iataCode,
      geoCode: amadeusAirport.geoCode,
      address: amadeusAirport.address,
      distance: amadeusAirport.distance,
      analytics: amadeusAirport.analytics,
    }));

    return {
      airports,
      geocodingInfo: geocodingResult,
      totalCount: amadeusResponse.meta.count,
    };
  }

  /**
   * Search for airports with only geocoding (when Amadeus is not available)
   */
  static async searchAirportsGeocodingOnly(request: AirportSearchRequest): Promise<GeocodingResult> {
    const { city, country, zipcode } = request;

    const geocodingRequest: GeocodingRequest = {
      city,
      country,
      zipcode,
    };

    return await GeocodingService.geocode(geocodingRequest);
  }

  /**
   * Check if full airport search is available
   */
  static isFullSearchAvailable(): boolean {
    return AmadeusService.isAvailable();
  }

  /**
   * Get service status information
   */
  static getServiceStatus() {
    return {
      geocoding: true, // Always available
      amadeus: AmadeusService.isAvailable(),
      fullSearch: this.isFullSearchAvailable(),
    };
  }
}
