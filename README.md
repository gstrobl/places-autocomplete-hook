# React Google Places Autocomplete Hook

A lightweight React hook for Google Places Autocomplete API that provides a simple way to implement location search functionality in your React applications.

[![npm version](https://img.shields.io/npm/v/places-autocomplete-hook.svg)](https://www.npmjs.com/package/places-autocomplete-hook)

[![bundle size](https://img.shields.io/bundlephobia/min/places-autocomplete-hook)](https://bundlephobia.com/package/places-autocomplete-hook)

> This package is a wrapper around the [Google Places Autocomplete API](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete). Make sure you have a valid Google Places API key with the Places API enabled in your Google Cloud Console.

## Features

- 🔍 Real-time address suggestions as you type
- 🎯 Support for location biasing
- 🌍 Multi-language support
- ⚡ Debounced search to prevent excessive API calls
- 🔒 Session token support for billing optimization
- 📍 Detailed place information retrieval
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
            <li key={prediction.placeId} onClick={() => handlePlaceSelect(prediction.placeId)}>
              {prediction.structuredFormat.mainText.text},{' '}
              {prediction.structuredFormat.secondaryText.text}
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
  /** Types of places to search for */
  types?: string[];
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
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails>;
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

### Custom Types

```tsx
const { value, suggestions, setValue } = usePlacesAutocomplete({
  apiKey: 'YOUR_API_KEY',
  types: ['address', 'establishment'],
});
```

### Session Token for Billing Optimization

```tsx
const { value, suggestions, setValue } = usePlacesAutocomplete({
  apiKey: 'YOUR_API_KEY',
  sessionToken: 'YOUR_SESSION_TOKEN',
});
```

### Getting Place Details

```tsx
const { getPlaceDetails, handlePlaceSelect } = usePlacesAutocomplete({
  apiKey: 'YOUR_API_KEY',
});

const handleSelect = async (placeId: string) => {
  await handlePlaceSelect(placeId);
  const details = await getPlaceDetails(placeId);
  console.log('Selected place details:', details);
};
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT [Seatsmatch GmbH](https://seatsmatch.com)
