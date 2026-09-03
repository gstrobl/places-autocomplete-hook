import gstroblLogo from '../../assets/gstrobl-logo.svg';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line py-12">
      <div className="mx-auto flex max-w-site flex-col items-center gap-4 px-5 text-center sm:px-8">
        <a
          href="https://gstrobl.at"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-80"
        >
          <img
            src={gstroblLogo}
            alt="gstrobl.at logo"
            width="50"
            height="33"
            className="h-8 w-auto"
          />
        </a>
        <p className="text-sm text-ink-soft">
          Built by{' '}
          <a
            href="https://gstrobl.at"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent transition-colors hover:text-accent-soft"
          >
            Gerald Strobl
          </a>{' '}
          · MIT License
        </p>
        <p className="text-sm text-ink-mute">Made with ❤️ for React developers in Vienna</p>
      </div>
    </footer>
  );
}
