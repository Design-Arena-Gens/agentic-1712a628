'use client';

import { useMemo } from 'react';

const statusMessages = {
  idle: 'Connect to your n8n instance to begin generating mix workflows.',
  connecting: 'Connecting… fetching workflows from your instance.',
  connected: 'Connected to n8n. Ready to launch and sync mix integrations.',
  error: 'We could not connect. Check credentials and try again.',
};

export default function ConnectionForm({
  connection,
  status,
  onChange,
  onConnect,
  onDisconnect,
  error,
}) {
  const descriptionPlaceholder = useMemo(
    () =>
      'Automated Mix integration: unify product signals, CRM enrichment, and analytics dispatch into a single orchestrated workflow powered by n8n.',
    [],
  );

  const handleInput = (field) => (event) => {
    onChange({ ...connection, [field]: event.target.value });
  };

  return (
    <section className="panel">
      <div className="stack" style={{ gap: 20 }}>
        <header className="row" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <span className="pill">Mix + n8n Integration</span>
            <h1 style={{ margin: '12px 0 8px', fontSize: '2.2rem' }}>
              Compose n8n Mix Automations Visually
            </h1>
            <p className="text-muted" style={{ maxWidth: 640 }}>
              Wire together Mix data sources, enrich with first-party systems, and deploy
              production-ready n8n workflows without leaving this canvas. Connect your instance,
              orchestrate steps, and publish directly.
            </p>
          </div>
          <div className="card" style={{ width: 260, alignSelf: 'stretch' }}>
            <span className="badge">Connection</span>
            <p style={{ marginTop: 12, fontWeight: 600 }}>{statusMessages[status]}</p>
            {error ? (
              <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: 12 }}>{error}</p>
            ) : null}
          </div>
        </header>

        <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 320px' }}>
          <div className="stack">
            <div className="field-group">
              <div className="field">
                <label htmlFor="workflowName">Workflow Name</label>
                <input
                  id="workflowName"
                  value={connection.workflowName}
                  onChange={handleInput('workflowName')}
                  placeholder="Mix Integration Workflow"
                  autoComplete="off"
                />
              </div>
              <div className="field">
                <label htmlFor="workflowDescription">Workflow Description</label>
                <textarea
                  id="workflowDescription"
                  className="textarea"
                  value={connection.description}
                  onChange={handleInput('description')}
                  placeholder={descriptionPlaceholder}
                />
              </div>
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="baseUrl">n8n Cloud / Self-host URL</label>
                <input
                  id="baseUrl"
                  value={connection.baseUrl}
                  onChange={handleInput('baseUrl')}
                  placeholder="https://your-instance.n8n.cloud"
                  autoComplete="off"
                  disabled={connection.useMock}
                />
              </div>
              <div className="field">
                <label htmlFor="apiKey">API Key</label>
                <input
                  id="apiKey"
                  type="password"
                  value={connection.apiKey}
                  onChange={handleInput('apiKey')}
                  placeholder="n8n personal access token"
                  autoComplete="off"
                  disabled={connection.useMock}
                />
              </div>
              <div className="field">
                <label htmlFor="triggerPath">Trigger Webhook Path</label>
                <input
                  id="triggerPath"
                  value={connection.triggerPath}
                  onChange={handleInput('triggerPath')}
                  placeholder="mix/ingest"
                />
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'grid', gap: 16 }}>
            <div className="field" style={{ gap: 8 }}>
              <label style={{ color: 'var(--text)', fontSize: '0.95rem' }}>Connection Mode</label>
              <p className="text-muted" style={{ margin: 0 }}>
                Toggle mock data to explore the builder without credentials. Disable to connect to
                your live n8n instance.
              </p>
              <div className="row" style={{ gap: 12 }}>
                <button
                  type="button"
                  className={`button-secondary ${connection.useMock ? 'active' : ''}`}
                  style={{
                    borderColor: connection.useMock ? 'rgba(89, 213, 255, 0.35)' : undefined,
                    background: connection.useMock
                      ? 'rgba(89, 213, 255, 0.18)'
                      : 'rgba(255, 255, 255, 0.06)',
                  }}
                  onClick={() =>
                    onChange({
                      ...connection,
                      useMock: true,
                    })
                  }
                >
                  Use Mock Data
                </button>
                <button
                  type="button"
                  className={`button-secondary ${!connection.useMock ? 'active' : ''}`}
                  style={{
                    borderColor: !connection.useMock ? 'rgba(139, 92, 246, 0.5)' : undefined,
                    background: !connection.useMock
                      ? 'rgba(139, 92, 246, 0.16)'
                      : 'rgba(255, 255, 255, 0.06)',
                  }}
                  onClick={() =>
                    onChange({
                      ...connection,
                      useMock: false,
                    })
                  }
                >
                  Connect Live
                </button>
              </div>
            </div>

            <div className="divider" />

            <button
              type="button"
              className="button-primary"
              onClick={status === 'connected' ? onDisconnect : onConnect}
            >
              {status === 'connected' ? 'Disconnect' : connection.useMock ? 'Load Mock Workspace' : 'Connect to n8n'}
            </button>

            <div>
              <p className="text-muted" style={{ marginBottom: 6 }}>
                Security best practices:
              </p>
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <li>Restrict tokens to Mix workflows scope</li>
                <li>Use HTTPS endpoints and rotate keys regularly</li>
                <li>Store credentials securely using n8n vaults</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
