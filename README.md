# React Google Places Autocomplete Hook

A lightweight React hook for Google Places Autocomplete API that provides a simple way to implement location search functionality in your React applications.

[![npm version](https://img.shields.io/npm/v/places-autocomplete-hook.svg)](https://www.npmjs.com/package/places-autocomplete-hook)

[![bundle size](https://img.shields.io/bundlephobia/min/places-autocomplete-hook)](https://bundlephobia.com/package/places-autocomplete-hook)

> This package is a wrapper around the [Google Places Autocomplete API](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete). Make sure you have a valid Google Places API key with the Places API enabled in your Google Cloud Console.

[![Try Demo](https://img.shields.io/badge/Try%20Demo-Live%20Preview-blue?style=for-the-badge&logo=react)](https://autocomplete.gstrobl.at)

## Features

- 🔍 Real-time address suggestions as you type
- 🎯 Support for location biasing
- 🌍 Multi-language support
- ⚡ Debounced search to prevent excessive API calls
- 🔒 Session token support for billing optimization
- 📍 Detailed place information retrieval with formattedAddress
- 🎨 Fully customizable UI (bring your own components)
- 🧪 Fully tested with Vitest

## Installation

```bash
npm install places-autocomplete-hook
# or
yarn add places-autocomplete-hook
```

## Quick Start

```tsx
import { usePlacesAutocomplete } from 'places-autocomplete-hook';

function AddressInput() {
  const {
    value,
    suggestions,
    setValue,
    clearSuggestions,
    loading,
    error,
    getPlaceDetails,
    handlePlaceSelect,
  } = usePlacesAutocomplete({
    apiKey: 'YOUR_GOOGLE_PLACES_API_KEY',
  });

  const handleSelect = async (placeId: string) => {
    await handlePlaceSelect(placeId);
    const details = await getPlaceDetails(placeId);
    console.log('Selected place:', details.formattedAddress);
  };

  return (
    <div>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Enter an address"
      />
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {suggestions.status === 'OK' && (
        <ul>
          {suggestions.data.map(prediction => (
            <li key={prediction.placeId} onClick={() => handleSelect(prediction.placeId)}>
              {prediction.structuredFormat?.mainText?.text},{' '}
              {prediction.structuredFormat?.secondaryText?.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## API Reference

### Hook Options

```typescript
interface UsePlacesAutocompleteOptions {
  /** Your Google Places API key */
  apiKey: string;
  /** Debounce time in milliseconds (default: 300) */
  debounceMs?: number;
  /** Language code for results (default: 'en') */
  language?: string;
  /** Primary place types to include (Google Places API v1) */
  includedPrimaryTypes?: string[];
  /** Region codes to restrict results to (ISO 3166-1 alpha-2 country codes) */
  includedRegionCodes?: string[];
  /** Session token for billing optimization */
  sessionToken?: string;
  /** Location bias for more relevant results */
  location?: {
    lat: number;
    lng: number;
    radius?: number;
  };
  /** Callback that is called when a place is selected, providing the place ID */
  setSelectedPlace?: (placeId: string) => void;
}
```

### Hook Return Value

```typescript
interface UsePlacesAutocompleteResult {
  /** Current input value */
  value: string;
  /** Suggestions state and data */
  suggestions: {
    status: 'OK' | 'ZERO_RESULTS' | 'ERROR' | 'LOADING';
    data: PlacePrediction[];
  };
  /** Function to update the input value */
  setValue: (value: string, shouldFetchData?: boolean) => void;
  /** Function to clear suggestions */
  clearSuggestions: () => void;
  /** Function to manually trigger a search */
  search: (input: string) => Promise<void>;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Function to get detailed place information */
  getPlaceDetails: (placeId: string, fields?: string[]) => Promise<PlaceDetails>;
  /** Function to handle place selection */
  handlePlaceSelect: (placeId: string) => Promise<void>;
}
```

### Types

```typescript
interface PlacePrediction {
  place: string;
  placeId: string;
  text: {
    text: string;
    matches: Array<{
      endOffset: number;
    }>;
  };
  structuredFormat: {
    mainText: {
      text: string;
      matches: Array<{
        endOffset: number;
      }>;
    };
    secondaryText: {
      text: string;
    };
  };
  types: string[];
}

interface PlaceDetails {
  placeId: string;
  formattedAddress: string;
  addressComponents: AddressComponent[];
  location: {
    latitude: number;
    longitude: number;
  };
  streetNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}
```

## Advanced Usage

### Location Biasing

```tsx
const { value, suggestions, setValue } = usePlacesAutocomplete({
  apiKey: 'YOUR_API_KEY',
  location: {
    lat: 37.7749,
    lng: -122.4194,
    radius: 50000, // 50km radius
  },
});
```

### Included Primary Types

```tsx
const { value, suggestions, setValue } = usePlacesAutocomplete({
  apiKey: 'YOUR_API_KEY',
  // Restrict to specific primary place types (Places API v1)
  includedPrimaryTypes: ['locality', 'sublocality'],
});
```

#### Available Primary Types

The `includedPrimaryTypes` parameter (Places API v1) accepts an array of primary place types:

- **`'locality'`** - Cites, Countries
- **`'administrative_area_level_3'`** - Third-level administrative areas
- **`'administrative_area_level_4'`** - Fourth-level administrative areas
- **`'administrative_area_level_5'`** - Fifth-level administrative areas
- **`'administrative_area_level_6'`** - Sixth-level administrative areas
- **`'administrative_area_level_7'`** - Seventh-level administrative areas
- **`'archipelago'`** - Groups of islands
- **`'colloquial_area'`** - Colloquial or informal areas
- **`'continent'`** - Continental regions
- **`'establishment'`** - Businesses and establishments
- **`'finance'`** - Financial institutions
- **`'food'`** - Food-related establishments
- **`'general_contractor'`** - General contracting services
- **`'geocode'`** - Geocoding results
- **`'health'`** - Health-related establishments
- **`'intersection'`** - Street intersections
- **`'landmark'`** - Notable landmarks
- **`'natural_feature'`** - Natural geographical features
- **`'neighborhood'`** - Neighborhoods and districts
- **`'place_of_worship'`** - Religious buildings
- **`'plus_code'`** - Plus codes for locations
- **`'point_of_interest'`** - Points of interest
- **`'political'`** - Political boundaries
- **`'postal_code_prefix'`** - Postal code prefixes
- **`'postal_code_suffix'`** - Postal code suffixes
- **`'postal_town'`** - Postal towns
- **`'premise'`** - Named locations
- **`'route'`** - Streets, roads, etc.
- **`'street_address'`** - Specific street addresses
- **`'sublocality'`** - Districts, neighborhoods, etc.
- **`'sublocality_level_1'`** - First-level sublocalities
- **`'sublocality_level_2'`** - Second-level sublocalities
- **`'sublocality_level_3'`** - Third-level sublocalities
- **`'sublocality_level_4'`** - Fourth-level sublocalities
- **`'sublocality_level_5'`** - Fifth-level sublocalities
- **`'subpremise'`** - Unit numbers, apartment numbers, etc.
- **`'town_square'`** - Town squares and plazas

### Region Code Restrictions

```tsx
const { value, suggestions, setValue } = usePlacesAutocomplete({
  apiKey: 'YOUR_API_KEY',
  // Restrict results to specific countries/regions
  includedRegionCodes: ['US', 'CA'], // North America only
});
```

#### Available Region Codes

The `includedRegionCodes` parameter accepts an array of ISO 3166-1 alpha-2 country codes:

- **`'US'`** - United States
- **`'CA'`** - Canada
- **`'GB'`** - United Kingdom
- **`'DE'`** - Germany
- **`'FR'`** - France
- **`'AU'`** - Australia
- **`'JP'`** - Japan
- **`'IN'`** - India
- **`'BR'`** - Brazil
- **`'MX'`** - Mexico
- **`'ES'`** - Spain
- **`'IT'`** - Italy
- **`'NL'`** - Netherlands
- **`'SE'`** - Sweden
- **`'NO'`** - Norway
- **`'DK'`** - Denmark
- **`'FI'`** - Finland
- **`'CH'`** - Switzerland
- **`'AT'`** - Austria
- **`'BE'`** - Belgium

#### Common Use Cases

- **Single country**: `['US']` - Restrict to United States only
- **Multiple countries**: `['US', 'CA']` - North America
- **European Union**: `['DE', 'FR', 'IT', 'ES', 'NL']` - Major EU countries
- **German-speaking regions**: `['DE', 'AT', 'CH']` - Germany, Austria, Switzerland
- **Nordic countries**: `['SE', 'NO', 'DK', 'FI']` - Scandinavia and Finland

### Session Token for Billing Optimization

```tsx
const { value, suggestions, setValue } = usePlacesAutocomplete({
  apiKey: 'YOUR_API_KEY',
  sessionToken: 'YOUR_SESSION_TOKEN',
});
```

### Getting Place Details with formattedAddress

```tsx
const { getPlaceDetails, handlePlaceSelect } = usePlacesAutocomplete({
  apiKey: 'YOUR_API_KEY',
});

const handleSelect = async (placeId: string) => {
  await handlePlaceSelect(placeId);
  const details = await getPlaceDetails(placeId);

  console.log('Full address:', details.formattedAddress);
  console.log('City:', details.city);
  console.log('State:', details.state);
  console.log('Country:', details.country);
  console.log('Coordinates:', details.location);
};
```

### Custom Fields for Place Details

You can specify which fields to retrieve when getting place details:

```tsx
const details = await getPlaceDetails(placeId, [
  'formattedAddress',
  'addressComponents',
  'location',
  'displayName',
  'photos',
  'rating',
  'userRatingCount',
  'priceLevel',
  'types',
  'websiteUri',
  'phoneNumbers',
  'businessStatus',
  'openingHours',
  'delivery',
  'dineIn',
  'takeout',
  'reservable',
  'servesBeer',
  'outdoorSeating',
  'liveMusic',
  'menuForChildren',
  'servesCocktails',
  'servesDessert',
  'servesCoffee',
  'goodForChildren',
  'allowsDogs',
  'restroom',
  'parking',
  'paymentOptions',
  'accessibilityOptions',
  'atmosphere',
  'crowd',
  'childrenFriendly',
  'touristFriendly',
  'upscale',
  'casual',
  'trendy',
  'romantic',
  'intimate',
  'classy',
  'hipster',
  'divey',
  'touristy',
  'local',
  'familyFriendly',
  'groups',
]);
```

### Retrieve all fields from Place Details

#### This should not be used in production since it will cost a lot.
You can use `*` wildcard to retrieve all available fields when getting place details:

```tsx
const details = await getPlaceDetails(placeId, ['*']);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT [Seatsmatch GmbH](https://seatsmatch.com)
