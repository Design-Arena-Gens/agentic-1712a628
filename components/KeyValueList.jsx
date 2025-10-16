'use client';

import { useCallback } from 'react';

const blankPair = { name: '', value: '' };

export default function KeyValueList({ label, items, onChange, addLabel }) {
  const handleChange = useCallback(
    (index, field) => (event) => {
      const clone = items.slice();
      clone[index] = { ...clone[index], [field]: event.target.value };
      onChange(clone);
    },
    [items, onChange],
  );

  const handleRemove = useCallback(
    (index) => () => {
      const clone = items.slice();
      clone.splice(index, 1);
      onChange(clone);
    },
    [items, onChange],
  );

  const handleAdd = useCallback(() => {
    onChange([...(items || []), { ...blankPair }]);
  }, [items, onChange]);

  return (
    <div className="field-group" style={{ marginTop: 10 }}>
      <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </label>
      {items?.length ? (
        <div className="stack" style={{ gap: 10 }}>
          {items.map((pair, index) => (
            <div
              key={`${pair.name}-${index}`}
              className="row"
              style={{ alignItems: 'center', gap: 12 }}
            >
              <input
                value={pair.name}
                onChange={handleChange(index, 'name')}
                placeholder="header name"
                style={{ flex: 2, minWidth: 120 }}
              />
              <input
                value={pair.value}
                onChange={handleChange(index, 'value')}
                placeholder="value"
                style={{ flex: 3, minWidth: 160 }}
              />
              <button
                type="button"
                className="button-secondary"
                onClick={handleRemove(index)}
                style={{ flex: '0 0 auto' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted" style={{ margin: 0 }}>
          No values defined yet. Add entries to enrich your request.
        </p>
      )}

      <button type="button" className="button-secondary" onClick={handleAdd}>
        {addLabel || 'Add row'}
      </button>
    </div>
  );
}
