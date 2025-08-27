// Common API response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Travel-related types
export interface Destination {
  id: string;
  name: string;
  country: string;
  city: string;
  description: string;
  imageUrl: string;
  rating: number;
  priceRange: 'budget' | 'mid-range' | 'luxury';
  tags: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  destination: Destination;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  participants: number;
  activities: Activity[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  type: 'sightseeing' | 'adventure' | 'culture' | 'food' | 'relaxation';
  duration: number; // in hours
  price: number;
  location: string;
  rating: number;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  trips: Trip[];
}

export interface UserPreferences {
  budgetRange: {
    min: number;
    max: number;
  };
  preferredActivities: string[];
  travelStyle: 'adventure' | 'relaxation' | 'culture' | 'luxury';
  groupSize: 'solo' | 'couple' | 'family' | 'group';
}

// Form types
export interface SearchFilters {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: {
    min: number;
    max: number;
  };
  activities?: string[];
  groupSize?: number;
}

// Component prop types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Geocoding types
export interface GeocodeRequest {
  city: string;
  country?: string;
}

export interface GeocodeResponse {
  latitude: number;
  longitude: number;
  display_name: string;
}

export interface GeocodeError {
  error: string;
}

// Airport search types
export interface AirportSearchRequest {
  city: string;
  country?: string;
  zipcode?: string;
  radius?: number; // in kilometers, defaults to 100
}

export interface Airport {
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

export interface AirportSearchResponse {
  data: Airport[];
  meta: {
    count: number;
    links: {
      self: string;
    };
  };
}

export interface AirportSearchError {
  error: string;
  details?: string;
}
