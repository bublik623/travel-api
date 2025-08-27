# Amadeus API Setup Guide

This guide explains how to set up the Amadeus API credentials for the airport search functionality.

## Prerequisites

1. Create an account on the [Amadeus for Developers](https://developers.amadeus.com/) platform
2. Verify your email address
3. Complete the developer registration process

## Getting API Credentials

1. **Log in to Amadeus for Developers**
   - Visit [https://developers.amadeus.com/](https://developers.amadeus.com/)
   - Sign in with your account

2. **Create a New Application**
   - Go to "My Apps" in your dashboard
   - Click "Create New App"
   - Fill in the application details:
     - App Name: `TravelAPI Airport Search`
     - Description: `Airport search functionality for travel planning`
     - Category: Select "Travel"
     - Website: Your website URL (optional)

3. **Get Your Credentials**
   - After creating the app, you'll receive:
     - **API Key (Client ID)**
     - **API Secret (Client Secret)**
   - These credentials are used for authentication

## Environment Variables Setup

Create a `.env.local` file in your project root and add the following variables:

```env
AMADEUS_CLIENT_ID=your_api_key_here
AMADEUS_CLIENT_SECRET=your_api_secret_here
```

## API Endpoints

### Airport Search Endpoint

**URL:** `GET /api/airports`

**Parameters:**
- `city` (required): City name
- `country` (optional): Country name for more precise geocoding
- `zipcode` (optional): Postal code for more precise geocoding
- `radius` (optional): Search radius in kilometers (default: 100)

**Example Request:**
```
GET /api/airports?city=New York&country=United States&radius=100
```

**Example Response:**
```json
{
  "data": [
    {
      "type": "location",
      "subType": "airport",
      "name": "John F. Kennedy International Airport",
      "detailedName": "John F. Kennedy International Airport",
      "id": "JFK",
      "iataCode": "JFK",
      "geoCode": {
        "latitude": 40.6413,
        "longitude": -73.7781
      },
      "address": {
        "cityCode": "NYC",
        "cityName": "New York",
        "countryName": "United States",
        "countryCode": "US"
      },
      "distance": {
        "value": 25.2,
        "unit": "KM"
      },
      "analytics": {
        "travelers": {
          "score": 85
        }
      }
    }
  ],
  "meta": {
    "count": 1,
    "links": {
      "self": "https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=40.7128&longitude=-74.0060&radius=100"
    }
  }
}
```

## Testing the API

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit the demo page:**
   - Go to `http://localhost:3000`
   - Scroll down to the "Пошук аеропортів" section
   - Enter city name or use "Use Current Location"
   - Click "Search Airports"

3. **Test geocoding (works without Amadeus credentials):**
   ```bash
   curl "http://localhost:3000/api/geocode?city=New%20York&country=United%20States"
   ```

4. **Test airport search (requires Amadeus credentials):**
   ```bash
   curl "http://localhost:3000/api/airports?city=New%20York&country=United%20States&radius=100"
   ```

## API Limits

- **Test Environment:** 1000 calls per month
- **Production Environment:** Higher limits available after approval
- **Rate Limiting:** 10 calls per second

## Troubleshooting

### Common Issues

1. **"Airport search service not available"**
   - Check that environment variables are set correctly
   - Verify the `.env.local` file exists in the project root

2. **"Failed to authenticate with airport search service"**
   - Verify your API credentials are correct
   - Check that your Amadeus account is active
   - Ensure you're using the test environment credentials

3. **"Failed to fetch airport data"**
   - Check your internet connection
   - Verify the coordinates are valid
   - Check if you've exceeded API limits

### Support

- [Amadeus API Documentation](https://developers.amadeus.com/self-service/category/flights/api-doc/airport-nearest-relevant)
- [Amadeus Developer Support](https://developers.amadeus.com/support)

## Security Notes

- Never commit your API credentials to version control
- Use environment variables for all sensitive data
- Consider using a secrets management service for production deployments
- Regularly rotate your API credentials
