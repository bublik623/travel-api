// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Travel Categories
export const TRAVEL_CATEGORIES = {
  SIGHTSEEING: 'sightseeing',
  ADVENTURE: 'adventure',
  CULTURE: 'culture',
  FOOD: 'food',
  RELAXATION: 'relaxation',
} as const;

export const TRAVEL_CATEGORIES_LABELS = {
  [TRAVEL_CATEGORIES.SIGHTSEEING]: 'Sightseeing',
  [TRAVEL_CATEGORIES.ADVENTURE]: 'Adventure',
  [TRAVEL_CATEGORIES.CULTURE]: 'Culture',
  [TRAVEL_CATEGORIES.FOOD]: 'Food & Dining',
  [TRAVEL_CATEGORIES.RELAXATION]: 'Relaxation',
} as const;

// Price Ranges
export const PRICE_RANGES = {
  BUDGET: 'budget',
  MID_RANGE: 'mid-range',
  LUXURY: 'luxury',
} as const;

export const PRICE_RANGES_LABELS = {
  [PRICE_RANGES.BUDGET]: 'Budget',
  [PRICE_RANGES.MID_RANGE]: 'Mid-Range',
  [PRICE_RANGES.LUXURY]: 'Luxury',
} as const;

// Trip Status
export const TRIP_STATUS = {
  PLANNED: 'planned',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const TRIP_STATUS_LABELS = {
  [TRIP_STATUS.PLANNED]: 'Planned',
  [TRIP_STATUS.ACTIVE]: 'Active',
  [TRIP_STATUS.COMPLETED]: 'Completed',
  [TRIP_STATUS.CANCELLED]: 'Cancelled',
} as const;

// Travel Styles
export const TRAVEL_STYLES = {
  ADVENTURE: 'adventure',
  RELAXATION: 'relaxation',
  CULTURE: 'culture',
  LUXURY: 'luxury',
} as const;

export const TRAVEL_STYLES_LABELS = {
  [TRAVEL_STYLES.ADVENTURE]: 'Adventure',
  [TRAVEL_STYLES.RELAXATION]: 'Relaxation',
  [TRAVEL_STYLES.CULTURE]: 'Culture',
  [TRAVEL_STYLES.LUXURY]: 'Luxury',
} as const;

// Group Sizes
export const GROUP_SIZES = {
  SOLO: 'solo',
  COUPLE: 'couple',
  FAMILY: 'family',
  GROUP: 'group',
} as const;

export const GROUP_SIZES_LABELS = {
  [GROUP_SIZES.SOLO]: 'Solo Travel',
  [GROUP_SIZES.COUPLE]: 'Couple',
  [GROUP_SIZES.FAMILY]: 'Family',
  [GROUP_SIZES.GROUP]: 'Group',
} as const;

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
} as const;

// UI Constants
export const UI = {
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  INFINITE_SCROLL_THRESHOLD: 100,
  TOAST_DURATION: 5000,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  SEARCH_HISTORY: 'search_history',
  FAVORITE_DESTINATIONS: 'favorite_destinations',
  CART_ITEMS: 'cart_items',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  EMAIL_INVALID: 'Please enter a valid email address.',
  PASSWORD_WEAK: 'Password must be at least 8 characters long.',
  REQUIRED_FIELD: 'This field is required.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully.',
  TRIP_CREATED: 'Trip created successfully.',
  DESTINATION_SAVED: 'Destination saved to favorites.',
  BOOKING_CONFIRMED: 'Booking confirmed successfully.',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  API: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
} as const;

// Currency
export const CURRENCY = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
} as const;

export const CURRENCY_SYMBOLS = {
  [CURRENCY.USD]: '$',
  [CURRENCY.EUR]: '€',
  [CURRENCY.GBP]: '£',
} as const;
