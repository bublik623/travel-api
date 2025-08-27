import axios from 'axios';

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  address: {
    city?: string;
    country?: string;
    state?: string;
    postcode?: string;
  };
}

export interface GeocodingRequest {
  city: string;
  country?: string;
  zipcode?: string;
}

export class GeocodingService {
  private static readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
  private static readonly USER_AGENT = 'TravelAPI/1.0';

  /**
   * Convert city name to coordinates using OpenStreetMap Nominatim API
   */
  static async geocode(request: GeocodingRequest): Promise<GeocodingResult> {
    const { city, country, zipcode } = request;

    if (!city) {
      throw new Error('City parameter is required');
    }

    // Build geocoding query
    let query = city;
    if (country) {
      query += `, ${country}`;
    }
    if (zipcode) {
      query += `, ${zipcode}`;
    }

    try {
      const response = await axios.get(this.NOMINATIM_BASE_URL, {
        params: {
          q: query,
          format: 'json',
          limit: '1',
          addressdetails: '1'
        },
        headers: {
          'User-Agent': this.USER_AGENT,
        },
      });

        const results = response.data;

        if (!results || results.length === 0) {
          throw new Error('Location not found. Please check the city name and try again.');
        }

        const location = results[0];
        
        return {
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          displayName: location.display_name,
          address: {
            city: location.address?.city || location.address?.town || location.address?.village,
            country: location.address?.country,
            state: location.address?.state,
            postcode: location.address?.postcode,
          },
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorText = error.response?.data || error.message;
          throw new Error(`Nominatim API error: ${error.response?.status} ${error.response?.statusText} - ${errorText}`);
        }
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to geocode location');
      }
  }

  /**
   * Validate coordinates are within valid ranges
   */
  static validateCoordinates(latitude: number, longitude: number): boolean {
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  }
}
