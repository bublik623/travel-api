'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GeocodeResponse, GeocodeError } from '@/types';

export function GeocodeDemo() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [result, setResult] = useState<GeocodeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeocode = async () => {
    if (!city.trim()) {
      setError('Будь ласка, введіть назву міста');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({ city: city.trim() });
      if (country.trim()) {
        params.append('country', country.trim());
      }

      const response = await fetch(`/api/geocode?${params}`);
      const data: GeocodeResponse | GeocodeError = await response.json();

      if (!response.ok) {
        setError((data as GeocodeError).error);
        return;
      }

      setResult(data as GeocodeResponse);
    } catch (err) {
      setError('Помилка при отриманні координат');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Геокодування міста</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              Місто *
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Наприклад: Київ"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">
              Країна (опціонально)
            </label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Наприклад: Україна"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            onClick={handleGeocode}
            disabled={isLoading || !city.trim()}
            className="w-full"
          >
            {isLoading ? 'Отримання координат...' : 'Отримати координати'}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <h4 className="font-medium text-green-800 mb-2">Результат:</h4>
              <div className="space-y-1 text-sm text-green-700">
                <p><strong>Широта:</strong> {result.latitude}</p>
                <p><strong>Довгота:</strong> {result.longitude}</p>
                <p><strong>Повна назва:</strong> {result.display_name}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
