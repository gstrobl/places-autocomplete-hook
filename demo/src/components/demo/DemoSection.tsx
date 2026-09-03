import { useState } from 'react';
import { ChevronRight, Code, MessageSquareWarning, Search, TestTube } from 'lucide-react';
import { PlaceDetails, usePlacesAutocomplete } from 'places-autocomplete-hook';
import { Card, CardHeader } from '../ui/Card';
import { CodePanel } from '../ui/CodePanel';
import { DEFAULT_SELECTED_FIELDS, PLACES_ONLY_TYPES } from '../../lib/fields';
import { buildUsageExample } from '../../lib/buildUsageExample';
import { FieldSelector } from './FieldSelector';
import { SuggestionsList } from './SuggestionsList';
import { PlaceDetailsView } from './PlaceDetailsView';

interface DemoSectionProps {
  apiKey: string;
}

export function DemoSection({ apiKey }: DemoSectionProps) {
  const [query, setQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [placesOnly, setPlacesOnly] = useState(false);
  const [showCodeExample, setShowCodeExample] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    () => new Set(DEFAULT_SELECTED_FIELDS),
  );

  const { suggestions, loading, setValue, getPlaceDetails } = usePlacesAutocomplete({
    apiKey,
    includedPrimaryTypes: placesOnly ? PLACES_ONLY_TYPES : undefined,
  });

  const handlePlaceSelect = async (placeId: string) => {
    setSelectedPlace(placeId);
    setDetailsError(null);
    const fieldsArray = Array.from(selectedFields);
    try {
      const details = await getPlaceDetails(
        placeId,
        fieldsArray.length > 0 ? fieldsArray : undefined,
      );
      setPlaceDetails(details);
    } catch (err) {
      setPlaceDetails(null);
      setDetailsError(err instanceof Error ? err.message : 'Failed to load place details');
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setValue(value);
  };

  const usageExample = buildUsageExample({
    fields: Array.from(selectedFields),
    includedPrimaryTypes: placesOnly ? PLACES_ONLY_TYPES : undefined,
  });

  return (
    <Card>
      <CardHeader
        icon={TestTube}
        title="Live Demo"
        subtitle="Test the places autocomplete functionality"
      />

      {!apiKey ? (
        <div className="py-12 text-center text-ink-mute">
          <MessageSquareWarning className="mx-auto mb-4 h-10 w-10 text-ink-mute" />
          <p>Please configure your API key to test the autocomplete</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label
              htmlFor="place-search-input"
              className="mb-2 block text-sm font-medium text-ink-soft"
            >
              Search for a place
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-mute" />
              <input
                id="place-search-input"
                type="text"
                value={query}
                onChange={e => handleInputChange(e.target.value)}
                placeholder="Start typing an address..."
                className="w-full rounded-xl border border-line bg-bg-tint py-3 pl-11 pr-11 text-ink transition-colors placeholder:text-ink-mute focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-accent" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-line-soft bg-bg-tint p-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={placesOnly}
                onChange={e => setPlacesOnly(e.target.checked)}
                className="h-3.5 w-3.5 accent-accent"
              />
              <span className="text-sm font-medium text-ink-soft">
                Places only (exclude businesses/companies)
              </span>
            </label>
            {placesOnly && (
              <span className="text-xs text-ink-mute">
                Showing only addresses, locations, and geographic places
              </span>
            )}
          </div>

          <FieldSelector selectedFields={selectedFields} onChange={setSelectedFields} />

          <div className="overflow-hidden rounded-xl border border-line">
            <button
              onClick={() => setShowCodeExample(!showCodeExample)}
              className="flex w-full items-center justify-between bg-bg-tint px-4 py-3 text-left transition-colors hover:bg-bg-elev"
            >
              <span className="flex items-center gap-2">
                <Code className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-ink-soft">Code Example</span>
                <span className="hidden text-xs text-ink-mute sm:inline">
                  (updates with your configuration)
                </span>
              </span>
              <ChevronRight
                className={`h-4 w-4 text-ink-mute transition-transform ${showCodeExample ? 'rotate-90' : ''}`}
              />
            </button>
            {showCodeExample && (
              <div className="border-t border-line p-4">
                <CodePanel code={usageExample} />
              </div>
            )}
          </div>

          {suggestions.status === 'OK' && suggestions.data.length > 0 && (
            <SuggestionsList suggestions={suggestions.data} onSelect={handlePlaceSelect} />
          )}

          {suggestions.status === 'ERROR' && (
            <div className="rounded-xl border border-accent bg-bg-tint p-4">
              <p className="text-sm text-accent">Error loading suggestions. Please try again.</p>
            </div>
          )}

          {detailsError && (
            <div className="rounded-xl border border-accent bg-bg-tint p-4">
              <p className="text-sm text-accent">Error loading place details: {detailsError}</p>
            </div>
          )}

          {selectedPlace && (
            <div className="rounded-xl border border-line bg-bg-tint p-4">
              <p className="text-sm text-ink-soft">
                <span className="font-medium text-ink">Selected Place ID:</span>{' '}
                <span className="font-mono text-xs">{selectedPlace}</span>
              </p>
            </div>
          )}

          {placeDetails && <PlaceDetailsView details={placeDetails} />}
        </div>
      )}
    </Card>
  );
}
