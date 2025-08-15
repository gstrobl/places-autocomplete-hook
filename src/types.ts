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
  /**
   * Primary place types to include (Google Places API v1). Common values include:
   * - 'locality' - Cities and towns
   * - 'administrative_area_level_3' - Third-level administrative areas
   * - 'administrative_area_level_4' - Fourth-level administrative areas
   * - 'administrative_area_level_5' - Fifth-level administrative areas
   * - 'administrative_area_level_6' - Sixth-level administrative areas
   * - 'administrative_area_level_7' - Seventh-level administrative areas
   * - 'archipelago' - Groups of islands
   * - 'colloquial_area' - Colloquial or informal areas
   * - 'continent' - Continental regions
   * - 'establishment' - Businesses and establishments
   * - 'finance' - Financial institutions
   * - 'food' - Food-related establishments
   * - 'general_contractor' - General contracting services
   * - 'geocode' - Geocoding results
   * - 'health' - Health-related establishments
   * - 'intersection' - Street intersections
   * - 'landmark' - Notable landmarks
   * - 'natural_feature' - Natural geographical features
   * - 'neighborhood' - Neighborhoods and districts
   * - 'place_of_worship' - Religious buildings
   * - 'plus_code' - Plus codes for locations
   * - 'point_of_interest' - Points of interest
   * - 'political' - Political boundaries
   * - 'postal_code_prefix' - Postal code prefixes
   * - 'postal_code_suffix' - Postal code suffixes
   * - 'postal_town' - Postal towns
   * - 'premise' - Named locations
   * - 'route' - Streets, roads, etc.
   * - 'street_address' - Specific street addresses
   * - 'sublocality' - Districts, neighborhoods, etc.
   * - 'sublocality_level_1' - First-level sublocalities
   * - 'sublocality_level_2' - Second-level sublocalities
   * - 'sublocality_level_3' - Third-level sublocalities
   * - 'sublocality_level_4' - Fourth-level sublocalities
   * - 'sublocality_level_5' - Fifth-level sublocalities
   * - 'subpremise' - Unit numbers, apartment numbers, etc.
   * - 'town_square' - Town squares and plazas
   */
  includedPrimaryTypes?: string[];
  /**
   * Region codes to restrict results to (ISO 3166-1 alpha-2 country codes).
   * This parameter restricts the results to places within the specified countries/regions.
   *
   * Common examples:
   * - 'US' - United States
   * - 'CA' - Canada
   * - 'GB' - United Kingdom
   * - 'DE' - Germany
   * - 'FR' - France
   * - 'AU' - Australia
   * - 'JP' - Japan
   * - 'IN' - India
   * - 'BR' - Brazil
   * - 'MX' - Mexico
   * - 'ES' - Spain
   * - 'IT' - Italy
   * - 'NL' - Netherlands
   * - 'SE' - Sweden
   * - 'NO' - Norway
   * - 'DK' - Denmark
   * - 'FI' - Finland
   * - 'CH' - Switzerland
   * - 'AT' - Austria
   * - 'BE' - Belgium
   *
   * You can specify multiple regions: ['US', 'CA'] for North America
   * or ['DE', 'AT', 'CH'] for German-speaking countries.
   */
  includedRegionCodes?: string[];
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
  getPlaceDetails: (placeId: string, fields?: string[]) => Promise<PlaceDetails>;
  handlePlaceSelect: (placeId: string) => Promise<void>;
}
