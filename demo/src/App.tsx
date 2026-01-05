import React, { useState, useEffect } from 'react';
import {
  Settings,
  MapPin,
  Code,
  Key,
  TestTube,
  Copy,
  Check,
  Map,
  Search,
  MessageSquareWarning,
} from 'lucide-react';
import { PlaceDetails, usePlacesAutocomplete } from 'places-autocomplete-hook';
import seatsmatchLogo from './assets/seatsmatch-logo.svg';
import githubIcon from './assets/github-mark.svg';

interface ConfigCardProps {
  apiKey: string;
  // eslint-disable-next-line no-unused-vars
  onApiKeyChange: (key: string) => void;
}

const ConfigCard: React.FC<ConfigCardProps> = ({ apiKey, onApiKeyChange }) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (apiKey) {
      setTempKey(apiKey);
    }
  });

  const handleSave = () => {
    onApiKeyChange(tempKey);
    localStorage.setItem('places-autocomplete-api-key', tempKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    onApiKeyChange('');
    setTempKey('');
    localStorage.setItem('places-autocomplete-api-key', '');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-50 rounded-xl">
          <Settings className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configuration</h2>
          <p className="text-gray-600 text-sm">Setup your Google Places API key</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Places API Key
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showKey ? 'text' : 'password'}
              value={tempKey}
              onChange={e => setTempKey(e.target.value)}
              placeholder="Enter your Google Places API key"
              className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-2">
            Key is only stored in your Browser LocalStorage
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={!tempKey.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {saved ? (
            <>
              <Check className="h-5 w-5" />
              Saved!
            </>
          ) : (
            'Save Configuration'
          )}
        </button>
        {tempKey && (
          <button
            onClick={() => handleDelete()}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            Remove Key from LocalStorage
          </button>
        )}

        {apiKey && (
          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-800 text-sm">✅ API key configured and ready to use</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface DemoSectionProps {
  apiKey: string;
}

const DemoSection: React.FC<DemoSectionProps> = ({ apiKey }) => {
  const [query, setQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [placesOnly, setPlacesOnly] = useState(false);
  const [showRequestDetails, setShowRequestDetails] = useState(false);

  // Define all available fields organized by category
  const fieldCategories = {
    'Basic Information': [
      'formattedAddress',
      'addressComponents',
      'location',
      'displayName',
      'name',
      'shortFormattedAddress',
      'adrFormatAddress',
    ],
    'Ratings & Reviews': ['rating', 'userRatingCount', 'reviews', 'editorialSummary'],
    'Business Details': [
      'businessStatus',
      'currentOpeningHours',
      'regularOpeningHours',
      'priceLevel',
      'priceRange',
      'types',
      'primaryType',
      'primaryTypeDisplayName',
    ],
    'Contact Information': [
      'websiteUri',
      'internationalPhoneNumber',
      'nationalPhoneNumber',
      'googleMapsUri',
      'googleMapsLinks',
    ],
    'Dining Options': [
      'delivery',
      'dineIn',
      'takeout',
      'reservable',
      'servesBeer',
      'servesWine',
      'servesCocktails',
      'servesDessert',
      'servesDinner',
      'servesLunch',
    ],
    Amenities: [
      'outdoorSeating',
      'liveMusic',
      'menuForChildren',
      'goodForChildren',
      'goodForGroups',
      'goodForWatchingSports',
      'allowsDogs',
      'restroom',
    ],
    'Location Details': [
      'plusCode',
      'viewport',
      'timeZone',
      'utcOffsetMinutes',
      'addressDescriptor',
    ],
    'Media & Content': ['photos'],
    Services: ['parkingOptions', 'paymentOptions', 'accessibilityOptions'],
  };

  // Initialize selected fields with all basic fields selected by default
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set([
      'formattedAddress',
      'addressComponents',
      'location',
      'displayName',
      'rating',
      'userRatingCount',
    ]),
  );

  // Primary types for places (addresses, locations) excluding businesses/establishments
  const placesOnlyTypes = [
    'locality',
    'sublocality',
    'street_address',
    'route',
    'geocode',
    'premise',
    'neighborhood',
    'postal_code',
    'administrative_area_level_1',
    'administrative_area_level_2',
    'administrative_area_level_3',
    'administrative_area_level_4',
    'administrative_area_level_5',
    'administrative_area_level_6',
    'administrative_area_level_7',
    'sublocality_level_1',
    'sublocality_level_2',
    'sublocality_level_3',
    'sublocality_level_4',
    'sublocality_level_5',
    'postal_town',
    'postal_code_prefix',
    'postal_code_suffix',
    'intersection',
    'plus_code',
    'political',
    'natural_feature',
    'archipelago',
    'colloquial_area',
    'continent',
    'town_square',
    'subpremise',
  ];

  const { suggestions, loading, setValue, getPlaceDetails } = usePlacesAutocomplete({
    apiKey,
    includedPrimaryTypes: placesOnly ? placesOnlyTypes : undefined,
  });

  const toggleField = (field: string) => {
    setSelectedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(field)) {
        newSet.delete(field);
      } else {
        newSet.add(field);
      }
      return newSet;
    });
  };

  const selectCategory = (category: string) => {
    const fields = fieldCategories[category as keyof typeof fieldCategories] || [];
    setSelectedFields(prev => {
      const newSet = new Set(prev);
      fields.forEach(field => newSet.add(field));
      return newSet;
    });
  };

  const deselectCategory = (category: string) => {
    const fields = fieldCategories[category as keyof typeof fieldCategories] || [];
    setSelectedFields(prev => {
      const newSet = new Set(prev);
      fields.forEach(field => newSet.delete(field));
      return newSet;
    });
  };

  const handlePlaceSelect = (placeId: string) => {
    setSelectedPlace(placeId);
    const fieldsArray = Array.from(selectedFields);
    getPlaceDetails(placeId, fieldsArray.length > 0 ? fieldsArray : undefined).then(details => {
      setPlaceDetails(details);
    });
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setValue(value);
  };

  // Generate dynamic code example based on current configuration
  const generateCodeExample = () => {
    const fieldsArray = Array.from(selectedFields);
    const fieldsString =
      fieldsArray.length > 0
        ? `[\n    ${fieldsArray.map(f => `'${f}'`).join(',\n    ')}\n  ]`
        : 'undefined';

    let hookConfig = `  apiKey: 'YOUR_API_KEY'`;
    if (placesOnly) {
      hookConfig += `,\n  includedPrimaryTypes: [\n    ${placesOnlyTypes
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
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-50 rounded-xl">
          <TestTube className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Demo</h2>
          <p className="text-gray-600 text-sm">Test the places autocomplete functionality</p>
        </div>
      </div>

      {!apiKey ? (
        <div className="text-center py-12 text-gray-500">
          <MessageSquareWarning className="h-10 w-10 mx-auto mb-4 text-gray-300" />
          <p>Please configure your API key to test the autocomplete</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search for a place
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => handleInputChange(e.target.value)}
                placeholder="Start typing an address..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Filter Options */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={placesOnly}
                onChange={e => setPlacesOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Places only (exclude businesses/companies)
              </span>
            </label>
            {placesOnly && (
              <span className="text-xs text-gray-500">
                Showing only addresses, locations, and geographic places
              </span>
            )}
          </div>

          {/* Field Selector */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowFieldSelector(!showFieldSelector)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Select Fields to Request ({selectedFields.size} selected)
                </span>
              </div>
              <span className="text-gray-500 text-sm">{showFieldSelector ? '▼' : '▶'}</span>
            </button>

            {showFieldSelector && (
              <div className="p-4 bg-white border-t border-gray-200 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {Object.entries(fieldCategories).map(([category, fields]) => (
                    <div key={category} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-800">{category}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => selectCategory(category)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Select All
                          </button>
                          <button
                            onClick={() => deselectCategory(category)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {fields.map(field => (
                          <label
                            key={field}
                            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFields.has(field)}
                              onChange={() => toggleField(field)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs">{field}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total fields selected: <strong>{selectedFields.size}</strong>
                    </span>
                    <button
                      onClick={() => setSelectedFields(new Set())}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Code Example */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowRequestDetails(!showRequestDetails)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Code Example</span>
                <span className="text-xs text-gray-500">(updates with your configuration)</span>
              </div>
              <span className="text-gray-500 text-sm">{showRequestDetails ? '▼' : '▶'}</span>
            </button>

            {showRequestDetails && (
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="relative">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateCodeExample());
                      // Show feedback
                      const btn = document.getElementById('copy-code-btn');
                      if (btn) {
                        const originalText = btn.textContent;
                        btn.textContent = 'Copied!';
                        setTimeout(() => {
                          btn.textContent = originalText;
                        }, 2000);
                      }
                    }}
                    id="copy-code-btn"
                    className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors z-10"
                  >
                    <Copy className="h-3 w-3" />
                    Copy Code
                  </button>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-gray-300 text-xs">
                      <code>{generateCodeExample()}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {suggestions.status === 'OK' && suggestions.data.length > 0 && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Suggestions</h3>
              </div>
              {suggestions.data.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handlePlaceSelect(suggestion.placeId);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                >
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{suggestion.structuredFormat?.mainText?.text}</div>
                    <div className="text-sm text-gray-500">
                      {suggestion.structuredFormat?.secondaryText?.text}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {suggestions.status === 'ERROR' && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-red-800 text-sm">Error loading suggestions. Please try again.</p>
            </div>
          )}

          {selectedPlace && (
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-green-800 text-sm">
                <strong>Selected Place ID:</strong> {selectedPlace}
              </p>
            </div>
          )}
          {placeDetails && (
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Basic Information</h3>
                <p className="text-green-800 text-sm mb-1">
                  <strong>Address:</strong> {placeDetails.formattedAddress}
                </p>
                {placeDetails.displayName?.text && (
                  <p className="text-green-800 text-sm mb-1">
                    <strong>Display Name:</strong> {placeDetails.displayName.text}
                  </p>
                )}
                {placeDetails.name && (
                  <p className="text-green-800 text-sm mb-1">
                    <strong>Name:</strong> {placeDetails.name}
                  </p>
                )}
                {placeDetails.rating !== undefined && (
                  <p className="text-green-800 text-sm mb-1">
                    <strong>Rating:</strong> {placeDetails.rating} ⭐
                    {placeDetails.userRatingCount !== undefined && (
                      <span className="text-green-700">
                        {' '}
                        ({placeDetails.userRatingCount} reviews)
                      </span>
                    )}
                  </p>
                )}
                {placeDetails.priceLevel && (
                  <p className="text-green-800 text-sm">
                    <strong>Price Level:</strong> {placeDetails.priceLevel}
                  </p>
                )}
              </div>

              {/* Location Details */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Location</h3>
                <p className="text-blue-800 text-sm mb-1">
                  <strong>Coordinates:</strong> {placeDetails.location.latitude.toFixed(6)},{' '}
                  {placeDetails.location.longitude.toFixed(6)}
                </p>
                {placeDetails.plusCode?.globalCode && (
                  <p className="text-blue-800 text-sm mb-1">
                    <strong>Plus Code:</strong> {placeDetails.plusCode.globalCode}
                  </p>
                )}
                {placeDetails.googleMapsUri && (
                  <a
                    href={placeDetails.googleMapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    View on Google Maps →
                  </a>
                )}
              </div>

              {/* Contact Information */}
              {(placeDetails.internationalPhoneNumber ||
                placeDetails.nationalPhoneNumber ||
                placeDetails.websiteUri) && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-2">Contact</h3>
                  {placeDetails.internationalPhoneNumber && (
                    <p className="text-purple-800 text-sm mb-1">
                      <strong>Phone:</strong> {placeDetails.internationalPhoneNumber}
                    </p>
                  )}
                  {placeDetails.nationalPhoneNumber && (
                    <p className="text-purple-800 text-sm mb-1">
                      <strong>National Phone:</strong> {placeDetails.nationalPhoneNumber}
                    </p>
                  )}
                  {placeDetails.websiteUri && (
                    <a
                      href={placeDetails.websiteUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 text-sm underline"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              )}

              {/* Business Status & Hours */}
              {(placeDetails.businessStatus ||
                placeDetails.currentOpeningHours ||
                placeDetails.regularOpeningHours) && (
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <h3 className="font-semibold text-yellow-900 mb-2">Business Information</h3>
                  {placeDetails.businessStatus && (
                    <p className="text-yellow-800 text-sm mb-1">
                      <strong>Status:</strong> {placeDetails.businessStatus}
                    </p>
                  )}
                  {placeDetails.currentOpeningHours?.openNow !== undefined && (
                    <p className="text-yellow-800 text-sm mb-1">
                      <strong>Open Now:</strong>{' '}
                      {placeDetails.currentOpeningHours.openNow ? '✅ Yes' : '❌ No'}
                    </p>
                  )}
                  {placeDetails.regularOpeningHours?.weekdayDescriptions && (
                    <div className="mt-2">
                      <p className="text-yellow-800 text-sm font-semibold mb-1">Opening Hours:</p>
                      <ul className="text-yellow-700 text-xs space-y-1">
                        {placeDetails.regularOpeningHours.weekdayDescriptions.map((day, idx) => (
                          <li key={idx}>{day}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Dining & Amenities */}
              {(placeDetails.delivery !== undefined ||
                placeDetails.dineIn !== undefined ||
                placeDetails.takeout !== undefined ||
                placeDetails.servesBeer !== undefined ||
                placeDetails.servesWine !== undefined ||
                placeDetails.outdoorSeating !== undefined ||
                placeDetails.liveMusic !== undefined ||
                placeDetails.reservable !== undefined ||
                placeDetails.allowsDogs !== undefined) && (
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <h3 className="font-semibold text-orange-900 mb-2">Dining & Amenities</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {placeDetails.delivery !== undefined && (
                      <span className="text-orange-800">
                        Delivery: {placeDetails.delivery ? '✅' : '❌'}
                      </span>
                    )}
                    {placeDetails.dineIn !== undefined && (
                      <span className="text-orange-800">
                        Dine In: {placeDetails.dineIn ? '✅' : '❌'}
                      </span>
                    )}
                    {placeDetails.takeout !== undefined && (
                      <span className="text-orange-800">
                        Takeout: {placeDetails.takeout ? '✅' : '❌'}
                      </span>
                    )}
                    {placeDetails.reservable !== undefined && (
                      <span className="text-orange-800">
                        Reservable: {placeDetails.reservable ? '✅' : '❌'}
                      </span>
                    )}
                    {placeDetails.servesBeer !== undefined && (
                      <span className="text-orange-800">
                        Serves Beer: {placeDetails.servesBeer ? '✅' : '❌'}
                      </span>
                    )}
                    {placeDetails.servesWine !== undefined && (
                      <span className="text-orange-800">
                        Serves Wine: {placeDetails.servesWine ? '✅' : '❌'}
                      </span>
                    )}
                    {placeDetails.servesCocktails !== undefined && (
                      <span className="text-orange-800">
                        Cocktails: {placeDetails.servesCocktails ? '✅' : '❌'}
                      </span>
                    )}
                    {placeDetails.outdoorSeating !== undefined && (
                      <span className="text-orange-800">
                        Outdoor Seating: {placeDetails.outdoorSeating ? '✅' : '❌'}
                      </span>
                    )}
                    {placeDetails.liveMusic !== undefined && (
                      <span className="text-orange-800">
                        Live Music: {placeDetails.liveMusic ? '✅' : '❌'}
                      </span>
                    )}
                    {placeDetails.allowsDogs !== undefined && (
                      <span className="text-orange-800">
                        Allows Dogs: {placeDetails.allowsDogs ? '✅' : '❌'}
                      </span>
                    )}
                    {placeDetails.goodForChildren !== undefined && (
                      <span className="text-orange-800">
                        Good for Children: {placeDetails.goodForChildren ? '✅' : '❌'}
                      </span>
                    )}
                    {placeDetails.goodForGroups !== undefined && (
                      <span className="text-orange-800">
                        Good for Groups: {placeDetails.goodForGroups ? '✅' : '❌'}
                      </span>
                    )}
                    {placeDetails.restroom !== undefined && (
                      <span className="text-orange-800">
                        Restroom: {placeDetails.restroom ? '✅' : '❌'}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Parking & Payment */}
              {(placeDetails.parkingOptions || placeDetails.paymentOptions) && (
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <h3 className="font-semibold text-indigo-900 mb-2">Parking & Payment</h3>
                  {placeDetails.parkingOptions && (
                    <div className="text-indigo-800 text-sm mb-2">
                      <strong>Parking:</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        {placeDetails.parkingOptions.freeStreetParking && (
                          <li>• Free Street Parking</li>
                        )}
                        {placeDetails.parkingOptions.freeParkingLot && <li>• Free Parking Lot</li>}
                      </ul>
                    </div>
                  )}
                  {placeDetails.paymentOptions && (
                    <div className="text-indigo-800 text-sm">
                      <strong>Payment:</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        {placeDetails.paymentOptions.acceptsCreditCards && <li>• Credit Cards</li>}
                        {placeDetails.paymentOptions.acceptsDebitCards && <li>• Debit Cards</li>}
                        {placeDetails.paymentOptions.acceptsCashOnly && <li>• Cash Only</li>}
                        {placeDetails.paymentOptions.acceptsNfc && <li>• NFC Payments</li>}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Accessibility */}
              {placeDetails.accessibilityOptions && (
                <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
                  <h3 className="font-semibold text-teal-900 mb-2">Accessibility</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-teal-800">
                    {placeDetails.accessibilityOptions.wheelchairAccessibleParking && (
                      <span>✅ Wheelchair Accessible Parking</span>
                    )}
                    {placeDetails.accessibilityOptions.wheelchairAccessibleEntrance && (
                      <span>✅ Wheelchair Accessible Entrance</span>
                    )}
                    {placeDetails.accessibilityOptions.wheelchairAccessibleRestroom && (
                      <span>✅ Wheelchair Accessible Restroom</span>
                    )}
                    {placeDetails.accessibilityOptions.wheelchairAccessibleSeating && (
                      <span>✅ Wheelchair Accessible Seating</span>
                    )}
                  </div>
                </div>
              )}

              {/* Photos */}
              {placeDetails.photos && placeDetails.photos.length > 0 && (
                <div className="p-4 bg-pink-50 rounded-xl border border-pink-200">
                  <h3 className="font-semibold text-pink-900 mb-2">
                    Photos ({placeDetails.photos.length})
                  </h3>
                  <p className="text-pink-800 text-sm">
                    {placeDetails.photos.length} photo{placeDetails.photos.length !== 1 ? 's' : ''}{' '}
                    available
                    {placeDetails.photos[0]?.authorAttributions?.[0]?.displayName && (
                      <span className="block mt-1 text-xs">
                        Sample by: {placeDetails.photos[0].authorAttributions[0].displayName}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Reviews */}
              {placeDetails.reviews && placeDetails.reviews.length > 0 && (
                <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                  <h3 className="font-semibold text-cyan-900 mb-2">
                    Recent Reviews ({placeDetails.reviews.length})
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {placeDetails.reviews.slice(0, 3).map((review, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-cyan-100">
                        {review.rating !== undefined && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-cyan-800 font-semibold">{review.rating} ⭐</span>
                            {review.authorAttributions?.displayName && (
                              <span className="text-cyan-700 text-xs">
                                by {review.authorAttributions.displayName}
                              </span>
                            )}
                          </div>
                        )}
                        {review.text?.text && (
                          <p className="text-cyan-800 text-sm">{review.text.text}</p>
                        )}
                        {review.relativePublishTimeDescription && (
                          <p className="text-cyan-600 text-xs mt-1">
                            {review.relativePublishTimeDescription}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Editorial Summary */}
              {placeDetails.editorialSummary?.text && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Editorial Summary</h3>
                  <p className="text-gray-800 text-sm">{placeDetails.editorialSummary.text}</p>
                </div>
              )}

              {/* Types */}
              {placeDetails.types && placeDetails.types.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Place Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {placeDetails.types.map((type, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-200 text-slate-800 text-xs rounded"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  {placeDetails.primaryType && (
                    <p className="text-slate-700 text-sm mt-2">
                      <strong>Primary Type:</strong> {placeDetails.primaryType}
                    </p>
                  )}
                </div>
              )}

              {/* Address Components */}
              {placeDetails.addressComponents && placeDetails.addressComponents.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Address Components</h3>
                  <div className="space-y-2">
                    {placeDetails.addressComponents.map((component, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="min-w-[100px] px-2 py-1 bg-gray-100 rounded text-gray-600">
                          {component.types?.join(', ') || 'N/A'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{component.longText}</div>
                          {component.shortText !== component.longText && (
                            <div className="text-gray-500 text-xs">{component.shortText}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CodeExample: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const codeExample = `import { usePlacesAutocomplete } from 'places-autocomplete-hook';

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
    apiKey: 'YOUR_GOOGLE_PLACES_API_KEY',
  });

  const handleSelect = async (placeId: string) => {
    await handlePlaceSelect(placeId);
    // Request specific fields to get comprehensive place details
    const details = await getPlaceDetails(placeId, [
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
      // Add more fields as needed
    ]);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Code className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Usage Example</h2>
            <p className="text-gray-600 text-sm">How to use the places-autocomplete-hook</p>
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
        <pre className="text-gray-300 text-sm">
          <code>{codeExample}</code>
        </pre>
      </div>
    </div>
  );
};

function App() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('places-autocomplete-api-key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [apiKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between w-full itmes-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl">
                <Map className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Google Places Autocomplete Hook
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                  React hook for Google Places API Autocomplete
                </p>
              </div>
            </div>
            <div className="border border-gray-300 px-4 py-2 rounded-lg flex align-center h-full">
              <a
                href="https://github.com/gstrobl/places-autocomplete-hook"
                className="flex gap-2 align-center justify-center items-center"
              >
                Github Repository
                <img src={githubIcon} alt="Github Icon" className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ConfigCard apiKey={apiKey} onApiKeyChange={setApiKey} />
          <DemoSection apiKey={apiKey} />
        </div>

        <div className="mb-12">
          <CodeExample />
        </div>

        {/* Features */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🚀',
                title: 'Easy to Use',
                description: 'Simple React hook interface for quick integration',
              },
              {
                icon: '⚡',
                title: 'Debounced Requests',
                description: 'Built-in debouncing to optimize API calls',
              },
              {
                icon: '🛡️',
                title: 'TypeScript Support',
                description: 'Full TypeScript support with proper type definitions',
              },
              {
                icon: '🎨',
                title: 'Customizable',
                description: 'Flexible configuration options for your needs',
              },
              {
                icon: '📱',
                title: 'Lightweight',
                description: 'Minimal bundle size with zero dependencies',
              },
              {
                icon: '🔧',
                title: 'Production Ready',
                description: 'Battle-tested and ready for production use',
              },
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl">
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-purple-800 to-blue-800 text-white py-12 mt-20 shadow-">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center">
              <p className="text-gray-200 mb-4">This Page is sponsored by</p>
              <a
                href="https://seatsmatch.com"
                target="_blank"
                className="inline-block hover:opacity-90 transition-opacity"
              >
                <img src={seatsmatchLogo} alt="Seatsmatch Logo" className="h-12" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-200">Made with ❤️ for React developers in Vienna</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
