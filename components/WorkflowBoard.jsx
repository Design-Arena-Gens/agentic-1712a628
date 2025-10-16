'use client';

import { formatDistanceToNow } from '../utils/dateFormat';

const EmptyState = ({ status }) => (
  <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
    <h3 style={{ marginBottom: 12 }}>No workflows detected</h3>
    <p className="text-muted" style={{ margin: 0 }}>
      {status === 'connected'
        ? 'Create your first mix-enabled workflow to see it here.'
        : 'Connect to an instance or enable mock data to inspect sample templates.'}
    </p>
  </div>
);

const WorkflowItem = ({ workflow, onSelect, active }) => (
  <button
    type="button"
    onClick={() => onSelect(workflow)}
    className={`list-item ${active ? 'active' : ''}`}
    style={{ textAlign: 'left' }}
  >
    <div className="card-header" style={{ marginBottom: 6 }}>
      <strong>{workflow.name}</strong>
      <span className="tag" style={{ color: workflow.active ? 'var(--success)' : 'var(--warning)' }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: workflow.active ? 'var(--success)' : 'var(--warning)',
            display: 'inline-block',
          }}
        />
        {workflow.active ? 'Active' : 'Draft'}
      </span>
    </div>
    <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>
      Updated {formatDistanceToNow(workflow.updatedAt)}
    </p>
    {workflow.tags?.length ? (
      <div className="row" style={{ marginTop: 8, gap: 8 }}>
        {workflow.tags.map((tag) => (
          <span key={tag} className="badge" style={{ fontSize: '0.7rem' }}>
            {tag}
          </span>
        ))}
      </div>
    ) : null}
  </button>
);

export default function WorkflowBoard({ workflows, selected, onSelect, status }) {
  return (
    <section className="panel" style={{ marginTop: 32 }}>
      <header className="card-header">
        <div>
          <h2 style={{ margin: 0, fontSize: '1.35rem' }}>Workspace Workflows</h2>
          <p className="text-muted" style={{ margin: 0 }}>
            Navigate existing automations, inspect versions, and build alongside legacy flows.
          </p>
        </div>
        <span className="badge">{workflows.length} workflows</span>
      </header>

      {workflows.length === 0 ? (
        <EmptyState status={status} />
      ) : (
        <div className="list" style={{ marginTop: 16 }}>
          {workflows.map((workflow) => (
            <WorkflowItem
              key={workflow.id}
              workflow={workflow}
              onSelect={onSelect}
              active={selected?.id === workflow.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
