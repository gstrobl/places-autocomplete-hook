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
  types,
  sessionToken,
  location,
}: UsePlacesAutocompleteOptions): UsePlacesAutocompleteResult {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const clear = useCallback(() => {
    setPredictions([]);
    setError(null);
  }, []);

  const extractAddressComponent = (
    components: AddressComponent[],
    type: string,
  ): string | undefined => {
    const component = components.find(comp => comp.types.includes(type));
    return component?.longText;
  };

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<PlaceDetails> => {
      try {
        const response = await fetch(
          `https://places.googleapis.com/v1/places/${placeId}?key=${apiKey}&languageCode=${language}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-FieldMask': 'formattedAddress,addressComponents,location',
              ...(sessionToken && { 'X-Goog-Api-Key': apiKey }),
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
          placeId: placeId,
          formattedAddress: data.formattedAddress,
          addressComponents,
          location: data.location,
          streetNumber: extractAddressComponent(addressComponents, 'street_number'),
          streetName: extractAddressComponent(addressComponents, 'route'),
          city: extractAddressComponent(addressComponents, 'locality'),
          state: extractAddressComponent(addressComponents, 'administrative_area_level_1'),
          country: extractAddressComponent(addressComponents, 'country'),
          postalCode: extractAddressComponent(addressComponents, 'postal_code'),
        };
      } catch (err) {
        throw err instanceof Error
          ? err
          : new Error('An error occurred while fetching place details');
      }
    },
    [apiKey, language, sessionToken],
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requestBody: any = {
          input: input,
          languageCode: language,
        };

        if (types) {
          requestBody.types = types;
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

        const response = await fetch(
          `https://places.googleapis.com/v1/places:autocomplete?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-FieldMask':
                'suggestions.placePrediction.place,suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.types',
              ...(sessionToken && { 'X-Goog-Api-Key': apiKey }),
            },
            body: JSON.stringify(requestBody),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPredictions(data.suggestions.map((suggestion: any) => suggestion.placePrediction) || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    },
    [apiKey, language, sessionToken, types, location, clear],
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
    predictions,
    loading,
    error,
    search: debouncedSearch,
    clear,
    getPlaceDetails,
  };
}

export type {
  PlacePrediction,
  UsePlacesAutocompleteOptions,
  UsePlacesAutocompleteResult,
  PlaceDetails,
};
