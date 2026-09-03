import { useState } from 'react';
import { ChevronRight, Settings2 } from 'lucide-react';
import { FIELD_CATEGORIES } from '../../lib/fields';

interface FieldSelectorProps {
  selectedFields: Set<string>;
  onChange: (fields: Set<string>) => void;
}

export function FieldSelector({ selectedFields, onChange }: FieldSelectorProps) {
  const [open, setOpen] = useState(false);

  const toggleField = (field: string) => {
    const next = new Set(selectedFields);
    if (next.has(field)) {
      next.delete(field);
    } else {
      next.add(field);
    }
    onChange(next);
  };

  const selectCategory = (fields: string[]) => {
    onChange(new Set([...selectedFields, ...fields]));
  };

  const deselectCategory = (fields: string[]) => {
    const next = new Set(selectedFields);
    fields.forEach(field => next.delete(field));
    onChange(next);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-bg-tint px-4 py-3 text-left transition-colors hover:bg-bg-elev"
      >
        <span className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-ink-soft">
            Select Fields to Request ({selectedFields.size} selected)
          </span>
        </span>
        <ChevronRight
          className={`h-4 w-4 text-ink-mute transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>

      {open && (
        <div className="max-h-96 overflow-y-auto border-t border-line p-4">
          <div className="space-y-4">
            {Object.entries(FIELD_CATEGORIES).map(([category, fields]) => (
              <div key={category} className="rounded-lg border border-line-soft p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-display text-sm font-semibold text-ink">{category}</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() => selectCategory(fields)}
                      className="text-xs font-medium text-accent transition-colors hover:text-accent-soft"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => deselectCategory(fields)}
                      className="text-xs text-ink-mute transition-colors hover:text-ink"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3">
                  {fields.map(field => (
                    <label
                      key={field}
                      className="flex cursor-pointer items-center gap-2 rounded p-1 transition-colors hover:bg-bg-tint"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFields.has(field)}
                        onChange={() => toggleField(field)}
                        className="h-3.5 w-3.5 accent-accent"
                      />
                      <span className="font-mono text-xs text-ink-soft">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="text-sm text-ink-mute">
              Total fields selected:{' '}
              <strong className="font-medium text-ink">{selectedFields.size}</strong>
            </span>
            <button
              onClick={() => onChange(new Set())}
              className="text-xs text-ink-mute transition-colors hover:text-accent"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
