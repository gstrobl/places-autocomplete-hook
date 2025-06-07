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
      expect.any(Object),
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
});
