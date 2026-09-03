import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodePanelProps {
  code: string;
}

export function CodePanel({ code }: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={copyToClipboard}
        className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-cta-bg px-3 py-1.5 font-mono text-xs font-medium text-cta-fg transition-colors hover:bg-cta-bg-hover"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <div className="overflow-x-auto rounded-xl bg-thunder-950 p-5">
        <pre className="font-mono text-xs leading-relaxed text-cream sm:text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
