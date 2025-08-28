'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HotelSearchDemo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<'list' | 'offers' | 'offersByCity'>('list');

  // Hotel List Search Form
  const [listForm, setListForm] = useState({
    cityName: '',
    countryCode: '',
    radius: '5',
    radiusUnit: 'KM' as 'KM' | 'MILE',
    ratings: '',
    amenities: '',
    currency: 'USD',
    bestRateOnly: false
  });

  // Hotel Offers Search Form
  const [offersForm, setOffersForm] = useState({
    hotelIds: '',
    cityCode: '',
    latitude: '',
    longitude: '',
    checkInDate: '',
    checkOutDate: '',
    adults: '1',
    radius: '5',
    radiusUnit: 'KM' as 'KM' | 'MILE',
    currency: 'USD'
  });

  // Hotel Offers by City Form
  const [offersByCityForm, setOffersByCityForm] = useState({
    cityName: '',
    countryCode: '',
    checkInDate: '',
    checkOutDate: '',
    adults: '1',
    radius: '5',
    radiusUnit: 'KM' as 'KM' | 'MILE',
    ratings: '',
    amenities: '',
    currency: 'USD',
    priceRange: '',
    bestRateOnly: false
  });

  // Results
  const [hotelList, setHotelList] = useState<any[]>([]);
  const [hotelOffers, setHotelOffers] = useState<any[]>([]);
  const [hotelOffersByCity, setHotelOffersByCity] = useState<any[]>([]);

  // Hotel List Search
  const searchHotelList = async () => {
    setLoading(true);
    setError(null);
    setHotelList([]);

    try {
      if (!listForm.cityName) {
        throw new Error('City name is required');
      }

      const params = new URLSearchParams();
      params.append('cityName', listForm.cityName);
      params.append('radius', listForm.radius);
      params.append('radiusUnit', listForm.radiusUnit);
      params.append('currency', listForm.currency);
      params.append('bestRateOnly', listForm.bestRateOnly.toString());

      if (listForm.countryCode) {
        params.append('countryCode', listForm.countryCode);
      }

      if (listForm.ratings) {
        params.append('ratings', listForm.ratings);
      }

      if (listForm.amenities) {
        params.append('amenities', listForm.amenities);
      }

      const response = await fetch(`/api/hotels/by-city?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search hotels');
      }

      setHotelList(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Hotel Offers Search
  const searchHotelOffers = async () => {
    setLoading(true);
    setError(null);
    setHotelOffers([]);

    try {
      if (!offersForm.checkInDate || !offersForm.checkOutDate) {
        throw new Error('Check-in and check-out dates are required');
      }

      const params = new URLSearchParams();
      params.append('checkInDate', offersForm.checkInDate);
      params.append('checkOutDate', offersForm.checkOutDate);
      params.append('adults', offersForm.adults);
      params.append('radius', offersForm.radius);
      params.append('radiusUnit', offersForm.radiusUnit);
      params.append('currency', offersForm.currency);

      if (offersForm.hotelIds) {
        params.append('hotelIds', offersForm.hotelIds);
      }

      if (offersForm.cityCode) {
        params.append('cityCode', offersForm.cityCode);
      }

      if (offersForm.latitude && offersForm.longitude) {
        params.append('latitude', offersForm.latitude);
        params.append('longitude', offersForm.longitude);
      }

      const response = await fetch(`/api/hotels/offers?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search hotel offers');
      }

      setHotelOffers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Hotel Offers Search by City
  const searchHotelOffersByCity = async () => {
    setLoading(true);
    setError(null);
    setHotelOffersByCity([]);

    try {
      if (!offersByCityForm.cityName) {
        throw new Error('City name is required');
      }

      if (!offersByCityForm.checkInDate || !offersByCityForm.checkOutDate) {
        throw new Error('Check-in and check-out dates are required');
      }

      const params = new URLSearchParams();
      
      params.append('cityName', offersByCityForm.cityName);
      params.append('checkInDate', offersByCityForm.checkInDate);
      params.append('checkOutDate', offersByCityForm.checkOutDate);
      params.append('adults', offersByCityForm.adults);
      params.append('radius', offersByCityForm.radius);
      params.append('radiusUnit', offersByCityForm.radiusUnit);
      params.append('currency', offersByCityForm.currency);
      params.append('bestRateOnly', offersByCityForm.bestRateOnly.toString());

      if (offersByCityForm.countryCode) {
        params.append('countryCode', offersByCityForm.countryCode);
      }

      if (offersByCityForm.ratings) {
        params.append('ratings', offersByCityForm.ratings);
      }

      if (offersByCityForm.amenities) {
        params.append('amenities', offersByCityForm.amenities);
      }

      if (offersByCityForm.priceRange) {
        params.append('priceRange', offersByCityForm.priceRange);
      }

      const response = await fetch(`/api/hotels/offers/by-city?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search hotel offers by city');
      }

      setHotelOffersByCity(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render hotel info for v3 API
  const renderHotelInfo = (hotel: any) => (
    <div>
      <h3 className="font-semibold text-lg">{hotel?.name || 'Hotel Name Not Available'}</h3>
      <p className="text-sm text-gray-600">
        {hotel?.cityCode || 'City Code Not Available'} • {hotel?.latitude ? `${hotel.latitude.toFixed(4)}, ${hotel.longitude.toFixed(4)}` : 'Location Not Available'}
      </p>
      <p className="text-sm text-gray-600">
        Chain: {hotel?.chainCode || 'N/A'} • ID: {hotel?.hotelId || 'N/A'}
      </p>
    </div>
  );

  // Helper function to render offer info for v3 API
  const renderOfferInfo = (offer: any) => (
    <div key={offer.id || Math.random()} className="bg-gray-50 rounded p-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{offer.room?.description?.text || 'Room description not available'}</p>
          <p className="text-sm text-gray-600">
            {offer.room?.typeEstimated?.category || 'N/A'} • {offer.room?.typeEstimated?.beds || 'N/A'} bed(s)
          </p>
          <p className="text-sm text-gray-600">
            Guests: {offer.guests?.adults || 'N/A'} adult(s)
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">{offer.price?.currency || 'USD'} {offer.price?.total || 'N/A'}</p>
          <p className="text-sm text-gray-600">per night</p>
        </div>
      </div>
      {offer.policies && (
        <div className="mt-2 text-xs text-gray-600">
          <p>Payment: {offer.policies.paymentType || 'N/A'} • Refundable: {offer.policies.refundable?.cancellationRefund || 'N/A'}</p>
          {offer.policies.cancellations && offer.policies.cancellations.length > 0 && (
            <p>Cancellation: {offer.policies.cancellations[0]?.description?.text || 'N/A'}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Hotel Search Demo</h2>
        <p className="text-gray-600">Test the Amadeus Hotel Search and Offers APIs</p>
      </div>

      <Tabs value={searchType} onValueChange={(value: string) => setSearchType(value as 'list' | 'offers' | 'offersByCity')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Hotel List</TabsTrigger>
          <TabsTrigger value="offers">Hotel Offers</TabsTrigger>
          <TabsTrigger value="offersByCity">Offers by City</TabsTrigger>
        </TabsList>

        {/* Hotel List Search Tab */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Hotel List Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="listCityName">City Name *</Label>
                  <Input
                    id="listCityName"
                    placeholder="Paris"
                    value={listForm.cityName}
                    onChange={(e) => setListForm({ ...listForm, cityName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listCountryCode">Country Code</Label>
                  <Input
                    id="listCountryCode"
                    placeholder="FR"
                    value={listForm.countryCode}
                    onChange={(e) => setListForm({ ...listForm, countryCode: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listRadius">Radius</Label>
                  <Input
                    id="listRadius"
                    type="number"
                    placeholder="5"
                    value={listForm.radius}
                    onChange={(e) => setListForm({ ...listForm, radius: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listRadiusUnit">Radius Unit</Label>
                  <Select value={listForm.radiusUnit} onValueChange={(value: string) => setListForm({ ...listForm, radiusUnit: value as 'KM' | 'MILE' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KM">Kilometers</SelectItem>
                      <SelectItem value="MILE">Miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listCurrency">Currency</Label>
                  <Input
                    id="listCurrency"
                    placeholder="USD"
                    value={listForm.currency}
                    onChange={(e) => setListForm({ ...listForm, currency: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listRatings">Ratings (comma-separated)</Label>
                  <Input
                    id="listRatings"
                    placeholder="4,5"
                    value={listForm.ratings}
                    onChange={(e) => setListForm({ ...listForm, ratings: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="listAmenities">Amenities (comma-separated)</Label>
                <Input
                  id="listAmenities"
                  placeholder="SPA,POOL,WIFI"
                  value={listForm.amenities}
                  onChange={(e) => setListForm({ ...listForm, amenities: e.target.value })}
                />
              </div>

              <Button onClick={searchHotelList} disabled={loading} className="w-full">
                {loading ? 'Searching...' : 'Search Hotels'}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {hotelList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Found {hotelList.length} Hotels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotelList.map((hotel) => (
                    <div key={hotel.hotelId} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg">{hotel.name}</h3>
                      <p className="text-sm text-gray-600">
                        {hotel.address?.cityName || 'City Not Available'}, {hotel.address?.countryName || 'Country Not Available'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Rating: {hotel.rating || 'N/A'}/5 • Distance: {hotel.hotelDistance?.distance || 'N/A'} {hotel.hotelDistance?.distanceUnit || 'KM'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Hotel Offers Search Tab */}
        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Offers Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="offersHotelIds">Hotel IDs (comma-separated)</Label>
                  <Input
                    id="offersHotelIds"
                    placeholder="HTNYC001,HTNYC002"
                    value={offersForm.hotelIds}
                    onChange={(e) => setOffersForm({ ...offersForm, hotelIds: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersCityCode">City Code</Label>
                  <Input
                    id="offersCityCode"
                    placeholder="NYC"
                    value={offersForm.cityCode}
                    onChange={(e) => setOffersForm({ ...offersForm, cityCode: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersLatitude">Latitude</Label>
                  <Input
                    id="offersLatitude"
                    type="number"
                    step="any"
                    placeholder="40.7128"
                    value={offersForm.latitude}
                    onChange={(e) => setOffersForm({ ...offersForm, latitude: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersLongitude">Longitude</Label>
                  <Input
                    id="offersLongitude"
                    type="number"
                    step="any"
                    placeholder="-74.0060"
                    value={offersForm.longitude}
                    onChange={(e) => setOffersForm({ ...offersForm, longitude: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersCheckIn">Check-in Date *</Label>
                  <Input
                    id="offersCheckIn"
                    type="date"
                    value={offersForm.checkInDate}
                    onChange={(e) => setOffersForm({ ...offersForm, checkInDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersCheckOut">Check-out Date *</Label>
                  <Input
                    id="offersCheckOut"
                    type="date"
                    value={offersForm.checkOutDate}
                    onChange={(e) => setOffersForm({ ...offersForm, checkOutDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersAdults">Adults</Label>
                  <Input
                    id="offersAdults"
                    type="number"
                    placeholder="1"
                    value={offersForm.adults}
                    onChange={(e) => setOffersForm({ ...offersForm, adults: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersCurrency">Currency</Label>
                  <Input
                    id="offersCurrency"
                    placeholder="USD"
                    value={offersForm.currency}
                    onChange={(e) => setOffersForm({ ...offersForm, currency: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={searchHotelOffers} disabled={loading} className="w-full">
                {loading ? 'Searching...' : 'Search Hotel Offers'}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {hotelOffers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Found {hotelOffers.length} Hotel Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {hotelOffers.map((hotelOffer) => (
                    <div key={hotelOffer.hotel?.hotelId || Math.random()} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        {renderHotelInfo(hotelOffer.hotel)}
                        <div className="text-right">
                          <span className={`inline-block text-xs px-2 py-1 rounded ${
                            hotelOffer.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {hotelOffer.available ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      </div>

                      {hotelOffer.offers && hotelOffer.offers.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium">Available Offers:</h4>
                          {hotelOffer.offers.map(renderOfferInfo)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Hotel Offers by City Tab */}
        <TabsContent value="offersByCity">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Offers Search by City</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="offersByCityName">City Name *</Label>
                  <Input
                    id="offersByCityName"
                    placeholder="Paris"
                    value={offersByCityForm.cityName}
                    onChange={(e) => setOffersByCityForm({ ...offersByCityForm, cityName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersByCityCountryCode">Country Code</Label>
                  <Input
                    id="offersByCityCountryCode"
                    placeholder="FR"
                    value={offersByCityForm.countryCode}
                    onChange={(e) => setOffersByCityForm({ ...offersByCityForm, countryCode: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersByCityCheckIn">Check-in Date *</Label>
                  <Input
                    id="offersByCityCheckIn"
                    type="date"
                    value={offersByCityForm.checkInDate}
                    onChange={(e) => setOffersByCityForm({ ...offersByCityForm, checkInDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersByCityCheckOut">Check-out Date *</Label>
                  <Input
                    id="offersByCityCheckOut"
                    type="date"
                    value={offersByCityForm.checkOutDate}
                    onChange={(e) => setOffersByCityForm({ ...offersByCityForm, checkOutDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersByCityAdults">Adults</Label>
                  <Input
                    id="offersByCityAdults"
                    type="number"
                    placeholder="1"
                    value={offersByCityForm.adults}
                    onChange={(e) => setOffersByCityForm({ ...offersByCityForm, adults: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersByCityRadius">Radius</Label>
                  <Input
                    id="offersByCityRadius"
                    type="number"
                    placeholder="5"
                    value={offersByCityForm.radius}
                    onChange={(e) => setOffersByCityForm({ ...offersByCityForm, radius: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersByCityRadiusUnit">Radius Unit</Label>
                  <Select value={offersByCityForm.radiusUnit} onValueChange={(value: string) => setOffersByCityForm({ ...offersByCityForm, radiusUnit: value as 'KM' | 'MILE' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KM">Kilometers</SelectItem>
                      <SelectItem value="MILE">Miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersByCityCurrency">Currency</Label>
                  <Input
                    id="offersByCityCurrency"
                    placeholder="USD"
                    value={offersByCityForm.currency}
                    onChange={(e) => setOffersByCityForm({ ...offersByCityForm, currency: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersByCityPriceRange">Price Range</Label>
                  <Input
                    id="offersByCityPriceRange"
                    placeholder="100-500"
                    value={offersByCityForm.priceRange}
                    onChange={(e) => setOffersByCityForm({ ...offersByCityForm, priceRange: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offersByCityRatings">Ratings (comma-separated)</Label>
                  <Input
                    id="offersByCityRatings"
                    placeholder="4,5"
                    value={offersByCityForm.ratings}
                    onChange={(e) => setOffersByCityForm({ ...offersByCityForm, ratings: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="offersByCityAmenities">Amenities (comma-separated)</Label>
                <Input
                  id="offersByCityAmenities"
                  placeholder="SPA,POOL,WIFI"
                  value={offersByCityForm.amenities}
                  onChange={(e) => setOffersByCityForm({ ...offersByCityForm, amenities: e.target.value })}
                />
              </div>

              <Button onClick={searchHotelOffersByCity} disabled={loading} className="w-full">
                {loading ? 'Searching...' : 'Search Hotel Offers by City'}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {hotelOffersByCity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Found {hotelOffersByCity.length} Hotel Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {hotelOffersByCity.map((hotelOffer) => (
                    <div key={hotelOffer.hotel?.hotelId || Math.random()} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        {renderHotelInfo(hotelOffer.hotel)}
                        <div className="text-right">
                          <span className={`inline-block text-xs px-2 py-1 rounded ${
                            hotelOffer.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {hotelOffer.available ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      </div>

                      {hotelOffer.offers && hotelOffer.offers.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium">Available Offers:</h4>
                          {hotelOffer.offers.map(renderOfferInfo)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
