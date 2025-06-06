export interface PlacePrediction {
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

export interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
}

export interface PlaceDetails {
  placeId: string;
  formattedAddress: string;
  addressComponents: AddressComponent[];
  location: {
    latitude: number;
    longitude: number;
  };
  // Extracted address components for easy access
  streetNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface UsePlacesAutocompleteOptions {
  apiKey: string;
  debounceMs?: number;
  language?: string;
  types?: string[];
  sessionToken?: string;
  location?: {
    lat: number;
    lng: number;
    radius?: number;
  };
  onPlaceSelect?: (details: PlaceDetails) => void;
}

export interface UsePlacesAutocompleteResult {
  predictions: PlacePrediction[];
  loading: boolean;
  error: Error | null;
  search: (input: string) => Promise<void>;
  clear: () => void;
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails>;
} 