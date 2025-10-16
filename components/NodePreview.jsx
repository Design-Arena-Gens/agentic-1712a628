'use client';

import { useMemo, useState } from 'react';

export default function NodePreview({
  nodes,
  workflowPayload,
  disabled,
  onCreate,
  isSubmitting,
}) {
  const [copied, setCopied] = useState(false);

  const nodeSummary = useMemo(
    () =>
      nodes.map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
        typeVersion: node.typeVersion,
        position: node.position,
      })),
    [nodes],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(workflowPayload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <section className="panel" style={{ marginTop: 32 }}>
      <header className="card-header" style={{ marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.35rem' }}>n8n Node Preview</h2>
          <p className="text-muted" style={{ margin: 0 }}>
            Review the node stack and metadata that will be deployed. Adjust steps above to
            regenerate this blueprint instantly.
          </p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button type="button" className="button-secondary" onClick={handleCopy} disabled={disabled}>
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
          <button
            type="button"
            className="button-primary"
            disabled={disabled || isSubmitting}
            onClick={onCreate}
          >
            {isSubmitting ? 'Publishing…' : 'Publish to n8n'}
          </button>
        </div>
      </header>

      <div className="card" style={{ background: 'rgba(9, 14, 33, 0.9)', borderRadius: 18 }}>
        <table className="table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Node</th>
              <th style={{ textAlign: 'left' }}>Type</th>
              <th style={{ textAlign: 'left' }}>Position</th>
            </tr>
          </thead>
          <tbody>
            {nodeSummary.map((node) => (
              <tr key={node.id}>
                <td>
                  <strong>{node.name}</strong>
                </td>
                <td className="text-muted" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {node.type}
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  [{node.position[0]}, {node.position[1]}]
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
