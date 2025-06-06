# Google Places Autocomplete Hook

A lightweight React hook for Google Places Autocomplete API that provides a simple way to implement location search functionality in your React applications.

[![npm version](https://img.shields.io/npm/v/places-autocomplete-hook.svg)](https://www.npmjs.com/package/places-autocomplete-hook)

[![bundle size](https://img.shields.io/bundlephobia/min/places-autocomplete-hook)](https://bundlephobia.com/package/places-autocomplete-hook)

> This package is a wrapper around the [Google Places Autocomplete API](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete). Make sure you have a valid Google Places API key with the Places API enabled in your Google Cloud Console.

## Features

- 🔍 Simple and intuitive API
- ⚡ Built-in debouncing
- 🌍 Language support
- 📍 Location biasing
- 🔒 TypeScript support
- 🎯 Place type filtering
- 💰 Session token support for billing optimization

## Installation

```bash
# Using npm
npm install places-autocomplete-hook

# Using yarn
yarn add places-autocomplete-hook

# Using pnpm
pnpm add places-autocomplete-hook
```

## Quick Start

```tsx
import { usePlacesAutocomplete } from 'places-autocomplete-hook';

function LocationSearch() {
  const { predictions, loading, error, search } = usePlacesAutocomplete({
    apiKey: 'YOUR_GOOGLE_PLACES_API_KEY',
  });

  return (
    <div>
      <input
        type="text"
        onChange={e => search(e.target.value)}
        placeholder="Search for a location..."
      />

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      <ul>
        {predictions.map(prediction => (
          <li key={prediction.placeId}>{prediction.description}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Advanced Usage

### With Location Biasing

```tsx
const { predictions, search } = usePlacesAutocomplete({
  apiKey: 'YOUR_GOOGLE_PLACES_API_KEY',
  location: {
    lat: 37.7749,
    lng: -122.4194,
    radius: 5000, // 5km radius
  },
});
```

### With Place Type Filtering

```tsx
const { predictions, search } = usePlacesAutocomplete({
  apiKey: 'YOUR_GOOGLE_PLACES_API_KEY',
  types: ['address', 'establishment'],
});
```

### With Custom Debounce

```tsx
const { predictions, search } = usePlacesAutocomplete({
  apiKey: 'YOUR_GOOGLE_PLACES_API_KEY',
  debounceMs: 500, // 500ms debounce
});
```

### With Session Token for Billing Optimization

```tsx
import { usePlacesAutocomplete } from 'places-autocomplete-hook';

function LocationSearch() {
  const sessionToken = useRef(new google.maps.places.AutocompleteSessionToken());

  const { predictions, search } = usePlacesAutocomplete({
    apiKey: 'YOUR_GOOGLE_PLACES_API_KEY',
    sessionToken: sessionToken.current,
  });
}
```

### With Place Details

```tsx
import { usePlacesAutocomplete } from 'places-autocomplete-hook';

function LocationSearch() {
  const { predictions, search, getPlaceDetails } = usePlacesAutocomplete({
    apiKey: 'YOUR_GOOGLE_PLACES_API_KEY',
  });

  const handleSelect = async (placeId: string) => {
    try {
      const details = await getPlaceDetails(placeId);
      console.log('Selected place details:', {
        address: details.formattedAddress,
        street: details.streetName,
        city: details.city,
        state: details.state,
        country: details.country,
        postalCode: details.postalCode,
        location: details.location,
      });
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        onChange={e => search(e.target.value)}
        placeholder="Search for a location..."
      />

      <ul>
        {predictions.map(prediction => (
          <li
            key={prediction.placeId}
            onClick={() => handleSelect(prediction.placeId)}
            style={{ cursor: 'pointer' }}
          >
            {prediction.structuredFormatting.mainText}
            <br />
            <small>{prediction.structuredFormatting.secondaryText}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### PlaceDetails Type

```typescript
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

interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
}
```

## API Reference

### usePlacesAutocomplete(options)

#### Options

| Option         | Type           | Required | Default | Description                              |
| -------------- | -------------- | -------- | ------- | ---------------------------------------- |
| `apiKey`       | `string`       | Yes      | -       | Your Google Places API key               |
| `debounceMs`   | `number`       | No       | `300`   | Debounce time in milliseconds            |
| `language`     | `string`       | No       | `'en'`  | Language code for results                |
| `types`        | `string[]`     | No       | -       | Array of place types to restrict results |
| `sessionToken` | `string`       | No       | -       | Session token for billing purposes       |
| `location`     | `LocationBias` | No       | -       | Location bias configuration              |

#### LocationBias Type

```typescript
interface LocationBias {
  lat: number;
  lng: number;
  radius?: number; // in meters
}
```

#### Returns

| Property          | Type                                         | Description                                   |
| ----------------- | -------------------------------------------- | --------------------------------------------- |
| `predictions`     | `PlacePrediction[]`                          | Array of place predictions                    |
| `loading`         | `boolean`                                    | Loading state indicator                       |
| `error`           | `Error \| null`                              | Error state                                   |
| `search`          | `(input: string) => Promise<void>`           | Function to trigger a search                  |
| `clear`           | `() => void`                                 | Function to clear predictions and error state |
| `getPlaceDetails` | `(placeId: string) => Promise<PlaceDetails>` | Function to get detailed place information    |

#### PlacePrediction Type

```typescript
interface PlacePrediction {
  placeId: string;
  description: string;
  structuredFormatting: {
    mainText: string;
    secondaryText: string;
  };
  types: string[];
  matchedSubstrings: Array<{
    length: number;
    offset: number;
  }>;
}
```

## Error Handling

The hook provides error handling through the `error` state:

```tsx
const { error, search } = usePlacesAutocomplete({
  apiKey: 'YOUR_GOOGLE_PLACES_API_KEY',
});

// Handle errors in your UI
{
  error && <div className="error">Error: {error.message}</div>;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Seatsmatch GmbH]
