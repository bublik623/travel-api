# Travel API

A modern travel application built with Next.js 14, TypeScript, and Tailwind CSS, featuring the App Router and following best practices for performance and developer experience.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **UI Components**: Shadcn UI components with Radix UI primitives
- **Type Safety**: Comprehensive TypeScript interfaces and type checking
- **Performance**: Optimized for Core Web Vitals with Server Components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **API Routes**: RESTful API endpoints with proper error handling
- **Geocoding**: City to coordinates conversion using OpenStreetMap Nominatim API
- **Airport Search**: Find airports within radius using Amadeus API with automatic geocoding
- **Best Practices**: Following Next.js and React best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Icons**: Lucide React
- **State Management**: React hooks + Local Storage
- **URL State**: nuqs for search parameters
- **Geocoding**: Direct OpenStreetMap Nominatim API integration
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── airports/      # Airport search endpoint
│   │   ├── destinations/  # Destination endpoints
│   │   ├── geocode/       # Geocoding endpoint
│   │   ├── status/        # Service status endpoint
│   │   ├── trips/         # Trip endpoints
│   │   └── users/         # User endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── services/             # Autonomous services
│   ├── geocoding.service.ts      # Geocoding service
│   ├── amadeus.service.ts        # Amadeus API service
│   ├── airport-search.service.ts # Combined airport search
│   └── __tests__/        # Service tests
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── constants/            # Application constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📚 API Documentation

### Geocoding

#### GET /api/geocode
Convert city names to coordinates using OpenStreetMap Nominatim API.

**Query Parameters:**
- `city` (required): City name
- `country` (optional): Country name for more precise results

**Response:**
```json
{
  "latitude": 48.8566,
  "longitude": 2.3522,
  "display_name": "Paris, Île-de-France, France"
}
```

### Airport Search

#### GET /api/airports
Search for airports within a specified radius using Amadeus API. Automatically converts city names to coordinates using OpenStreetMap geocoding.

**Query Parameters:**
- `city` (required): City name
- `country` (optional): Country name for more precise geocoding
- `zipcode` (optional): Postal code for more precise geocoding
- `radius` (optional): Search radius in kilometers (default: 100)

**Example Request:**
```
GET /api/airports?city=New York&country=United States&radius=100
```

**Response:**
```json
{
  "data": [
    {
      "type": "location",
      "subType": "airport",
      "name": "John F. Kennedy International Airport",
      "iataCode": "JFK",
      "geoCode": {
        "latitude": 40.6413,
        "longitude": -73.7781
      },
      "address": {
        "cityName": "New York",
        "countryName": "United States"
      },
      "distance": {
        "value": 25.2,
        "unit": "KM"
      }
    }
  ],
  "meta": {
    "count": 1
  }
}
```

**Note:** Requires Amadeus API credentials. See [AMADEUS_SETUP.md](./AMADEUS_SETUP.md) for setup instructions.

### Service Status

#### GET /api/status
Check the availability of different services.

**Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "geocoding": true,
    "amadeus": false,
    "fullSearch": false
  },
  "version": "1.0.0"
}
```

### Destinations

#### GET /api/destinations
Fetch destinations with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term
- `country` (string): Filter by country
- `priceRange` (string): Filter by price range

**Response:**
```json
{
  "data": [...],
  "message": "Destinations retrieved successfully",
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### POST /api/destinations
Create a new destination.

**Request Body:**
```json
{
  "name": "Paris",
  "country": "France",
  "city": "Paris",
  "description": "The City of Light...",
  "imageUrl": "/images/paris.jpg",
  "rating": 4.8,
  "priceRange": "mid-range",
  "tags": ["culture", "romance"],
  "coordinates": {
    "latitude": 48.8566,
    "longitude": 2.3522
  }
}
```

## 🎨 Component Library

### Button Component
```tsx
import { Button } from '@/components/ui/button';

<Button variant="primary" size="lg">
  Get Started
</Button>
```

### Card Component
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Destination</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Tailwind CSS

The project uses Tailwind CSS v4 with custom configuration. See `tailwind.config.ts` for details.

### TypeScript

Strict TypeScript configuration with comprehensive type definitions in `src/types/`.

## 📱 Responsive Design

The application follows a mobile-first approach with responsive breakpoints:

- **Mobile**: Default styles
- **Tablet**: `md:` prefix (768px+)
- **Desktop**: `lg:` prefix (1024px+)
- **Large Desktop**: `xl:` prefix (1280px+)

## 🏗️ Service Architecture

The application uses a modular service architecture with autonomous services:

### **GeocodingService**
- **Purpose**: Converts city names to coordinates using OpenStreetMap Nominatim API
- **Features**: 
  - City, country, and postal code support
  - Coordinate validation
  - Error handling and retry logic
- **Usage**: Can be used independently or as part of other services

### **AmadeusService**
- **Purpose**: Handles Amadeus API authentication and airport search
- **Features**:
  - OAuth2 token management with automatic refresh
  - Airport search within radius
  - Credential validation
  - Rate limiting and error handling
- **Usage**: Requires Amadeus API credentials

### **AirportSearchService**
- **Purpose**: Orchestrates geocoding and airport search
- **Features**:
  - Combines geocoding and Amadeus services
  - Fallback to geocoding-only when Amadeus unavailable
  - Service status monitoring
  - Unified error handling
- **Usage**: Main service for airport search functionality

### **Benefits**
- **Modularity**: Each service can be used independently
- **Testability**: Services can be unit tested in isolation
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new services or modify existing ones
- **Reusability**: Services can be used across different endpoints

## 🚀 Performance Optimizations

- **Server Components**: Maximized use of React Server Components
- **Image Optimization**: Next.js Image component with WebP format
- **Code Splitting**: Automatic code splitting with dynamic imports
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: Optimized caching strategies
- **Service Caching**: Token caching in AmadeusService

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Changelog

### v1.0.0
- Initial release
- Next.js 14 with App Router
- TypeScript support
- Shadcn UI components
- API routes for destinations
- Responsive design
- Performance optimizations
