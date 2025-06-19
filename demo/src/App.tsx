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
  const { suggestions, loading, setValue, getPlaceDetails } = usePlacesAutocomplete({
    apiKey,
  });

  const handlePlaceSelect = (placeId: string) => {
    setSelectedPlace(placeId);
    getPlaceDetails(placeId).then(details => {
      setPlaceDetails(details);
    });
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setValue(value);
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
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-800 text-sm">
                  <strong>Place Details:</strong> {placeDetails.formattedAddress}
                </p>
              </div>

              {placeDetails.addressComponents && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Address Components</h3>
                  <div className="space-y-2">
                    {placeDetails.addressComponents.map((component, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="min-w-[100px] px-2 py-1 bg-gray-100 rounded text-gray-600">
                          {component.types.join(', ')}
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
    const details = await getPlaceDetails(placeId);
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
