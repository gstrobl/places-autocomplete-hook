import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlacesAutocomplete } from './index';

describe('usePlacesAutocomplete', () => {
  const mockApiKey = 'test-api-key';
  const mockPredictions = [
    {
      placeId: '1',
      description: 'Test Location 1',
      structuredFormatting: {
        mainText: 'Test Location 1',
        secondaryText: 'Test City, Test Country',
      },
      types: ['address'],
      matchedSubstrings: [{ length: 4, offset: 0 }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty predictions', () => {
    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey })
    );

    expect(result.current.predictions).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should make API request when search is called', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ suggestions: [{ placePrediction: mockPredictions[0] }] }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey })
    );

    await act(async () => {
      await result.current.search('test');
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://places.googleapis.com/v1/places:autocomplete'),
      expect.any(Object)
    );
    expect(result.current.predictions).toEqual(mockPredictions);
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    const mockFetch = vi.fn().mockRejectedValue(mockError);
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey })
    );

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.predictions).toEqual([]);
  });

  it('should clear predictions and error', async () => {
    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey })
    );

    await act(async () => {
      result.current.clear();
    });

    expect(result.current.predictions).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should debounce search requests', async () => {
    vi.useFakeTimers();
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ predictions: mockPredictions }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey, debounceMs: 300 })
    );

    await act(async () => {
      result.current.search('test');
    });

    expect(mockFetch).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockFetch).toHaveBeenCalled();
    vi.useRealTimers();
  });
}); 