import { useEffect, useState } from 'react';
import { Check, Eye, EyeOff, Key, Settings } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { PillButton } from '../ui/PillButton';

interface ConfigCardProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function ConfigCard({ apiKey, onApiKeyChange }: ConfigCardProps) {
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTempKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    onApiKeyChange(tempKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card>
      <CardHeader
        icon={Settings}
        title="Configuration"
        subtitle="Setup your Google Places API key"
      />

      <div className="space-y-4">
        <div>
          <label htmlFor="api-key-input" className="mb-2 block text-sm font-medium text-ink-soft">
            Google Places API Key
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-mute" />
            <input
              id="api-key-input"
              type={showKey ? 'text' : 'password'}
              value={tempKey}
              onChange={e => setTempKey(e.target.value)}
              placeholder="Enter your Google Places API key"
              className="w-full rounded-xl border border-line bg-bg-tint py-3 pl-11 pr-12 text-ink transition-colors placeholder:text-ink-mute focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute transition-colors hover:text-ink"
            >
              {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-mute">
            Key is only stored in your browser&apos;s localStorage
          </p>
        </div>

        <PillButton onClick={handleSave} disabled={!tempKey.trim()} className="w-full">
          {saved ? (
            <>
              <Check className="h-5 w-5" />
              Saved!
            </>
          ) : (
            'Save Configuration'
          )}
        </PillButton>

        {tempKey && (
          <PillButton variant="danger" onClick={() => onApiKeyChange('')} className="w-full">
            Remove Key from LocalStorage
          </PillButton>
        )}

        {apiKey && (
          <div className="flex items-center gap-2 rounded-xl border border-line bg-bg-tint p-4">
            <Check className="h-4 w-4 flex-none text-accent" />
            <p className="text-sm text-ink-soft">API key configured and ready to use</p>
          </div>
        )}
      </div>
    </Card>
  );
}
