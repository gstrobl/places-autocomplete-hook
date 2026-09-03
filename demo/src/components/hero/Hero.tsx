import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const INSTALL_COMMAND = 'npm install places-autocomplete-hook';

export function Hero() {
  const [copied, setCopied] = useState(false);

  const copyInstallCommand = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto max-w-site px-5 pb-4 pt-12 sm:px-8 sm:pt-16"
    >
      <h2
        id="hero-heading"
        className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl"
      >
        Google Places autocomplete for React<span className="text-accent">.</span>
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
        A lightweight hook around the Places API v1 — debounced, cancellable, fully typed, and
        headless so you bring your own UI.
      </p>
      <button
        onClick={copyInstallCommand}
        className="mt-6 inline-flex items-center gap-3 rounded-full border border-line bg-bg-elev px-5 py-3 font-mono text-sm text-ink-soft transition-colors hover:border-accent hover:text-ink"
      >
        <span aria-hidden="true" className="text-accent">
          $
        </span>
        {INSTALL_COMMAND}
        {copied ? (
          <Check className="h-4 w-4 text-accent" />
        ) : (
          <Copy className="h-4 w-4 text-ink-mute" />
        )}
      </button>
    </section>
  );
}
