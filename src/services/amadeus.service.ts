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

// Hotel List API Types
export interface HotelListRequest {
  cityCode?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  radiusUnit?: 'KM' | 'MILE';
  chainCodes?: string[];
  amenities?: string[];
  ratings?: number[];
  hotelSource?: 'ALL' | 'BEST_UNRATED' | 'VIRTUOSO' | 'EXPEDIA' | 'AMADEUS';
  checkInDate?: string;
  checkOutDate?: string;
  currency?: string;
  bestRateOnly?: boolean;
  view?: 'FULL' | 'LIGHT' | 'LONG';
  page?: {
    limit?: number;
    offset?: number;
  };
}

export interface HotelListResponse {
  data: Hotel[];
  meta: {
    count: number;
    links: {
      self: string;
      next?: string;
      last?: string;
    };
  };
}

export interface Hotel {
  type: string;
  hotelId: string;
  chainCode: string;
  dupeId: string;
  name: string;
  rating: number;
  cityCode: string;
  latitude: number;
  longitude: number;
  hotelDistance: {
    distance: number;
    distanceUnit: string;
  };
  address: {
    lines: string[];
    postalCode: string;
    cityName: string;
    countryCode: string;
    countryName: string;
  };
  contact: {
    phone: string;
    fax?: string;
    email?: string;
  };
  amenities: string[];
  media: HotelMedia[];
  description?: {
    lang: string;
    text: string;
  };
  available: boolean;
  offers?: HotelOffer[];
  policies?: HotelPolicies;
  lastUpdate: string;
}

export interface HotelMedia {
  uri: string;
  category: string;
}

export interface HotelOffer {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  rateCode: string;
  rateFamilyEstimated: {
    code: string;
    type: string;
  };
  room: {
    type: string;
    typeEstimated: {
      category: string;
      beds: number;
      bedType: string;
    };
    description: {
      text: string;
      lang: string;
    };
  };
  guests: {
    adults: number;
  };
  price: {
    currency: string;
    base: string;
    total: string;
    variations: {
      average: {
        base: string;
      };
      changes: Array<{
        startDate: string;
        endDate: string;
        base: string;
        total: string;
      }>;
    };
  };
  policies: {
    cancellation: {
      amount: string;
      deadline: string;
    };
    deposit: {
      amount: string;
      acceptedFormats: string[];
    };
    prepayment: {
      amount: string;
      deadline: string;
    };
  };
  self: string;
}

export interface HotelPolicies {
  cancellation: {
    amount: string;
    deadline: string;
  };
  deposit: {
    amount: string;
    acceptedFormats: string[];
  };
  prepayment: {
    amount: string;
    deadline: string;
  };
}

// Hotel Search API Types
export interface HotelSearchRequest {
  cityCode?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  radiusUnit?: 'KM' | 'MILE';
  chainCodes?: string[];
  amenities?: string[];
  ratings?: number[];
  hotelSource?: 'ALL' | 'BEST_UNRATED' | 'VIRTUOSO' | 'EXPEDIA' | 'AMADEUS';
  checkInDate?: string;
  checkOutDate?: string;
  currency?: string;
  bestRateOnly?: boolean;
  view?: 'FULL' | 'LIGHT' | 'LONG';
  page?: {
    limit?: number;
    offset?: number;
  };
}

export interface HotelSearchResponse {
  data: HotelSearchResult[];
  meta: {
    count: number;
    links: {
      self: string;
      next?: string;
      last?: string;
    };
  };
}

export interface HotelSearchResult {
  type: string;
  hotelId: string;
  chainCode: string;
  dupeId: string;
  name: string;
  rating: number;
  cityCode: string;
  latitude: number;
  longitude: number;
  hotelDistance: {
    distance: number;
    distanceUnit: string;
  };
  address: {
    lines: string[];
    postalCode: string;
    cityName: string;
    countryCode: string;
    countryName: string;
  };
  contact: {
    phone: string;
    fax?: string;
    email?: string;
  };
  amenities: string[];
  media: HotelMedia[];
  description?: {
    lang: string;
    text: string;
  };
  available: boolean;
  offers?: HotelOffer[];
  policies?: HotelPolicies;
  lastUpdate: string;
}

// Hotel Offers Search API Types
export interface HotelOffersSearchRequest {
  hotelIds?: string[];
  cityCode?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  radiusUnit?: 'KM' | 'MILE';
  chainCodes?: string[];
  amenities?: string[];
  ratings?: number[];
  hotelSource?: 'ALL' | 'BEST_UNRATED' | 'VIRTUOSO' | 'EXPEDIA' | 'AMADEUS';
  checkInDate: string;
  checkOutDate: string;
  roomQuantity?: number;
  adults?: number;
  priceRange?: string;
  currency?: string;
  paymentPolicy?: string;
  boardType?: string;
  includedCheckedBagsOnly?: boolean;
  bestRateOnly?: boolean;
  view?: 'FULL' | 'LIGHT' | 'LONG';
  page?: {
    limit?: number;
    offset?: number;
  };
}

export interface HotelOffersSearchResponse {
  data: HotelOfferResult[];
  meta: {
    count: number;
    links: {
      self: string;
      next?: string;
      last?: string;
    };
  };
}

export interface HotelOfferResult {
  type: string;
  hotel: HotelSearchResult;
  available: boolean;
  offers: HotelOffer[];
  self: string;
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
  private static readonly BASE_URL_V3 = 'https://test.api.amadeus.com/v3';
  private static readonly TOKEN_URL = `${this.BASE_URL}/security/oauth2/token`;
  private static readonly AIRPORTS_URL = `${this.BASE_URL}/reference-data/locations/airports`;
  private static readonly FLIGHT_OFFERS_URL = `${this.BASE_URL_V2}/shopping/flight-offers`;
  
  // Hotel Search API endpoints
  private static readonly HOTEL_SEARCH_URL = `${this.BASE_URL}/reference-data/locations/hotels`;
  private static readonly HOTEL_OFFERS_URL = `${this.BASE_URL_V3}/shopping/hotel-offers`;

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
   * Search for hotels using the Hotel Search API
   */
  static async searchHotels(request: HotelSearchRequest): Promise<HotelSearchResponse> {
    const {
      cityCode,
      latitude,
      longitude,
      radius = 5,
      radiusUnit = 'KM',
      chainCodes,
      amenities,
      ratings,
      hotelSource = 'ALL',
      checkInDate,
      checkOutDate,
      currency = 'USD',
      bestRateOnly = false,
      view = 'FULL',
      page
    } = request;

    // Validate required parameters
    if (!cityCode && (!latitude || !longitude)) {
      throw new Error('Either cityCode or both latitude and longitude are required');
    }

    // Validate coordinates if provided
    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      throw new Error('Latitude must be between -90 and 90');
    }

    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      throw new Error('Longitude must be between -180 and 180');
    }

    // Validate radius
    if (radius <= 0 || radius > 100) {
      throw new Error('Radius must be between 1 and 100');
    }

    // Validate date format if provided
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (checkInDate && !dateRegex.test(checkInDate)) {
      throw new Error('Check-in date must be in YYYY-MM-DD format');
    }

    if (checkOutDate && !dateRegex.test(checkOutDate)) {
      throw new Error('Check-out date must be in YYYY-MM-DD format');
    }

    // Validate ratings
    if (ratings) {
      for (const rating of ratings) {
        if (rating < 1 || rating > 5) {
          throw new Error('Ratings must be between 1 and 5');
        }
      }
    }

    const accessToken = await this.getAccessToken();

    // Determine the correct endpoint based on parameters
    const endpoint = cityCode 
      ? `${this.HOTEL_SEARCH_URL}/by-city`
      : `${this.HOTEL_SEARCH_URL}/by-geocode`;

    // Build params object
    const params: Record<string, string> = {};

    if (cityCode) {
      // For by-city endpoint
      params.cityCode = cityCode;
      params.radius = radius.toString();
      params.radiusUnit = radiusUnit;
      params.hotelSource = hotelSource;
      params.currency = currency;
      params.bestRateOnly = bestRateOnly.toString();
      params.view = view;

      if (chainCodes && chainCodes.length > 0) {
        params.chainCodes = chainCodes.join(',');
      }

      if (amenities && amenities.length > 0) {
        params.amenities = amenities.join(',');
      }

      if (ratings && ratings.length > 0) {
        params.ratings = ratings.join(',');
      }

      if (checkInDate) {
        params.checkInDate = checkInDate;
      }

      if (checkOutDate) {
        params.checkOutDate = checkOutDate;
      }

      if (page?.limit) {
        params['page[limit]'] = page.limit.toString();
      }

      if (page?.offset) {
        params['page[offset]'] = page.offset.toString();
      }
    } else {
      // For by-geocode endpoint - only send essential parameters
      params.latitude = latitude!.toString();
      params.longitude = longitude!.toString();
      params.radius = radius.toString();
      params.radiusUnit = radiusUnit;

      if (page?.offset) {
        params['page[offset]'] = page.offset.toString();
      }
    }

    try {
      console.log('🔑 Hotel search - Access token length:', accessToken.length);
      console.log('🔑 Hotel search params:', params);
      console.log('🔑 Request URL:', endpoint);

      const response = await axios.get(endpoint, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Hotel search request successful');
      
      // Limit results to 20 hotels for performance
      const limitedData = response.data.data.slice(0, 20);
      const limitedResponse = {
        ...response.data,
        data: limitedData,
        meta: {
          ...response.data.meta,
          count: Math.min(response.data.meta.count, 20)
        }
      };
      
      return limitedResponse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        const errorText = errorData ? JSON.stringify(errorData) : error.message;
        console.error('❌ Hotel search request failed:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: errorData,
          url: error.config?.url,
          params: error.config?.params,
          endpoint: endpoint
        });
        throw new Error(`Amadeus Hotel API error: ${error.response?.status} ${error.response?.statusText} - ${errorText}`);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch hotel data');
    }
  }

  /**
   * Search for hotel offers using the Hotel Offers Search API
   */
  static async searchHotelOffers(request: HotelOffersSearchRequest): Promise<HotelOffersSearchResponse> {
    const {
      hotelIds,
      cityCode,
      latitude,
      longitude,
      radius = 5,
      radiusUnit = 'KM',
      checkInDate,
      checkOutDate,
      roomQuantity = 1,
      adults = 1,
      currency = 'USD'
    } = request;

    // Validate required parameters
    if (!checkInDate || !checkOutDate) {
      throw new Error('Check-in and check-out dates are required');
    }

    if (!hotelIds && !cityCode && (!latitude || !longitude)) {
      throw new Error('Either hotelIds, cityCode, or both latitude and longitude are required');
    }

    // Validate coordinates if provided
    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      throw new Error('Latitude must be between -90 and 90');
    }

    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      throw new Error('Longitude must be between -180 and 180');
    }

    // Validate radius
    if (radius <= 0 || radius > 100) {
      throw new Error('Radius must be between 1 and 100');
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(checkInDate)) {
      throw new Error('Check-in date must be in YYYY-MM-DD format');
    }

    if (!dateRegex.test(checkOutDate)) {
      throw new Error('Check-out date must be in YYYY-MM-DD format');
    }

    const accessToken = await this.getAccessToken();

    // Build params object for v3 API - simplified parameter structure
    const params: Record<string, string> = {};

    // Essential parameters for v3
    if (hotelIds && hotelIds.length > 0) {
      params.hotelIds = hotelIds.join(',');
    }

    if (cityCode) {
      params.cityCode = cityCode;
    }

    if (latitude !== undefined && longitude !== undefined) {
      params.latitude = latitude.toString();
      params.longitude = longitude.toString();
    }

    if (radius) {
      params.radius = radius.toString();
    }

    if (radiusUnit) {
      params.radiusUnit = radiusUnit;
    }

    // Add adults parameter (v3 supports this)
    if (adults) {
      params.adults = adults.toString();
    }

    // Add check-in and check-out dates if provided
    if (checkInDate) {
      params.checkInDate = checkInDate;
    }

    if (checkOutDate) {
      params.checkOutDate = checkOutDate;
    }

    // Add other optional parameters that might be supported in v3
    if (currency) {
      params.currency = currency;
    }

    if (roomQuantity) {
      params.roomQuantity = roomQuantity.toString();
    }

    try {
      console.log('🔑 Hotel offers search - Access token length:', accessToken.length);
      console.log('🔑 Hotel offers search params:', params);
      console.log('🔑 Request URL:', this.HOTEL_OFFERS_URL);

      const response = await axios.get(this.HOTEL_OFFERS_URL, {
        params,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Hotel offers search request successful');
      console.log('🔍 V3 API Response structure:', {
        hasData: !!response.data.data,
        dataLength: response.data.data?.length || 0,
        hasMeta: !!response.data.meta,
        metaKeys: response.data.meta ? Object.keys(response.data.meta) : []
      });
      
      // Handle v3 API response structure (different from v1)
      const responseData = response.data;
      
      // Limit results to 10 hotels for performance
      const limitedData = responseData.data ? responseData.data.slice(0, 10) : [];
      const limitedResponse = {
        ...responseData,
        data: limitedData,
        meta: {
          count: limitedData.length,
          links: responseData.meta?.links || { self: '' }
        }
      };
      
      return limitedResponse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        const errorText = errorData ? JSON.stringify(errorData) : error.message;
        console.error('❌ Hotel offers search request failed:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: errorData,
          url: error.config?.url,
          params: error.config?.params
        });
        throw new Error(`Amadeus Hotel Offers API error: ${error.response?.status} ${error.response?.statusText} - ${errorText}`);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch hotel offers data');
    }
  }

  /**
   * Get hotel offers for specific hotels by their IDs
   */
  static async getHotelOffersByHotelIds(
    hotelIds: string[],
    checkInDate: string,
    checkOutDate: string,
    options?: Omit<HotelOffersSearchRequest, 'hotelIds' | 'checkInDate' | 'checkOutDate'>
  ): Promise<HotelOffersSearchResponse> {
    return this.searchHotelOffers({
      hotelIds,
      checkInDate,
      checkOutDate,
      ...options
    });
  }

  /**
   * Get hotel offers by city code
   */
  static async getHotelOffersByCityCode(
    cityCode: string,
    checkInDate: string,
    checkOutDate: string,
    options?: Omit<HotelOffersSearchRequest, 'cityCode' | 'checkInDate' | 'checkOutDate'>
  ): Promise<HotelOffersSearchResponse> {
    return this.searchHotelOffers({
      cityCode,
      checkInDate,
      checkOutDate,
      ...options
    });
  }

  /**
   * Get hotel offers by coordinates
   */
  static async getHotelOffersByCoordinates(
    latitude: number,
    longitude: number,
    checkInDate: string,
    checkOutDate: string,
    options?: Omit<HotelOffersSearchRequest, 'latitude' | 'longitude' | 'checkInDate' | 'checkOutDate'>
  ): Promise<HotelOffersSearchResponse> {
    return this.searchHotelOffers({
      latitude,
      longitude,
      checkInDate,
      checkOutDate,
      ...options
    });
  }

  /**
   * Search for hotels by city name (automatically finds coordinates)
   */
  static async searchHotelsByCity(
    cityName: string,
    countryCode?: string,
    options?: Omit<HotelSearchRequest, 'latitude' | 'longitude'>
  ): Promise<HotelSearchResponse> {
    try {
      console.log('Starting city-based hotel search:', { cityName, countryCode });
      
      // Step 1: Get city coordinates from city name
      const cityCoordinates = await this.getCityCoordinates(cityName, countryCode);
      console.log('City coordinates found:', cityCoordinates);
      
      // Step 2: Search for hotels using the coordinates
      const hotelSearchRequest: HotelSearchRequest = {
        ...options,
        latitude: cityCoordinates.latitude,
        longitude: cityCoordinates.longitude
      };
      
      return await this.searchHotels(hotelSearchRequest);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to search hotels by city');
    }
  }

  /**
   * Search for hotels by specific hotel IDs
   */
  static async searchHotelsByIds(
    hotelIds: string[],
    options?: Omit<HotelSearchRequest, 'hotelIds'>
  ): Promise<HotelSearchResponse> {
    try {
      console.log('Starting hotel search by IDs:', { hotelIds });
      
      const accessToken = await this.getAccessToken();
      
      // Build params object for by-hotels endpoint
      const params: Record<string, string> = {
        hotelIds: hotelIds.join(',')
      };

      // Add optional parameters
      if (options?.radius) {
        params.radius = options.radius.toString();
      }
      if (options?.radiusUnit) {
        params.radiusUnit = options.radiusUnit;
      }
      if (options?.hotelSource) {
        params.hotelSource = options.hotelSource;
      }
      if (options?.currency) {
        params.currency = options.currency;
      }
      if (options?.bestRateOnly !== undefined) {
        params.bestRateOnly = options.bestRateOnly.toString();
      }
      if (options?.view) {
        params.view = options.view;
      }
      if (options?.chainCodes && options.chainCodes.length > 0) {
        params.chainCodes = options.chainCodes.join(',');
      }
      if (options?.amenities && options.amenities.length > 0) {
        params.amenities = options.amenities.join(',');
      }
      if (options?.ratings && options.ratings.length > 0) {
        params.ratings = options.ratings.join(',');
      }
      if (options?.checkInDate) {
        params.checkInDate = options.checkInDate;
      }
      if (options?.checkOutDate) {
        params.checkOutDate = options.checkOutDate;
      }
      if (options?.page?.limit) {
        params['page[limit]'] = options.page.limit.toString();
      }
      if (options?.page?.offset) {
        params['page[offset]'] = options.page.offset.toString();
      }

      const endpoint = `${this.HOTEL_SEARCH_URL}/by-hotels`;

      try {
        console.log('🔑 Hotel search by IDs - Access token length:', accessToken.length);
        console.log('🔑 Hotel search by IDs params:', params);
        console.log('🔑 Request URL:', endpoint);

        const response = await axios.get(endpoint, {
          params,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('✅ Hotel search by IDs request successful');
        
        // Limit results to 10 hotels for performance
        const limitedData = response.data.data.slice(0, 10);
        const limitedResponse = {
          ...response.data,
          data: limitedData,
          meta: {
            ...response.data.meta,
            count: Math.min(response.data.meta.count, 10)
          }
        };
        
        return limitedResponse;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorData = error.response?.data;
          const errorText = errorData ? JSON.stringify(errorData) : error.message;
          console.error('❌ Hotel search by IDs request failed:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: errorData,
            url: error.config?.url,
            params: error.config?.params,
            endpoint: endpoint
          });
          throw new Error(`Amadeus Hotel API error: ${error.response?.status} ${error.response?.statusText} - ${errorText}`);
        }
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to fetch hotel data by IDs');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to search hotels by IDs');
    }
  }

  /**
   * Search for hotel offers by city name (first finds hotels, then gets offers)
   */
  static async searchHotelsOffersByCity(
    cityName: string,
    checkInDate: string,
    checkOutDate: string,
    adults: number = 1,
    countryCode?: string,
    hotelSearchOptions?: Omit<HotelSearchRequest, 'latitude' | 'longitude'>,
    offerSearchOptions?: Omit<HotelOffersSearchRequest, 'hotelIds' | 'checkInDate' | 'checkOutDate' | 'roomQuantity'>
  ): Promise<HotelOffersSearchResponse> {
    try {
      console.log('Starting city-based hotel offers search:', { 
        cityName, 
        countryCode, 
        checkInDate, 
        checkOutDate, 
        adults 
      });
      
      // Step 1: Search for hotels in the city
      const hotelsResponse = await this.searchHotelsByCity(cityName, countryCode, hotelSearchOptions);
      console.log('Hotels found:', hotelsResponse.data.length);
      
      if (hotelsResponse.data.length === 0) {
        return {
          data: [],
          meta: {
            count: 0,
            links: { self: '' }
          }
        };
      }
      
      // Step 2: Extract hotel IDs from the search results
      const hotelIds = hotelsResponse.data.map(hotel => hotel.hotelId);
      console.log('Hotel IDs for offers search:', hotelIds);
      
      // Step 3: Search for offers for these specific hotels
      const offersResponse = await this.searchHotelOffers({
        hotelIds,
        checkInDate,
        checkOutDate,
        adults,
        ...offerSearchOptions
      });
      
      console.log('Hotel offers found:', offersResponse.data.length);
      return offersResponse;
      
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to search hotel offers by city');
    }
  }

  /**
   * Check which APIs are available with current credentials
   */
  static async checkApiAvailability(): Promise<{
    airports: boolean;
    flights: boolean;
    hotels: boolean;
    errors: string[];
  }> {
    const results = {
      airports: false,
      flights: false,
      hotels: false,
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

    // Test hotels API
    try {
      await this.searchHotels({
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 5
      });
      results.hotels = true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Hotels API: ${errorMsg}`);
    }

    return results;
  }
}
