import axios from 'axios';

export interface AmadeusAirport {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  id: string;
  self: {
    href: string;
    methods: string[];
  };
  timeZoneOffset: string;
  iataCode: string;
  geoCode: {
    latitude: number;
    longitude: number;
  };
  address: {
    cityCode: string;
    cityName: string;
    countryName: string;
    countryCode: string;
    regionCode: string;
  };
  distance: {
    value: number;
    unit: string;
  };
  analytics: {
    travelers: {
      score: number;
    };
  };
}

export interface AmadeusAirportSearchResponse {
  data: AmadeusAirport[];
  meta: {
    count: number;
    links: {
      self: string;
    };
  };
}

export interface AmadeusAirportSearchRequest {
  latitude: number;
  longitude: number;
  radius: number;
}

// Flight Offers Search API Types
export interface FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  lastTicketingDateTime: string;
  numberOfBookableSeats: number;
  itineraries: FlightItinerary[];
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightSegment {
  departure: FlightEndpoint;
  arrival: FlightEndpoint;
  carrierCode: string;
  number: string;
  aircraft: Aircraft;
  operating?: OperatingFlight;
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface FlightEndpoint {
  iataCode: string;
  terminal?: string;
  at: string;
}

export interface Aircraft {
  code: string;
}

export interface OperatingFlight {
  carrierCode: string;
  number: string;
}

export interface PricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: Price;
  fareDetailsBySegment: FareDetailsBySegment[];
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  fees: Fee[];
  grandTotal: string;
}

export interface Fee {
  amount: string;
  type: string;
}

export interface FareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  brandedFare?: string;
  classOfService: string;
  includedCheckedBags: BaggageAllowance;
}

export interface BaggageAllowance {
  weight: number;
  weightUnit: string;
}

export interface FlightOffersSearchResponse {
  data: FlightOffer[];
  dictionaries: FlightDictionaries;
  meta: FlightSearchMeta;
}

export interface FlightDictionaries {
  locations: Record<string, LocationInfo>;
  aircraft: Record<string, string>;
  currencies: Record<string, string>;
  carriers: Record<string, string>;
}

export interface LocationInfo {
  cityCode: string;
  countryCode: string;
}

export interface FlightSearchMeta {
  count: number;
  links: {
    self: string;
  };
}

export interface FlightOffersSearchRequest {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  includedAirlineCodes?: string[];
  excludedAirlineCodes?: string[];
  nonStop?: boolean;
  currencyCode?: string;
  maxPrice?: number;
  max?: number;
}

export interface CityFlightSearchRequest {
  originCity: string;
  destinationCity: string;
  originCountry?: string;
  destinationCountry?: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  includedAirlineCodes?: string[];
  excludedAirlineCodes?: string[];
  nonStop?: boolean;
  currencyCode?: string;
  maxPrice?: number;
  max?: number;
  airportSearchRadius?: number; // Радіус пошуку аеропортів в км
}

export class AmadeusService {
  private static readonly BASE_URL = 'https://test.api.amadeus.com/v1';
  private static readonly BASE_URL_V2 = 'https://test.api.amadeus.com/v2';
  private static readonly TOKEN_URL = `${this.BASE_URL}/security/oauth2/token`;
  private static readonly AIRPORTS_URL = `${this.BASE_URL}/reference-data/locations/airports`;
  private static readonly FLIGHT_OFFERS_URL = `${this.BASE_URL_V2}/shopping/flight-offers`;

  private static accessToken: string | null = null;
  private static tokenExpiry: number | null = null;

  /**
   * Get Amadeus API credentials from environment variables
   */
  private static getCredentials(): { clientId: string; clientSecret: string } {
    const clientId = process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

    console.log('Environment check:', {
      AMADEUS_CLIENT_ID: clientId ? 'SET' : 'NOT SET',
      AMADEUS_CLIENT_SECRET: clientSecret ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV
    });

    if (!clientId || !clientSecret) {
      throw new Error('Amadeus API credentials not configured. Please check AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET environment variables.');
    }

    return { clientId, clientSecret };
  }

  /**
   * Get or refresh access token
   */
  private static async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      console.log('🔑 Using cached token (expires in', Math.round((this.tokenExpiry - Date.now()) / 1000), 'seconds)');
      return this.accessToken;
    }

    console.log('🔑 Getting new access token...');
    const { clientId, clientSecret } = this.getCredentials();

                try {
        const response = await axios.post(this.TOKEN_URL, new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        this.accessToken = response.data.access_token;
        // Set token expiry to 1 hour from now (with 5 minute buffer)
        this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

        return this.accessToken!;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorText = error.response?.data || error.message;
          console.error('Token request failed:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            errorText
          });
          throw new Error(`Failed to get access token: ${error.response?.status} ${error.response?.statusText} - ${errorText}`);
        }
        if (error instanceof Error) {
          throw new Error(`Authentication failed: ${error.message}`);
        }
        throw new Error('Authentication failed');
      }
  }

  /**
   * Search for airports within a specified radius
   */
  static async searchAirports(request: AmadeusAirportSearchRequest): Promise<AmadeusAirportSearchResponse> {
    const { latitude, longitude, radius } = request;

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new Error('Invalid coordinate values');
    }

    // Validate radius
    if (radius <= 0 || radius > 500) {
      throw new Error('Radius must be between 1 and 500 kilometers');
    }

    const accessToken = await this.getAccessToken();

    console.log('🔑 Airport search - Access token length:', accessToken.length);
    console.log('🔑 Airport search - Access token preview:', accessToken.substring(0, 20) + '...');

    try {
      const response = await axios.get(this.AIRPORTS_URL, {
        params: {
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          radius: radius.toString(),
          'page[limit]': '50',
          sort: 'relevance'
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Airport search request successful');
      return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorText = error.response?.data || error.message;
          console.error('❌ Airport search request failed:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            headers: error.response?.headers,
            data: error.response?.data,
            url: error.config?.url,
            params: error.config?.params
          });
          throw new Error(`Amadeus API error: ${error.response?.status} ${error.response?.statusText} - ${errorText}`);
        }
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to fetch airport data');
      }
  }

  /**
   * Search for flight offers
   */
  static async searchFlightOffers(request: FlightOffersSearchRequest): Promise<FlightOffersSearchResponse> {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults = 1,
      children = 0,
      infants = 0,
      travelClass,
      includedAirlineCodes,
      excludedAirlineCodes,
      nonStop,
      currencyCode = 'USD',
      maxPrice,
      max = 50
    } = request;

    // Validate required parameters
    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      throw new Error('Origin, destination, and departure date are required');
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(departureDate)) {
      throw new Error('Departure date must be in YYYY-MM-DD format');
    }

    if (returnDate && !dateRegex.test(returnDate)) {
      throw new Error('Return date must be in YYYY-MM-DD format');
    }

    // Validate passenger counts
    if (adults < 1 || adults > 9) {
      throw new Error('Adults must be between 1 and 9');
    }

    if (children < 0 || children > 9) {
      throw new Error('Children must be between 0 and 9');
    }

    if (infants < 0 || infants > 9) {
      throw new Error('Infants must be between 0 and 9');
    }

    if (infants > adults) {
      throw new Error('Number of infants cannot exceed number of adults');
    }

    

    // Build params object
    const params: Record<string, string> = {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
      currencyCode,
      max: max.toString()
    };

    if (returnDate) {
      params.returnDate = returnDate;
    }

    if (travelClass) {
      params.travelClass = travelClass;
    }

    if (includedAirlineCodes && includedAirlineCodes.length > 0) {
      params.includedAirlineCodes = includedAirlineCodes.join(',');
    }

    if (excludedAirlineCodes && excludedAirlineCodes.length > 0) {
      params.excludedAirlineCodes = excludedAirlineCodes.join(',');
    }

    if (nonStop !== undefined) {
      params.nonStop = nonStop.toString();
    }

    if (maxPrice) {
      params.maxPrice = maxPrice.toString();
    }

    try {
      const accessToken = await this.getAccessToken();
      console.log('🔑 Access token length:', accessToken.length);
      console.log('🔑 Access token preview:', accessToken.substring(0, 20) + '...');
      console.log('🔑 Params:', params);
      console.log('🔑 Request URL:', this.FLIGHT_OFFERS_URL);
      
      const response = await axios.get(this.FLIGHT_OFFERS_URL, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Flight offers request successful');
      return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorText = error.response?.data || error.message;
          console.error('❌ Flight offers request failed:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            headers: error.response?.headers,
            data: error.response?.data,
            url: error.config?.url,
            params: error.config?.params
          });
          throw new Error(`Amadeus Flight API error: ${error.response?.status} ${JSON.stringify(error.response?.statusText)} - ${JSON.stringify(errorText)}`);
        }
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to fetch flight offers');
      }
  }

  /**
   * Get flight offer by ID
   */
  static async getFlightOffer(offerId: string): Promise<FlightOffer> {
    if (!offerId) {
      throw new Error('Flight offer ID is required');
    }

    const accessToken = await this.getAccessToken();
    const url = `${this.FLIGHT_OFFERS_URL}/${offerId}`;

          try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorText = error.response?.data || error.message;
          throw new Error(`Amadeus Flight API error: ${error.response?.status} ${error.response?.statusText} - ${errorText}`);
        }
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to fetch flight offer');
      }
  }

  /**
   * Search for flight offers with price prediction
   */
  static async searchFlightOffersWithPrediction(request: FlightOffersSearchRequest): Promise<FlightOffersSearchResponse> {
    const searchRequest = { ...request };
    
    // Build params object with prediction
    const params: Record<string, string> = {
      originLocationCode: searchRequest.originLocationCode,
      destinationLocationCode: searchRequest.destinationLocationCode,
      departureDate: searchRequest.departureDate,
      adults: (searchRequest.adults || 1).toString(),
      children: (searchRequest.children || 0).toString(),
      infants: (searchRequest.infants || 0).toString(),
      currencyCode: searchRequest.currencyCode || 'USD',
      max: (searchRequest.max || 50).toString(),
      pricePrediction: 'true'
    };

    if (searchRequest.returnDate) {
      params.returnDate = searchRequest.returnDate;
    }

    if (searchRequest.travelClass) {
      params.travelClass = searchRequest.travelClass;
    }

    const accessToken = await this.getAccessToken();

    try {
      const response = await axios.get(this.FLIGHT_OFFERS_URL, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorText = error.response?.data || error.message;
          throw new Error(`Amadeus Flight API error: ${error.response?.status} ${error.response?.statusText} - ${errorText}`);
        }
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to fetch flight offers with prediction');
      }
  }

  /**
   * Search for flight offers by city names (automatically finds nearest airports)
   */
  static async searchFlightOffersByCity(request: CityFlightSearchRequest): Promise<FlightOffersSearchResponse> {
    const {
      originCity,
      destinationCity,
      originCountry,
      destinationCountry,
      airportSearchRadius = 100,
      ...flightSearchParams
    } = request;

    try {
      console.log('Starting city-based flight search:', { originCity, destinationCity, airportSearchRadius });
      
      // Step 1: Get coordinates for origin city
      const originCoords = await this.getCityCoordinates(originCity, originCountry);
      console.log('Origin coordinates:', originCoords);
      
      // Step 2: Get coordinates for destination city
      const destinationCoords = await this.getCityCoordinates(destinationCity, destinationCountry);
      console.log('Destination coordinates:', destinationCoords);
      
      // Step 3: Find nearest airports for origin
      const originAirports = await this.searchAirports({
        latitude: originCoords.latitude,
        longitude: originCoords.longitude,
        radius: airportSearchRadius
      });
      console.log('Origin airports found:', originAirports.data.length);
      
      // Step 4: Find nearest airports for destination
      const destinationAirports = await this.searchAirports({
        latitude: destinationCoords.latitude,
        longitude: destinationCoords.longitude,
        radius: airportSearchRadius
      });
      console.log('Destination airports found:', destinationAirports.data.length);
      
      // Step 5: Filter airports to get the best ones (major airports first)
      const bestOriginAirports = this.getBestAirports(originAirports.data);
      const bestDestinationAirports = this.getBestAirports(destinationAirports.data);
      
      console.log('Best origin airports:', bestOriginAirports.map(a => ({ iata: a.iataCode, name: a.name, score: a.analytics?.travelers?.score })));
      console.log('Best destination airports:', bestDestinationAirports.map(a => ({ iata: a.iataCode, name: a.name, score: a.analytics?.travelers?.score })));
      
      if (bestOriginAirports.length === 0) {
        throw new Error(`No airports found near ${originCity} (searched ${originAirports.data.length} airports in ${airportSearchRadius}km radius)`);
      }
      
      if (bestDestinationAirports.length === 0) {
        throw new Error(`No airports found near ${destinationCity} (searched ${destinationAirports.data.length} airports in ${airportSearchRadius}km radius)`);
      }
      
      // Step 6: Search for flights using the best airports
      const allFlightOffers: FlightOffer[] = [];
      
      for (const originAirport of bestOriginAirports.slice(0, 2)) { // Limit to top 3 origin airports
        for (const destAirport of bestDestinationAirports.slice(0, 2)) { // Limit to top 3 destination airports
          try {
            const flightSearchRequest: FlightOffersSearchRequest = {
              ...flightSearchParams,
              originLocationCode: originAirport.iataCode,
              destinationLocationCode: destAirport.iataCode,
              max: 5
            };
            
            const flightOffers = await this.searchFlightOffers(flightSearchRequest);
            
            // Add airport information to each flight offer
            const enhancedOffers = flightOffers.data.map(offer => ({
              ...offer,
              originAirport: {
                iataCode: originAirport.iataCode,
                name: originAirport.name,
                city: originAirport.address.cityName,
                country: originAirport.address.countryName
              },
              destinationAirport: {
                iataCode: destAirport.iataCode,
                name: destAirport.name,
                city: destAirport.address.cityName,
                country: destAirport.address.countryName
              }
            }));
            
            allFlightOffers.push(...enhancedOffers);
          } catch (error) {
            // Continue with other airport combinations if one fails
            console.warn(`Failed to search flights from ${originAirport.iataCode} to ${destAirport.iataCode}:`, error);
          }
        }
      }
      
      // Step 7: Sort and limit results
      const sortedOffers = allFlightOffers
        .sort((a, b) => {
          // Parse duration strings (ISO 8601 format like 'PT5H30M') to minutes
          const parseDuration = (duration: string): number => {
            const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
            if (!match) return 0;
            const hours = parseInt(match[1] || '0');
            const minutes = parseInt(match[2] || '0');
            return hours * 60 + minutes;
          };
          
          const durationA = parseDuration(a.itineraries[0]?.duration || 'PT0M');
          const durationB = parseDuration(b.itineraries[0]?.duration || 'PT0M');
          return durationA - durationB; // Sort by shortest duration first
        })
        .slice(0, flightSearchParams.max || 50);
      
      return {
        data: sortedOffers,
        dictionaries: {
          locations: {},
          aircraft: {},
          currencies: {},
          carriers: {}
        },
        meta: {
          count: sortedOffers.length,
          links: { self: '' }
        }
      };
      
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to search flight offers by city');
    }
  }

  /**
   * Get city coordinates using geocoding
   */
  private static async getCityCoordinates(city: string, country?: string): Promise<{ latitude: number; longitude: number }> {
    const params: Record<string, string> = {
      city,
      format: 'json',
      limit: '1'
    };
    
    if (country) {
      params.country = country;
    }
    
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params,
        headers: {
          'User-Agent': 'TravelAPI/1.0'
        }
      });
        
        if (!response.data || response.data.length === 0) {
          throw new Error(`City not found: ${city}${country ? `, ${country}` : ''}`);
        }
        
        return {
          latitude: parseFloat(response.data[0].lat),
          longitude: parseFloat(response.data[0].lon)
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorText = error.response?.data || error.message;
          throw new Error(`Geocoding failed: ${error.response?.status} - ${errorText}`);
        }
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(`Failed to get coordinates for ${city}`);
      }
  }

  /**
   * Get the best airports from a list (prioritize major airports)
   */
  private static getBestAirports(airports: AmadeusAirport[]): AmadeusAirport[] {
    return airports
      .filter(airport => airport.iataCode && airport.iataCode.length === 3) // Only airports with valid IATA codes
      .sort((a, b) => {
        // Prioritize airports with higher traveler scores
        const scoreA = a.analytics?.travelers?.score || 0;
        const scoreB = b.analytics?.travelers?.score || 0;
        
        if (scoreA !== scoreB) {
          return scoreB - scoreA; // Higher score first
        }
        
        // If scores are equal, prioritize by distance (closer is better)
        return (a.distance?.value || 0) - (b.distance?.value || 0);
      })
      .slice(0, 5); // Return top 5 airports
  }

  /**
   * Check if Amadeus service is available (credentials configured)
   */
  static isAvailable(): boolean {
    try {
      this.getCredentials();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check which APIs are available with current credentials
   */
  static async checkApiAvailability(): Promise<{
    airports: boolean;
    flights: boolean;
    errors: string[];
  }> {
    const results = {
      airports: false,
      flights: false,
      errors: [] as string[]
    };

    // Test airports API
    try {
      await this.searchAirports({
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 10
      });
      results.airports = true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Airports API: ${errorMsg}`);
    }

    // Test flights API
    try {
      await this.searchFlightOffers({
        originLocationCode: 'DUS',
        destinationLocationCode: 'CDG',
        departureDate: '2025-09-15',
        adults: 1
      });
      results.flights = true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Flights API: ${errorMsg}`);
    }

    return results;
  }
}
