'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Hotel {
  chainCode: string;
  iataCode: string;
  dupeId: number;
  name: string;
  hotelId: string;
  geoCode: {
    latitude: number;
    longitude: number;
  };
  address?: {
    countryCode: string;
  };
  distance: {
    value: number;
    unit: string;
  };
}

interface HotelSearchResponse {
  success: boolean;
  data: Hotel[];
  meta: {
    count: number;
    links: {
      self: string;
      next?: string;
      last?: string;
    };
  };
  message: string;
}

export function HotelSearchDemo() {
  const [searchType, setSearchType] = useState<'cityCode' | 'cityName' | 'coordinates'>('cityName');
  const [cityCode, setCityCode] = useState('');
  const [cityName, setCityName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('5');
  const [radiusUnit, setRadiusUnit] = useState<'KM' | 'MILE'>('KM');
  const [amenities, setAmenities] = useState('');
  const [ratings, setRatings] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [view, setView] = useState<'FULL' | 'LIGHT' | 'LONG'>('FULL');
  const [limit, setLimit] = useState('10');
  
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    count: number;
    links: {
      self: string;
      next?: string;
      last?: string;
    };
  } | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setHotels([]);
    setMeta(null);

    try {
      let url: string;
      const params = new URLSearchParams();

      // Add common parameters
      params.append('radius', radius);
      params.append('radiusUnit', radiusUnit);
      params.append('currency', currency);
      params.append('view', view);
      params.append('limit', limit);

      if (amenities) {
        params.append('amenities', amenities);
      }

      if (ratings) {
        params.append('ratings', ratings);
      }

      // Build URL based on search type
      if (searchType === 'cityCode') {
        if (!cityCode) {
          throw new Error('City code is required');
        }
        url = `/api/hotels?${params.toString()}&cityCode=${cityCode}`;
      } else if (searchType === 'cityName') {
        if (!cityName) {
          throw new Error('City name is required');
        }
        url = `/api/hotels/by-city?${params.toString()}&city=${cityName}`;
        if (countryCode) {
          params.append('countryCode', countryCode);
        }
      } else {
        // coordinates
        if (!latitude || !longitude) {
          throw new Error('Both latitude and longitude are required');
        }
        url = `/api/hotels?${params.toString()}&latitude=${latitude}&longitude=${longitude}`;
      }

      console.log('🔍 Searching hotels with URL:', url);

      const response = await fetch(url);
      const data: HotelSearchResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setHotels(data.data);
      setMeta(data.meta);
      console.log('✅ Hotel search successful:', data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('❌ Hotel search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(parseFloat(price));
  };



  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🏨 Hotel Search Demo</CardTitle>
          <CardDescription>
            Search for hotels using Amadeus Hotel List API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Type Selection */}
          <div className="flex gap-4 mb-4">
                         <label className="flex items-center space-x-2">
               <input
                 type="radio"
                 value="cityName"
                 checked={searchType === 'cityName'}
                 onChange={(e) => setSearchType(e.target.value as 'cityName' | 'cityCode' | 'coordinates')}
                 className="rounded"
               />
               <span>City Name</span>
             </label>
                         <label className="flex items-center space-x-2">
               <input
                 type="radio"
                 value="cityCode"
                 checked={searchType === 'cityCode'}
                 onChange={(e) => setSearchType(e.target.value as 'cityName' | 'cityCode' | 'coordinates')}
                 className="rounded"
               />
               <span>City Code</span>
             </label>
                         <label className="flex items-center space-x-2">
               <input
                 type="radio"
                 value="coordinates"
                 checked={searchType === 'coordinates'}
                 onChange={(e) => setSearchType(e.target.value as 'cityName' | 'cityCode' | 'coordinates')}
                 className="rounded"
               />
               <span>Coordinates</span>
             </label>
          </div>

          {/* Search Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchType === 'cityName' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">City Name *</label>
                  <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="e.g., New York, Paris"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country Code</label>
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    placeholder="e.g., US, FR"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </>
            )}

            {searchType === 'cityCode' && (
              <div>
                <label className="block text-sm font-medium mb-1">City Code *</label>
                <input
                  type="text"
                  value={cityCode}
                  onChange={(e) => setCityCode(e.target.value)}
                  placeholder="e.g., NYC, PAR"
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            {searchType === 'coordinates' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="e.g., 40.7128"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="e.g., -74.0060"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Radius</label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                min="1"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Radius Unit</label>
              <select
                value={radiusUnit}
                onChange={(e) => setRadiusUnit(e.target.value as 'KM' | 'MILE')}
                className="w-full p-2 border rounded"
              >
                <option value="KM">Kilometers</option>
                <option value="MILE">Miles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amenities</label>
              <input
                type="text"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                placeholder="e.g., WIFI,POOL,GYM"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ratings</label>
              <input
                type="text"
                value={ratings}
                onChange={(e) => setRatings(e.target.value)}
                placeholder="e.g., 4,5"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">View</label>
              <select
                value={view}
                onChange={(e) => setView(e.target.value as 'FULL' | 'LIGHT' | 'LONG')}
                className="w-full p-2 border rounded"
              >
                <option value="FULL">Full</option>
                <option value="LIGHT">Light</option>
                <option value="LONG">Long</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Limit</label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                min="1"
                max="50"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Searching...' : 'Search Hotels'}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">❌ Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {hotels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              🏨 Hotels Found ({meta?.count || hotels.length})
            </CardTitle>
            <CardDescription>
              Showing {hotels.length} hotels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotels.map((hotel) => (
                <Card key={hotel.hotelId}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{hotel.name}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        🏨 {hotel.chainCode}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {hotel.address?.countryCode || 'Unknown location'}
                    </p>
                    <p className="text-gray-500 text-sm mb-2">
                      📍 {hotel.distance.value} {hotel.distance.unit} from center
                    </p>
                    <p className="text-gray-500 text-sm mb-2">
                      🆔 {hotel.hotelId}
                    </p>
                    <p className="text-gray-500 text-sm mb-2">
                      📍 Lat: {hotel.geoCode.latitude.toFixed(4)}, Lon: {hotel.geoCode.longitude.toFixed(4)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
