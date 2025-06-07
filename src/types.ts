/* eslint-disable no-unused-vars */
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
  /** Callback that is called when a place is selected, providing the place ID */
  setSelectedPlace?: (placeId: string) => void;
}

export interface UsePlacesAutocompleteResult {
  value: string;
  suggestions: {
    status: 'OK' | 'ZERO_RESULTS' | 'ERROR' | 'LOADING';
    data: PlacePrediction[];
  };
  setValue: (value: string, shouldFetchData?: boolean) => void;
  clearSuggestions: () => void;
  search: (input: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails>;
  handlePlaceSelect: (placeId: string) => Promise<void>;
}
