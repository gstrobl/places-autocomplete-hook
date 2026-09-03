import { MapPin } from 'lucide-react';
import { PlacePrediction } from 'places-autocomplete-hook';

interface SuggestionsListProps {
  suggestions: PlacePrediction[];
  onSelect: (placeId: string) => void;
}

export function SuggestionsList({ suggestions, onSelect }: SuggestionsListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="border-b border-line bg-bg-tint px-4 py-2">
        <h3 className="font-mono text-xs uppercase tracking-wider text-ink-mute">Suggestions</h3>
      </div>
      <ul>
        {suggestions.map(suggestion => (
          <li key={suggestion.placeId}>
            <button
              onClick={() => onSelect(suggestion.placeId)}
              className="flex w-full items-center gap-3 border-b border-line-soft px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-bg-tint"
            >
              <MapPin className="h-4 w-4 flex-none text-accent" />
              <span>
                <span className="block font-medium text-ink">
                  {suggestion.structuredFormat?.mainText?.text}
                </span>
                <span className="block text-sm text-ink-mute">
                  {suggestion.structuredFormat?.secondaryText?.text}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
