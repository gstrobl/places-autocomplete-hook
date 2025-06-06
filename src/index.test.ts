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
    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

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

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await act(async () => {
      await result.current.search('test');
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://places.googleapis.com/v1/places:autocomplete'),
      expect.any(Object),
    );
    expect(result.current.predictions).toEqual(mockPredictions);
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    const mockFetch = vi.fn().mockRejectedValue(mockError);
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.predictions).toEqual([]);
  });

  it('should clear predictions and error', async () => {
    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

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
      usePlacesAutocomplete({ apiKey: mockApiKey, debounceMs: 300 }),
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

  it('should handle empty search input', async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await act(async () => {
      await result.current.search('');
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.predictions).toEqual([]);
  });

  it('should handle API response with no predictions', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ suggestions: [] }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await act(async () => {
      await result.current.search('nonexistent');
    });

    expect(result.current.predictions).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should handle network errors', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new TypeError('Network error'));
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBeInstanceOf(TypeError);
    expect(result.current.error?.message).toBe('Network error');
    expect(result.current.predictions).toEqual([]);
  });

  it('should handle invalid API responses', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ invalid: 'response' }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.predictions).toEqual([]);
    expect(result.current.error).toBeInstanceOf(TypeError);
    expect(result.current.error?.message).toContain('Cannot read properties of undefined');
  });

  it('should handle component unmounting during search', async () => {
    const mockFetch = vi.fn().mockImplementation(() => new Promise(() => {}));
    global.fetch = mockFetch;

    const { result, unmount } = renderHook(() => usePlacesAutocomplete({ apiKey: mockApiKey }));

    act(() => {
      result.current.search('test');
    });

    unmount();

    expect(result.current.loading).toBe(false);
  });

  it('should handle multiple rapid searches', async () => {
    vi.useFakeTimers();
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ suggestions: [{ placePrediction: mockPredictions[0] }] }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      usePlacesAutocomplete({ apiKey: mockApiKey, debounceMs: 300 }),
    );

    await act(async () => {
      result.current.search('test1');
      result.current.search('test2');
      result.current.search('test3');
    });

    expect(mockFetch).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
