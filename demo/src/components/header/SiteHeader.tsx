import { Github, Moon, Sun } from 'lucide-react';
import gstroblLogo from '../../assets/gstrobl-logo.svg';

interface SiteHeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function SiteHeader({ theme, onToggleTheme }: SiteHeaderProps) {
  return (
    <header className="header-blur sticky top-0 z-50 border-b border-line">
      <div className="mx-auto flex max-w-site items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-4">
          <a
            href="https://gstrobl.at"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="gstrobl.at"
            className="flex-none transition-opacity hover:opacity-80"
          >
            <img
              src={gstroblLogo}
              alt="gstrobl.at logo"
              width="54"
              height="36"
              className="h-9 w-auto"
            />
          </a>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-ink sm:text-2xl">
              Places Autocomplete Hook
            </h1>
            <p className="hidden text-sm text-ink-mute sm:block">
              React hook for Google Places API Autocomplete
            </p>
          </div>
        </div>
        <nav aria-label="Project links" className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://github.com/gstrobl/places-autocomplete-hook"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-bg-tint hover:text-ink"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <button
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:bg-bg-tint hover:text-ink"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
