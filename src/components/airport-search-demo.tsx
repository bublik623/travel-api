'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Airport } from '@/types';
import axios from 'axios';

export function AirportSearchDemo() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [radius, setRadius] = useState('100');
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!city) {
      setError('Please enter a city name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        city,
        radius,
      });
      
      if (country) params.append('country', country);
      if (zipcode) params.append('zipcode', zipcode);

      const response = await fetch(`/api/airports?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch airports');
      }

      setAirports(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocode to get city name
            const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
              params: {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                format: 'json',
                addressdetails: '1'
              }
            });
            const data = response.data;
            
            if (data.address) {
              setCity(data.address.city || data.address.town || data.address.village || '');
              setCountry(data.address.country || '');
              setZipcode(data.address.postcode || '');
            }
          } catch (error) {
            setError('Unable to get location details: ' + (error instanceof Error ? error.message : 'Unknown error'));
          }
        },
        (error) => {
          setError('Unable to get current location: ' + error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Airport Search</CardTitle>
          <CardDescription>
            Search for airports within a specified radius using coordinates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., New York"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., United States"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Postal Code</label>
              <input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                placeholder="e.g., 10001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Radius (km)</label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search Airports'}
            </Button>
            <Button variant="outline" onClick={handleUseCurrentLocation}>
              Use Current Location
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {airports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Found Airports ({airports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {airports.map((airport) => (
                <div
                  key={airport.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {airport.name} ({airport.iataCode})
                      </h3>
                      <p className="text-gray-600">{airport.detailedName}</p>
                      <p className="text-sm text-gray-500">
                        {airport.address.cityName}, {airport.address.countryName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Distance: {airport.distance.value} {airport.distance.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {airport.type}
                      </span>
                      {airport.analytics?.travelers?.score && (
                        <p className="text-xs text-gray-500 mt-1">
                          Traveler Score: {airport.analytics.travelers.score}
                        </p>
                      )}
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
