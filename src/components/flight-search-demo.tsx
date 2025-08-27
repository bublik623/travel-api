'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlightOffersSearchRequest, FlightOffer, CityFlightSearchRequest } from '@/services/amadeus.service';

interface FlightSearchDemoProps {
  className?: string;
}

export function FlightSearchDemo({ className }: FlightSearchDemoProps) {
  const [searchType, setSearchType] = useState<'city' | 'airport'>('city');
  
  const [citySearchParams, setCitySearchParams] = useState<CityFlightSearchRequest>({
    originCity: 'Київ',
    destinationCity: 'Лондон',
    departureDate: '2024-06-15',
    adults: 1,
    currencyCode: 'USD',
    max: 10,
    airportSearchRadius: 100
  });

  const [airportSearchParams, setAirportSearchParams] = useState<FlightOffersSearchRequest>({
    originLocationCode: 'NYC',
    destinationLocationCode: 'LAX',
    departureDate: '2024-06-15',
    adults: 1,
    currencyCode: 'USD',
    max: 10
  });

  const [flightOffers, setFlightOffers] = useState<FlightOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = searchType === 'city' ? citySearchParams : airportSearchParams;
      
      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to search flights');
      }

      setFlightOffers(result.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    const currencyCode = searchType === 'city' ? citySearchParams.currencyCode : airportSearchParams.currencyCode;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
    }).format(parseFloat(price));
  };

  const formatDuration = (duration: string) => {
    // Convert PT2H30M to "2h 30m"
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;

    const hours = match[1] ? match[1].replace('H', '') : '0';
    const minutes = match[2] ? match[2].replace('M', '') : '0';

    if (hours === '0') return `${minutes}m`;
    if (minutes === '0') return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Flight Search Demo</CardTitle>
          <CardDescription>
            Search for flight offers using the Amadeus Flight Offers Search API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Type Toggle */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setSearchType('city')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                searchType === 'city'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Search by City
            </button>
            <button
              onClick={() => setSearchType('airport')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                searchType === 'airport'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Search by Airport Code
            </button>
          </div>

          {searchType === 'city' ? (
            /* City Search Form */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Origin City</label>
                  <input
                    type="text"
                    value={citySearchParams.originCity}
                    onChange={(e) => setCitySearchParams(prev => ({ ...prev, originCity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Київ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Destination City</label>
                  <input
                    type="text"
                    value={citySearchParams.destinationCity}
                    onChange={(e) => setCitySearchParams(prev => ({ ...prev, destinationCity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Лондон"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Departure Date</label>
                  <input
                    type="date"
                    value={citySearchParams.departureDate}
                    onChange={(e) => setCitySearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adults</label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={citySearchParams.adults || 1}
                    onChange={(e) => setCitySearchParams(prev => ({ ...prev, adults: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Origin Country (Optional)</label>
                  <input
                    type="text"
                    value={citySearchParams.originCountry || ''}
                    onChange={(e) => setCitySearchParams(prev => ({ ...prev, originCountry: e.target.value || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Україна"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Destination Country (Optional)</label>
                  <input
                    type="text"
                    value={citySearchParams.destinationCountry || ''}
                    onChange={(e) => setCitySearchParams(prev => ({ ...prev, destinationCountry: e.target.value || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Великобританія"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Airport Search Radius (km)</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={citySearchParams.airportSearchRadius || 100}
                    onChange={(e) => setCitySearchParams(prev => ({ ...prev, airportSearchRadius: parseInt(e.target.value) || 100 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Results</label>
                  <input
                    type="number"
                    min="1"
                    max="250"
                    value={citySearchParams.max || 10}
                    onChange={(e) => setCitySearchParams(prev => ({ ...prev, max: parseInt(e.target.value) || 10 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Airport Code Search Form */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Origin (IATA)</label>
                  <input
                    type="text"
                    value={airportSearchParams.originLocationCode}
                    onChange={(e) => setAirportSearchParams(prev => ({ ...prev, originLocationCode: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="NYC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Destination (IATA)</label>
                  <input
                    type="text"
                    value={airportSearchParams.destinationLocationCode}
                    onChange={(e) => setAirportSearchParams(prev => ({ ...prev, destinationLocationCode: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="LAX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Departure Date</label>
                  <input
                    type="date"
                    value={airportSearchParams.departureDate}
                    onChange={(e) => setAirportSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adults</label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={airportSearchParams.adults || 1}
                    onChange={(e) => setAirportSearchParams(prev => ({ ...prev, adults: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Return Date (Optional)</label>
                  <input
                    type="date"
                    value={airportSearchParams.returnDate || ''}
                    onChange={(e) => setAirportSearchParams(prev => ({ ...prev, returnDate: e.target.value || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Travel Class</label>
                  <select
                    value={airportSearchParams.travelClass || ''}
                    onChange={(e) => setAirportSearchParams(prev => ({ ...prev, travelClass: e.target.value as any || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="ECONOMY">Economy</option>
                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                    <option value="BUSINESS">Business</option>
                    <option value="FIRST">First</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Results</label>
                  <input
                    type="number"
                    min="1"
                    max="250"
                    value={airportSearchParams.max || 10}
                    onChange={(e) => setAirportSearchParams(prev => ({ ...prev, max: parseInt(e.target.value) || 10 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          <Button 
            onClick={handleSearch} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Searching...' : `Search Flights ${searchType === 'city' ? 'by City' : 'by Airport Code'}`}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {flightOffers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Flight Offers ({flightOffers.length})</CardTitle>
            <CardDescription>
              Found {flightOffers.length} flight offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flightOffers.map((offer) => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                     <div className="flex justify-between items-start mb-3">
                     <div>
                       <h3 className="font-semibold text-lg">
                         {offer.itineraries[0]?.segments[0]?.departure.iataCode} → {offer.itineraries[0]?.segments[offer.itineraries[0].segments.length - 1]?.arrival.iataCode}
                       </h3>
                       <p className="text-sm text-gray-600">
                         {offer.oneWay ? 'One Way' : 'Round Trip'} • {offer.numberOfBookableSeats} seats available
                       </p>
                       {/* Show airport information if available */}
                       {(offer as any).originAirport && (offer as any).destinationAirport && (
                         <p className="text-xs text-gray-500 mt-1">
                           {(offer as any).originAirport.city} → {(offer as any).destinationAirport.city}
                         </p>
                       )}
                     </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {formatPrice(offer.travelerPricings[0]?.price.total || '0')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {offer.travelerPricings[0]?.price.currency}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {offer.itineraries.map((itinerary, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            {index === 0 ? 'Outbound' : 'Return'}
                          </span>
                          <span className="text-sm text-gray-600">
                            Duration: {formatDuration(itinerary.duration)}
                          </span>
                        </div>
                        
                        {itinerary.segments.map((segment, segIndex) => (
                          <div key={segment.id} className="flex items-center justify-between py-1">
                            <div className="flex items-center space-x-3">
                              <div className="text-center">
                                <p className="font-medium">{formatDateTime(segment.departure.at)}</p>
                                <p className="text-sm text-gray-600">{segment.departure.iataCode}</p>
                              </div>
                              <div className="flex-1 text-center">
                                <div className="border-t-2 border-gray-300 relative">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-white px-2 text-xs text-gray-500">
                                      {segment.carrierCode} {segment.number}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDuration(segment.duration)}
                                  {segment.numberOfStops > 0 && ` • ${segment.numberOfStops} stop${segment.numberOfStops > 1 ? 's' : ''}`}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="font-medium">{formatDateTime(segment.arrival.at)}</p>
                                <p className="text-sm text-gray-600">{segment.arrival.iataCode}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span>Validating Airlines: {offer.validatingAirlineCodes.join(', ')}</span>
                      <span>Last Ticketing: {new Date(offer.lastTicketingDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
