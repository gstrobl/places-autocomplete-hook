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
  longText?: string;
  shortText?: string;
  types?: string[];
  languageCode?: string;
}

interface GoogleMapsLinks {
  directionsUri?: string;
  placeUri?: string;
  writeAReviewUri?: string;
  reviewsUri?: string;
  photosUri?: string;
}

interface AuthorAttributions {
  displayName?: string;
  uri?: string;
  photoUri?: string;
}

interface Photos {
  name?: string;
  widthPx?: number;
  heightPx?: number;
  authorAttributions?: AuthorAttributions[];
  flagContentUri?: string;
  googleMapsUri?: string;
}

interface DisplayName {
  text?: string;
  languageCode?: string;
}

interface ViewPort {
  low?: {
    latitude?: number;
    longitude?: number;
  };
  high?: {
    latitude?: number;
    longitude?: number;
  };
}

interface PlusCode {
  globalCode?: string;
  compoundCode?: string;
}

interface TimeZone {
  id?: string;
}

interface PaymentOptions {
  acceptsCreditCards?: boolean;
  acceptsDebitCards?: boolean;
  acceptsCashOnly?: boolean;
  acceptsNfc?: boolean;
}

interface PostalAddress {
  regionCode?: string;
  languageCode?: string;
  postalCode?: string;
  locality?: string;
  addressLines?: string[];
  administrativeArea?: string;
}

interface AccessibilityOptions {
  wheelchairAccessibleParking?: boolean;
  wheelchairAccessibleEntrance?: boolean;
  wheelchairAccessibleRestroom?: boolean;
  wheelchairAccessibleSeating?: boolean;
}

interface PrimaryTypeDisplayName {
  text?: string;
  languageCode?: string;
}

interface PriceRange {
  startPrice?: {
    currencyCode?: string;
    units?: string;
  };
  endPrice?: {
    currencyCode?: string;
    units?: string;
  };
}

interface EditorialSummary {
  text?: string;
  languageCode?: string;
}

interface Review {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: {
    text?: string;
    languageCode?: string;
  };
  originalText?: {
    text?: string;
    languageCode?: string;
  };
  authorAttributions?: AuthorAttributions;
  publishTime?: string;
  flagContentUri?: string;
  googleMapsUri?: string;
}

interface Period {
  open?: {
    day?: number;
    hour?: number;
    minute?: number;
    date?: {
      year?: number;
      month?: number;
      day?: number;
    };
  };
  close?: {
    day?: number;
    hour?: number;
    minute?: number;
    date?: {
      year?: number;
      month?: number;
      day?: number;
    };
  };
}

interface OpeningHours {
  openNow?: boolean;
  weekdayDescriptions?: string[];
  periods?: Period[];
  nextCloseTime?: string;
}

interface ParkingOptions {
  freeStreetParking?: boolean;
  freeParkingLot?: boolean;
}

interface Landmark {
  name?: string;
  placeId?: string;
  displayName?: DisplayName;
  types?: string[];
  straightLineDistanceMeters?: number;
  travelDistanceMeters?: number;
  spatialRelationship?: string;
}

interface Area {
  name?: string;
  placeId?: string;
  displayName?: DisplayName;
  containment: string;
}

interface AddressDescriptor {
  landmarks?: Landmark[];
  areas?: Area[];
}

export interface PlaceDetails {
  accessibilityOptions?: AccessibilityOptions;
  addressComponents: AddressComponent[];
  addressDescriptor?: AddressDescriptor;
  adrFormatAddress?: string;
  allowsDogs?: boolean;
  businessStatus?: string;
  city?: string;
  country?: string;
  curbsidePickup?: boolean;
  currentOpeningHours?: OpeningHours;
  delivery?: boolean;
  dineIn?: boolean;
  displayName?: DisplayName;
  editorialSummary?: EditorialSummary;
  formattedAddress: string;
  goodForChildren?: boolean;
  goodForGroups?: boolean;
  goodForWatchingSports?: boolean;
  googleMapsLinks?: GoogleMapsLinks;
  googleMapsUri?: string;
  iconBackgroundColor?: string;
  iconMaskBaseUri?: string;
  internationalPhoneNumber?: string;
  liveMusic?: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  menuForChildren?: boolean;
  name?: string;
  nationalPhoneNumber?: string;
  outdoorSeating?: boolean;
  parkingOptions?: ParkingOptions;
  paymentOptions?: PaymentOptions;
  photos?: Photos[];
  placeId: string;
  plusCode?: PlusCode;
  postalAddress?: PostalAddress;
  postalCode?: string;
  priceLevel?: string;
  priceRange?: PriceRange;
  primaryType?: string;
  primaryTypeDisplayName?: PrimaryTypeDisplayName;
  pureServiceAreaBusiness?: boolean;
  rating?: number;
  regularOpeningHours?: OpeningHours;
  reservable?: boolean;
  restroom?: boolean;
  reviews?: Review[];
  servesBeer?: boolean;
  servesCocktails?: boolean;
  servesDessert?: boolean;
  servesDinner?: boolean;
  servesLunch?: boolean;
  servesWine?: boolean;
  shortFormattedAddress?: string;
  state?: string;
  streetName?: string;
  streetNumber?: string;
  takeout?: boolean;
  timeZone?: TimeZone;
  types?: string[];
  userRatingCount?: number;
  utcOffsetMinutes?: number;
  viewport?: ViewPort;
  websiteUri?: string;
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
