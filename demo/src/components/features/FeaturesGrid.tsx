import { Card } from '../ui/Card';

const FEATURES = [
  {
    title: 'Easy to Use',
    description: 'Simple React hook interface for quick integration',
  },
  {
    title: 'Debounced Requests',
    description: 'Built-in debouncing to optimize API calls',
  },
  {
    title: 'Request Cancellation',
    description: 'Stale responses are aborted so results never race',
  },
  {
    title: 'TypeScript Support',
    description: 'Full TypeScript support with proper type definitions',
  },
  {
    title: 'Lightweight',
    description: 'Minimal bundle size with zero dependencies',
  },
  {
    title: 'Bring Your Own UI',
    description: 'Headless by design — style suggestions your way',
  },
];

export function FeaturesGrid() {
  return (
    <Card>
      <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-ink">Features</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <div key={feature.title} className="rounded-xl border border-line-soft bg-bg-tint p-5">
            <p className="font-mono text-xs text-accent">{String(index + 1).padStart(2, '0')}</p>
            <h3 className="mt-2 font-display font-semibold text-ink">{feature.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-mute">{feature.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
