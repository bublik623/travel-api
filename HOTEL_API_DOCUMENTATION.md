# Hotel Search API Documentation

This document describes the hotel search functionality implemented using the Amadeus Hotel Search API.

## Overview

The hotel search API provides two main functionalities:
1. **Hotel List Search** - Find hotels by location (city or coordinates)
2. **Hotel Offers Search** - Find hotel offers with pricing and availability

## API Endpoints

### 1. Hotel List Search

**Endpoint:** `GET /api/hotels`

Search for hotels by city code or coordinates.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cityCode` | string | No* | City code (e.g., "NYC", "PAR") |
| `latitude` | number | No* | Latitude coordinate |
| `longitude` | number | No* | Longitude coordinate |
| `radius` | number | No | Search radius (default: 5) |
| `radiusUnit` | string | No | Unit for radius: "KM" or "MILE" (default: "KM") |
| `chainCodes` | string | No | Comma-separated hotel chain codes |
| `amenities` | string | No | Comma-separated amenities (e.g., "SPA,POOL,WIFI") |
| `ratings` | string | No | Comma-separated ratings (1-5) |
| `hotelSource` | string | No | Hotel source: "ALL", "BEST_UNRATED", "VIRTUOSO", "EXPEDIA", "AMADEUS" |
| `checkInDate` | string | No | Check-in date (YYYY-MM-DD) |
| `checkOutDate` | string | No | Check-out date (YYYY-MM-DD) |
| `currency` | string | No | Currency code (default: "USD") |
| `bestRateOnly` | boolean | No | Return only best rates (default: false) |
| `view` | string | No | View type: "FULL", "LIGHT", "LONG" (default: "FULL") |
| `limit` | number | No | Number of results to return |
| `offset` | number | No | Number of results to skip |

*Either `cityCode` or both `latitude` and `longitude` are required.

#### Example Request

```bash
# Search by city code
GET /api/hotels?cityCode=NYC&radius=10&amenities=SPA,POOL

# Search by coordinates
GET /api/hotels?latitude=40.7128&longitude=-74.0060&radius=5&currency=EUR
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "type": "hotel",
      "hotelId": "HTNYC001",
      "chainCode": "HI",
      "dupeId": "12345",
      "name": "Hilton New York",
      "rating": 4,
      "cityCode": "NYC",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "hotelDistance": {
        "distance": 0.5,
        "distanceUnit": "KM"
      },
      "address": {
        "lines": ["123 Main St"],
        "postalCode": "10001",
        "cityName": "New York",
        "countryCode": "US",
        "countryName": "United States"
      },
      "contact": {
        "phone": "+1-555-123-4567"
      },
      "amenities": ["SPA", "POOL", "WIFI", "GYM"],
      "media": [
        {
          "uri": "https://example.com/hotel-image.jpg",
          "category": "EXTERIOR"
        }
      ],
      "available": true
    }
  ],
  "meta": {
    "count": 1,
    "links": {
      "self": "https://api.example.com/hotels"
    }
  },
  "message": "Found 1 hotels"
}
```

### 2. Hotel Offers Search

**Endpoint:** `GET /api/hotels/offers`

Search for hotel offers with pricing and availability using Amadeus v3 API.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hotelIds` | string | No* | Comma-separated hotel IDs |
| `cityCode` | string | No* | City code |
| `latitude` | number | No* | Latitude coordinate |
| `longitude` | number | No* | Longitude coordinate |
| `checkInDate` | string | No | Check-in date (YYYY-MM-DD) |
| `checkOutDate` | string | No | Check-out date (YYYY-MM-DD) |
| `roomQuantity` | number | No | Number of rooms (default: 1) |
| `radius` | number | No | Search radius (default: 5) |
| `radiusUnit` | string | No | Unit for radius: "KM" or "MILE" (default: "KM") |
| `adults` | number | No | Number of adults (default: 1) |
| `currency` | string | No | Currency code (default: "USD") |

*Either `hotelIds`, `cityCode`, or both `latitude` and `longitude` are required.

**Note:** This endpoint uses Amadeus v3 API which has a simplified parameter structure compared to v1.

#### Example Request

```bash
# Search by hotel IDs
GET /api/hotels/offers?hotelIds=HTNYC001,HTNYC002&adults=2&checkInDate=2024-06-01&checkOutDate=2024-06-05

# Search by city code
GET /api/hotels/offers?cityCode=NYC&adults=1&checkInDate=2024-06-01&checkOutDate=2024-06-05

# Search by coordinates
GET /api/hotels/offers?latitude=40.7128&longitude=-74.0060&radius=5&radiusUnit=KM&adults=2
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "type": "hotel-offers",
      "hotel": {
        "type": "hotel",
        "hotelId": "HTNYC001",
        "name": "Hilton New York",
        "rating": 4,
        "address": {
          "cityName": "New York",
          "countryName": "United States"
        },
        "hotelDistance": {
          "distance": 0.5,
          "distanceUnit": "KM"
        }
      },
      "available": true,
      "offers": [
        {
          "id": "OFFER001",
          "checkInDate": "2024-06-01",
          "checkOutDate": "2024-06-05",
          "rateCode": "RACK",
          "rateFamilyEstimated": {
            "code": "STANDARD",
            "type": "P"
          },
          "room": {
            "type": "STANDARD",
            "typeEstimated": {
              "category": "STANDARD_ROOM",
              "beds": 1,
              "bedType": "KING"
            },
            "description": {
              "text": "Standard King Room",
              "lang": "en"
            }
          },
          "guests": {
            "adults": 2
          },
          "price": {
            "currency": "USD",
            "base": "200.00",
            "total": "800.00",
            "variations": {
              "average": {
                "base": "200.00"
              }
            }
          },
          "policies": {
            "cancellation": {
              "amount": "0.00",
              "deadline": "2024-05-31T18:00:00"
            }
          }
        }
      ]
    }
  ],
  "meta": {
    "count": 1,
    "links": {
      "self": "https://api.example.com/hotels/offers"
    }
  },
  "message": "Found 1 hotel offers"
}
```

### 3. Hotel Search by City Name

**Endpoint:** `GET /api/hotels/by-city`

Search for hotels by city name (automatically converts to coordinates using geocoding).

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cityName` | string | Yes | City name (e.g., "New York", "Paris") |
| `countryCode` | string | No | Country code (e.g., "US", "FR") |
| `radius` | number | No | Search radius (default: 5) |
| `radiusUnit` | string | No | Unit for radius: "KM" or "MILE" (default: "KM") |
| `chainCodes` | string | No | Comma-separated hotel chain codes |
| `amenities` | string | No | Comma-separated amenities |
| `ratings` | string | No | Comma-separated ratings (1-5) |
| `hotelSource` | string | No | Hotel source |
| `checkInDate` | string | No | Check-in date (YYYY-MM-DD) |
| `checkOutDate` | string | No | Check-out date (YYYY-MM-DD) |
| `currency` | string | No | Currency code (default: "USD") |
| `bestRateOnly` | boolean | No | Return only best rates (default: false) |
| `view` | string | No | View type (default: "FULL") |
| `limit` | number | No | Number of results to return |
| `offset` | number | No | Number of results to skip |

#### Example Request

```bash
GET /api/hotels/by-city?cityName=New York&countryCode=US&radius=10&amenities=SPA,POOL
```

### 4. Hotel Offers Search by City Name

**Endpoint:** `GET /api/hotels/offers/by-city`

Search for hotel offers by city name (first finds hotels, then gets offers for those hotels).

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cityName` | string | Yes | City name (e.g., "New York", "Paris") |
| `countryCode` | string | No | Country code (e.g., "US", "FR") |
| `checkInDate` | string | Yes | Check-in date (YYYY-MM-DD) |
| `checkOutDate` | string | Yes | Check-out date (YYYY-MM-DD) |
| `adults` | number | No | Number of adults (default: 1, max: 9) |
| `radius` | number | No | Search radius for hotels (default: 5) |
| `radiusUnit` | string | No | Unit for radius: "KM" or "MILE" (default: "KM") |
| `chainCodes` | string | No | Comma-separated hotel chain codes |
| `amenities` | string | No | Comma-separated amenities |
| `ratings` | string | No | Comma-separated ratings (1-5) |
| `hotelSource` | string | No | Hotel source |
| `priceRange` | string | No | Price range (e.g., "100-500") |
| `currency` | string | No | Currency code (default: "USD") |
| `paymentPolicy` | string | No | Payment policy |
| `boardType` | string | No | Board type |
| `includedCheckedBagsOnly` | boolean | No | Include checked bags only (default: false) |
| `bestRateOnly` | boolean | No | Return only best rates (default: false) |
| `view` | string | No | View type (default: "FULL") |
| `limit` | number | No | Number of results to return |
| `offset` | number | No | Number of results to skip |

#### Example Request

```bash
GET /api/hotels/offers/by-city?cityName=New York&checkInDate=2024-06-01&checkOutDate=2024-06-05&adults=2&priceRange=100-300
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "type": "hotel-offers",
      "hotel": {
        "type": "hotel",
        "hotelId": "HTNYC001",
        "name": "Hilton New York",
        "rating": 4,
        "address": {
          "cityName": "New York",
          "countryName": "United States"
        },
        "hotelDistance": {
          "distance": 0.5,
          "distanceUnit": "KM"
        }
      },
      "available": true,
      "offers": [
        {
          "id": "OFFER001",
          "checkInDate": "2024-06-01",
          "checkOutDate": "2024-06-05",
          "rateCode": "RACK",
          "rateFamilyEstimated": {
            "code": "STANDARD",
            "type": "P"
          },
          "room": {
            "type": "STANDARD",
            "typeEstimated": {
              "category": "STANDARD_ROOM",
              "beds": 1,
              "bedType": "KING"
            },
            "description": {
              "text": "Standard King Room",
              "lang": "en"
            }
          },
          "guests": {
            "adults": 2
          },
          "price": {
            "currency": "USD",
            "base": "200.00",
            "total": "800.00",
            "variations": {
              "average": {
                "base": "200.00"
              }
            }
          },
          "policies": {
            "cancellation": {
              "amount": "0.00",
              "deadline": "2024-05-31T18:00:00"
            }
          }
        }
      ]
    }
  ],
  "meta": {
    "count": 1,
    "links": {
      "self": "https://api.example.com/hotels/offers/by-city"
    }
  },
  "message": "Found 1 hotel offers in New York"
}
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cityName` | string | Yes | City name (e.g., "New York", "Paris") |
| `countryCode` | string | No | Country code (e.g., "US", "FR") |
| `radius` | number | No | Search radius (default: 5) |
| `radiusUnit` | string | No | Unit for radius: "KM" or "MILE" (default: "KM") |
| `chainCodes` | string | No | Comma-separated hotel chain codes |
| `amenities` | string | No | Comma-separated amenities |
| `ratings` | string | No | Comma-separated ratings (1-5) |
| `hotelSource` | string | No | Hotel source |
| `checkInDate` | string | No | Check-in date (YYYY-MM-DD) |
| `checkOutDate` | string | No | Check-out date (YYYY-MM-DD) |
| `currency` | string | No | Currency code (default: "USD") |
| `bestRateOnly` | boolean | No | Return only best rates (default: false) |
| `view` | string | No | View type (default: "FULL") |
| `limit` | number | No | Number of results to return |
| `offset` | number | No | Number of results to skip |

#### Example Request

```bash
GET /api/hotels/by-city?cityName=New York&countryCode=US&radius=10&amenities=SPA,POOL
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (city not found)
- `502` - Bad Gateway (Amadeus API error)
- `503` - Service Unavailable (API credentials not configured)
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse. Please respect reasonable usage limits.

## Authentication

The API uses Amadeus API credentials configured via environment variables:
- `AMADEUS_CLIENT_ID`
- `AMADEUS_CLIENT_SECRET`

## Demo Component

A demo component is available at `/components/hotel-search-demo.tsx` that showcases both hotel list and hotel offers search functionality with a user-friendly interface.

## Implementation Notes

1. **Geocoding**: City name searches use OpenStreetMap's Nominatim service for geocoding
2. **Result Limiting**: Results are limited to 10 hotels for performance
3. **Caching**: Access tokens are cached for 1 hour to reduce API calls
4. **Validation**: All parameters are validated before making API calls
5. **Error Handling**: Comprehensive error handling for various failure scenarios

## Related Files

- `src/services/amadeus.service.ts` - Main service implementation
- `src/app/api/hotels/route.ts` - Hotel list search endpoint
- `src/app/api/hotels/offers/route.ts` - Hotel offers search endpoint
- `src/app/api/hotels/by-city/route.ts` - City name search endpoint
- `src/app/api/hotels/offers/by-city/route.ts` - Hotel offers search by city endpoint
- `src/components/hotel-search-demo.tsx` - Demo component
