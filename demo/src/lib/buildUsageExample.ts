export const DEFAULT_EXAMPLE_FIELDS = [
  'formattedAddress',
  'addressComponents',
  'location',
  'displayName',
  'rating',
  'userRatingCount',
  'photos',
  'currentOpeningHours',
  'websiteUri',
  'internationalPhoneNumber',
];

interface UsageExampleOptions {
  fields: string[];
  includedPrimaryTypes?: string[];
}

/** Renders a ready-to-paste usage snippet reflecting the current demo configuration. */
export function buildUsageExample({ fields, includedPrimaryTypes }: UsageExampleOptions): string {
  const fieldsString =
    fields.length > 0 ? `[\n    ${fields.map(f => `'${f}'`).join(',\n    ')}\n  ]` : 'undefined';

  let hookConfig = `  apiKey: 'YOUR_GOOGLE_PLACES_API_KEY'`;
  if (includedPrimaryTypes && includedPrimaryTypes.length > 0) {
    hookConfig += `,\n  includedPrimaryTypes: [\n    ${includedPrimaryTypes
      .slice(0, 5)
      .map(t => `'${t}'`)
      .join(',\n    ')},\n    // ... more place types\n  ]`;
  }

  return `import { usePlacesAutocomplete } from 'places-autocomplete-hook';

function AddressInput() {
  const {
    value,
    suggestions,
    setValue,
    loading,
    error,
    getPlaceDetails,
    handlePlaceSelect,
  } = usePlacesAutocomplete({
${hookConfig}
  });

  const handleSelect = async (placeId: string) => {
    await handlePlaceSelect(placeId);
    const details = await getPlaceDetails(placeId, ${fieldsString});
    console.log('Selected place details:', details);
  };

  return (
    <div>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Enter an address"
      />
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {suggestions.status === 'OK' && (
        <ul>
          {suggestions.data.map(prediction => (
            <li key={prediction.placeId} onClick={() => handleSelect(prediction.placeId)}>
              {prediction.structuredFormat?.mainText?.text},{' '}
              {prediction.structuredFormat?.secondaryText?.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`;
}
