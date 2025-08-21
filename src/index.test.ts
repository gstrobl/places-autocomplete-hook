import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlacesAutocomplete } from './index';

describe('usePlacesAutocomplete', () => {
  const mockApiKey = 'test-api-key';
  const mockPredictions = [
    {
      place: 'place1',
      placeId: '1',
      text: {
        text: 'Test Location 1',
        matches: [{ endOffset: 4 }],
      },
      structuredFormat: {
        mainText: {
          text: 'Test Location 1',
          matches: [{ endOffset: 4 }],
        },
        secondaryText: {
          text: 'Test City, Test Country',
        },
      },
      types: ['address'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    expect(result.current.value).toBe('');
    expect(result.current.suggestions.status).toBe('ZERO_RESULTS');
    expect(result.current.suggestions.data).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update value and fetch suggestions', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ suggestions: [{ placePrediction: mockPredictions[0] }] }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test');
    });

    expect(result.current.value).toBe('test');
    expect(mockFetch).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://places.googleapis.com/v1/places:autocomplete'),
      expect.any(Object),
    );
    expect(result.current.suggestions.data).toEqual(mockPredictions);
    expect(result.current.suggestions.status).toBe('OK');
  });

  it('should update value without fetching suggestions', async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test', false);
    });

    expect(result.current.value).toBe('test');
    expect(mockFetch).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should clear suggestions', async () => {
    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    act(() => {
      result.current.clearSuggestions();
    });

    expect(result.current.value).toBe('');
    expect(result.current.suggestions.data).toEqual([]);
    expect(result.current.suggestions.status).toBe('ZERO_RESULTS');
  });

  it('should handle place selection', async () => {
    const mockSetSelectedPlace = vi.fn();
    const { result } = renderHook(() =>
      usePlacesAutocomplete({
        apiKey: mockApiKey,
        setSelectedPlace: mockSetSelectedPlace,
      }),
    );

    await act(async () => {
      await result.current.handlePlaceSelect('1');
    });

    expect(mockSetSelectedPlace).toHaveBeenCalledWith('1');
  });

  it('should get place details', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          formattedAddress: '123 Test St, Test City, Test Country',
          addressComponents: [],
          location: { latitude: 0, longitude: 0 },
        }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await act(async () => {
      const details = await result.current.getPlaceDetails('1');
      expect(details).toEqual({
        placeId: '1',
        formattedAddress: '123 Test St, Test City, Test Country',
        addressComponents: [],
        location: { latitude: 0, longitude: 0 },
      });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://places.googleapis.com/v1/places/1'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Goog-FieldMask': 'formattedAddress,addressComponents,location',
        }),
      }),
    );
  });

  it('should get place details with custom fields', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          formattedAddress: '123 Test St, Test City, Test Country',
          displayName: { text: 'Test Place' },
        }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await act(async () => {
      const details = await result.current.getPlaceDetails('1', [
        'formattedAddress',
        'displayName',
      ]);
      expect(details.formattedAddress).toBe('123 Test St, Test City, Test Country');
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://places.googleapis.com/v1/places/1'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Goog-FieldMask': 'formattedAddress,displayName',
        }),
      }),
    );
  });

  it('should use default fields when empty array is provided', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          formattedAddress: '123 Test St, Test City, Test Country',
          addressComponents: [],
          location: { latitude: 0, longitude: 0 },
        }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await act(async () => {
      await result.current.getPlaceDetails('1', []);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://places.googleapis.com/v1/places/1'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Goog-FieldMask': 'formattedAddress,addressComponents,location',
        }),
      }),
    );
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    const mockFetch = vi.fn().mockRejectedValue(mockError);
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.suggestions.status).toBe('ERROR');
    expect(result.current.suggestions.data).toEqual([]);
  });

  it('should handle empty search input', async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.suggestions.data).toEqual([]);
    expect(result.current.suggestions.status).toBe('ZERO_RESULTS');
  });

  it('should handle API response with no predictions', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ suggestions: [] }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('nonexistent');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.suggestions.data).toEqual([]);
    expect(result.current.suggestions.status).toBe('ZERO_RESULTS');
    expect(result.current.error).toBeNull();
  });

  it('should include includedPrimaryTypes in the request body when provided', async () => {
    const includedPrimaryTypes = ['locality', 'sublocality'];

    const mockFetch = vi.fn().mockImplementation((_url: string, options: any) => {
      const body = JSON.parse(options.body);
      expect(body.includedPrimaryTypes).toEqual(includedPrimaryTypes);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ suggestions: [] }),
      });
    });
    // @ts-ignore
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey, includedPrimaryTypes }),
    );

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://places.googleapis.com/v1/places:autocomplete'),
      expect.any(Object),
    );
  });

  it('should handle network errors', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new TypeError('Network error'));
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.error).toBeInstanceOf(TypeError);
    expect(result.current.error?.message).toBe('Network error');
    expect(result.current.suggestions.data).toEqual([]);
    expect(result.current.suggestions.status).toBe('ERROR');
  });

  it('should handle invalid API responses', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ invalid: 'response' }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.suggestions.data).toEqual([]);
    expect(result.current.error).toBeInstanceOf(TypeError);
    expect(result.current.error?.message).toContain('Cannot read properties of undefined');
    expect(result.current.suggestions.status).toBe('ERROR');
  });

  it('should handle component unmounting during search', async () => {
    const mockFetch = vi.fn().mockImplementation(() => new Promise(() => {}));
    global.fetch = mockFetch;

    const { result, unmount } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test');
    });

    unmount();

    expect(result.current.loading).toBe(false);
  });

  it('should handle multiple rapid searches', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ suggestions: [{ placePrediction: mockPredictions[0] }] }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey, debounceMs: 300 }),
    );

    act(() => {
      result.current.setValue('test1');
      result.current.setValue('test2');
      result.current.setValue('test3');
    });

    expect(mockFetch).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  // New tests to cover missing coverage lines

  it('should handle HTTP error responses in getPlaceDetails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: { message: 'Bad Request' } }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await expect(result.current.getPlaceDetails('1')).rejects.toThrow('Bad Request');
  });

  it('should handle HTTP error responses without error message in getPlaceDetails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await expect(result.current.getPlaceDetails('1')).rejects.toThrow('HTTP error! status: 500');
  });

  it('should handle non-Error exceptions in getPlaceDetails', async () => {
    const mockFetch = vi.fn().mockRejectedValue('String error');
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await expect(result.current.getPlaceDetails('1')).rejects.toThrow(
      'An error occurred while fetching place details',
    );
  });

  it('should handle address components extraction in getPlaceDetails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          formattedAddress: '123 Test St, Test City, Test Country',
          addressComponents: [
            { longText: '123', shortText: '123', types: ['street_number'] },
            { longText: 'Test Street', shortText: 'Test St', types: ['route'] },
            { longText: 'Test City', shortText: 'Test City', types: ['locality'] },
            { longText: 'Test State', shortText: 'TS', types: ['administrative_area_level_1'] },
            { longText: 'Test Country', shortText: 'TC', types: ['country'] },
            { longText: '12345', shortText: '12345', types: ['postal_code'] },
          ],
          location: { latitude: 0, longitude: 0 },
        }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await act(async () => {
      const details = await result.current.getPlaceDetails('1');
      expect(details.streetNumber).toBe('123');
      expect(details.streetName).toBe('Test Street');
      expect(details.city).toBe('Test City');
      expect(details.state).toBe('Test State');
      expect(details.country).toBe('Test Country');
      expect(details.postalCode).toBe('12345');
    });
  });

  it('should handle missing address components gracefully', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          formattedAddress: 'Test Location',
          addressComponents: [],
          location: { latitude: 0, longitude: 0 },
        }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await act(async () => {
      const details = await result.current.getPlaceDetails('1');
      expect(details.streetNumber).toBeUndefined();
      expect(details.streetName).toBeUndefined();
      expect(details.city).toBeUndefined();
      expect(details.state).toBeUndefined();
      expect(details.country).toBeUndefined();
      expect(details.postalCode).toBeUndefined();
    });
  });

  it('should handle undefined addressComponents in response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          formattedAddress: 'Test Location',
          location: { latitude: 0, longitude: 0 },
        }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await act(async () => {
      const details = await result.current.getPlaceDetails('1');
      expect(details.addressComponents).toEqual([]);
    });
  });

  it('should handle HTTP error responses in search function', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ error: { message: 'Rate Limited' } }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Rate Limited');
    expect(result.current.suggestions.status).toBe('ERROR');
  });

  it('should handle HTTP error responses without error message in search function', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: () => Promise.resolve({}),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('HTTP error! status: 403');
    expect(result.current.suggestions.status).toBe('ERROR');
  });

  it('should handle non-Error exceptions in search function', async () => {
    const mockFetch = vi.fn().mockRejectedValue('String error');
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('An error occurred');
    expect(result.current.suggestions.status).toBe('ERROR');
    expect(result.current.suggestions.data).toEqual([]);
  });

  it('should handle empty suggestions array in search response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ suggestions: [] }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.suggestions.data).toEqual([]);
    expect(result.current.suggestions.status).toBe('ZERO_RESULTS');
  });

  it('should handle location bias configuration', async () => {
    const location = { lat: 37.7749, lng: -122.4194, radius: 50000 };
    let requestBody: any;

    const mockFetch = vi.fn().mockImplementation((_url: string, options: any) => {
      requestBody = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ suggestions: [] }),
      });
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey, location }));

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(requestBody.locationBias).toEqual({
      circle: {
        center: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
        radius: 50000,
      },
    });
  });

  it('should handle includedPrimaryTypes configuration', async () => {
    const includedPrimaryTypes = ['establishment', 'geocode'];
    let requestBody: any;

    const mockFetch = vi.fn().mockImplementation((_url: string, options: any) => {
      requestBody = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ suggestions: [] }),
      });
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey, includedPrimaryTypes }),
    );

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(requestBody.includedPrimaryTypes).toEqual(['establishment', 'geocode']);
  });

  it('should handle includedRegionCodes configuration', async () => {
    const includedRegionCodes = ['US', 'CA'];
    let requestBody: any;

    const mockFetch = vi.fn().mockImplementation((_url: string, options: any) => {
      requestBody = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ suggestions: [] }),
      });
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey, includedRegionCodes }),
    );

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(requestBody.includedRegionCodes).toEqual(['US', 'CA']);
  });

  it('should include session token in request body', async () => {
    const sessionToken = 'test-session-token';
    let requestBody: any;

    const mockFetch = vi.fn().mockImplementation((_url: string, options: any) => {
      requestBody = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ suggestions: [] }),
      });
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey, sessionToken }),
    );

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(requestBody.sessionToken).toBeDefined();
    expect(requestBody.sessionToken).toBe(sessionToken);
  });

  it('should include session token in getPlaceDetails query params', async () => {
    const sessionToken = 'test-session-token';
    let requestUrl: any;

    const mockFetch = vi.fn().mockImplementation((_url: string) => {
      requestUrl = _url;
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            formattedAddress: 'Test Address',
            addressComponents: [],
            location: { latitude: 0, longitude: 0 },
          }),
      });
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey, sessionToken }),
    );

    await act(async () => {
      await result.current.getPlaceDetails('1');
    });

    expect(requestUrl).toContain(`sessionToken=${sessionToken}`);
  });

  it('should handle debounced search with custom debounce time', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ suggestions: [] }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey, debounceMs: 500 }),
    );

    act(() => {
      result.current.setValue('test');
    });

    expect(mockFetch).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockFetch).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(mockFetch).toHaveBeenCalled();
  });

  it('should handle debounce timer cleanup', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ suggestions: [] }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test1');
    });

    act(() => {
      result.current.setValue('test2');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle component cleanup on unmount', () => {
    const { unmount } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    // This test covers the useEffect cleanup function
    expect(() => unmount()).not.toThrow();
  });

  it('should handle suggestions status calculation correctly', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ suggestions: [{ placePrediction: mockPredictions[0] }] }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    // Initially should be ZERO_RESULTS
    expect(result.current.suggestions.status).toBe('ZERO_RESULTS');

    // Set value to trigger search
    act(() => {
      result.current.setValue('test');
    });

    // Loading state is set when the debounced search actually runs
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // Should be OK after successful search
    expect(result.current.suggestions.status).toBe('OK');
    expect(result.current.loading).toBe(false);
  });

  it('should handle error status correctly', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Test error'));
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.setValue('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.suggestions.status).toBe('ERROR');
  });

  it('should handle search function existence', () => {
    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    // Verify that the search function exists and is a function
    expect(result.current.search).toBeDefined();
    expect(typeof result.current.search).toBe('function');
  });

  it('should handle search function with empty input', () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    // Test that search function exists
    expect(result.current.search).toBeDefined();

    // Test that search function returns a promise
    const searchPromise = result.current.search('');
    expect(searchPromise).toBeInstanceOf(Promise);

    // Don't wait for the promise to resolve since it's debounced
    // Just verify the function exists and returns a promise
  });
});
