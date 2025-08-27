import { AmadeusService, FlightOffersSearchRequest } from '../amadeus.service';

// Mock fetch globally
global.fetch = jest.fn();

describe('AmadeusService Flight Search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset static properties
    (AmadeusService as unknown as { accessToken: string | null; tokenExpiry: number | null }).accessToken = null;
    (AmadeusService as unknown as { accessToken: string | null; tokenExpiry: number | null }).tokenExpiry = null;
  });

  describe('searchFlightOffers', () => {
    it('should validate required parameters', async () => {
      const invalidRequest = {} as FlightOffersSearchRequest;

      await expect(AmadeusService.searchFlightOffers(invalidRequest))
        .rejects
        .toThrow('Origin, destination, and departure date are required');
    });

    it('should validate date format', async () => {
      const request: FlightOffersSearchRequest = {
        originLocationCode: 'NYC',
        destinationLocationCode: 'LAX',
        departureDate: 'invalid-date',
        adults: 1
      };

      await expect(AmadeusService.searchFlightOffers(request))
        .rejects
        .toThrow('Departure date must be in YYYY-MM-DD format');
    });

    it('should validate passenger counts', async () => {
      const request: FlightOffersSearchRequest = {
        originLocationCode: 'NYC',
        destinationLocationCode: 'LAX',
        departureDate: '2024-06-15',
        adults: 0, // Invalid
        infants: 2 // More than adults
      };

      await expect(AmadeusService.searchFlightOffers(request))
        .rejects
        .toThrow('Adults must be between 1 and 9');
    });

    it('should make successful API call', async () => {
      // Mock environment variables
      process.env.AMADEUS_CLIENT_ID = 'test-client-id';
      process.env.AMADEUS_CLIENT_SECRET = 'test-client-secret';

      // Mock token response
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            access_token: 'test-token',
            expires_in: 3600
          })
        })
        // Mock flight search response
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: [
              {
                type: 'flight-offer',
                id: '1',
                source: 'GDS',
                oneWay: true,
                numberOfBookableSeats: 4,
                itineraries: [
                  {
                    duration: 'PT5H30M',
                    segments: [
                      {
                        departure: {
                          iataCode: 'NYC',
                          at: '2024-06-15T10:00:00'
                        },
                        arrival: {
                          iataCode: 'LAX',
                          at: '2024-06-15T13:30:00'
                        },
                        carrierCode: 'AA',
                        number: '123',
                        duration: 'PT5H30M'
                      }
                    ]
                  }
                ],
                travelerPricings: [
                  {
                    travelerId: '1',
                    price: {
                      currency: 'USD',
                      total: '299.99',
                      base: '250.00'
                    }
                  }
                ]
              }
            ],
            dictionaries: {
              locations: {},
              carriers: {}
            },
            meta: {
              count: 1
            }
          })
        });

      const request: FlightOffersSearchRequest = {
        originLocationCode: 'NYC',
        destinationLocationCode: 'LAX',
        departureDate: '2024-06-15',
        adults: 1,
        currencyCode: 'USD'
      };

      const result = await AmadeusService.searchFlightOffers(request);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('1');
      expect(result.data[0].oneWay).toBe(true);
      expect(result.meta.count).toBe(1);

      // Verify fetch was called correctly
      expect(fetch).toHaveBeenCalledTimes(2);
      
      // Check flight search URL
      const flightSearchCall = (fetch as jest.Mock).mock.calls[1];
      expect(flightSearchCall[0]).toContain('/shopping/flight-offers');
      expect(flightSearchCall[0]).toContain('originLocationCode=NYC');
      expect(flightSearchCall[0]).toContain('destinationLocationCode=LAX');
      expect(flightSearchCall[0]).toContain('departureDate=2024-06-15');
    });

    it('should handle API errors', async () => {
      // Mock environment variables
      process.env.AMADEUS_CLIENT_ID = 'test-client-id';
      process.env.AMADEUS_CLIENT_SECRET = 'test-client-secret';

      // Mock token response
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            access_token: 'test-token',
            expires_in: 3600
          })
        })
        // Mock flight search error
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          text: async () => 'Invalid parameters'
        });

      const request: FlightOffersSearchRequest = {
        originLocationCode: 'NYC',
        destinationLocationCode: 'LAX',
        departureDate: '2024-06-15',
        adults: 1
      };

      await expect(AmadeusService.searchFlightOffers(request))
        .rejects
        .toThrow('Amadeus Flight API error: 400 Bad Request - Invalid parameters');
    });
  });

  describe('getFlightOffer', () => {
    it('should validate offer ID', async () => {
      await expect(AmadeusService.getFlightOffer(''))
        .rejects
        .toThrow('Flight offer ID is required');
    });

    it('should make successful API call', async () => {
      // Mock environment variables
      process.env.AMADEUS_CLIENT_ID = 'test-client-id';
      process.env.AMADEUS_CLIENT_SECRET = 'test-client-secret';

      // Mock token response
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            access_token: 'test-token',
            expires_in: 3600
          })
        })
        // Mock flight offer response
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: {
              type: 'flight-offer',
              id: '1',
              source: 'GDS',
              oneWay: true,
              numberOfBookableSeats: 4
            }
          })
        });

      const result = await AmadeusService.getFlightOffer('1');

      expect(result.id).toBe('1');
      expect(result.type).toBe('flight-offer');
      expect(result.oneWay).toBe(true);

      // Verify fetch was called correctly
      expect(fetch).toHaveBeenCalledTimes(2);
      
      // Check flight offer URL
      const flightOfferCall = (fetch as jest.Mock).mock.calls[1];
      expect(flightOfferCall[0]).toContain('/shopping/flight-offers/1');
    });
  });

  describe('searchFlightOffersWithPrediction', () => {
    it('should include prediction parameter', async () => {
      // Mock environment variables
      process.env.AMADEUS_CLIENT_ID = 'test-client-id';
      process.env.AMADEUS_CLIENT_SECRET = 'test-client-secret';

      // Mock token response
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            access_token: 'test-token',
            expires_in: 3600
          })
        })
        // Mock flight search response
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: [],
            dictionaries: {},
            meta: { count: 0 }
          })
        });

      const request: FlightOffersSearchRequest = {
        originLocationCode: 'NYC',
        destinationLocationCode: 'LAX',
        departureDate: '2024-06-15',
        adults: 1
      };

      await AmadeusService.searchFlightOffersWithPrediction(request);

      // Verify fetch was called correctly
      expect(fetch).toHaveBeenCalledTimes(2);
      
      // Check that pricePrediction parameter is included
      const flightSearchCall = (fetch as jest.Mock).mock.calls[1];
      expect(flightSearchCall[0]).toContain('pricePrediction=true');
    });
  });

  describe('isAvailable', () => {
    it('should return true when credentials are configured', () => {
      process.env.AMADEUS_CLIENT_ID = 'test-client-id';
      process.env.AMADEUS_CLIENT_SECRET = 'test-client-secret';

      expect(AmadeusService.isAvailable()).toBe(true);
    });

    it('should return false when credentials are missing', () => {
      delete process.env.AMADEUS_CLIENT_ID;
      delete process.env.AMADEUS_CLIENT_SECRET;

      expect(AmadeusService.isAvailable()).toBe(false);
    });
  });
});
