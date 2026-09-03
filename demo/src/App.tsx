import { useState } from 'react';
import { SiteHeader } from './components/header/SiteHeader';
import { Hero } from './components/hero/Hero';
import { ConfigCard } from './components/config/ConfigCard';
import { DemoSection } from './components/demo/DemoSection';
import { CodeExample } from './components/code-example/CodeExample';
import { FeaturesGrid } from './components/features/FeaturesGrid';
import { SiteFooter } from './components/footer/SiteFooter';
import { useTheme } from './hooks/useTheme';

const API_KEY_STORAGE_KEY = 'places-autocomplete-api-key';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE_KEY) ?? '');

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <main className="mx-auto max-w-site px-5 py-10 sm:px-8">
        <div className="mb-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <ConfigCard apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
          <DemoSection apiKey={apiKey} />
        </div>
        <div className="mb-8">
          <CodeExample />
        </div>
        <FeaturesGrid />
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
