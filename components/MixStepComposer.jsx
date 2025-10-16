'use client';

import { useCallback } from 'react';
import KeyValueList from './KeyValueList';

const stepTypes = [
  { value: 'http', label: 'HTTP Request' },
  { value: 'transform', label: 'Transform (Code)' },
  { value: 'merge', label: 'Merge Streams' },
  { value: 'analytics', label: 'Analytics Branch' },
];

const updateConfig = (step, patch) => ({
  ...step,
  config: {
    ...step.config,
    ...patch,
  },
});

const tryParseJson = (value) => {
  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch (error) {
    return undefined;
  }
};

const renderHttpFields = (step, onUpdate) => (
  <div className="stack" style={{ gap: 14 }}>
    <div className="field-row">
      <div className="field">
        <label>Method</label>
        <select
          value={step.config.method}
          onChange={(event) =>
            onUpdate(
              updateConfig(step, {
                method: event.target.value,
              }),
            )
          }
        >
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Endpoint URL</label>
        <input
          value={step.config.url || ''}
          onChange={(event) =>
            onUpdate(
              updateConfig(step, {
                url: event.target.value,
              }),
            )
          }
          placeholder="https://api.mixsource.io/v1/events"
        />
      </div>
    </div>

    <KeyValueList
      label="Headers"
      addLabel="Add header"
      items={step.config.headers || []}
      onChange={(items) =>
        onUpdate(
          updateConfig(step, {
            headers: items,
          }),
        )
      }
    />

    <KeyValueList
      label="Query Parameters"
      addLabel="Add query parameter"
      items={step.config.query || []}
      onChange={(items) =>
        onUpdate(
          updateConfig(step, {
            query: items,
          }),
        )
      }
    />
  </div>
);

const renderTransformFields = (step, onUpdate) => (
  <div className="field">
    <label>Transformation Script</label>
    <textarea
      className="textarea"
      value={step.config.code || ''}
      onChange={(event) =>
        onUpdate(
          updateConfig(step, {
            code: event.target.value,
          }),
        )
      }
      placeholder={`return items.map(item => ({\n  json: {\n    ...item.json,\n    transformed: true,\n  }\n}));`}
    />
  </div>
);

const renderMergeFields = (step, onUpdate) => (
  <div className="field-row">
    <div className="field">
      <label>Mode</label>
      <select
        value={step.config.mode}
        onChange={(event) =>
          onUpdate(
            updateConfig(step, {
              mode: event.target.value,
            }),
          )
        }
      >
        <option value="combine">Combine</option>
        <option value="append">Append</option>
        <option value="passThrough">Pass Through</option>
        <option value="multiplex">Multiplex</option>
      </select>
    </div>
    <div className="field">
      <label>Join by Property</label>
      <input
        value={step.config.propertyName || ''}
        onChange={(event) =>
          onUpdate(
            updateConfig(step, {
              propertyName: event.target.value,
            }),
          )
        }
        placeholder="accountId"
      />
    </div>
  </div>
);

const renderAnalyticsFields = (step, onUpdate) => {
  const stringified = JSON.stringify(step.config.conditions || {}, null, 2);
  return (
    <div className="field">
      <label>Branch Conditions (JSON)</label>
      <textarea
        className="textarea"
        value={stringified}
        onChange={(event) => {
          const parsed = tryParseJson(event.target.value);
          if (parsed) {
            onUpdate(updateConfig(step, { conditions: parsed }));
          }
        }}
        style={{ minHeight: 180 }}
      />
    </div>
  );
};

const renderConfigControls = (step, onUpdate) => {
  switch (step.type) {
    case 'http':
      return renderHttpFields(step, onUpdate);
    case 'transform':
      return renderTransformFields(step, onUpdate);
    case 'merge':
      return renderMergeFields(step, onUpdate);
    case 'analytics':
      return renderAnalyticsFields(step, onUpdate);
    default:
      return null;
  }
};

export default function MixStepComposer({
  steps,
  onAddStep,
  onUpdateStep,
  onRemoveStep,
  onDuplicateStep,
}) {
  const handleNameChange = useCallback(
    (step) => (event) => {
      onUpdateStep(step.id, {
        ...step,
        name: event.target.value,
      });
    },
    [onUpdateStep],
  );

  const handleTypeChange = useCallback(
    (step) => (event) => {
      const nextType = event.target.value;
      const defaultConfig = {
        http: { method: 'GET', url: '', headers: [], query: [] },
        transform: {
          code: `return items.map(item => ({\n  json: {\n    ...item.json,\n  }\n}));`,
        },
        merge: { mode: 'combine', propertyName: 'id' },
        analytics: {
          conditions: {
            string: [
              {
                value1: '={{$json["event"]}}',
                operation: 'notEmpty',
              },
            ],
          },
        },
      }[nextType];

      onUpdateStep(step.id, {
        ...step,
        type: nextType,
        config: defaultConfig,
      });
    },
    [onUpdateStep],
  );

  return (
    <section className="panel" style={{ marginTop: 32 }}>
      <header className="card-header">
        <div>
          <h2 style={{ margin: 0, fontSize: '1.35rem' }}>Mix Blueprint</h2>
          <p className="text-muted" style={{ margin: 0 }}>
            Compose the journey your Mix payload should take. The builder converts each block into
            production-ready n8n nodes with preserved ordering.
          </p>
        </div>
        <button type="button" className="button-primary" onClick={onAddStep}>
          Add Step
        </button>
      </header>

      <div className="stack" style={{ marginTop: 20 }}>
        {steps.map((step, index) => (
          <div key={step.id} className="card" style={{ padding: 20, gap: 16 }}>
            <div className="card-header" style={{ marginBottom: 12 }}>
              <div className="step-indicator">
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(89, 213, 255, 0.17)',
                    border: '1px solid rgba(89, 213, 255, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </span>
                <strong>{step.name}</strong>
              </div>
              <div className="row" style={{ flex: '0 0 auto', gap: 8 }}>
                <span className="tag" style={{ background: 'rgba(139, 92, 246, 0.18)' }}>
                  {stepTypes.find((type) => type.value === step.type)?.label || step.type}
                </span>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => onDuplicateStep(step.id)}
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => onRemoveStep(step.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="field-group">
              <div className="field">
                <label>Step Name</label>
                <input value={step.name} onChange={handleNameChange(step)} />
              </div>
              <div className="field">
                <label>Step Type</label>
                <select value={step.type} onChange={handleTypeChange(step)}>
                  {stepTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {renderConfigControls(step, (updatedStep) => onUpdateStep(step.id, updatedStep))}
          </div>
        ))}

        {!steps.length ? (
          <div className="card" style={{ textAlign: 'center', padding: '36px 24px' }}>
            <h3 style={{ marginBottom: 10 }}>No steps configured yet</h3>
            <p className="text-muted" style={{ margin: 0 }}>
              Add at least one block to define how Mix data should flow through n8n.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
