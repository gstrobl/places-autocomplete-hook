import { useState, useCallback, useEffect, useRef } from 'react';
import {
  UsePlacesAutocompleteOptions,
  UsePlacesAutocompleteResult,
  PlacePrediction,
  PlaceDetails,
  AddressComponent,
} from './types';

export function usePlacesAutocomplete({
  apiKey,
  debounceMs = 300,
  language = 'en',
  includedPrimaryTypes,
  includedRegionCodes,
  sessionToken,
  location,
  setSelectedPlace,
}: UsePlacesAutocompleteOptions): UsePlacesAutocompleteResult {
  const [value, setValue] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const clear = useCallback(() => {
    setPredictions([]);
    setError(null);
    setValue('');
  }, []);

  const extractAddressComponent = (
    components: AddressComponent[],
    type: string,
  ): string | undefined => {
    // Safely find component by type, handling cases where types property is missing
    const component = components.find(
      comp => comp.types && Array.isArray(comp.types) && comp.types.includes(type),
    );
    return component?.longText;
  };

  const getPlaceDetails = useCallback(
    async (placeId: string, fields?: string[]): Promise<PlaceDetails> => {
      try {
        const defaultFields = ['formattedAddress', 'addressComponents', 'location'];
        const fieldMask = fields && fields.length > 0 ? fields.join(',') : defaultFields.join(',');

        const response = await fetch(
          `https://places.googleapis.com/v1/places/${placeId}?key=${apiKey}&languageCode=${language}${sessionToken ? `&sessionToken=${sessionToken}` : ''}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-FieldMask': fieldMask,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const addressComponents = data.addressComponents || [];

        return {
          accessibilityOptions: data.accessibilityOptions,
          addressComponents,
          addressDescriptor: data.addressDescriptor,
          adrFormatAddress: data.adrFormatAddress,
          allowsDogs: data.allowsDogs,
          businessStatus: data.businessStatus,
          city: extractAddressComponent(addressComponents, 'locality'),
          country: extractAddressComponent(addressComponents, 'country'),
          curbsidePickup: data.curbsidePickup,
          currentOpeningHours: data.currentOpeningHours,
          delivery: data.delivery,
          dineIn: data.dineIn,
          displayName: data.displayName,
          editorialSummary: data.editorialSummary,
          formattedAddress: data.formattedAddress,
          goodForChildren: data.goodForChildren,
          goodForGroups: data.goodForGroups,
          goodForWatchingSports: data.goodForWatchingSports,
          googleMapsLinks: data.googleMapsLinks,
          googleMapsUri: data.googleMapsUri,
          iconBackgroundColor: data.iconBackground,
          iconMaskBaseUri: data.iconMaskBaseUri,
          internationalPhoneNumber: data.internationalPhoneNumber,
          liveMusic: data.liveMusic,
          location: data.location,
          menuForChildren: data.menuForChildren,
          name: data.name,
          nationalPhoneNumber: data.nationalPhoneNumber,
          outdoorSeating: data.outdoorSeating,
          parkingOptions: data.parkingOptions,
          paymentOptions: data.paymentOptions,
          photos: data.photos,
          placeId: data.id || placeId,
          plusCode: data.plusCode,
          postalAddress: data.postalAddress,
          postalCode: extractAddressComponent(addressComponents, 'postal_code'),
          priceLevel: data.priceLevel,
          priceRange: data.priceRange,
          primaryType: data.primaryType,
          primaryTypeDisplayName: data.primaryTypeDisplayName,
          pureServiceAreaBusiness: data.pureServiceAreaBusiness,
          rating: data.rating,
          regularOpeningHours: data.regularOpeningHours,
          reservable: data.reservable,
          restroom: data.restroom,
          reviews: data.reviews,
          servesBeer: data.servesBeer,
          servesCocktails: data.servesCocktails,
          servesDessert: data.servesDessert,
          servesDinner: data.servesDinner,
          servesLunch: data.servesLunch,
          servesWine: data.servesWine,
          shortFormattedAddress: data.shortFormattedAddress,
          state: extractAddressComponent(addressComponents, 'administrative_area_level_1'),
          streetName: extractAddressComponent(addressComponents, 'route'),
          streetNumber: extractAddressComponent(addressComponents, 'street_number'),
          takeout: data.takeout,
          timeZone: data.timeZone,
          types: data.types,
          userRatingCount: data.userRatingCount,
          utcOffsetMinutes: data.utcOffsetMinutes,
          viewport: data.viewport,
          websiteUri: data.websiteUri,
        };
      } catch (err) {
        throw err instanceof Error
          ? err
          : new Error('An error occurred while fetching place details');
      }
    },
    [apiKey, language, sessionToken],
  );

  const handlePlaceSelect = useCallback(
    async (placeId: string) => {
      setSelectedPlace?.(placeId);
    },
    [setSelectedPlace],
  );

  const search = useCallback(
    async (input: string) => {
      if (!input.trim()) {
        clear();
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const requestBody: any = {
          input: input,
          languageCode: language,
        };

        if (includedPrimaryTypes) {
          requestBody.includedPrimaryTypes = includedPrimaryTypes;
          requestBody.includeQueryPredictions = true;
        }

        if (includedRegionCodes) {
          requestBody.includedRegionCodes = includedRegionCodes;
        }

        if (location) {
          requestBody.locationBias = {
            circle: {
              center: {
                latitude: location.lat,
                longitude: location.lng,
              },
              radius: location.radius,
            },
          };
        }

        if (includedPrimaryTypes || includedRegionCodes || location) {
          requestBody.includeQueryPredictions = true;
        }

        if (sessionToken) {
          requestBody.sessionToken = sessionToken;
        }

        // Build FieldMask - include query prediction fields when includeQueryPredictions is true
        let fieldMask =
          'suggestions.placePrediction.place,suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.types';
        if (requestBody.includeQueryPredictions) {
          fieldMask +=
            ',suggestions.queryPrediction.text,suggestions.queryPrediction.structuredFormat';
        }

        const response = await fetch(
          `https://places.googleapis.com/v1/places:autocomplete?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-FieldMask': fieldMask,
            },
            body: JSON.stringify(requestBody),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Filter to only include place predictions (exclude query predictions)
        // This will throw if data.suggestions is undefined (maintains original error behavior)
        const placePredictions = data.suggestions
          .map((suggestion: any) => suggestion.placePrediction)
          .filter((prediction: any) => prediction !== undefined && prediction !== null);
        setPredictions(placePredictions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    },
    [apiKey, language, sessionToken, includedPrimaryTypes, includedRegionCodes, location, clear],
  );

  const debouncedSearch = useCallback(
    async (input: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      return new Promise<void>(resolve => {
        debounceTimer.current = setTimeout(async () => {
          await search(input);
          resolve();
        }, debounceMs);
      });
    },
    [search, debounceMs],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    value,
    suggestions: {
      status: error
        ? 'ERROR'
        : loading
          ? 'LOADING'
          : predictions.length > 0
            ? 'OK'
            : 'ZERO_RESULTS',
      data: predictions,
    },
    setValue: (newValue: string, shouldFetchData = true) => {
      setValue(newValue);
      if (shouldFetchData) {
        debouncedSearch(newValue);
      }
    },
    clearSuggestions: clear,
    search: debouncedSearch,
    loading,
    error,
    getPlaceDetails,
    handlePlaceSelect,
  };
}

export type {
  PlacePrediction,
  AddressComponent,
  UsePlacesAutocompleteOptions,
  UsePlacesAutocompleteResult,
  PlaceDetails,
};
