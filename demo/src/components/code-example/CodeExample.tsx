import { Code } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { CodePanel } from '../ui/CodePanel';
import { buildUsageExample, DEFAULT_EXAMPLE_FIELDS } from '../../lib/buildUsageExample';

export function CodeExample() {
  return (
    <Card>
      <CardHeader
        icon={Code}
        title="Usage Example"
        subtitle="How to use the places-autocomplete-hook"
      />
      <CodePanel code={buildUsageExample({ fields: DEFAULT_EXAMPLE_FIELDS })} />
    </Card>
  );
}
